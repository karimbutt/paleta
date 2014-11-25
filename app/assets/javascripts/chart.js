$(document).ready(function(){

  $.ajax({
    type: 'GET',
    url: '/query',
    dataType: "json",
    success: function(response){
      console.log(response)
      var dataset = response.dataset[0];
      var start = 0;
      var end = 50;
      buildChart(dataset);
      buildMiniChart(dataset, start, end);
    }
  });

  // FULL BAR CHART
  function buildChart(dataset){

    // Define dimensions of svg
    var h = 300,
        w = 600;

    // Creates svg element
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
                 .domain(barLabels) // Passes in a list of discreet 'labels' or categories
                 // RangeBands divide passed in interval by the length of the domain (calculates %spacing if passed in)
                 // RangeRoundBands rounds calculation to the nearest whole pixel
                 .rangeRoundBands([chartPadding,chartRight], 0.1); // Divides bands equally, with 10% spacing

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { return 'Hex: ' + d[0] + '<br>RGB: ' + d[1] + '<br>CMYK: ' + d[3]; });

    chart.call(tip);

    // Creates bars
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
        // Attaches an event listener to each bar for mouseover
         .on('mouseover', tip.show)
         .on('mouseout', tip.hide)
         .on('click', function(d){
           $('.selected-colors').append(
             '<span><svg height="20" width="20"><circle cx="10" cy="10" r="10" fill="' + d[0] + '" /></svg>' 
             + " Hex: " + d[0] + ", RGB: " + d[1] + ", CMYK: " + d[3] + '<span id="delete"> X</span><br></span>'
             )
           var hex = d[0]
           $.ajax({
             type: 'POST',
             url: '/tint_shade',
             data: 'color[' + hex + ']', 
             success: function(response){
              // debugger;
               $('.tints').html("");
               response.dataset[0].forEach(function(color){
                 $('.tints').append('<div style="width:70px; height:70px; position:relative; float:left; background-color: #' + color + '"></div>');
               });

               $('.shades').html("");
               response.dataset[1].forEach(function(color){
                 $('.tints').append('<div style="width:70px; height:70px; position:relative; float:left; background-color: #' + color + '"></div>');
               });
            } 
           })
         });
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
      .html(function(d) { return "Hex: " + d[0] + '<br>RGB: ' + d[1] + '<br>CMYK: ' + d[3]; });

    chart.call(tip);

    // Creates bars
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
             '<span><svg height="20" width="20"><circle cx="10" cy="10" r="10" fill="' + d[0] + '" /></svg>' 
             + " Hex: " + d[0] + ", RGB: " + d[1] + ", CMYK: " + d[3] + '<span id="delete"> X</span><br></span>'
             )
           var hex = d[0]
           $.ajax({
             type: 'POST',
             url: '/tint_shade',
             data: 'color[' + hex + ']', 
             success: function(response){
               $('.tints').html("");
               response.dataset.forEach(function(color){
                 $('.tints').append('<div style="width:70px; height:70px; position:relative; float:left; background-color: #' + color + '"></div>');
               });
            } 
           })
         });
  }

  $('.selected-colors').on('click', '#delete', function(){
    $(this).parent().remove();
  });


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

    // Creates bars
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
             '<span><svg height="20" width="20"><circle cx="10" cy="10" r="10" fill="' + d[0] + '" /></svg>' 
             + " Hex: " + d[0] + ", RGB: " + d[1] + ", CMYK: " + d[3] + '<span id="delete"> X</span><br></span>'
             )
           var hex = d[0]
           $.ajax({
             type: 'POST',
             url: '/tint_shade',
             data: 'color[' + hex + ']', 
             success: function(response){
               $('.tints').html("");
               response.dataset.forEach(function(color){
                 $('.tints').append('<div style="width:70px; height:70px; position:relative; float:left; background-color: #' + color + '"></div>');
               });
            } 
           })
         });
  }

  // Handles toggling between sets of 50 colors
  $('#first').click(function(){
    $.ajax({
      type: 'GET',
      url: '/query',
      dataType: "json",
      success: function(response){
        var dataset = response.dataset[0];
        var start = 0;
        var end = 50;
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
        var dataset = response.dataset[0];
        var start = 51;
        var end = 101;
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
        var dataset = response.dataset[0];
        var start = 102;
        var end = 152;
        updateMiniChart(dataset, start, end);
      }    
    });
  })

  $('#fourth').click(function(){
    $.ajax({
      type: 'GET',
      url: '/query',
      dataType: "json",
      success: function(response){
        var dataset = response.dataset[0];
        var start = 153;
        var end = 203;
        updateMiniChart(dataset, start, end);
      }    
    });
  })

  $('#fifth').click(function(){
    $.ajax({
      type: 'GET',
      url: '/query',
      dataType: "json",
      success: function(response){
        var dataset = response.dataset[0];
        var start = 204;
        var end = 255;
        updateMiniChart(dataset, start, end);
      }    
    });
  })

  // Adds colors from suggested to custom
  $('.suggested-colors').on('click', function(d){
    var hex = $(this).data('color');
    $.ajax({
      type: 'POST',
      url: '/convert_colors',
      data: 'color[' + hex + ']',
      success: function(response){
        var RGB = response.dataset[0];
        var CMYK = response.dataset[1];
        $('.selected-colors').append(
          '<span><svg height="20" width="20"><circle cx="10" cy="10" r="10" fill="' + $(this).data('color') + '" /></svg>' 
          + " Hex: " + hex + ", RGB: " + RGB + ", CMYK: " + CMYK + '<span id="delete"> X</span><br></span>'
          )
      }
    })
  });

  // Removes selected colors from custom palette
  $('.selected-colors').on('click', '#delete', function(){
    $(this).parent().remove();
  });

});
