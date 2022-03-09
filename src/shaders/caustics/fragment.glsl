#extension GL_OES_standard_derivatives : enable

precision highp float;
precision highp int;

#include <utils>

varying vec3 oldPos;
varying vec3 newPos;
varying vec3 ray;

void main()	{
    // If the triangle gets smaller, it get brighter, and vice versa
    float oldArea = length(dFdx(oldPos)) * length(dFdy(oldPos));
    float newArea = length(dFdx(newPos)) * length(dFdy(newPos));
    gl_FragColor = vec4(oldArea / newArea * 0.2, 1.0, 0.0, 0.0);

    vec3 refractedLight = refract(-light, vec3(0.0, 1.0, 0.0), IOR_AIR / IOR_WATER);

    // Shadow for the rim of the pool. <- I will delete this.
    vec2 t = intersectCube(newPos, -refractedLight, vec3(-1.0, -poolHeight, -1.0), vec3(1.0, 2.0, 1.0));
    gl_FragColor.r *=  1.0 / (1.0 + exp(-200.0 / (1.0 + 10.0 * (t.y - t.x)) * (newPos.y - refractedLight.y * t.y - 2.0 / 12.0)));
}