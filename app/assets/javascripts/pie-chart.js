$(document).ready(function(){

    $.ajax({
    type: 'GET',
    url: '/query',
    dataType: "json",
    success: function(response){
      var dataset = response.dataset;
      buildCMYKPieChart(dataset);
      buildRGBPieChart(dataset);
    }
  });


// CMYK PIE CHART
  function buildCMYKPieChart(dataset){

    var pie_chart = d3.select('.cmyk-pie-chart')
                      .append('svg')
                      .attr('width', w)
                      .attr('height', h);

    var h = 300,
        w = 300;

    // Define inner and outer radius
    var oRadius = w / 2;
    var iRadius = w / 4; // > 1 to create 'donut' chart

    // arc() function helps draw SVG paths - need to pass in radii
    var arc = d3.svg.arc() 
                    .innerRadius(iRadius)
                    .outerRadius(oRadius);

    // Sample data        
    var dataset = [{color: "cyan", value: 50}, 
                   {color: "magenta", value: 10}, 
                   {color: "yellow", value: 10},
                   {color: "black", value: 30}
                  ];

    // Declare pie() function
    var pie = d3.layout.pie().value(function(d){return d.value});
    
    // // Create parent SVG element
    var pieChart = d3.select('.cmyk-pie-chart')
                   .append('svg')
                   .attr({
                          'width' : w,
                          'height' : h
                          });
   
    // var color = d3.scale.category10(); // Creates an ordinal scale of 10 different category colors
    var color = d3.scale.ordinal().domain(function(d){return d.value}).range(["cyan", "magenta", "yellow", "black"])

    // Use svg group elements for pie wedges
    var wedges = pieChart.selectAll('g')
                         .data(pie(dataset))
                         .enter()
                         .append('g')
                         .attr({
                                'class' : 'wedge',
                                // Translate each wedge into the center
                                'transform' : 'translate(' + oRadius + ', ' + oRadius + ')' 
                         });

        // Draw arcs for wedges
        wedges.append('path')
              .attr({
                     'fill' : function(d,i) {
                       return color(i);
                       // return 'black';

                    },
                    // pass in the arc generator for the 'd' attribute of the path,
                    // which is the path description
                     'd' : arc
              });
  }

// RGB PIE CHART
  function buildRGBPieChart(dataset){

    var pie_chart = d3.select('.rgb-pie-chart')
                      .append('svg')
                      .attr('width', w)
                      .attr('height', h);

    var h = 300,
        w = 300;

    // Define inner and outer radius
    var oRadius = w / 2;
    var iRadius = w / 4; // > 1 to create 'donut' chart

    // arc() function helps draw SVG paths - need to pass in radii
    var arc = d3.svg.arc() 
                    .innerRadius(iRadius)
                    .outerRadius(oRadius);

    // Sample data
    // var red = "#e50000"
    // var green = "#00cc00"
    // var blue = "#0000ff"

    var dataset = [{color: "#e50000", value: 30}, 
                   {color: "#00cc00", value: 20}, 
                   {color: "#0000ff", value: 50},
                  ];

    // Declare pie() function
    var pie = d3.layout.pie().value(function(d){return d.value});
    
    // // Create parent SVG element
    var pieChart = d3.select('.rgb-pie-chart')
                   .append('svg')
                   .attr({
                          'width' : w,
                          'height' : h
                          });
   
    // var color = d3.scale.category10(); // Creates an ordinal scale of 10 different category colors
    var color = d3.scale.ordinal().domain(function(d){return d.value}).range(["#e50000", "#00cc00", "#0000ff"])

    // Use svg group elements for pie wedges
    var wedges = pieChart.selectAll('g')
                         .data(pie(dataset))
                         .enter()
                         .append('g')
                         .attr({
                                'class' : 'wedge',
                                // Translate each wedge into the center
                                'transform' : 'translate(' + oRadius + ', ' + oRadius + ')' 
                         });

        // Draw arcs for wedges
        wedges.append('path')
              .attr({
                     'fill' : function(d,i) {
                       return color(i);
                       // return 'black';

                    },
                    // pass in the arc generator for the 'd' attribute of the path,
                    // which is the path description
                     'd' : arc
              });
  }

});