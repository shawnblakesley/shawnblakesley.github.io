#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

uniform mat4 uViewMatrix;
uniform vec3 uMaterialColor;

// user defined
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform float uBorder;
uniform float uCheckerSize;
uniform float uShine;

varying vec3 vNormal;
varying vec3 vSurfacePos;
varying vec3 vVertLightDir;

void main() {
    float specular;
    float diffuse;
    float shine;
    vec3 color = uMaterialColor;
    vec3 position = vSurfacePos / uCheckerSize;
    if(fract(position.x) < 0.5 && fract(position.z) < 0.5){
        color *= uPrimaryColor;
    }
    else if(fract(position.z) < 0.5){
        color *= uSecondaryColor;
    }
    else if(fract(position.x) < 0.5)
    {
        color *= uPrimaryColor.yzx * 0.3;
    }
    else{
        color *= uSecondaryColor.yzx * 0.3;
    }
    vec4 lDirection = uViewMatrix * vec4( vVertLightDir, 0.0 );
    vec3 lVector = normalize( lDirection.xyz );
    vec3 normal = normalize( vNormal );
    diffuse = max(0.0, dot(lVector, vNormal));
    vec3 eye = vec3(0,0,1);
    vec3 H = normalize(lVector + eye);
    specular = max(0.0, dot(reflect(-lVector, normal), eye));
    shine = uShine * 195.0 + 5.0;
    specular = pow(specular, shine);
    specular = step(0.5, specular);
    diffuse = diffuse > uBorder ? 1.0 : diffuse > uBorder - 0.2 ? 0.4 : 0.1;
    gl_FragColor = vec4( color * (diffuse + specular), 1.0 );

}