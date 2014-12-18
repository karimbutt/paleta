$(document).ready(function(){

  $.ajax({
    type: 'GET',
    url: '/query',
    dataType: "json",
    success: function(response){
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
      .html(function(d) { return 'HEX  ' + d[0] + '<br>RGB  ' + d[1] + '<br>CMYK  ' + d[3]; })
      .style('fill', 'white');

    chart.call(tip);

    // Creates bars
    chart.selectAll('rect')  // Returns empty selection
         .data(dataset)      // Parses & counts data
         .enter()            // Binds data to placeholders
         .append('rect')     // Creates a rect svg element for every datum
         // .style('stroke', '#000')    
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
             + " HEX -> " + d[0] + '<br>' + " RGB -> " + d[1] + '<br>' + " CMYK -> " + d[3] + '</div>' + '<span id="delete" ><a href="#">×</a></span><div class="clearfix"></div></div>'
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
               response.dataset[0].forEach(function(d){
                $('.tints').append('<div class="tint" style="width: 10%; height: 40px; position: relative; float: left; background-color: #' + d[0] + '"></div>')
               });

               $('.shades').html("");
               response.dataset[1].forEach(function(d){
                 $('.shades').append('<div style="width: 10%; height: 40px; position: relative; float: left; background-color: #' + d[0] + '"></div>');
               });
            } 
           })

           // Adds selected shades/tints to custom palette
           // $.ajax({
           //  type: 'GET'
           //  url:


           // })

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
      .html(function(d) { return "HEX  " + d[0] + '<br>RGB  ' + d[1] + '<br>CMYK  ' + d[3]; });

    chart.call(tip);

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
             + " HEX -> " + d[0] + '<br>' + " RGB -> " + d[1] + '<br>' + " CMYK -> " + d[3] + '</div>' + '<span id="delete"><a href="#">×</a></span><div class="clearfix"></div></div>'
             )

           // Adds complementary colors
           $('div#chosen-color').html('<span><svg height="40" width="40"><circle cx="20" cy="20" r="20" fill="' + d[0] + '" /></svg>') 
           $('div#complementary-color').html('<span><svg height="40" width="40"><circle cx="20" cy="20" r="20" fill="' + d[4] + '" /></svg>')


          // $('div#chosen-color').html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 29.73 29.73" style="enable-background:new'+ d[0] +';" xml:space="preserve"> <path d="M14.865,0C6.655,0,0,6.655,0,14.865c0,1.714,0.201,2.831,0.767,4.546c1.104,3.188,6.896-2.808,9.388,0.729  c2.492,3.536-5.62,6.64-0.18,8.764c2.475,0.601,3.175,0.827,4.89,0.827c8.21,0,14.865-6.655,14.865-14.865  C29.73,6.655,23.075,0,14.865,0z M22.077,4.955c1.695,0,3.07,1.17,3.07,2.614c0,1.442-1.375,2.613-3.07,2.613  s-3.07-1.171-3.07-2.613C19.007,6.125,20.381,4.955,22.077,4.955z M4.74,15.802c-1.695,0-3.069-1.171-3.069-2.614  c0-1.443,1.375-2.614,3.069-2.614c1.696,0,3.071,1.171,3.071,2.614C7.811,14.631,6.437,15.802,4.74,15.802z M8.335,9.784  c-1.695,0-3.07-1.17-3.07-2.614c0-1.444,1.375-2.614,3.07-2.614c1.695,0,3.07,1.17,3.07,2.614C11.405,8.614,10.03,9.784,8.335,9.784  z M12.078,4.189c0-1.443,1.374-2.615,3.07-2.615c1.695,0,3.069,1.172,3.069,2.615s-1.375,2.614-3.069,2.614  C13.452,6.803,12.078,5.632,12.078,4.189z M17.341,27.627c-1.696,0-3.069-1.17-3.069-2.613c0-1.444,1.374-2.614,3.069-2.614  c1.695,0,3.07,1.17,3.07,2.614C20.411,26.457,19.036,27.627,17.341,27.627z M23.48,23.155c-1.695,0-3.069-1.172-3.069-2.614  c0-1.443,1.374-2.614,3.069-2.614s3.07,1.171,3.07,2.614C26.55,21.983,25.176,23.155,23.48,23.155z M25.146,16.603  c-1.695,0-3.07-1.17-3.07-2.614c0-1.444,1.375-2.614,3.07-2.614c1.696,0,3.071,1.17,3.071,2.614  C28.217,15.433,26.843,16.603,25.146,16.603z"/></svg>')
          // $('div#complementary-color').html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 29.73 29.73" style="enable-background:new'+ d[4] +';" xml:space="preserve"> <path d="M14.865,0C6.655,0,0,6.655,0,14.865c0,1.714,0.201,2.831,0.767,4.546c1.104,3.188,6.896-2.808,9.388,0.729  c2.492,3.536-5.62,6.64-0.18,8.764c2.475,0.601,3.175,0.827,4.89,0.827c8.21,0,14.865-6.655,14.865-14.865  C29.73,6.655,23.075,0,14.865,0z M22.077,4.955c1.695,0,3.07,1.17,3.07,2.614c0,1.442-1.375,2.613-3.07,2.613  s-3.07-1.171-3.07-2.613C19.007,6.125,20.381,4.955,22.077,4.955z M4.74,15.802c-1.695,0-3.069-1.171-3.069-2.614  c0-1.443,1.375-2.614,3.069-2.614c1.696,0,3.071,1.171,3.071,2.614C7.811,14.631,6.437,15.802,4.74,15.802z M8.335,9.784  c-1.695,0-3.07-1.17-3.07-2.614c0-1.444,1.375-2.614,3.07-2.614c1.695,0,3.07,1.17,3.07,2.614C11.405,8.614,10.03,9.784,8.335,9.784  z M12.078,4.189c0-1.443,1.374-2.615,3.07-2.615c1.695,0,3.069,1.172,3.069,2.615s-1.375,2.614-3.069,2.614  C13.452,6.803,12.078,5.632,12.078,4.189z M17.341,27.627c-1.696,0-3.069-1.17-3.069-2.613c0-1.444,1.374-2.614,3.069-2.614  c1.695,0,3.07,1.17,3.07,2.614C20.411,26.457,19.036,27.627,17.341,27.627z M23.48,23.155c-1.695,0-3.069-1.172-3.069-2.614  c0-1.443,1.374-2.614,3.069-2.614s3.07,1.171,3.07,2.614C26.55,21.983,25.176,23.155,23.48,23.155z M25.146,16.603  c-1.695,0-3.07-1.17-3.07-2.614c0-1.444,1.375-2.614,3.07-2.614c1.696,0,3.071,1.17,3.071,2.614  C28.217,15.433,26.843,16.603,25.146,16.603z"/></svg>')


           // Updates tints/shades based on selected color
           var hex = d[0]

           $.ajax({
             type: 'POST',
             url: '/tint_shade',
             data: 'color[' + hex + ']', 
             success: function(response){
               $('.tints').html("");
               response.dataset[0].forEach(function(d){
                 $('.tints').append('<div style="width: 10%; height: 40px; position: relative; float: left; background-color: #' + d[0] + '"></div>');
               });

               $('.shades').html("");
               response.dataset[1].forEach(function(d){
                 $('.shades').append('<div style="width: 10%; height: 40px; position: relative; float: left; background-color: #' + d[0] + '"></div>');
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

    var h = 150,
        w = 300;

    var dataset = dataset.slice(start, end);

    var chart = d3.select('.mini-set-bar-chart svg');
                 
    var chartPadding = 0
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
      .html(function(d) { return 'HEX  ' + d[0] + '<br>RGB  ' + d[1] + '<br>CMYK  ' + d[3]; });

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
             + " HEX -> " + d[0] + '<br>' + " RGB -> " + d[1] + '<br>' + " CMYK -> " + d[3] + '</div>' + '<span id="delete"><a href="#">×</a></span><div class="clearfix"></div></div>'
             )

           // Adds complementary colors
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
               response.dataset[0].forEach(function(d){
                 $('.tints').append('<div style="width: 10%; height: 40px; position: relative; float: left; background-color: #' + d[0] + '"></div>');
               });

               $('.shades').html("");
               response.dataset[1].forEach(function(d){
                 $('.shades').append('<div style="width: 10%; height: 40px; position: relative; float: left; background-color: #' + d[0] + '"></div>');
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
             + " HEX -> " + hex + '<br>' + " RGB -> " + RGB + '<br>' + " CMYK -> " + CMYK + '</div>' + '<span id="delete" href="#">×</span><div class="clearfix"></div></div>'
             )
        // Need to add complementary colors
      }
    })
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
    defaultTints.forEach(function(d){
      $('.tints').append('<div style="width: 10%; height: 40px; position:relative; float:left; background-color: #' + d[0] + '"></div>');
    });

    defaultShades.forEach(function(d){
      $('.shades').append('<div style="width: 10%; height: 40px; position:relative; float:left; background-color: #' + d[0] + '"></div>');
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
               + " HEX -> " + hex + '<br>' + " RGB -> " + RGB + '<br>' + " CMYK -> " + CMYK + '</div>' + '<span id="delete" href="#">×</span><div class="clearfix"></div></div>'
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
               + " HEX -> " + complementaryHex + '<br>' + " RGB -> " + RGB + '<br>' + " CMYK -> " + CMYK + '</div>' + '<span id="delete" href="#">×</span><div class="clearfix"></div></div>'
               )
      }
    })
  });


  // Removes colors from custom palette
  $('.selected-colors').on('click', '#delete', function(){
    $(this).parent().remove();
  });

});
