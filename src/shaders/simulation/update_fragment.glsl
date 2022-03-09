precision highp float;
precision highp int;

uniform sampler2D texture;
uniform vec2 delta;
varying vec2 coord;

void main() {
    // Get vertex info
    vec4 info = texture2D(texture, coord);

    // calculate average neighbor height
    vec2 dx = vec2(delta.x, 0.0);
    vec2 dy = vec2(0.0, delta.y);
    float average = (
        texture2D(texture, coord - dx).r +
        texture2D(texture, coord - dy).r +
        texture2D(texture, coord + dx).r +
        texture2D(texture, coord + dy).r
    ) * 0.25;

    // change the velocity to move towerd the average
    info.g += (average - info.r) * 1.8;

    // attenuate the velocity of the waves
    info.g *= 0.993;

    // move vertex with velocity
    info.r += info.g;

    gl_FragColor = info;

}