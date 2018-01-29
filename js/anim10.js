class Anim10{
    start(){
        this.delta = 5;
        this.size = 50;
        this.nx = Math.floor(window.innerWidth / this.size) - 1;
        this.margeX = (window.innerWidth - this.nx * this.size) / 2;
        this.ny = Math.floor(window.innerHeight / this.size) - 1;
        this.margeY = (window.innerHeight - this.ny * this.size) / 2;

        class Line {
            constructor( x, y, dx, dy ){
                this.init( x, y, dx, dy );
            }

            init( x, y, dx, dy ){
                this.weight = 100;
                this.color = random( 1 ) > 0.5 ? frontColor : 255;
                this.x1 = this.x2 = x;
                this.y1 = this.y2 = y;
                this.dx = dx;
                this.dy = dy;
                this.vert = random( 1 ) < .5;
            }

            display(){
                push();

                noStroke();
                fill( this.color );
                if( this.vert ){
                    quad( this.x1, this.y1 + this.weight / 2, this.x1, this.y1 - this.weight / 2, this.x2, this.y2 - this.weight / 2, this.x2, this.y2 + this.weight / 2 );
                    quad( width - this.x1, this.y1 + this.weight / 2, width - this.x1, this.y1 - this.weight / 2, width - this.x2, this.y2 - this.weight / 2, width - this.x2, this.y2 + this.weight / 2 );
                }
                else{
                    quad( this.x1 + this.weight / 2, this.y1, this.x1 - this.weight / 2, this.y1, this.x2 - this.weight / 2, this.y2, this.x2 + this.weight / 2, this.y2 );
                    quad( width - this.x1 + this.weight / 2, this.y1, width - this.x1 - this.weight / 2, this.y1, width - this.x2 - this.weight / 2, this.y2, width - this.x2 + this.weight / 2, this.y2 );
                }

                pop();
            }

            anim(){
                let tl = new TimelineMax();
                tl.to( this, 0.5, {
                    delay: 1 + random( 3 ),
                    x2: this.dx,
                    y2: this.dy,
                    ease: Power4.easeInOut
                } )
                .to( this, 0.5, {
                    delay: 1 + random( 3 ),
                    x1: this.dx,
                    y1: this.dy,
                    ease: Power4.easeInOut
                } )
                .to( this, 1, {
                    delay: 1,
                    ease: Power4.easeInOut,
                    onComplete: () => {
                        this.finished = true
                    }
                } )
            }
        }

        this.lines = new Array( ~~random( 35, 75 ) ).fill( 0 ).map( l => {
            let _nx = ~~ random( this.nx );
            let _ny = ~~ random( this.ny );
            let x = this.margeX + ( _nx + 0.5 ) * this.size;
            let y = this.margeY + ( _ny + 0.5 ) * this.size;
            let dx = _nx - this.delta < 0 ? x + this.delta * this.size :
                     _nx + this.delta > this.nx ? x - this.delta * this.size :
                     x + this.delta * this.size * ( random( 1 ) < .5 ? -1 : 1 );
            let dy = _ny - this.delta < 0 ? y + this.delta * this.size :
                     _ny + this.delta > this.ny ? y - this.delta * this.size :
                     y + this.delta * this.size * ( random( 1 ) < .5 ? -1 : 1 );
            return new Line( x, y, dx, dy );
        } );

        this.lines.forEach( a => a.anim() );
    }

    display(){
        this.lines.forEach( a => a.display() );

        if( this.lines.every( a => a.finished ) ){
            pauseAfterAnim();
        }
    }
}
