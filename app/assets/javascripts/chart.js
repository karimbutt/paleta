$(document).ready(function(){

  $.ajax({
    type: 'GET',
    url: '/query',
    dataType: "json",
    success: function(response){
      var dataset = response.dataset;
      var start = 0;
      var end = 49;
      buildChart(dataset);
      buildMiniChart(dataset, start, end);
    }
  });

  // FULL BAR CHART
  function buildChart(dataset){

    // Define dimensions of svg
    var h = 300,
        w = 600;

    // Create svg element
    var chart = d3.select('.bar-chart')
                  .append('svg') // Parent svg element will contain the chart
                  .attr('width', w)
                  .attr('height', h)
                  .style('border', '1px solid black');

    var chartPadding = 12,
        chartBottom = h - chartPadding,
        chartRight = w - chartPadding;

    // y value scale domain
    var maxValue = d3.max(dataset,function(d){ return d[2]; });
    var yScale = d3.scale
                 .linear()
                 .domain( [0,maxValue] );

    // y value scale range
    var yScale = d3.scale
                 .linear()
                 .domain( [0,maxValue] )
                 .range( [chartPadding, chartBottom] );

    // x value scale (ordinal)
    var barLabels = dataset.map(function(datum){
              return datum[0];
          });

    var xScale = d3.scale.ordinal()
                 .domain(barLabels) // Pass in a list of discreet 'labels' or categories
                 // RangeBands divide passed in interval by the length of the domain (calculates %spacing if passed in)
                 // RangeRoundBands rounds calculation to the nearest whole pixel
                 .rangeRoundBands([chartPadding,chartRight], 0.1); // Divides bands equally, with 10% spacing

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { return d[0]; });

    chart.call(tip);

    // Create bars
    chart.selectAll('rect')  // Returns empty selection
         .data(dataset)      // Parses & counts data
         .enter()            // Binds data to placeholders
         .append('rect')     // Creates a rect svg element for every datum
         .style('fill', function(d){return d[0];})
         .attr({
               'x': function(d) {
                   return xScale(d[0]); 
               },
               'y': function(d) {
                   return h - yScale(d[2]);
               },
               'width': xScale.rangeBand(), // Gives bar width with space calculation built in
               'height': function(d) {
                   return yScale(d[2]) - chartPadding;
               }
         })
        // Attach event listener to each bar for mouseover
         .on('mouseover', tip.show)
         .on('mouseout', tip.hide)
         .on('click', function(d){
           $('.selected-colors').append(
             '<svg height="20" width="20"><circle cx="10" cy="10" r="10" fill="' + d[0] + '" /></svg>' 
             + d[0] + '<br>'
             )
// =======
// function buildCart(response){

//   var h = 500,
//       w = 1000;

//   // Create svg element
//   var chart = d3.select('.bar-chart')
//                 .append('svg') // parent svg element will contain the chart
//                 .attr('width', w)
//                 .attr('height', h);

//   // var barwidth = w / dataset.length;
//   // var spacing = 1;

//   // var chartPadding = 50;
//   // var chartBottom = h - chartPadding;
//   // var chartRight = w - chartPadding;

//   // y value scale domain
//   var maxValue = d3.max(dataset,function(d){ return d.value; });
//   var yScale = d3.scale
//                .linear()
//                .domain( [0,maxValue] );

//   //y value scale range
//   var yScale = d3.scale
//                .linear()
//                .domain( [0,maxValue] )
//                .range( [0, h] );

//   // x value scale (ordinal)
//   var barLabels = dataset.map(function(datum){
//             return datum.color;
//         });

//   var xScale = d3.scale.ordinal()
//                .domain(barLabels) // Pass in a list of discreet 'labels' or categories
//                // RangeBands divide passed in interval by the length of the domain (calculates %spacing if passed in)
//                // RangeRoundBands rounds calculation to the nearest whole pixel
//                .rangeRoundBands( [0, w], 0.1 ); // Divides bands equally among total width, with 10% spacing
                
//   // Create bars
//   chart.selectAll('rect')  // Returns empty selection
//        .data(dataset)      // Parses & counts data
//        .enter()            // Binds data to placeholders
//        .append('rect')     // Creates a rect svg element for every datum
//      //   .attr('x',function(d,i){
//      //      return i * (barwidth);
//      //  })
//      // .attr('y',function(d){
//      //      return h - d.value;
//      //  })
//      // .attr('width', barwidth - spacing) // Subtract spacing from bar width
//      // .attr('height',function(d){
//      //      return d.value;
//      //  })
//      // .attr('fill','black');
//        .attr({
//              'x': function(d) {
//                  return xScale(d.color); 
//                  // instead of return i * barwidth
//              },
//              'y': function(d) {
//                  return h - yScale(d.value);
//                  // instead of return h - d.value
//              },
//              'width': xScale.rangeBand(), // gives bar width with space calculation built in
//                 // instead of barwidth - spacing
//              'height': function(d) {
//                  return yScale(d.value);
//                 // instead of return d.value
//              },
//              'fill': 'black'
// >>>>>>> 359d248975a313517d171e91c31022ef62771e27
         });

    // var showValue = function(d) {
    //   chart.append('text')
    //        .text(d[2])
    //        .attr({
    //             'x': xScale(d[2]) + xScale.rangeBand() / 2,
    //             'y': yScale(d[2]) + 15,
    //             'class': 'value'
    //        });
    // }

    // var hideValue = function() {
    //   chart.select('text.value').remove();
    // }

    // var zoomListener = d3.behavior.zoom()
    //   .scaleExtent([0.1, 3])
    //   .on("zoom", zoomHandler);

    // function zoomHandler(){
    //   vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
         
    // Add labels
    // chart.selectAll('text')
    //      .data(dataset)
    //      .enter()
    //      .append('text')
    //      .text(function(d){
    //        return d[0];
    //      })

    //      .attr({
    //           'x': function(d){return xScale(d[0]) + xScale.rangeBand() / 2},
    //           'y': function(d){ return h - yScale(d[2]) },

    //           'font-family': 'sans-serif',
    //           'font-size': '10px',
    //           'font-weight': 'normal',
    //           'fill': 'black',
    //           'text-anchor': 'middle'
    //      });

  }

  // ZOOMED IN BAR CHART
  function buildMiniChart(dataset, start, end){

    var h = 300,
        w = 600;

    var dataset = dataset.slice(start, end);

    var chart = d3.select('.mini-set-bar-chart')
                  .append('svg') 
                  .attr('width', w)
                  .attr('height', h)
                  .style('border', '1px solid black');

    var chartPadding = 50,
        chartBottom = h - chartPadding,
        chartRight = w - chartPadding;

    var maxValue = d3.max(dataset,function(d){ return d[2]; });
    var yScale = d3.scale
                 .linear()
                 .domain( [0,maxValue] );

    var yScale = d3.scale
                 .linear()
                 .domain( [0,maxValue] )
                 .range( [chartPadding, chartBottom] );

    var barLabels = dataset.map(function(datum){
              return datum[0];
          });

    var xScale = d3.scale.ordinal()
                 .domain(barLabels) 
                 .rangeRoundBands([chartPadding,chartRight], 0.1);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { return d[0]; });

    chart.call(tip);

    // Create bars
    chart.selectAll('rect')  
         .data(dataset)      
         .enter()           
         .append('rect')     
         .style('fill', function(d){return d[0];})
         .attr({
               'x': function(d) {
                   return xScale(d[0]); 
               },
               'y': function(d) {
                   return h - yScale(d[2]);
               },
               'width': xScale.rangeBand(), 
               'height': function(d) {
                   return yScale(d[2]) - chartPadding;
               }
         })
         .on('mouseover', tip.show)
         .on('mouseout', tip.hide)
         .on('click', function(d){
           $('.selected-colors').append(
             '<svg height="20" width="20"><circle cx="10" cy="10" r="10" fill="' + d[0] + '" /></svg>' 
             + d[0] + '<br>'
             )
         });
  }

  // Updates zoomed in chart based on selected range
  function updateMiniChart(dataset, start, end){

    var h = 300,
        w = 600;

    var dataset = dataset.slice(start, end);

    var chart = d3.select('.mini-set-bar-chart svg');
                 
    var chartPadding = 50,
        chartBottom = h - chartPadding,
        chartRight = w - chartPadding;

    var maxValue = d3.max(dataset,function(d){ return d[2]; });
    var yScale = d3.scale
                 .linear()
                 .domain( [0,maxValue] );

    var yScale = d3.scale
                 .linear()
                 .domain( [0,maxValue] )
                 .range( [chartPadding, chartBottom] );

    var barLabels = dataset.map(function(datum){
              return datum[0];
          });

    var xScale = d3.scale.ordinal()
                 .domain(barLabels) 
                 .rangeRoundBands([chartPadding,chartRight], 0.1);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { return d[0]; });

    chart.call(tip);

    // Create bars
    chart.selectAll('rect')  
         .data(dataset)   
         .style('fill', function(d){return d[0];})
         .attr({
               'x': function(d) {
                   return xScale(d[0]); 
               },
               'y': function(d) {
                   return h - yScale(d[2]);
               },
               'width': xScale.rangeBand(), 
               'height': function(d) {
                   return yScale(d[2]) - chartPadding;
               }
         })
         .on('mouseover', tip.show)
         .on('mouseout', tip.hide)
         .on('click', function(d){
           $('.selected-colors').append(
             '<svg height="20" width="20"><circle cx="10" cy="10" r="10" fill="' + d[0] + '" /></svg>' 
             + d[0] + '<br>'
             )
         });
  }

  $('#first').click(function(){
    $.ajax({
      type: 'GET',
      url: '/query',
      dataType: "json",
      success: function(response){
        var dataset = response.dataset;
        var start = 0;
        var end = 49;
        updateMiniChart(dataset, start, end);
      }    
    });
  })

  $('#second').click(function(){
    $.ajax({
      type: 'GET',
      url: '/query',
      dataType: "json",
      success: function(response){
        var dataset = response.dataset;
        var start = 50;
        var end = 99;
        updateMiniChart(dataset, start, end);
      }    
    });
  })

  $('#third').click(function(){
    $.ajax({
      type: 'GET',
      url: '/query',
      dataType: "json",
      success: function(response){
        var dataset = response.dataset;
        var start = 100;
        var end = 149;
        updateMiniChart(dataset, start, end);
      }    
    });
  })

});

