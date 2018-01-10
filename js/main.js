const color1 = '#e40050',
    color2 = '#421b4b';

let camera, scene, renderer, uniforms, startTime = Math.random() * 1500;
let w, h, svg;

let imgs = [];
function preload(){
    imgs.push( loadImage( 'imgs/1.png' ) );
    imgs.push( loadImage( 'imgs/2.png' ) );
}


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
    let choice = ~~ random( 8 );
    // console.log( choice );
    // switch( choice ){
    switch( 0 ){
        case 0 :
            currentAnim = anim0;
            break;
        case 1 :
            currentAnim = anim1;
            break;
        case 2 :
            currentAnim = anim2;
            break;
        case 3 :
            currentAnim = anim3;
            break;
        case 4 :
            currentAnim = anim0;
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
    }
    currentAnim.start();
}
