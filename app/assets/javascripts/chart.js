$(document).ready(function(){

  $.ajax({
    type: 'GET',
    url: '/query',
    dataType: "json",
    success: function(response){
      var dataset = response.dataset; 
      buildCart(response);
    }
  });

function buildCart(response){
  debugger
  // Define dimensions of svg
  var h = 500,
      w = 1000;

  // Create svg element
  var chart = d3.select('.bar-chart')
                .append('svg') // parent svg element will contain the chart
                .attr('width', w)
                .attr('height', h);

  // var barwidth = w / dataset.length;
  // var spacing = 1;

  // var chartPadding = 50;
  // var chartBottom = h - chartPadding;
  // var chartRight = w - chartPadding;

  // y value scale domain
  var maxValue = d3.max(dataset,function(d){ return d.value; });
  var yScale = d3.scale
               .linear()
               .domain( [0,maxValue] );

  //y value scale range
  var yScale = d3.scale
               .linear()
               .domain( [0,maxValue] )
               .range( [0, h] );

  // x value scale (ordinal)
  var barLabels = dataset.map(function(datum){
            return datum.color;
        });

  var xScale = d3.scale.ordinal()
               .domain(barLabels) // Pass in a list of discreet 'labels' or categories
               // RangeBands divide passed in interval by the length of the domain (calculates %spacing if passed in)
               // RangeRoundBands rounds calculation to the nearest whole pixel
               .rangeRoundBands( [0, w], 0.1 ); // Divides bands equally among total width, with 10% spacing
                
  // Create bars
  chart.selectAll('rect')  // Returns empty selection
       .data(dataset)      // Parses & counts data
       .enter()            // Binds data to placeholders
       .append('rect')     // Creates a rect svg element for every datum
     //   .attr('x',function(d,i){
     //      return i * (barwidth);
     //  })
     // .attr('y',function(d){
     //      return h - d.value;
     //  })
     // .attr('width', barwidth - spacing) // Subtract spacing from bar width
     // .attr('height',function(d){
     //      return d.value;
     //  })
     // .attr('fill','black');
       .attr({
             'x': function(d) {
                 return xScale(d.color); 
                 // instead of return i * barwidth
             },
             'y': function(d) {
                 return h - yScale(d.value);
                 // instead of return h - d.value
             },
             'width': xScale.rangeBand(), // gives bar width with space calculation built in
                // instead of barwidth - spacing
             'height': function(d) {
                 return yScale(d.value);
                // instead of return d.value
             },
             'fill': 'black'
         });

  // Add labels
  chart.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .text(function(d){
          return d.color;
      })
     // Multiple attributes may be passed in as an object
     // .attr({
     //      'x': function(d,i){
     //           return (i * barwidth) + (barwidth / 2); 
     //      },                       // position text at the middle of each bar
     //      'y': function(d){
     //           return h - d.value; // base of text will be at the top of each bar
     //      },
        .attr({
             'x': function(d){return xScale(d.color) + xScale.rangeBand() / 2},
             'y': function(d){ return h - yScale(d.value) },

          'font-family': 'sans-serif',
          'font-size': '13px',
          'font-weight': 'bold',
          'fill': 'black',
          'text-anchor': 'middle'
     });
}
});

