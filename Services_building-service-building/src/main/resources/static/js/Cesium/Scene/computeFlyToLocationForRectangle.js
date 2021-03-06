define([
    '../Core/defined',
    '../Core/Rectangle',
    '../Core/sampleTerrainMostDetailed',
    './SceneMode',
    '../ThirdParty/when'
], function (
    defined,
    Rectangle,
    sampleTerrainMostDetailed,
    SceneMode,
    when) {
    'use strict';

    /**
     * Computes the final camera location to view a rectangle adjusted for the current terrain.
     * If the terrain does not support availability, the height above the ellipsoid is used.
     *
     * @param {Rectangle} rectangle The rectangle being zoomed to.
     * @param {Scene} scene The scene being used.
     *
     * @returns {Cartographic} The optimal location to place the camera so that the entire rectangle is in view.
     *
     * @private
     */
    function computeFlyToLocationForRectangle(rectangle, scene) {
        var terrainProvider = scene.terrainProvider;
        var mapProjection = scene.mapProjection;
        var ellipsoid = mapProjection.ellipsoid;

        var positionWithoutTerrain;
        var tmp = scene.camera.getRectangleCameraCoordinates(rectangle);
        if (scene.mode === SceneMode.SCENE3D) {
            positionWithoutTerrain = ellipsoid.cartesianToCartographic(tmp);
        } else {
            positionWithoutTerrain = mapProjection.unproject(tmp);
        }

        if (!defined(terrainProvider)) {
            return when.resolve(positionWithoutTerrain);
        }

        return terrainProvider.readyPromise.then(function () {
            var availability = terrainProvider.availability;

            if (!defined(availability) || scene.mode === SceneMode.SCENE2D) {
                return positionWithoutTerrain;
            }

            var cartographics = [
                Rectangle.center(rectangle),
                Rectangle.southeast(rectangle),
                Rectangle.southwest(rectangle),
                Rectangle.northeast(rectangle),
                Rectangle.northwest(rectangle)
            ];

            return computeFlyToLocationForRectangle._sampleTerrainMostDetailed(terrainProvider, cartographics)
                .then(function (positionsOnTerrain) {
                    var maxHeight = positionsOnTerrain.reduce(function (currentMax, item) {
                        return Math.max(item.height, currentMax);
                    }, -Number.MAX_VALUE);

                    var finalPosition = positionWithoutTerrain;
                    finalPosition.height += maxHeight;
                    return finalPosition;
                });
        });
    }

    //Exposed for testing.
    computeFlyToLocationForRectangle._sampleTerrainMostDetailed = sampleTerrainMostDetailed;

    return computeFlyToLocationForRectangle;
});
