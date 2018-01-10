// arcs
function animD3_1() {
    let data, data2, arc, g1, g2, arcs1, arcs2;

    function arcTween(transition) {
        transition.attrTween('d', function(d) {
            let interpolate = d3.interpolate(d.endAngle, d.toAngle);
            return function(t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        });
    }

    function arcTween2(transition) {
        transition.attrTween('d', function(d) {
            let interpolate = d3.interpolate(d.startAngle, d.toAngle);
            return function(t) {
                d.startAngle = interpolate(t);
                return arc(d);
            };
        });
    }

    (function() {
        data = [];
        let longueur = w - 100;
        for (let position = 0; position < longueur; position += data[data.length - 1].size) {
            let size = 30 + ~~(Math.random() * 70);

            if (position + size > longueur) size = longueur - position;

            data.push({
                size: size,
                x: position + size / 2,
                upper: Math.random() < 0.5
            });
        }

        data2 = [], index = 0;
        for (let i = 0; i < data.length - 1; i++) {
            if (data[i].upper == data[i + 1].upper) {
                if (data2[index]) {
                    data2[index].size += data[i + 1].size;
                } else {
                    let size = data[i].size + data[i + 1].size;
                    data2.push({
                        size: size,
                        x: data[i].x - data[i].size / 2,
                        upper: data[i].upper
                    });
                }

                if (i == data.length - 2) {
                    data2[index].x += data2[index].size / 2;
                }
            } else {
                if (data2[index]) {
                    data2[index].x += data2[index].size / 2;
                    index++;
                }
            }
        }

        arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(function(d) {
                return d.size / 2;
            });

        g2 = svg.append('g')
            .attr('id', 'g2');

        g1 = svg.append('g')
            .attr('id', 'g1');

        arcs1 = g1.selectAll('path')
            .data(data.map(function(d) {
                d.startAngle = 3 * Math.PI / 2;
                d.endAngle = 3 * Math.PI / 2;
                return d;
            }))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', 'rgb( 255, 255, 255 )')
            .attr('transform', function(d) {
                return 'translate(' + (50 + d.x) + ',' + (h / 2) + ')';
            })
            .data(data.map(function(d) {
                d.toAngle = d.upper ? Math.PI / 2 : 5 * Math.PI / 2;
                return d;
            }));

        arcs2 = g2.selectAll('path')
            .data(data2.map(function(d) {
                d.startAngle = 3 * Math.PI / 2;
                d.endAngle = 3 * Math.PI / 2;
                return d;
            }))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', 'rgba( 255, 255, 255, .3 )')
            .attr('transform', function(d) {
                return 'translate(' + (50 + d.x) + ',' + (h / 2) + ')';
            })
            .data(data2.map(function(d) {
                d.toAngle = d.upper ? Math.PI / 2 : 5 * Math.PI / 2;
                return d;
            }));

        step1();
    })();

    function step1() {
        let count = 0;

        arcs1
            .transition()
            .duration(500)
            .ease('sin')
            .call(arcTween)
            .each('end', function() {
                count++;
                if (count === data.length) step2();
            });
    }

    function step2() {
        let count = 0;

        arcs2
            .transition()
            .duration(500)
            .call(arcTween)
            .transition()
            .duration(300)
            .each('end', function() {
                count++;
                if (count === data2.length) step3();
            });
    }

    function step3() {
        let count = 0;

        arcs2
            .transition()
            .duration(500)
            .call(arcTween2);

        arcs1
            .transition()
            .duration(500)
            .call(arcTween2)
            .each('end', function() {
                count++;
                if (count === data.length) endStep();
            });
    }

    function endStep() {
        g1.remove();
        g2.remove();
        pauseAfterAnim();
    }
}
