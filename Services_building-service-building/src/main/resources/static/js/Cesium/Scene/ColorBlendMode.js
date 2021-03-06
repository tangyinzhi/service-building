define([
    '../Core/freezeObject',
    '../Core/Math'
], function (
    freezeObject,
    CesiumMath) {
    'use strict';

    /**
     * Defines different modes for blending between a target color and a primitive's source color.
     *
     * HIGHLIGHT multiplies the source color by the target color
     * REPLACE replaces the source color with the target color
     * MIX blends the source color and target color together
     *
     * @exports ColorBlendMode
     *
     * @see Model.colorBlendMode
     */
    var ColorBlendMode = {
        HIGHLIGHT: 0,
        REPLACE: 1,
        MIX: 2
    };

    /**
     * @private
     */
    ColorBlendMode.getColorBlend = function (colorBlendMode, colorBlendAmount) {
        if (colorBlendMode === ColorBlendMode.HIGHLIGHT) {
            return 0.0;
        } else if (colorBlendMode === ColorBlendMode.REPLACE) {
            return 1.0;
        } else if (colorBlendMode === ColorBlendMode.MIX) {
            // The value 0.0 is reserved for highlight, so clamp to just above 0.0.
            return CesiumMath.clamp(colorBlendAmount, CesiumMath.EPSILON4, 1.0);
        }
    };

    return freezeObject(ColorBlendMode);
});
