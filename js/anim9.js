class Anim9{
    constructor(){
        this.size = 120;
        this.nx = Math.floor(window.innerWidth / this.size) - 1;
        this.margeX = (window.innerWidth - this.nx * this.size) / 2;
        this.ny = Math.floor(window.innerHeight / this.size) - 1;
        this.margeY = (window.innerHeight - this.ny * this.size) / 2;
    }

    start(){
        class Arc {
            constructor( cx, cy ){
                this.color = random( 1 ) > 0.5 ? frontColor : 255;
                this.cx = cx;
                this.cy = cy;
                this.radius = 0;
                this.angle = 0.001;
                this.rotation = 0;
                this.finished = false;
            }

            display(){
                push();

                translate( this.cx, this.cy );
                rotate( this.rotation );
                noStroke();
                fill( this.color );
                arc( 0, 0, this.radius, this.radius, 0, this.angle, CHORD );

                pop();
            }

            anim(){
                let tl = new TimelineMax();
                tl.set( this, {
                    radius: 118,
                        angle: 0.0001,
                        rotation: 0
                    } )
                    .to( this, 1, {
                        delay: 1,
                        angle: TWO_PI * 3 / 4,
                        ease: Power4.easeInOut
                    } )
                    .to( this, 1, {
                        delay: 1,
                        rotation: ( ( random( 1 ) < .5 ? -1 : 1 ) * ~~random( 1, 3 ) ) * PI / 2,
                        ease: Power4.easeInOut
                    } )
                    .to( this, 1, {
                        delay: 1,
                        rotation: ( ( random( 1 ) < .5 ? -1 : 1 ) * ~~random( 1, 3 ) ) * PI / 2,
                        ease: Power4.easeInOut
                    } )
                    .to( this, 1, {
                        delay: 1,
                        rotation: ( ( random( 1 ) < .5 ? -1 : 1 ) * ~~random( 1, 3 ) ) * PI / 2,
                        ease: Power4.easeInOut
                    } )
                    .to( this, 1, {
                        delay: 1,
                        angle: 0.001,
                        ease: Power4.easeInOut,
                        onComplete: () => {
                            this.finished = true
                        }
                    } )
            }
        }

        this.arcs = [];
        for( let x = 0; x < this.nx; x ++ ){
            for( let y = 0; y < this.ny; y ++ ){
                this.arcs.push( new Arc( this.margeX + ( x + 0.5 ) * this.size, this.margeY + ( y + 0.5 ) * this.size ) );
            }
        }
        this.arcs.forEach( a => a.anim() );
    }

    display(){
        this.arcs.forEach( a => a.display() );

        if( this.arcs.every( a => a.finished ) ){
            pauseAfterAnim();
        }
    }
}
