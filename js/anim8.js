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
