// pie chart
class Anim6{
    start(){
        let data, mask, rectmasks, g, arcs;
        let rnd = Math.random();

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
                    .stroke(rnd < .5 ? frontColor : 'rgb( 255, 255, 255 )')
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
                    .attr('stroke', rnd < .5 ? frontColor : 'rgb( 255, 255, 255 )')
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
                return i * 50 + 1500;
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

    display(){}
}
