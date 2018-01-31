function initBackground(){
    let vertexShader = `
        void main() {
            gl_Position = vec4( position, 1.0 );
        }`;

    let fragShader = `
        #ifdef GL_ES
        precision mediump float;
        #endif

        uniform vec2 resolution;
        uniform float time;
        uniform int mode;
        uniform float patternSize;
        uniform float noiseScale1;
        uniform float noiseScale2;

        const vec3 color1 = vec3( 228., 0., 80. ) / 255.; // Electric Crimson
        const vec3 color2 = vec3( 66., 27., 75. ) / 255.; // Dark Purple

        float satur(float x) {
            return clamp(x, 0., 1.);
        }

        float random( vec2 st ) {
            return fract( sin( dot( st.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453123 );
        }

        float round( float f ){
            return f < 0.5 ? 0.0 : 1.0;
        }

        float wave(vec2 coord){
            float interval = resolution.x * 0.04;
            vec2 p = coord / interval;

            float py2t = 0.112 * sin(time * 0.378);
            float phase1 = dot(p, vec2(0.00, 1.00)) + time * 1.338;
            float phase2 = dot(p, vec2(0.09, py2t)) + time * 0.566;
            float phase3 = dot(p, vec2(0.08, 0.11)) + time * 0.666;

            float pt = phase1 + sin(phase2) * 3.0;
            pt = abs(fract(pt) - 0.5) * interval * 0.5;

            float lw = 2.3 + sin(phase3) * 1.9;
            return saturate(lw - pt);
        }

        // Simplex noise 3D
        // https://github.com/ashima/webgl-noise/wiki
        vec3 mod289(vec3 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
            return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r){
            return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise(vec3 v){
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

            // First corner
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 =   v - i + dot(i, C.xxx) ;

            // Other corners
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );

            //   x0 = x0 - 0.0 + 0.0 * C.xxx;
            //   x1 = x0 - i1  + 1.0 * C.xxx;
            //   x2 = x0 - i2  + 2.0 * C.xxx;
            //   x3 = x0 - 1.0 + 3.0 * C.xxx;
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
            vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

            // Permutations
            i = mod289(i);
            vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ) )
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ) )
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ) );

            // Gradients: 7x7 points over a square, mapped onto an octahedron.
            // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
            float n_ = 0.142857142857; // 1.0/7.0
            vec3  ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );

            //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
            //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);

            //Normalise gradients
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

            // Mix final noise value
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }


        vec2 rotate(vec2 st, float a) {
            st = mat2(cos(a),-sin(a),
                      sin(a),cos(a))*(st-.5);
            return st+.5;
        }

        // SDF
        float aastep(float threshold, float value) {
            return smoothstep( threshold - 0.08, threshold + 0.08  , value );
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
            vec2 repetitions = floor( resolution / patternSize ) + 1.0;
            vec2 origin = ( gl_FragCoord.xy - ( resolution - patternSize * repetitions ) / 2.  ) / patternSize;
            vec2 pos = fract( origin );

            float color = 0.0;
            float threshold = 1.0;
            float minthreshold = threshold + .1;
            if( mode == 0 ){
                color += fill( rectSDF(
                    rotate( pos, snoise( vec3( time / noiseScale1, floor( origin ) / noiseScale1 ) ) * 4.0 * PI - 2.0 ),
                    vec2( minthreshold + threshold * snoise( vec3( time / 4.0, floor( origin ) / noiseScale2 ) ) , 5.0 )
                ), 0.5 );
            }
            else if( mode == 1 ){
                color += stroke( circleSDF( pos ), 1.5, 1.5 + 2.5 * snoise( vec3( time / 4.0, floor( origin ) / noiseScale2 ) ) );
            }
            else if( mode == 2 ){
                float scale = resolution.y / 15.;
                vec2 p = gl_FragCoord.xy / scale;
                vec2 p1 = fract(p) - 0.5;
                vec2 p2 = fract(p - 0.5) - 0.5;

                float z1 = random(0.12 * floor(p));
                float z2 = random(0.23 * floor(p - 0.5));

                float r1 = 0.2 + 0.2 * sin(time * 0.9 + z1 * 30.);
                float r2 = 0.2 + 0.2 * sin(time * 0.9 + z2 * 30.);

                float c1 = satur((r1 - length(p1)) * scale);
                float c2 = satur((r2 - length(p2)) * scale);

                float a1 = satur((r1 + 0.08 - length(p1)) * scale);
                float a2 = satur((r2 + 0.08 - length(p2)) * scale);

                color = mix(
                    mix(mix(0., c1, a1), c2, a2),
                    mix(mix(0., c2, a2), c1, a1),
                    step(z1, z2)
                );
            }
            else if( mode == 3 ){
                color = wave( gl_FragCoord.xy );
            }
            else if( mode == 4 ){
                const float pi = 3.1415926535;
                vec2 p = gl_FragCoord.xy - resolution / 2.;
                float phi = atan(p.y, p.x + 1e-6);

                float fin = mod(floor(phi * 3. / pi + 0.5), 6.);
                float phi_fin = fin * pi / 3.;

                vec2 dir = vec2(cos(phi_fin), sin(phi_fin));
                float l = dot(dir, p) - time/20. * resolution.y / 5.;

                float ivr = 20.;
                float seg = l / ivr;

                float w = sin(floor(seg) * 0.2 - time) * 0.4 + 0.5;
                color = (w / 2. - abs(fract(seg) - 0.5)) * ivr;
            }
            else if( mode == 5 ){
                vec2 p = gl_FragCoord.xy / resolution;
                for( int i = 1; i < 15; i++ ){
                    float r = random( vec2( float( i ) * 0.3456, floor( origin.y ) ) ) + 0.3;
                    float px = ( sin( time * r / float( i ) ) / 2.0 + 0.5 ) * 2.0;
                    float rx = r / 18.0;
                    color += step( px - rx, p.x ) - step( px + rx, p.x );
                }
                color *= step( floor( origin.y ) * patternSize - patternSize*0.58, gl_FragCoord.y ) - step( floor( origin.y ) * patternSize + patternSize*0.58, gl_FragCoord.y );
            }
            else if( mode == 6 ){
                vec2 p = gl_FragCoord.xy / resolution;
                for( int i = 1; i < 10; i++ ){
                    float r = random( vec2( float( i ) * 0.3456, float( i ) * 0.4865 ) ) + 0.1;
                    float px = sin( time / 2.0 / float( i ) ) / 2.0 + 0.5;
                    float py = cos( time / 2.0 / float( i ) ) / 2.0 + 0.5;
                    float rx = r / 10.0;
                    color += step( py - rx, p.y ) - step( py + rx, p.y );
                    color += step( 1.0 - ( py + rx ), p.y ) - step( 1.0 - ( py - rx ), p.y );
                    color -= step( px - rx, p.x ) - step( px + rx, p.x );
                    color -= step( 1.0 - ( px + rx ), p.x ) - step( 1.0 - ( px - rx ), p.x );
                }
            }
            // else if( mode == 5 ){
            //     color = 1.0 - gl_FragCoord.x / resolution.x;
            // }
            // else if( mode == 6 ){
            //     color = gl_FragCoord.y / resolution.y;
            // }
            // else if( mode == 7 ){
            //     color = 1.0 - gl_FragCoord.y / resolution.y;
            // }
            // else if( mode == 8 ){
            //     color = gl_FragCoord.x / resolution.x;
            // }

            color = clamp( color, 0.0, 1.0 );
            gl_FragColor = vec4( mix( color2, color1, color ), 1. );
        }`;

    scene = new THREE.Scene();
    camera = new THREE.Camera();
    camera.position.z = 1;
    let geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    uniforms = {
        resolution : {
            type : 'v2',
            value : new THREE.Vector2()
        },
        time : {
            type : 'f',
            value : 0.0
        },
        mode : {
            type : 'i',
            value : 0
        },
        patternSize : {
            type : 'f',
            value : 20.0
        },
        noiseScale1 : {
            type : 'f',
            value : 20.0
        },
        noiseScale2 : {
            type : 'f',
            value : 20.0
        }
    };

    var material = new THREE.ShaderMaterial( {
        uniforms : uniforms,
        vertexShader : vertexShader,
        fragmentShader : fragShader
    } );

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { canvas: document.getElementById( 'background' ) } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0xffffff, 0 );
}
