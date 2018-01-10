const anim2 = {
    size: 40,
    nx: Math.ceil(window.innerWidth / this.size),
    margeX: (window.innerWidth - this.nx * this.size) / 2,
    ny: Math.ceil(window.innerHeight / this.size),
    margeY: (window.innerHeight - this.ny * this.size) / 2,

    start: () => {
        function Line() {
            this.init();
        }

        Line.prototype.init = function(c) {
            this.x1 = this.x2 = random(-100, width + 100);
            this.y1 = this.y2 = random(-100, height + 100);
            this.tx = random(-100, width + 100);
            this.ty = random(-100, height + 100);
            this.c = random(1)<0.5?color1:color2;
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
