define([
    '../../Core/defaultValue',
    '../../Core/defined',
    '../../Core/defineProperties',
    '../../Core/DeveloperError',
    '../../Core/Event',
    '../../Core/wrapFunction',
    '../../DataSources/CzmlDataSource',
    '../../DataSources/GeoJsonDataSource',
    '../../DataSources/KmlDataSource',
    '../getElement'
], function (
    defaultValue,
    defined,
    defineProperties,
    DeveloperError,
    Event,
    wrapFunction,
    CzmlDataSource,
    GeoJsonDataSource,
    KmlDataSource,
    getElement) {
    'use strict';

    /**
     * A mixin which adds default drag and drop support for CZML files to the Viewer widget.
     * Rather than being called directly, this function is normally passed as
     * a parameter to {@link Viewer#extend}, as shown in the example below.
     * @exports viewerDragDropMixin
     * @namespace
     * @param {Viewer} viewer The viewer instance.
     * @param {Object} [options] Object with the following properties:
     * @param {Element|String} [options.dropTarget=viewer.container] The DOM element which will serve as the drop target.
     * @param {Boolean} [options.clearOnDrop=true] When true, dropping files will clear all existing data sources first, when false, new data sources will be loaded after the existing ones.
     * @param {Boolean} [options.flyToOnDrop=true] When true, dropping files will fly to the data source once it is loaded.
     * @param {Boolean} [options.clampToGround=true] When true, datasources are clamped to the ground.
     * @param {DefaultProxy} [options.proxy] The proxy to be used for KML network links.
     *
     * @exception {DeveloperError} Element with id <options.dropTarget> does not exist in the document.
     * @exception {DeveloperError} dropTarget is already defined by another mixin.
     * @exception {DeveloperError} dropEnabled is already defined by another mixin.
     * @exception {DeveloperError} dropError is already defined by another mixin.
     * @exception {DeveloperError} clearOnDrop is already defined by another mixin.
     *
     * @example
     * // Add basic drag and drop support and pop up an alert window on error.
     * var viewer = new Cesium.Viewer('cesiumContainer');
     * viewer.extend(Cesium.viewerDragDropMixin);
     * viewer.dropError.addEventListener(function(viewerArg, source, error) {
     *     window.alert('Error processing ' + source + ':' + error);
     * });
     */
    function viewerDragDropMixin(viewer, options) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(viewer)) {
            throw new DeveloperError('viewer is required.');
        }
        if (viewer.hasOwnProperty('dropTarget')) {
            throw new DeveloperError('dropTarget is already defined by another mixin.');
        }
        if (viewer.hasOwnProperty('dropEnabled')) {
            throw new DeveloperError('dropEnabled is already defined by another mixin.');
        }
        if (viewer.hasOwnProperty('dropError')) {
            throw new DeveloperError('dropError is already defined by another mixin.');
        }
        if (viewer.hasOwnProperty('clearOnDrop')) {
            throw new DeveloperError('clearOnDrop is already defined by another mixin.');
        }
        if (viewer.hasOwnProperty('flyToOnDrop')) {
            throw new DeveloperError('flyToOnDrop is already defined by another mixin.');
        }
        //>>includeEnd('debug');

        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        //Local variables to be closed over by defineProperties.
        var dropEnabled = true;
        var flyToOnDrop = defaultValue(options.flyToOnDrop, true);
        var dropError = new Event();
        var clearOnDrop = defaultValue(options.clearOnDrop, true);
        var dropTarget = defaultValue(options.dropTarget, viewer.container);
        var clampToGround = defaultValue(options.clampToGround, true);
        var proxy = options.proxy;

        dropTarget = getElement(dropTarget);

        defineProperties(viewer, {
            /**
             * Gets or sets the element to serve as the drop target.
             * @memberof viewerDragDropMixin.prototype
             * @type {Element}
             */
            dropTarget: {
                //TODO See https://github.com/AnalyticalGraphicsInc/cesium/issues/832
                get: function () {
                    return dropTarget;
                },
                set: function (value) {
                    //>>includeStart('debug', pragmas.debug);
                    if (!defined(value)) {
                        throw new DeveloperError('value is required.');
                    }
                    //>>includeEnd('debug');

                    unsubscribe(dropTarget, handleDrop);
                    dropTarget = value;
                    subscribe(dropTarget, handleDrop);
                }
            },

            /**
             * Gets or sets a value indicating if drag and drop support is enabled.
             * @memberof viewerDragDropMixin.prototype
             * @type {Element}
             */
            dropEnabled: {
                get: function () {
                    return dropEnabled;
                },
                set: function (value) {
                    if (value !== dropEnabled) {
                        if (value) {
                            subscribe(dropTarget, handleDrop);
                        } else {
                            unsubscribe(dropTarget, handleDrop);
                        }
                        dropEnabled = value;
                    }
                }
            },

            /**
             * Gets the event that will be raised when an error is encountered during drop processing.
             * @memberof viewerDragDropMixin.prototype
             * @type {Event}
             */
            dropError: {
                get: function () {
                    return dropError;
                }
            },

            /**
             * Gets or sets a value indicating if existing data sources should be cleared before adding the newly dropped sources.
             * @memberof viewerDragDropMixin.prototype
             * @type {Boolean}
             */
            clearOnDrop: {
                get: function () {
                    return clearOnDrop;
                },
                set: function (value) {
                    clearOnDrop = value;
                }
            },

            /**
             * Gets or sets a value indicating if the camera should fly to the data source after it is loaded.
             * @memberof viewerDragDropMixin.prototype
             * @type {Boolean}
             */
            flyToOnDrop: {
                get: function () {
                    return flyToOnDrop;
                },
                set: function (value) {
                    flyToOnDrop = value;
                }
            },

            /**
             * Gets or sets the proxy to be used for KML.
             * @memberof viewerDragDropMixin.prototype
             * @type {DefaultProxy}
             */
            proxy: {
                get: function () {
                    return proxy;
                },
                set: function (value) {
                    proxy = value;
                }
            },

            /**
             * Gets or sets a value indicating if the datasources should be clamped to the ground
             * @memberof viewerDragDropMixin.prototype
             * @type {Boolean}
             */
            clampToGround: {
                get: function () {
                    return clampToGround;
                },
                set: function (value) {
                    clampToGround = value;
                }
            }
        });

        function handleDrop(event) {
            stop(event);

            if (clearOnDrop) {
                viewer.entities.removeAll();
                viewer.dataSources.removeAll();
            }

            var files = event.dataTransfer.files;
            var length = files.length;
            for (var i = 0; i < length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = createOnLoadCallback(viewer, file, proxy, clampToGround);
                reader.onerror = createDropErrorCallback(viewer, file);
                reader.readAsText(file);
            }
        }

        //Enable drop by default;
        subscribe(dropTarget, handleDrop);

        //Wrap the destroy function to make sure all events are unsubscribed from
        viewer.destroy = wrapFunction(viewer, viewer.destroy, function () {
            viewer.dropEnabled = false;
        });

        //Specs need access to handleDrop
        viewer._handleDrop = handleDrop;
    }

    function stop(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    function unsubscribe(dropTarget, handleDrop) {
        var currentTarget = dropTarget;
        if (defined(currentTarget)) {
            currentTarget.removeEventListener('drop', handleDrop, false);
            currentTarget.removeEventListener('dragenter', stop, false);
            currentTarget.removeEventListener('dragover', stop, false);
            currentTarget.removeEventListener('dragexit', stop, false);
        }
    }

    function subscribe(dropTarget, handleDrop) {
        dropTarget.addEventListener('drop', handleDrop, false);
        dropTarget.addEventListener('dragenter', stop, false);
        dropTarget.addEventListener('dragover', stop, false);
        dropTarget.addEventListener('dragexit', stop, false);
    }

    function createOnLoadCallback(viewer, file, proxy, clampToGround) {
        var scene = viewer.scene;
        return function (evt) {
            var fileName = file.name;
            try {
                var loadPromise;

                if (/\.czml$/i.test(fileName)) {
                    loadPromise = CzmlDataSource.load(JSON.parse(evt.target.result), {
                        sourceUri: fileName
                    });
                } else if (/\.geojson$/i.test(fileName) || /\.json$/i.test(fileName) || /\.topojson$/i.test(fileName)) {
                    loadPromise = GeoJsonDataSource.load(JSON.parse(evt.target.result), {
                        sourceUri: fileName,
                        clampToGround: clampToGround
                    });
                } else if (/\.(kml|kmz)$/i.test(fileName)) {
                    loadPromise = KmlDataSource.load(file, {
                        sourceUri: fileName,
                        proxy: proxy,
                        camera: scene.camera,
                        canvas: scene.canvas,
                        clampToGround: clampToGround
                    });
                } else {
                    viewer.dropError.raiseEvent(viewer, fileName, 'Unrecognized file: ' + fileName);
                    return;
                }

                if (defined(loadPromise)) {
                    viewer.dataSources.add(loadPromise).then(function (dataSource) {
                        if (viewer.flyToOnDrop) {
                            viewer.flyTo(dataSource);
                        }
                    }).otherwise(function (error) {
                        viewer.dropError.raiseEvent(viewer, fileName, error);
                    });
                }
            } catch (error) {
                viewer.dropError.raiseEvent(viewer, fileName, error);
            }
        };
    }

    function createDropErrorCallback(viewer, file) {
        return function (evt) {
            viewer.dropError.raiseEvent(viewer, file.name, evt.target.error);
        };
    }

    return viewerDragDropMixin;
});
