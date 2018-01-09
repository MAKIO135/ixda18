let camera, scene, renderer, uniforms, startTime = Math.random() * 150 * 1000;
let w, h, svg;

const color1 = '#e40050',
    color2 = '#421b4b';

let imgs = [];

let bgRect = {
    color : color1,
    x : 0,
    y : 0,
    w : window.innerWidth,
    h : window.innerHeight
};

let currentAnim = {
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
        vertexShader : document.getElementById( 'vertexShader' ).textContent,
        fragmentShader : document.getElementById( 'backgroundFrag' ).textContent
    } );

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { canvas: document.getElementById( 'background' ) } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0xffffff, 0 );
}

function preload(){
    imgs.push( loadImage( 'imgs/1.png' ) );
    imgs.push( loadImage( 'imgs/2.png' ) );
}

function setup(){
    var p5Canvas = createCanvas( windowWidth, windowHeight );
    p5Canvas.parent( 'back' );

    svg = d3.select( '#front' ).append( 'svg' );
    initBackground();

    windowResized();

    displayBackground();
}

function draw(){
    uniforms.time.value = ( millis() + startTime ) / 1000;
    renderer.render( scene, camera );

    clear();

    push();
    noStroke();
    fill( bgRect.color );
    rect( bgRect.x, bgRect.y, bgRect.w, bgRect.h );
    pop();

    currentAnim.display();
}

function windowResized(){
    resizeCanvas( windowWidth, windowHeight );

    renderer.setSize( width, height );
    uniforms.resolution.value.x = width;
    uniforms.resolution.value.y = height;

    w = width;
    h = height;
    svg.attr( {
        width: w,
        height: h
    } );
}

function displayBackground(){
    bgRect.x = 0;
    bgRect.y = 0;
    bgRect.w = width;
    bgRect.h = height;
    uniforms.patternSize.value = random( 10, 40 );
    uniforms.noiseScale1.value = random( 20, 100 );
    uniforms.noiseScale2.value = random( 30, 140 );

    let axisX = ~~random( 2 );
    let axisY = ~~random( 2 );

    if( axisX == 0 && axisY == 0 ){
        TweenMax.to( bgRect, 2, {
            w: 0,
            ease: Power4.easeInOut,
            onComplete: pauseBetweenAnims
        } );
    }
    else if( axisX == 1 && axisY == 0 ){
        TweenMax.to( bgRect, 2, {
            x: width,
            ease: Power4.easeInOut,
            onComplete: pauseBetweenAnims
        } );
    }
    else if( axisX == 0 && axisY == 1 ){
        TweenMax.to( bgRect, 2, {
            h: 0,
            ease: Power4.easeInOut,
            onComplete: pauseBetweenAnims
        } );
    }
    else if( axisX == 1 && axisY == 1 ){
        TweenMax.to( bgRect, 2, {
            y: height,
            ease: Power4.easeInOut,
            onComplete: pauseBetweenAnims
        } );
    }
}

function pauseBetweenAnims(){
    TweenMax.to( bgRect, 30, { onComplete: transitionToAnim } );
}

function transitionToAnim(){
    bgRect.x = 0;
    bgRect.y = 0;
    bgRect.w = 0;
    bgRect.h = 0;

    let axisX = ~~random( 2 );
    let axisY = ~~random( 2 );

    if( axisX == 0 && axisY == 0 ){
        TweenMax.fromTo( bgRect, 2, {
            color: random( 1 ) < 0.5 ? color1 : color2,
            h: height
        },
        {
            w: width,
            ease: Power4.easeInOut,
            onComplete: pauseBeforeAnim
        } );
    }
    else if( axisX == 1 && axisY == 0 ){
        TweenMax.fromTo( bgRect, 2, {
            color: random( 1 ) < 0.5 ? color1 : color2,
            x: width,
            w: width,
            h: height
        },
        {
            x: 0,
            ease: Power4.easeInOut,
            onComplete: pauseBeforeAnim
        } );
    }
    else if( axisX == 0 && axisY == 1 ){
        TweenMax.fromTo( bgRect, 2, {
            color: random( 1 ) < 0.5 ? color1 : color2,
            w: width
        },
        {
            h: height,
            ease: Power4.easeInOut,
            onComplete: pauseBeforeAnim
        } );
    }
    else if( axisX == 1 && axisY == 1 ){
        TweenMax.fromTo( bgRect, 2, {
            color: random( 1 ) < 0.5 ? color1 : color2,
            y: height,
            w: width,
            h: height
        },
        {
            y: 0,
            ease: Power4.easeInOut,
            onComplete: pauseBeforeAnim
        } );
    }
}

