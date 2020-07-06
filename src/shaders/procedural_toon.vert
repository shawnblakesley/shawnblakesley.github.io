attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform vec3 uLightingDirection;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vSurfacePos;
varying vec3 vVertLightDir;

void main() {
    vec4 v4Position = vec4(aPosition, 1.0);
    vec4 mvPosition = uModelViewMatrix * v4Position;
    gl_Position = uProjectionMatrix * uModelViewMatrix * v4Position;
    vNormal = normalize( uNormalMatrix * aNormal );
    vVertLightDir = -uLightingDirection;
    vSurfacePos = aPosition;
}
