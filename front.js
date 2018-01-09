// vertical stack bar graph
function animD3_0() {
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
                fill: 'rgb( 255, 255, 255 )',
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

// horizontal bars
function animD3_2() {
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

// pie chart
function animD3_3() {
    let data, mask, rectmasks, g, arcs;

    let arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(w);

    function arcTween(transition) {
        transition.attrTween('d', function(d) {
            let interpolate = d3.interpolate(d.endAngle, d.toAngle);
            return function(t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        });
    }

    (function() {
        mask = svg.append('clipPath')
            .attr('id', 'mask');

        rectmasks = mask.selectAll('rect')
            .data(d3.range(20))
            .enter()
            .append('rect')
            .attr({
                y: 0,
                width: w / 20 + 2,
                height: h
            })
            .attr('x', function(d, i) {
                return i * (w / 20);
            });

        data = [];
        for (let a = 0; a < 2 * Math.PI;) {
            let angle = .4 + Math.random() * (Math.PI / 2 - .3);
            if (a + angle + .4 > 2 * Math.PI) {
                angle = 2 * Math.PI - a;
            }

            data.push({
                startAngle: a + Math.PI / 2,
                endAngle: a + Math.PI / 2,
                toAngle: a + Math.PI / 2 + angle,
                diff: angle
            });

            a += angle;
        }

        let patternScale = d3.scale.linear()
            .domain([.4, Math.PI / 2])
            .range([1, .1]);

        let patterns = data.map(function(d, i) {
            let t = textures.lines()
                .stroke('rgb( 255, 255, 255 )')
                .thinner(patternScale(d.diff))
                .orientation('' + ~~(1 + Math.random() * 7) + '/8')
                .id('pattern' + i);

            svg.call(t);

            return t;
        });

        g = svg.append('g')
            .attr('clip-path', 'url(#mask)');

        arcs = g.selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('opacity', 1)
            .attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')')
            .attr('fill', function(d, i) {
                return patterns[i].url();
            });

        step1();
    })();

    function step1() {
        let count = 0;

        let timeScale = d3.scale.linear()
            .domain([0, 2 * Math.PI])
            .range([0, 500]);

        arcs
            .transition()
            .ease('linear')
            .delay(function(d) {
                return timeScale(d.startAngle);
            })
            .duration(100)
            .transition()
            .duration(function(d) {
                return timeScale(d.diff);
            })
            .call(arcTween)
            .each('start', function() {
                d3.select(this)
                    .attr('stroke', 'rgb( 255, 255, 255 )')
                    .attr('stroke-width', 3);
            })
            .transition()
            .duration(500)
            .each('end', function() {
                count++;
                if (count === data.length) step2();
            })
    }

    function step2() {
        let count = 0;

        rectmasks.transition()
            .duration(800)
            .delay(function(d, i) {
                return i * 50;
            })
            .attr('y', function(d, i) {
                return i % 2 === 0 ? h : -h;
            })
            .each('end', function() {
                count++;
                if (count === 20) endStep();
            })
    }

    function endStep() {
        arcs.remove();
        g.remove();
        rectmasks.remove();
        mask.remove();
        data.forEach(function(d, i) {
            d3.select('#pattern' + i).remove();
        })
        svg.selectAll('defs').remove();
        pauseAfterAnim();
    }
}

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

function animD3_5(){
    var arc = d3.svg.arc();

        function arcTween( transition ) {
            transition.attrTween( 'd', function( d ) {
                var start = Math.random() * 3 * Math.PI;

                var interpolateStart = d3.interpolate( d.startAngle, start );
                var interpolateEnd = d3.interpolate( d.endAngle, start + Math.random() * Math.PI * 2 );
                return function( t ) {
                    d.startAngle = interpolateStart( t );
                    d.endAngle = interpolateEnd( t );
                    return arc( d );
                };
            });
        }

        var paths, nb, n;
        function init(){
            n = 5 + ~~( Math.random() * 5 );
            nb = 5 + ~~( Math.random() * 50 );
            paths = svg.selectAll( 'path' )
                .remove()
                .data( d3.range( nb ).map( function(){
                    var inRad = 50 + Math.random() * 500;

                    return {
                        startAngle: 0,
                        endAngle: 0,
                        innerRadius: inRad,
                        outerRadius: inRad + Math.random() * 60
                    };
                } ) )
                .enter()
                .append( 'path' )
                .attr( 'd', arc )
                .attr( 'fill', 'rgba( 255, 255, 255, 0.8 )' )
                .attr( 'transform', 'translate(' + ( w / 2 ) + ',' + ( h / 2 ) + ')' );

            anim();
        }

        function anim(){
            var count = 0;
            paths
                .transition()
                .duration( 1000 )
                .call( arcTween )
                .transition()
                .duration( 300 )
                .each( 'end', function( d ){
                    count ++;
                    if( count === nb ){
                        n --;
                        if( n === 0){
                            terminate();
                        }
                        else{
                            anim();
                        }
                    }
                } );
        }

        init();

        function arcTerminate( transition ) {
            transition.attrTween( 'd', function( d ) {
                var interpolateStart = d3.interpolate( d.startAngle, Math.PI * 2 );
                var interpolateEnd = d3.interpolate( d.endAngle, Math.PI * 2 );
                return function( t ) {
                    d.startAngle = interpolateStart( t );
                    d.endAngle = interpolateEnd( t );
                    return arc( d );
                };
            });
        }

        function terminate(){
            var count = 0;
            paths
                .transition()
                .duration( 1000 )
                .call( arcTerminate )
                .remove()
                .each( 'end', function( d ){
                    count ++;
                    if( count === nb ) pauseAfterAnim();
                } );
        }
}
