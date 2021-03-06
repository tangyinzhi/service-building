define([
    '../Core/defaultValue',
    '../Renderer/Pass'
], function (
    defaultValue,
    Pass) {
    'use strict';

    /**
     * Defines a list of commands whose geometry are bound by near and far distances from the camera.
     * @alias FrustumCommands
     * @constructor
     *
     * @param {Number} [near=0.0] The lower bound or closest distance from the camera.
     * @param {Number} [far=0.0] The upper bound or farthest distance from the camera.
     *
     * @private
     */
    function FrustumCommands(near, far) {
        this.near = defaultValue(near, 0.0);
        this.far = defaultValue(far, 0.0);

        var numPasses = Pass.NUMBER_OF_PASSES;
        var commands = new Array(numPasses);
        var indices = new Array(numPasses);

        for (var i = 0; i < numPasses; ++i) {
            commands[i] = [];
            indices[i] = 0;
        }

        this.commands = commands;
        this.indices = indices;
    }

    return FrustumCommands;
});
