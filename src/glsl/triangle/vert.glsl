#version 300 es

precision mediump float;

in vec2 vertPosition;
in vec3 vertColor;

out vec3 fragColor;

uniform vec2 canvasSize;
uniform vec2 shapeLocation;
uniform float shapeSize;

void main() {
    fragColor = vertColor;

    vec2 finalVertexPosition = vertPosition * shapeSize + shapeLocation;
    vec2 clipPosition = (finalVertexPosition / canvasSize) * 2.0f - 1.0f;

    gl_Position = vec4(clipPosition, 0.0f, 1.0f);
}