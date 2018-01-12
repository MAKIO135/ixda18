class Anim1 {
    constructor(){
        this.w = 0;
        this.h = 0;
        this.sw = 0;
        this.angle = 0;
    }

    start(){
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
    }

    display(){
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
