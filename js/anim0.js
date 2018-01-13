class Anim0 {
    start(){
        class Rect {
            constructor( x, y, s, n ){
                this.x = x;
                this.y = y;
                this.s = s;
                this.sw = 0;
                this.w = 0;
                this.h = 0;
                this.n = n;
                this.finished = false;
                this.color = random( 1 ) > 0.5 ? frontColor : 255;

                if( random( n ) > n / 5 ){
                    this.shouldSplit = true;
                }
            }

            anim(){
                let tl = new TimelineMax();
                let targetS = this.s;
                let delay = random( 0.5, 1.2 );
                tl.set( this, {
                    w: 0,
                    h: 0,
                    sw: 0
                } )
                .to( this, 0.8, {
                    w: targetS - 5,
                    h: targetS - 5,
                    sw: 0.5,
                    delay: delay,
                    ease: Bounce.easeOut
                } )
                .to( this, 0.8, {
                    h: 0,
                    sw: 0,
                    delay: 1.5 + 1 - delay,
                    ease: Power4.easeOut
                } )
                .to( this, 0.1, {
                    finished: true
                } );
            }

            display(){
                push();
                fill( this.color );
                // noFill();
                stroke( this.color );
                strokeWeight( this.sw );
                rect( this.x, this.y, this.w, this.h );
                pop();
            }
        }

        let s = height - 100;
        this.rects = [ new Rect( width / 2 - s / 2, height / 2 - s / 2, s, 5 ) ];
        this.rects[ 0 ].shouldSplit = true;

        for( var n = 7; n > 0; n-- ){
            this.rects.forEach( r => {
                if( r.shouldSplit ){
                    r.n --;
                    this.rects.push( new Rect( r.x + r.s/2, r.y, r.s/2, r.n ) );
                    this.rects.push( new Rect( r.x, r.y + r.s/2, r.s/2, r.n ) );
                    this.rects.push( new Rect( r.x + r.s/2, r.y + r.s/2, r.s/2, r.n ) );
                    r.s /= 2;
                }
            } )
        }

        this.rects.forEach( r => r.anim() );
    }

    display(){
        this.rects.forEach( r => r.display() );
        if( this.rects.every( r => r.finished ) ){
            pauseAfterAnim();
        }
    }
}
