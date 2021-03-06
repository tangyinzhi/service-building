define([
    '../Core/clone',
    '../Core/defined',
    '../Core/defineProperties',
    './Expression'
], function (
    clone,
    defined,
    defineProperties,
    Expression) {
    'use strict';

    /**
     * An expression for a style applied to a {@link Cesium3DTileset}.
     * <p>
     * Evaluates a conditions expression defined using the
     * {@link https://github.com/AnalyticalGraphicsInc/3d-tiles/tree/master/specification/Styling|3D Tiles Styling language}.
     * </p>
     * <p>
     * Implements the {@link StyleExpression} interface.
     * </p>
     *
     * @alias ConditionsExpression
     * @constructor
     *
     * @param {Object} [conditionsExpression] The conditions expression defined using the 3D Tiles Styling language.
     * @param {Object} [defines] Defines in the style.
     *
     * @example
     * var expression = new Cesium.ConditionsExpression({
     *     conditions : [
     *         ['${Area} > 10, 'color("#FF0000")'],
     *         ['${id} !== "1"', 'color("#00FF00")'],
     *         ['true', 'color("#FFFFFF")']
     *     ]
     * });
     * expression.evaluateColor(feature, result); // returns a Cesium.Color object
     */
    function ConditionsExpression(conditionsExpression, defines) {
        this._conditionsExpression = clone(conditionsExpression, true);
        this._conditions = conditionsExpression.conditions;
        this._runtimeConditions = undefined;

        setRuntime(this, defines);
    }

    defineProperties(ConditionsExpression.prototype, {
        /**
         * Gets the conditions expression defined in the 3D Tiles Styling language.
         *
         * @memberof ConditionsExpression.prototype
         *
         * @type {Object}
         * @readonly
         *
         * @default undefined
         */
        conditionsExpression: {
            get: function () {
                return this._conditionsExpression;
            }
        }
    });

    function Statement(condition, expression) {
        this.condition = condition;
        this.expression = expression;
    }

    function setRuntime(expression, defines) {
        var runtimeConditions = [];
        var conditions = expression._conditions;
        if (!defined(conditions)) {
            return;
        }
        var length = conditions.length;
        for (var i = 0; i < length; ++i) {
            var statement = conditions[i];
            var cond = String(statement[0]);
            var condExpression = String(statement[1]);
            runtimeConditions.push(new Statement(
                new Expression(cond, defines),
                new Expression(condExpression, defines)
            ));
        }
        expression._runtimeConditions = runtimeConditions;
    }

    /**
     * Evaluates the result of an expression, optionally using the provided feature's properties. If the result of
     * the expression in the
     * {@link https://github.com/AnalyticalGraphicsInc/3d-tiles/tree/master/specification/Styling|3D Tiles Styling language}
     * is of type <code>Boolean</code>, <code>Number</code>, or <code>String</code>, the corresponding JavaScript
     * primitive type will be returned. If the result is a <code>RegExp</code>, a Javascript <code>RegExp</code>
     * object will be returned. If the result is a <code>Cartesian2</code>, <code>Cartesian3</code>, or <code>Cartesian4</code>,
     * a {@link Cartesian2}, {@link Cartesian3}, or {@link Cartesian4} object will be returned. If the <code>result</code> argument is
     * a {@link Color}, the {@link Cartesian4} value is converted to a {@link Color} and then returned.
     *
     * @param {Cesium3DTileFeature} feature The feature whose properties may be used as variables in the expression.
     * @param {Object} [result] The object onto which to store the result.
     * @returns {Boolean|Number|String|RegExp|Cartesian2|Cartesian3|Cartesian4|Color} The result of evaluating the expression.
     */
    ConditionsExpression.prototype.evaluate = function (feature, result) {
        var conditions = this._runtimeConditions;
        if (!defined(conditions)) {
            return undefined;
        }
        var length = conditions.length;
        for (var i = 0; i < length; ++i) {
            var statement = conditions[i];
            if (statement.condition.evaluate(feature)) {
                return statement.expression.evaluate(feature, result);
            }
        }
    };

    /**
     * Evaluates the result of a Color expression, using the values defined by a feature.
     * <p>
     * This is equivalent to {@link ConditionsExpression#evaluate} but always returns a {@link Color} object.
     * </p>
     * @param {Cesium3DTileFeature} feature The feature whose properties may be used as variables in the expression.
     * @param {Color} [result] The object in which to store the result
     * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
     */
    ConditionsExpression.prototype.evaluateColor = function (feature, result) {
        var conditions = this._runtimeConditions;
        if (!defined(conditions)) {
            return undefined;
        }
        var length = conditions.length;
        for (var i = 0; i < length; ++i) {
            var statement = conditions[i];
            if (statement.condition.evaluate(feature)) {
                return statement.expression.evaluateColor(feature, result);
            }
        }
    };

    /**
     * Gets the shader function for this expression.
     * Returns undefined if the shader function can't be generated from this expression.
     *
     * @param {String} functionName Name to give to the generated function.
     * @param {String} attributePrefix Prefix that is added to any variable names to access vertex attributes.
     * @param {Object} shaderState Stores information about the generated shader function, including whether it is translucent.
     * @param {String} returnType The return type of the generated function.
     *
     * @returns {String} The shader function.
     *
     * @private
     */
    ConditionsExpression.prototype.getShaderFunction = function (functionName, attributePrefix, shaderState, returnType) {
        var conditions = this._runtimeConditions;
        if (!defined(conditions) || conditions.length === 0) {
            return undefined;
        }

        var shaderFunction = '';
        var length = conditions.length;
        for (var i = 0; i < length; ++i) {
            var statement = conditions[i];

            var condition = statement.condition.getShaderExpression(attributePrefix, shaderState);
            var expression = statement.expression.getShaderExpression(attributePrefix, shaderState);

            // Build the if/else chain from the list of conditions
            shaderFunction +=
                '    ' + ((i === 0) ? 'if' : 'else if') + ' (' + condition + ') \n' +
                '    { \n' +
                '        return ' + expression + '; \n' +
                '    } \n';
        }

        shaderFunction = returnType + ' ' + functionName + '() \n' +
            '{ \n' +
            shaderFunction +
            '    return ' + returnType + '(1.0); \n' + // Return a default value if no conditions are met
            '} \n';

        return shaderFunction;
    };

    return ConditionsExpression;
});
