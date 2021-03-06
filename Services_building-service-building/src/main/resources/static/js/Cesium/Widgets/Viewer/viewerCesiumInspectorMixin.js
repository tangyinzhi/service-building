define([
    '../../Core/defined',
    '../../Core/defineProperties',
    '../../Core/DeveloperError',
    '../CesiumInspector/CesiumInspector'
], function (
    defined,
    defineProperties,
    DeveloperError,
    CesiumInspector) {
    'use strict';

    /**
     * A mixin which adds the CesiumInspector widget to the Viewer widget.
     * Rather than being called directly, this function is normally passed as
     * a parameter to {@link Viewer#extend}, as shown in the example below.
     * @exports viewerCesiumInspectorMixin
     *
     * @param {Viewer} viewer The viewer instance.
     *
     * @exception {DeveloperError} viewer is required.
     *
     * @demo {@link https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=Cesium%20Inspector.html|Cesium Sandcastle Cesium Inspector Demo}
     *
     * @example
     * var viewer = new Cesium.Viewer('cesiumContainer');
     * viewer.extend(Cesium.viewerCesiumInspectorMixin);
     */
    function viewerCesiumInspectorMixin(viewer) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(viewer)) {
            throw new DeveloperError('viewer is required.');
        }
        //>>includeEnd('debug');

        var cesiumInspectorContainer = document.createElement('div');
        cesiumInspectorContainer.className = 'cesium-viewer-cesiumInspectorContainer';
        viewer.container.appendChild(cesiumInspectorContainer);
        var cesiumInspector = new CesiumInspector(cesiumInspectorContainer, viewer.scene);

        defineProperties(viewer, {
            cesiumInspector: {
                get: function () {
                    return cesiumInspector;
                }
            }
        });
    }

    return viewerCesiumInspectorMixin;
});
