let camera, scene, renderer, uniforms, clock;
let w, h, svg = d3.select( '#front' )
    .append( 'svg' );

let anim = {
    display: () => {}
};

function initBackground(){
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
        factor : {
            type : 'f',
            value : 0.0
        }
    };

    var material = new THREE.ShaderMaterial( {
        uniforms : uniforms,
        vertexShader : document.getElementById( 'vertexShader' ).textContent,
        fragmentShader : document.getElementById( 'backgroundFrag' ).textContent
    } );

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { canvas: document.getElementById( 'background' ) } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0xffffff, 0 );
}

function setup(){
    var p5Canvas = createCanvas( windowWidth, windowHeight );
    p5Canvas.parent( 'back' );

    svg = d3.select( '#front' ).append( 'svg' );
    initBackground();

    windowResized();

    resetAnim();
}

function draw(){
    uniforms.time.value = millis() / 1000;
    // uniforms.factor.value = constrain( 3 + sin( millis() / 10000 ) * 3.5, 0, 6 );
    // uniforms.factor.value = 1;
    renderer.render( scene, camera );

    clear();
    anim.display();
}

function windowResized(){
    resizeCanvas( windowWidth, windowHeight );

    renderer.setSize( width, height );
    uniforms.resolution.value.x = width;
    uniforms.resolution.value.y = height;

    w = width;
    h = height;
    svg.attr({
        width: w,
        height: h
    });
}

function resetAnim(){
    TweenMax.to( uniforms.factor, 10, {
        value: 1.0,
        ease: Power1.easeOut,
        delay: 5,
        onComplete: selectAnim
    } );
}

function selectAnim(){
    if( ~~random( 2 ) ){
        TweenMax.to( uniforms.factor, 10, {
            value: 0.0,
            ease: SlowMo.ease.config( 0.7, 0.4, false ),
            delay: 20,
            onComplete: startP5Anim
        } );
    }
    else{
        TweenMax.to( uniforms.factor, 10, {
            value: 10.0,
            ease: SlowMo.ease.config( 0.7, 0.4, false ),
            delay: 20,
            onComplete: animFront
        } );
    }
}

function startP5Anim(){
    anim = anim1;
    anim.start();
}

const anim1 = {
    w: 0,
    h: 0,
    sw: 0,
    angle: 0,

    start: () => {
        let tl = new TimelineMax();
        tl.set( this, {
                w: 0,
                h: 0,
                sw: 20,
                angle: 0
            } )
            .to( this, .5, {
                h: height - 100,
                ease: Bounce.easeOut
            } )
            .to( this, .3, {
                angle: HALF_PI
            } )
            .to( this, .5, {
                w: height-100,
                delay: 0.5,
                ease: Bounce.easeOut
            } )
            .to( this, .5, {
                h: 0,
                sw: 0,
                delay: 1.5,
                ease: Power2.easeIn,
                onComplete: resetAnim
            } );
    },

    display: () => {
        push();

        translate( width / 2, height / 2 );
        rotate( angle );

        strokeWeight( this.sw );
        stroke( 255 );
        fill( 255 );
        // noFill();
        rectMode( CENTER );
        rect( 0, 0, this.w, this.h );

        pop();
    }
}
