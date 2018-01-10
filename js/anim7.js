// radars
function animD3_4() {
    let angles, center, pts, pentas, lines, g, shapes;

    (function() {
        angles = d3.range(5).map(function(d) {
            return {
                sin: Math.sin((2 * Math.PI) / 5 * d - Math.PI / 2),
                cos: Math.cos((2 * Math.PI) / 5 * d - Math.PI / 2)
            };
        });

        center = {
            x: w / 2,
            y: h / 2 + 20
        }

        pts = d3.range(5).map(function(d) {
            return angles.map(function(a) {
                return {
                    x: ~~(center.x + a.cos * (d + 1) * 100),
                    y: ~~(center.y + a.sin * (d + 1) * 100)
                };
            });
        });

        pentas = svg.selectAll('path')
            .data(pts)
            .enter()
            .append('path')
            .attr({
                'stroke-width': 2,
                fill: 'none'
            })
            .attr('stroke', function(d, i) {
                return 'rgba( 255, 255, 255, ' + (i === pts.length - 1 ? 1.0 : 0.5) + ' )'
            })
            .attr('d', function(d) {
                return d.map(function(pt, i) {
                    return (i === 0 ? 'M ' : 'L ') + pt.x + ' ' + pt.y;
                }).join(' ') + ' Z';
            })
            .datum(function(d) {
                return {
                    length: this.getTotalLength()
                };
            })
            .attr('stroke-dasharray', function(d) {
                return '0 ' + d.length;
            });

        step1();
    })();

    function step1() {
        let count = 0;

        pentas
            .transition()
            .delay(function(d, i) {
                return (pts.length - i) * 150;
            })
            .duration(500)
            .attr('stroke-dasharray', function(d) {
                return d.length + ' 0';
            })
            .each('end', function() {
                count++;
                if (count == pts.length) step2();
            });
    }

    function step2() {
        let count = 0;

        lines = svg.selectAll('line')
            .data(d3.range(5))
            .enter()
            .append('line')
            .attr({
                stroke: 'rgba( 255, 255, 255, 0.5 )',
                'stroke-width': 2,
                x1: center.x,
                y1: center.y,
                x2: center.x,
                y2: center.y
            })
            .transition()
            .duration(300)
            .attr('x2', function(d) {
                return pts[pts.length - 1][d].x;
            })
            .attr('y2', function(d) {
                return pts[pts.length - 1][d].y;
            })
            .each('end', function() {
                count++;
                if (count == pts.length) step3();
            });
    }

    function step3() {
        let count = 0;
        g = svg.append('g');
        shapes = g.selectAll('path')
            .data(d3.range(4))
            .enter()
            .append('path')
            .attr({
                fill: 'rgba( 255, 255, 255, 0.5 )',
                d: d3.range(5).map(function(i) {
                    return (i === 0 ? 'M ' : 'L ') + center.x + ' ' + center.y;
                }).join(' ') + ' Z'
            });

        (function animShapes() {
            let n = 0;
            shapes
                .transition()
                .duration(300)
                .delay(function(d) {
                    return count === 0 ? d * 500 : 0;
                })
                .attr('d', function() {
                    return d3.range(5).map(function(i) {
                        let n = ~~(Math.random() * 5);
                        return (i === 0 ? 'M ' : 'L ') + pts[n][i].x + ' ' + pts[n][i].y;
                    }).join(' ') + ' Z';
                })
                .each('end', function() {
                    n++;
                    if (n == 4) {
                        count++;
                        if (count === 5) step4();
                        else animShapes();
                    }
                });
        })();
    }

    function step4() {
        d3.selectAll('line')
            .transition()
            .duration(300)
            .attr('x2', center.x)
            .attr('y2', center.y);

        let count = 0;
        pentas
            .data(pts)
            .attr('d', function(d) {
                return d.reverse().map(function(pt, i) {
                    return (i === 0 ? 'M ' : 'L ') + pt.x + ' ' + pt.y;
                }).join(' ') + ' Z';
            })
            .datum(function(d) {
                return {
                    length: this.getTotalLength()
                };
            })
            .attr('stroke-dasharray', function(d) {
                return (d.length / 5) + ' ' + 0;
            })
            .transition()
            .delay(function(d, i) {
                return 300 + (pts.length - i) * 150;
            })
            .duration(500)
            .attr('stroke-dasharray', function(d) {
                return 0 + ' ' + (d.length / 5);
            })
            .each('end', function() {
                count++;
                if (count === pts.length) endStep();
            });

        shapes
            .transition()
            .duration(300)
            .attr('d', d3.range(5).map(function(i) {
                return (i === 0 ? 'M ' : 'L ') + center.x + ' ' + center.y;
            }).join(' ') + ' Z')
    }

    function endStep() {
        pentas.remove();
        d3.selectAll('line').remove();
        g.remove();

        pauseAfterAnim();
    }
}
