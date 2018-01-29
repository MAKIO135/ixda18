class Anim1{
    start(){
        this.delta = 40;
        this.n = 20;

        class Circle {
            constructor( n, diam, pos ){
                this.init( n, diam, pos );
            }

            init( n, diam, pos ){
                this.color = n % 2 == 0 ? frontColor : 255;
                this.n = n;
                this.diam = diam;
                this.d = 0;
                this.pos = pos;
                this.cx = this.pos[ 0 ].x;
                this.cy = this.pos[ 0 ].y;
            }

            display(){
                push();

                noStroke();
                fill( this.color );
                ellipse( this.cx, this.cy, this.d );

                pop();
            }

            anim(){
                let tl = new TimelineMax();
                tl.to( this, 2, {
                    delay: 1 + ( 29 - this.n ) * 0.1,
                    d: this.diam,
                    ease: Bounce.easeOut
                } )
                tl.to( this, 1, {
                    delay: 1 + this.n * 0.15,
                    cx: this.pos[ 1 ].x,
                    cy: this.pos[ 1 ].y,
                    ease: Power4.easeInOut
                } )
                tl.to( this, 1, {
                    delay: 3,
                    cx: this.pos[ 2 ].x,
                    cy: this.pos[ 2 ].y,
                    ease: Power4.easeInOut
                } )
                tl.to( this, 1, {
                    delay: 3,
                    cx: this.pos[ 3 ].x,
                    cy: this.pos[ 3 ].y,
                    ease: Power4.easeInOut
                } )
                tl.to( this, 1, {
                    delay: 3,
                    cx: this.pos[ 4 ].x,
                    cy: this.pos[ 4 ].y,
                    ease: Power4.easeInOut
                } )
                tl.to( this, 1, {
                    delay: 1 + (29 - this.n) * 0.1,
                    d: 0,
                    ease: Power4.easeOut,
                    onComplete: () => this.finished = true
                } )
            }
        }

        let pos = new Array( 5 ).fill( 0 ).map( d => ( { x: random( width ), y: random( height ) } ) );
        this.circles = new Array( 30 ).fill( 0 ).map( ( c, i ) => new Circle( 29 - i, ( 29 - i ) * 100, pos ) );

        this.circles.forEach( a => a.anim() );
    }

    display(){
        this.circles.forEach( a => a.display() );

        if( this.circles.every( a => a.finished ) ){
            pauseAfterAnim();
        }
    }
}
