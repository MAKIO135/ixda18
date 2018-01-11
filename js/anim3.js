// vertical stack bar graph
class Anim3{
    start(){
        let margin, space, barWidth, rects, nb, g, data;

        (function() {
            margin = 50;
            space = 10;
            barWidth = 30;

            nb = Math.floor((w - margin * 2) / (barWidth + space));
            margin = (w - (nb * (barWidth + space))) / 2;

            g = svg.append('g')
            .attr('id', 'bars');

            data = d3.range(nb).map(function(d) {
                let pos = Math.random() < .5 ? -1 : 1,
                height = 20 + Math.random() * (h / 2 - 20 - 20),
                h1 = 5 + Math.random() * (height / 2 - 10),
                h2 = 5 + Math.random() * (height / 2 - 10),
                h3 = height - h1 - h2;

                return {
                    pos: pos,
                    height: height,
                    cumul: [h1, h2, h3]
                };
            });

            rects = g.selectAll('rect')
            .remove()
            .data(d3.range(nb * 3))
            .enter()
            .append('rect')
            .datum(function(d, i) {
                let opacity = 1.0;
                if (data[~~(i / 3)].pos < 0) {
                    if (i % 3 === 1) {
                        opacity = .6;
                    } else if (i % 3 === 2) {
                        opacity = .3;
                    }
                } else {
                    if (i % 3 === 1) {
                        opacity = .6;
                    } else if (i % 3 === 0) {
                        opacity = .3;
                    }
                }
                return {
                    opacity: opacity,
                    pos: data[~~(i / 3)].pos,
                    height: data[~~(i / 3)].height
                };
            });

            step1();
        })();

        // small bars graph
        function step1() {
            let count = 0;

            rects
            .attr({
                opacity: 1.0,
                fill: random( 1 ) < 0.5 ? frontColor : 'rgb( 255, 255, 255 )',
                y: h / 2,
                width: 8,
                height: 0
            })
            .attr('x', function(d, i) {
                return margin + space / 2 + (barWidth + space) * ~~(i / 3) + (i % 3) * 11;
            })
            .transition()
            .delay(function(d, i) {
                return i * 10;
            })
            .attr('height', function(d, i) {
                return data[~~(i / 3)].cumul[i % 3];
            })
            .attr('y', function(d, i) {
                return d.pos < 0 ? h / 2 - (data[~~(i / 3)].cumul[i % 3]) : h / 2;
            })
            .transition()
            .duration(300)
            .each('end', function() {
                count++;
                if (count === nb * 3) step2();
            });
        }

        // stack bars
        function step2() {
            let count = 0;

            rects
            .transition()
            .attr('y', function(d, i) {
                let y;
                if (d.pos < 0) {
                    y = h / 2 - d.height;
                } else {
                    y = h / 2;
                }
                for (let n = 0; n < i % 3; n++) {
                    y += data[~~(i / 3)].cumul[n];
                }
                return y;
            })
            .transition()
            .attr('x', function(d, i) {
                return margin + space / 2 + (barWidth + space) * ~~(i / 3);
            })
            .attr('opacity', function(d) {
                return d.opacity;
            })
            .attr('width', barWidth)
            .transition()
            .duration(300)
            .each('end', function() {
                count++;
                if (count === nb * 3) step3();
            })
        }

        // large bars graph
        function step3() {
            let count = 0;

            rects
            .transition()
            .duration(300)
            .attr('height', function(d, i) {
                let _h = 0;
                if (d.pos < 0) {
                    if (i % 3 === 0) {
                        _h = Math.abs(d.height);
                    }
                } else {
                    if (i % 3 === 2) {
                        _h = Math.abs(d.height);
                    }
                }

                return _h;
            })
            .attr('y', function(d, i) {
                let _y = h / 2;
                if (d.pos < 0) {
                    if (i % 3 === 0) {
                        _y = h / 2 - d.height;
                    }
                }
                return _y;
            })
            .each('end', function() {
                count++;
                if (count === nb * 3) step4();
            });
        }

        function step4() {
            let last = 0,
            count = 0;

            let sortedHeights = data.map(function(d) {
                return d.height * d.pos;
            }).sort(function(a, b) {
                return -(a - b);
            });

            rects
            .datum(function(d, i) {
                let index = sortedHeights.indexOf(d.height * d.pos);
                if (index == last) {
                    index++;
                }
                last = index;
                return {
                    orderedIndex: index
                }
            })
            .transition()
            .duration(500)
            .attr('x', function(d) {
                return margin + space / 2 + (barWidth + space) * d.orderedIndex;
            })
            .transition()
            .duration(300)
            .each('end', function() {
                count++;
                if (count === data.length) step5();
            });
        }

        // disapperaing large bars
        function step5() {
            let count = 0;

            rects
            .transition()
            .duration(300)
            .attr({
                y: h / 2,
                height: 0
            })
            .each('end', function() {
                count++;
                if (count === nb * 3) endStep();
            });
        }

        function endStep() {
            rects.remove();
            g.remove();

            pauseAfterAnim();
        }
    }

    display(){}
}
