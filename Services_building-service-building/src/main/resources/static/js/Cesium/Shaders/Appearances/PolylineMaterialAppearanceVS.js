//This file is automatically rebuilt by the Cesium build process.
define(function () {
    'use strict';
    return "attribute vec3 position3DHigh;\n\
attribute vec3 position3DLow;\n\
attribute vec3 prevPosition3DHigh;\n\
attribute vec3 prevPosition3DLow;\n\
attribute vec3 nextPosition3DHigh;\n\
attribute vec3 nextPosition3DLow;\n\
attribute vec2 expandAndWidth;\n\
attribute vec2 st;\n\
attribute float batchId;\n\
\n\
varying float v_width;\n\
varying vec2 v_st;\n\
varying float v_polylineAngle;\n\
\n\
void main()\n\
{\n\
    float expandDir = expandAndWidth.x;\n\
    float width = abs(expandAndWidth.y) + 0.5;\n\
    bool usePrev = expandAndWidth.y < 0.0;\n\
\n\
    vec4 p = czm_computePosition();\n\
    vec4 prev = czm_computePrevPosition();\n\
    vec4 next = czm_computeNextPosition();\n\
\n\
    v_width = width;\n\
    v_st = st;\n\
\n\
    vec4 positionWC = getPolylineWindowCoordinates(p, prev, next, expandDir, width, usePrev, v_polylineAngle);\n\
    gl_Position = czm_viewportOrthographic * positionWC;\n\
\n\
#ifdef LOG_DEPTH\n\
    czm_vertexLogDepth(czm_modelViewProjectionRelativeToEye * p);\n\
#endif\n\
}\n\
";
});