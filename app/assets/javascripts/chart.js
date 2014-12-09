$(document).ready(function(){

  $.ajax({
    type: 'GET',
    url: '/query',
    dataType: "json",
    success: function(response){
      var dataset = response.dataset[0];
      var start = 0;
      var end = 50;
      console.log(dataset)
      buildChart(dataset);
      buildMiniChart(dataset, start, end);
    }
  });


  // FULL BAR CHART
  function buildChart(dataset){

    // Define dimensions of svg
    var h = 400,
        w = 800;

    // Creates svg element
    var chart = d3.select('.bar-chart')
                  .append('svg') // Parent svg element will contain the chart
                  .attr('width', w)
                  .attr('height', h);

    var chartPadding = 0, // 10
        chartBottom = h - chartPadding,
        chartRight = w - chartPadding;

    // y value scale domain
    var maxValue = d3.max(dataset,function(d){ return d[2]; });
    var yScale = d3.scale
                 .linear()
                 .domain( [0,maxValue] )
                 .range( [chartPadding, chartBottom] );

    // x value scale (ordinal)
    var barLabels = dataset.map(function(d){
              return d[0];
          });

    var xScale = d3.scale.ordinal()
                 .domain(barLabels) // Passes in a list of discreet 'labels' or categories
                 // RangeBands divide passed in interval by the length of the domain (calculates %spacing if passed in)
                 // RangeRoundBands rounds calculation to the nearest whole pixel
                 .rangeRoundBands([chartPadding,chartRight], 0.1); // Divides bands equally, with 10% spacing
                 // .rangeRoundBands([-50,700], 0.1);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { return 'Hex  ' + d[0] + '<br>RGB  ' + d[1] + '<br>CMYK  ' + d[3]; })
      .style('fill', 'white');

    chart.call(tip);

    // Creates bars
    chart.selectAll('rect')  // Returns empty selection
         .data(dataset)      // Parses & counts data
         .enter()            // Binds data to placeholders
         .append('rect')     // Creates a rect svg element for every datum
         .style('stroke', '#000')    
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
         // Adds clicked color to custom palette
         .on('click', function(d){
           $('.selected-colors').append(
             '<div class="color-row"><div class="color-box" style="background: ' + d[0] + ';"></div><div class="color-info">' 
             + " Hex -> " + d[0] + '<br>' + " RGB -> " + d[1] + '<br>' + " CMYK -> " + d[3] + '</div>' + '<span id="delete">×</span><div class="clearfix"></div></div>'
             )

           // Click event for complementary color
          $('div#chosen-color').html('<span><svg height="40" width="40"><circle cx="20" cy="20" r="20" fill="' + d[0] + '" /></svg>') 
          $('div#complementary-color').html('<span><svg height="40" width="40"><circle cx="20" cy="20" r="20" fill="' + d[4] + '" /></svg>')

           var hex = d[0]

           // Updates tints/shades based on selected color
           $.ajax({
             type: 'POST',
             url: '/tint_shade',
             data: 'color[' + hex + ']', 
             success: function(response){
               $('.tints').html("");
               response.dataset[0].forEach(function(color){
                $('.tints').append('<div style="width: 10%; height: 70px; position: relative; float: left; background-color: #' + color + '"></div>');
               });

               $('.shades').html("");
               response.dataset[1].forEach(function(color){
                 $('.shades').append('<div style="width: 10%; height: 70px; position: relative; float: left; background-color: #' + color + '"></div>');
               });
            } 
           })
         });
  }

  // ZOOMED IN BAR CHART
  function buildMiniChart(dataset, start, end){

    var h = 150,
        w = 300;

    var dataset = dataset.slice(start, end);

    var chart = d3.select('.mini-set-bar-chart')
                  .append('svg') 
                  .attr('width', w)
                  .attr('height', h);
                  

    var chartPadding = 0, // 50
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
      .html(function(d) { return "Hex  " + d[0] + '<br>RGB  ' + d[1] + '<br>CMYK  ' + d[3]; });

    chart.call(tip);

    // Creates bars
    chart.selectAll('rect')  
         .data(dataset)      
         .enter()           
         .append('rect') 
         .style('stroke', '#000')    
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
             '<div class="color-row"><div class="color-box" style="background: ' + d[0] + ';"></div><div class="color-info">' 
             + " Hex -> " + d[0] + '<br>' + " RGB -> " + d[1] + '<br>' + " CMYK -> " + d[3] + '</div>' + '<span id="delete">×</span><div class="clearfix"></div></div>'
             )

          // Adds complementary colors
          $('div#chosen-color').html('<span><svg height="40" width="40"><circle cx="20" cy="20" r="20" fill="' + d[0] + '" /></svg>') 
          $('div#complementary-color').html('<span><svg height="40" width="40"><circle cx="20" cy="20" r="20" fill="' + d[4] + '" /></svg>')


           // Updates tints/shades based on selected color
           var hex = d[0]

           $.ajax({
             type: 'POST',
             url: '/tint_shade',
             data: 'color[' + hex + ']', 
             success: function(response){
               $('.tints').html("");
               response.dataset[0].forEach(function(color){
                 $('.tints').append('<div style="width: 10%; height: 70px; position: relative; float: left; background-color: #' + color + '"></div>');
               });

               $('.shades').html("");
               response.dataset[1].forEach(function(color){
                 $('.shades').append('<div style="width: 10%; height: 70px; position: relative; float: left; background-color: #' + color + '"></div>');
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
      .html(function(d) { return 'Hex  ' + d[0] + '<br>RGB  ' + d[1] + '<br>CMYK  ' + d[3]; });

    chart.call(tip);

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
             '<div class="color-row"><div class="color-box" style="background: ' + d[0] + ';"></div><div class="color-info">' 
             + " Hex -> " + d[0] + '<br>' + " RGB -> " + d[1] + '<br>' + " CMYK -> " + d[3] + '</div>' + '<span id="delete">×</span><div class="clearfix"></div></div>'
             )

           var hex = d[0]

           // Updates tints/shades based on selected color
           $.ajax({
             type: 'POST',
             url: '/tint_shade',
             data: 'color[' + hex + ']', 
             success: function(response){
               $('.tints').html("");
               response.dataset[0].forEach(function(color){
                 $('.tints').append('<div style="width: 10%; height: 70px; position: relative; float: left; background-color: #' + color + '"></div>');
               });

               $('.shades').html("");
               response.dataset[1].forEach(function(color){
                 $('.shades').append('<div style="width: 10%; height: 70px; position: relative; float: left; background-color: #' + color + '"></div>');
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

           
  // Adds colors from suggested palettes to custom palette
  $('.suggested-color').on('click', function(d){
    var hex = $(this).data('color');
    $.ajax({
      type: 'POST',
      url: '/convert_colors',
      data: 'color[' + hex + ']',
      success: function(response){
        var RGB = response.dataset[0];
        var CMYK = response.dataset[1];
        $('.selected-colors').append(
             '<div class="color-row"><div class="color-box" style="background: ' + hex + ';"></div><div class="color-info">' 
             + " Hex -> " + hex + '<br>' + " RGB -> " + RGB + '<br>' + " CMYK -> " + CMYK + '</div>' + '<span id="delete">×</span><div class="clearfix"></div></div>'
             )
      }
    })
  });

  // Adds base color of complementary color pair to custom palette
  $('div#chosen-color').on('click', function(d){
    $.ajax({
      type: 'GET',
      url: '/query',
      dataType: "json",
      success: function(response){
        var hex = response.dataset[0][0][0]
        var RGB = response.dataset[0][0][1]
        var CMYK = response.dataset[0][0][3]
          $('.selected-colors').append(
               '<div class="color-row"><div class="color-box" style="background: ' + hex + ';"></div><div class="color-info">' 
               + " Hex -> " + hex + '<br>' + " RGB -> " + RGB + '<br>' + " CMYK -> " + CMYK + '</div>' + '<span id="delete">×</span><div class="clearfix"></div></div>'
               )
      }
    })
  });

  // Adds complementary color of complementary color pair to custom palette
  $('div#complementary-color').on('click', function(d){
    $.ajax({
      type: 'GET',
      url: '/query',
      dataType: "json",
      success: function(response){
        var hex = response.dataset[0][0][0]
        var RGB = response.dataset[0][0][1]
        var CMYK = response.dataset[0][0][3]
        var complementaryHex = response.dataset[0][0][4]
          $('.selected-colors').append(
               '<div class="color-row"><div class="color-box" style="background: ' + complementaryHex + ';"></div><div class="color-info">' 
               + " Hex -> " + hex + '<br>' + " RGB -> " + RGB + '<br>' + " CMYK -> " + CMYK + '</div>' + '<span id="delete">×</span><div class="clearfix"></div></div>'
               )
      }
    })
  });

  // Removes colors from custom palette
  $('.selected-colors').on('click', '#delete', function(){
    $(this).parent().remove();
  });


  // Adds default set of tints/shades based on most prevalent color
  $.ajax({
    type: 'GET',
    url: '/default_tint_shade',
    dataType: "json",
    success: function(response){
      var defaultTints = response.dataset[0]
      var defaultShades = response.dataset[1]
      setDefaultTintsShades(defaultTints, defaultShades)
    }
  });

  function setDefaultTintsShades(defaultTints, defaultShades){
    defaultTints.forEach(function(color){
      $('.tints').append('<div style="width: 10%; height: 70px; position:relative; float:left; background-color: #' + color + '"></div>');
    });

    defaultShades.forEach(function(color){
      $('.shades').append('<div style="width: 10%; height: 70px; position:relative; float:left; background-color: #' + color + '"></div>');
    });
  }


  // Adds default complementary color pair based on most prevalent color
  $.ajax({
    type: 'GET',
    url: '/query',
    dataType: "json",
    success: function(response){
      var defaultStartColor = response.dataset[0][0][0]
      var defaultComplementaryColor = response.dataset[0][0][4]
      setDefaultComplementaryPair(defaultStartColor, defaultComplementaryColor)
    }
  });

  function setDefaultComplementaryPair(defaultStartColor, defaultComplementaryColor){
    $('div#chosen-color').append('<span><svg height="40" width="40"><circle cx="20" cy="20" r="20" fill="' + defaultStartColor + '" /></svg>');

    $('div#complementary-color').append('<span><svg height="40" width="40"><circle cx="20" cy="20" r="20" fill="' + defaultComplementaryColor + '" /></svg>');
  };

});
