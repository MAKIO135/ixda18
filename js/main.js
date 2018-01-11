const color1 = '#e40050',
    color2 = '#421b4b';

let bgColor = color1,
    frontColor = color2;

const timeBetweenAnims = 10;
const timeBeforeAfterAnims = 1;

let camera, scene, renderer, uniforms, startTime = Math.random() * 1500;
let w, h, svg;

let imgs = [];
function preload(){
    imgs.push( loadImage( 'imgs/1.png' ) );
    imgs.push( loadImage( 'imgs/2.png' ) );
}

let bgRect = {
    x : 0,
    y : 0,
    w : window.innerWidth,
    h : window.innerHeight
};

let currentAnim = {
    display: () => {}
};

function setup(){
    var p5Canvas = createCanvas( windowWidth, windowHeight );
    p5Canvas.parent( 'back' );

    svg = d3.select( '#front' ).append( 'svg' );
    initBackground();

    windowResized();

    displayBackground();
}

function draw(){
    uniforms.time.value = millis() / 1000 + startTime;
    renderer.render( scene, camera );

    clear();

    push();
    noStroke();
    fill( bgColor );
    rect( bgRect.x, bgRect.y, bgRect.w, bgRect.h );
    rect( width - bgRect.x - bgRect.w, height - bgRect.y - bgRect.h, bgRect.w, bgRect.h );
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
    startTime = Math.random() * 1500;

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
    TweenMax.to( bgRect, timeBetweenAnims, { onComplete: transitionToAnim } );
}

function transitionToAnim(){
    [ bgColor, frontColor ] = [ color1, color2 ].shuffle();
    bgRect.x = 0;
    bgRect.y = 0;
    bgRect.w = 0;
    bgRect.h = 0;

    // let axisX = ~~random( 2 );
    let axisX = 0;
    // let axisY = ~~random( 2 );
    let axisY = 0;

    let tl = new TimelineMax();

    if( axisX == 0 && axisY == 0 ){
        tl.set( bgRect, {
            y: height / 2,
            h: height
        } )
        .to( bgRect, 0.5, {
            w: width / 2,
            ease: Bounce.easeOut
        } )
        .to( bgRect, 1, {
            y: 0,
            ease: Power4.easeInOut,
            onComplete: pauseBeforeAnim
        } );
    }
    else if( axisX == 1 && axisY == 0 ){
        TweenMax.fromTo( bgRect, 2, {
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
    TweenMax.to( bgRect, timeBeforeAfterAnims, { onComplete: startAnim } );
}

function pauseAfterAnim(){
    currentAnim.display = () => {};
    TweenMax.to( bgRect, timeBeforeAfterAnims, { onComplete: displayBackground } );
}

function startAnim(){
    // let choice = 4;
    let choice = random( [ 0, 2, 3, 4, 8 ] );
    // let choice = ~~ random( 8 );

    switch( choice ){
        case 0 :
            currentAnim = new Anim0();
            break;
        case 1 :
            currentAnim = anim1;
            break;
        case 2 :
            currentAnim = new Anim2();
            break;
        case 3 :
            currentAnim = new Anim3();
            break;
        case 4 :
            currentAnim = new Anim4();
            break;
        case 5 :
            currentAnim = anim0;
            break;
        case 6 :
            currentAnim = anim0;
            break;
        case 7 :
            currentAnim = anim0;
            break;
        case 8 :
            currentAnim = new Anim8();
            break;
    }
    currentAnim.start();
}
