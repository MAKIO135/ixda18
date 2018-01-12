// horizontal bars
class Anim5{
    start(){
        let data, g, bars;

        (function() {
            let n = 10;
            let data2 = d3.shuffle(d3.range(n));
            let data3 = d3.shuffle(d3.range(n));
            data = d3.range(n).map(function(d) {
                return {
                    pos1: d,
                    pos2: data2[d],
                    pos3: data3[d],
                }
            });

            g = svg.append('g');
            bars = g.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr({
                x: w / 2,
                width: 0,
                height: 0,
                fill: 'rgb( 255, 255, 255 )',
                opacity: 0
            })
            .attr('y', function(d) {
                return 50 + ~~((h - 100) / data.length) * d.pos1;
            });

            step1();
        })();

        function step1() {
            let count = 0;

            bars
            .transition()
            .duration(500)
            .delay(function(d, i) {
                return (data.length - i) * 100;
            })
            .attr('width', function(d) {
                return (d.pos3 + 1) / data.length * (w - 100);
            })
            .attr('height', ~~((h - 100) / data.length))
            .attr('x', function(d) {
                return w / 2 - ((d.pos3 + 1) / data.length * (w - 100)) / 2;
            })
            .attr('opacity', function(d) {
                return (1 / data.length) * (d.pos3 + 1);
            })
            .transition()
            .duration(300)
            .each('end', function() {
                count++;
                if (count === data.length) step2();
            });
        }

        function step2() {
            let count = 0;

            bars
            .transition()
            .duration(500)
            .attr('width', function(d) {
                return (d.pos2 + 1) / data.length * (w - 100);
            })
            .attr('x', function(d) {
                return w / 2 - ((d.pos2 + 1) / data.length * (w - 100)) / 2;
            })
            .attr('opacity', function(d) {
                return (1 / data.length) * (d.pos2 + 1);
            })
            .transition()
            .duration(300)

            .transition()
            .duration(500)
            .attr('width', function(d) {
                return (d.pos1 + 1) / data.length * (w - 100);
            })
            .attr('x', function(d) {
                return w / 2 - ((d.pos1 + 1) / data.length * (w - 100)) / 2;
            })
            .attr('opacity', function(d) {
                return (1 / data.length) * (d.pos1 + 1);
            })
            .transition()
            .duration(300)

            .transition()
            .duration(500)
            .attr('width', w - 100)
            .attr('x', 50)
            .attr('opacity', function(d) {
                return (1 / data.length) * (d.pos1 + 1);
            })
            .each('end', function() {
                count++;
                if (count === data.length) endStep();
            });
        }

        function endStep() {
            bars.remove();
            g.remove();
            animD3_2suite(data);
        }

        // horizontal lines
        function animD3_2suite(_data) {
            let data, paths;

            (function() {
                data = _data;

                paths = svg.selectAll('path')
                .data(data)
                .enter()
                .append('path')
                .attr({
                    stroke: 'rgb( 255, 255, 255 )',
                    fill: 'none',
                    'stroke-width': ~~((h - 100) / data.length)
                })
                .attr('opacity', function(d) {
                    return (1 / data.length) * (d.pos1 + 1);
                })
                .attr('d', function(d) {
                    let path =
                    ' M ' + ~~(w - 50) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5)) +
                    ' L ' + ~~(5 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5)) +
                    ' L ' + ~~(4 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5)) +
                    ' L ' + ~~(w / 2 + 15) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5)) +
                    ' L ' + ~~(w / 2 - 15) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5)) +
                    ' L ' + ~~(2 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5)) +
                    ' L ' + ~~(1 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5)) +
                    ' L ' + 50 + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5));
                    return path;
                });

                step1();
            })();

            function step1() {
                paths
                .transition()
                .duration(500)
                .attr('d', function(d) {
                    let path =
                    ' M ' + ~~(w - 50) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5)) +
                    ' L ' + ~~(5 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5)) +
                    ' L ' + ~~(4 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos2 + 0.5)) +
                    ' L ' + ~~(w / 2 + 15) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos2 + 0.5)) +
                    ' L ' + ~~(w / 2 - 15) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos2 + 0.5)) +
                    ' L ' + ~~(2 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos2 + 0.5)) +
                    ' L ' + ~~(1 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5)) +
                    ' L ' + 50 + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5));
                    return path;
                })
                .transition()
                .duration(500)
                .attr('d', function(d) {
                    let path =
                    ' M ' + ~~(w - 50) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos3 + 0.5)) +
                    ' L ' + ~~(5 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos3 + 0.5)) +
                    ' L ' + ~~(4 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos2 + 0.5)) +
                    ' L ' + ~~(w / 2 + 15) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos2 + 0.5)) +
                    ' L ' + ~~(w / 2 - 15) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos2 + 0.5)) +
                    ' L ' + ~~(2 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos2 + 0.5)) +
                    ' L ' + ~~(1 / 6 * (w - 100)) + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5)) +
                    ' L ' + 50 + ' ' + (50 + ~~((h - 100) / data.length) * (d.pos1 + 0.5));
                    return path;
                })
                .transition()
                .duration(300)
                .each('end', step2);
            }

            function step2() {
                let count = 0;

                paths
                .transition()
                .duration(500)
                .attr('stroke-width', 3)
                .transition()
                .duration(300)
                .each('end', function(d, i) {
                    count++;
                    if (count === data.length) step3();
                });
            }

            function step3() {
                let count = 0;

                svg.selectAll('path')
                .datum(function(d) {
                    return {
                        length: this.getTotalLength()
                    };
                })
                .attr('stroke-dasharray', function(d) {
                    return (d.length / 10) + ' ' + 0;
                })
                .transition()
                .delay(function(d, i) {
                    return i * 50;
                })
                .duration(1000)
                .attr('stroke-dasharray', function(d) {
                    return 0 + ' ' + (d.length / 10);
                })
                .each('end', function() {
                    count++;
                    if (count == data.length) endStep();
                });
            }

            function endStep() {
                paths.remove();
                pauseAfterAnim();
            }
        }
    }

    display(){}
}
