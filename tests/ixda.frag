precision mediump float;
uniform float time;
uniform vec2 resolution;


const vec3 color1 = vec3( 228., 0., 80. ) / 255.; // Electric Crimson
const vec3 color2 = vec3( 66., 27., 75. ) / 255.; // Dark Purple

// utils
float random( vec2 uv ){
    return fract( sin( dot( uv, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    // vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);
    // Quintic interpolation curve: Simplex Noise
    vec2 u = f*f*f*(f*(f*6.-15.)+10.);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


vec2 rotate(vec2 st, float a) {
    st = mat2(cos(a),-sin(a),
              sin(a),cos(a))*(st-.5);
    return st+.5;
}

// SDF
// #ifdef GL_OES_standard_derivatives
// #extension GL_OES_standard_derivatives : enable
// #endif
float aastep(float threshold, float value) {
    // #ifdef GL_OES_standard_derivatives
    // float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
    // return smoothstep(threshold-afwidth, threshold+afwidth, value);
    // #else
    return smoothstep(threshold-0.04, threshold+0.04, value);
    // #endif
}

float stroke(float x, float size, float w) {
    float d = aastep(size, x+w*.5) - aastep(size, x-w*.5);
    return clamp(d, 0., 1.);
}

float fill(float x, float size) {
    return 1.-aastep(size, x);
}

float circleSDF(vec2 st) {
    return length(st-.5)*2.;
}

float rectSDF(vec2 st, vec2 s) {
    st = st*2.-1.;
    return max( abs(st.x/s.x), abs(st.y/s.y) );
}

void main(){
    const float PI = 3.1415926;
    float repetitions = 40.;
    float patternSize = resolution.x / repetitions;
    vec2 origin = vec2( gl_FragCoord.x, gl_FragCoord.y - ( resolution.y - patternSize * repetitions ) / 2.  ) / patternSize;
    vec2 pos = fract( origin );

    vec3 color = vec3( 0.0 );
    color += fill( rectSDF(
            rotate( pos, noise( floor( origin ) / 25.0 + time / 20. ) * 4.0 * PI - 2.0 ),
            vec2( 0.1 + 2.0 * noise( floor( origin )/ 15. + time / 15. ) , 3.0 )
        ), 0.5);

    gl_FragColor = vec4( mix( color2, color1, color ), 1. );
}