function pauseBeforeAnim(){
    TweenMax.to( bgRect, 2, { onComplete: startAnim } );
}

function pauseAfterAnim(){
    TweenMax.to( bgRect, 2, { onComplete: displayBackground } );
}

function startAnim(){
    switch( ~~random( 8 ) ){
        case 0 :
            animD3_0();
            break;
        case 1 :
            animD3_1();
            break;
        case 2 :
            animD3_2();
            break;
        case 3 :
            animD3_3();
            break;
        case 4 :
            animD3_4();
            break;
        case 5 :
            animD3_5();
            break;
        case 6 :
            currentAnim = anim1;
            currentAnim.start();
            break;
        case 7 :
            currentAnim = anim2;
            currentAnim.start();
            break;
    }
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
                ease: Power4.easeInOut
            } )
            .to( this, .3, {
                angle: HALF_PI
            } )
            .to( this, .5, {
                w: height-100,
                delay: 0.5,
                ease: Power4.easeInOut
            } )
            .to( this, .5, {
                h: 0,
                sw: 0,
                delay: 1.5,
                ease: Power2.easeIn,
                onComplete: pauseAfterAnim
            } );
    },

    display: () => {
        push();

        translate( width / 2, height / 2 );
        rotate( angle );

        // drawingContext.shadowOffsetX = 10;
        // drawingContext.shadowOffsetY = 10;
        // drawingContext.shadowBlur = 20;
        // drawingContext.shadowColor = 'rgba(0,0,0,0.8)';

        strokeWeight( this.sw );
        stroke( 255 );
        fill( 255 );
        noFill();
        rectMode( CENTER );
        rect( 0, 0, this.w, this.h );

        pop();
    }
}

const anim2 = {
    size: 40,
    nx: Math.ceil(window.innerWidth / this.size),
    margeX: (window.innerWidth - this.nx * this.size) / 2,
    ny: Math.ceil(window.innerHeight / this.size),
    margeY: (window.innerHeight - this.ny * this.size) / 2,
    start: () => {
        this.lines = new Array(15).fill(0).map(l => new Line());
        this.lines.forEach(l => {
            if (l.ready) {
                l.init();
                l.anim();
            }
        });
    },

    display: () => {
        this.lines.forEach(l => l.display());

        if( this.lines.every( l => l.ready ) ){
            currentAnim.display = () => {};
            pauseAfterAnim();
        }
    }

}
function Line() {
    this.init();
}

Line.prototype.init = function(c) {
    this.x1 = this.x2 = random(-100, width + 100);
    this.y1 = this.y2 = random(-100, height + 100);
    this.tx = random(-100, width + 100);
    this.ty = random(-100, height + 100);
    this.c = 255;
    this.ready = true;
    this.sw = random(20, 400);
};

Line.prototype.display = function() {
    push();
    drawingContext.shadowOffsetX = 10;
    drawingContext.shadowOffsetY = 10;
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(0,0,0,0.8)';
    stroke(this.c);
    strokeCap(SQUARE);
    strokeWeight(this.sw);
    line(this.x1, this.y1, this.x2, this.y2);
    pop();
};

Line.prototype.anim = function() {
    this.ready = false;

    var tx = this.tx,
    ty = this.ty;

    var step2 = function() {
        TweenMax.to(this, 0.3, {
            x1: tx,
            y1: ty,
            delay: 2 + random(1),
            onComplete: setReady
        });
    }.bind(this);

    var setReady = function() {
        this.ready = true;
    }.bind(this);

    TweenMax.to(this, 0.3, {
        x2: tx,
        y2: ty,
        delay: random(1),
        onComplete: step2
    });
};
