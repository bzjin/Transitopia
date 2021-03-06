var CTPS = {};
CTPS.demoApp = {};

var projection = d3.geo.conicConformal()
  .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
  .scale([21000]) // N.B. The scale and translation vector were determined empirically.
  .translate([30,830]);
  
var geoPath = d3.geo.path().projection(projection); 

var comma = d3.format(",");

var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("drag", dragmove);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return d.LI_Percent + "%" ;
  })

var tipRoute = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "Route " + d.properties.letter;
  })

function dragmove(d) {
  d3.select(this)
  console.log(d3.event.x)
      .attr("x", function(d) { return d.x = Math.min(vrhScale(-30), d3.event.x)})
}


//Using the queue.js library
queue()
  .defer(d3.csv, "sourceTable.csv")
  .defer(d3.json, "tract_census.topojson")
  .defer(d3.json, "routes.topojson")

  .awaitAll(function(error, results){ 
    CTPS.demoApp.generateMap(results[1], results[2]);
    CTPS.demoApp.generatePanel(results[0]);
    CTPS.demoApp.generateSavings(results[0]);

    var globalVRH = 0; 
    results[0].forEach(function(i){ globalVRH += +i.TotalHours; })

    var minTotal = 0; 
    var popTotal = 0; 
    var vrhSavings = 0; 
    var vrhSavingsTotal = 0; 

    //highlight rectangles
    d3.selectAll(".selection").on("mouseover", function() { 
      if($(this).hasClass("clicked") == false){ 
            var routeName = this.getAttribute("class").split(" ")[0];
            
            d3.selectAll("." + routeName).filter("text").filter(".numRiders, .minPercent, .letterName")
              .style("font-weight", 700)
              .style("fill", "#FFC04C")

            d3.selectAll("." + routeName).filter(".routes")
              .style("stroke", "orange")

            d3.selectAll("." + routeName).filter(".minorityChart")
              .style("fill", "orange")

            d3.selectAll(".selection") 
              .style("cursor", "pointer");
      }
    })

    d3.selectAll(".selection").on("mouseout", function() { 
      if($(this).hasClass("clicked") == false){ 
            var routeName = this.getAttribute("class").split(" ")[0];
            
            d3.selectAll("." + routeName).filter("text").filter(".numRiders, .minPercent, .letterName")
              .style("font-weight", 300)
              .style("fill", "#ddd")

            d3.selectAll("." + routeName).filter(".routes")
              .style("stroke", "#ddd")

            d3.selectAll("." + routeName).filter(".minorityChart")
              .style("fill", "#ddd")
      }
    })

    //Clicking on bus routes on map and on chart 
    d3.selectAll(".selection").on("click", function() { 
        var routeName = this.getAttribute("class").split(" ")[0];

       if($(this).hasClass("clicked") == false){       //If not previously selected3
          d3.selectAll("." + routeName).filter("text").filter(".numRiders, .minPercent, .letterName")
            .style("font-weight", 700)
            .style("fill", "orange")
            .classed("clicked", true);

          d3.selectAll("." + routeName).filter(".routes")
            .style("stroke-dasharray", "none")
            .style("stroke", "orange")
            .classed("clicked", true);

          d3.selectAll("." + routeName).filter(".minorityChart")
              .style("fill", "orange")
              .classed("clicked", true);

          var letterRef = routeName.split("e")[1];

          results[0].forEach(function(i){
            if (i.Route == letterRef) { 
              minTotal += i.Wdky_Riders * i.LI_Percent / 100;
              popTotal += i.Wdky_Riders;
            }
          })
        } else { // If previously already selected
            d3.selectAll("." + routeName).filter("text").filter(".numRiders, .minPercent, .letterName")
            .style("font-weight", 300)
            .style("fill", "#ddd")
            .classed("clicked", false);

          d3.selectAll("." + routeName).filter(".routes")
            .style("stroke-dasharray", "1, 2")
            .style("stroke", "#ddd")
            .classed("clicked", false);

          d3.selectAll("." + routeName).filter(".minorityChart")
              .style("fill", "#ddd")
              .classed("clicked", false);

          var letterRef = routeName.split("e")[1];

          results[0].forEach(function(i){
            if (i.Route == letterRef) { 
              minTotal -= i.Wdky_Riders * i.LI_Percent / 100;
              popTotal -= i.Wdky_Riders;
            }
          })
        }

        //Update front-end numbers
        var didbRatio = (100 * minTotal / (popTotal + .01))/47.5;
          d3.selectAll(".yourChange")
            .attr("x", ratioScale(didbRatio));

          d3.selectAll('#sliderRatio').text(d3.round(didbRatio, 2));

          d3.selectAll('#aboveBelow')
            .text(function() { 
              if (didbRatio < brushValue) { return "below" }
              else { return "above" }
            })
            .style("color", function() { 
              if (didbRatio < brushValue) { return "green" }
              else { return "red" }
            })

          d3.selectAll('#isNot')
            .text(function() { 
              if (didbRatio < brushValue) { return "is no" }
              else { return "is" }
            })
           .style("color", function() { 
              if (didbRatio < brushValue) { return "green" }
              else { return "red" }
            })

          d3.select("#globalMinority").text(d3.round(100 * minTotal / (popTotal + .01), 0) + "%")
          d3.select("#globalMinPop").text(d3.round(minTotal, 0) + " People");
          d3.select("#globalPop").text(d3.round(popTotal, 0) + " People");

    }) //end select(".selection") for routes

    d3.selectAll(".vrhSlider").on("mouseover", function() { 
      if($(this).hasClass("clicked") == false){
        d3.selectAll(".vrhSlider").style("cursor", "pointer");

        var routeName = this.getAttribute("class").split(" ")[0];
        var routeChange = this.getAttribute("class").split(" ")[1];

        d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("rect")
          .style("stroke-width", 1)

        d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("text")
          .style("fill", "orange")
      }
    })

    d3.selectAll(".vrhSlider").on("mouseout", function() { 
      if($(this).hasClass("clicked") == false){
        var routeName = this.getAttribute("class").split(" ")[0];
        var routeChange = this.getAttribute("class").split(" ")[1];
      
        d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("rect")
          .style("stroke-width", 0)

        d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("text")
          .style("fill", "none")
      }
    })

    // If VRH rectangle is clicked
     d3.selectAll(".vrhSlider").on("click", function() { 
        var routeName = this.getAttribute("class").split(" ")[0];
        var routeChange = this.getAttribute("class").split(" ")[1];
        var letterRef = routeName.split("e")[1];
        var percentRef = +routeChange.split("t")[1];

        if ( $(this).hasClass("clicked") == false) {
            d3.selectAll("." + routeName).filter(".vrhSlider").filter("rect")
              .style("stroke-width", 0)
              .classed("clicked", false)

            d3.selectAll("." + routeName).filter(".vrhSlider").filter("text")
              .style("fill", "none")
              .classed("clicked", false)

            d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("rect")
              .style("stroke-width", 1)

            d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("text")
              .style("fill", "orange")

            results[0].forEach(function(i){
              if (i.Route == letterRef) { 
                if (i.Selected > 0){
                  vrhSavings -= i.Selected;
                }
                vrhSavings += i.TotalHours * percentRef / 100;
                i.Selected = i.TotalHours * percentRef / 100;
            }})

            d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange)
                .classed("clicked", true)
        } else {
          d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("rect")
            .style("stroke-width", 0)

          d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange).filter("text")
            .style("fill", "none")

          results[0].forEach(function(i){
            if (i.Route == letterRef) { 
                vrhSavings -= i.TotalHours * percentRef / 100;
                i.Selected = 0;
            }
          })

          d3.selectAll("." + routeName).filter(".vrhSlider").filter("." + routeChange)
                .classed("clicked", false)
        }
        
        d3.select("#vrhTotSavings").text(d3.round(100 * vrhSavings / globalVRH, 2) + "%")
    })


  }); 

CTPS.demoApp.generateMap = function(tracts, routes) {  
  var routes = topojson.feature(routes, routes.objects.select_routes_modified).features;

  var index = 0; 
  routes.forEach(function(i){ 
    i.properties.letter = alphabet[index];
    index++;
  })

  var projection = d3.geo.conicConformal()
    .parallels([41 + 43 / 60, 42 + 41 / 60])
    .rotate([71 + 30 / 60, -41 ])
    .scale([70000]) // N.B. The scale and translation vector were determined empirically.
    .translate([-240,2450]);
    
  var geoPath = d3.geo.path().projection(projection); 

  var tractMap = d3.select("#map").append("svg")
                .attr("width", "100%")
                .attr("height", 600)

  tractMap.call(tipRoute);

  tractMap.selectAll(".tracts")
      .data(topojson.feature(tracts, tracts.objects.tract_census_2).features)
      .enter()
      .append("path")
        .attr("class", function(d) { return "t" + d.properties.TRACT; })
        .attr("d", function(d) { return geoPath(d); })
        .style("fill", "#ddd")
        .style("opacity", function(d) { return d.properties.LOW_INC_HH_PCT/2; })

  tractMap.selectAll(".routes")
      .data(routes)
      .enter()
      .append("path")
        .attr("class", function(d) { return "route" + d.properties.letter + " routes selection"})
        .attr("d", function(d) { return geoPath(d); })
        .style("stroke", "#ddd")
        .style("fill", "none")
        .style("stroke-width", 3)
        .style("stroke-dasharray", "1, 2")
        .style("opacity", 1)
        .on("mouseenter", function(d) { tipRoute.show(d); })
        .on("mouseleave", function(d) { tipRoute.hide(d); })

     //Color key
    var xPos = 5;
    var yPos = 40; 
    var height = 600; 
    //background
    tractMap.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos - 7)
      .text("KEY");
    tractMap.append("text")
      .style("font-weight", 700)
      .attr("x", xPos).attr("y", yPos + 7)
      .text("% Low Income Households");

    //text and colors
    tractMap.append("rect")
      .style("fill", "#ddd").style("stroke", "none").style("opacity", .1)
      .attr("x", xPos).attr("y", yPos + 15).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 22)
      .text("20%");
    tractMap.append("rect")
      .style("fill", "#ddd").style("stroke", "none").style("opacity", .2)
      .attr("x", xPos).attr("y", yPos + 30).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 37)
      .text("40%");
    tractMap.append("rect")
      .style("fill", "#ddd").style("stroke", "none").style("opacity", .3)
      .attr("x", xPos).attr("y", yPos + 45).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 52)
      .text("60%");
    tractMap.append("rect")
      .style("fill", "#ddd").style("stroke", "none").style("opacity", .4)
      .attr("x", xPos).attr("y", yPos + 60).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 67)
      .text("80%");
    tractMap.append("rect")
      .style("fill", "#ddd").style("stroke", "none").style("opacity", .5)
      .attr("x", xPos).attr("y", yPos + 75).attr("height", "7px").attr("width", height/35);
    tractMap.append("text")
      .style("font-weight", 300)
      .attr("x", xPos + 25).attr("y", yPos + 82)
      .text("100%");

}

CTPS.demoApp.generatePanel = function(source) {
  var routes = [];

  source.forEach(function(i){
      routes.push(i.Route);
      i.Wdky_Riders = +i.Wdky_Riders;
      i.LI_Percent = +i.LI_Percent;
      i.Selected = 0;
  })

  var height = 600; 

  var toggler = d3.select("#chart").append("svg")
                  .attr("width", "100%")
                  .attr("height", height)

  var w = $("#chart").width();


  var xScale = d3.scale.linear()
              .domain([0, 100])
              .range([80, w - 30])

  var xScaleLength = d3.scale.linear()
                    .domain([0, 100])
                    .range([0, w - 110])

  var yScale = d3.scale.ordinal()
              .domain(routes)
              .rangePoints([110, height - 10])

  var xAxis = d3.svg.axis().scale(xScale).orient("top").ticks(10);

  toggler.append("g").attr("class", "x axis")
    .attr("transform", "translate(0, 100)")
    .call(xAxis)
    .selectAll("text").style("font-size", 10)

//Labelling
var yPos = 55;

  toggler.append("text")
    .text("Route")
    .attr("x", 25)
    .attr("y", yPos + 35)
    .style("text-anchor", "middle")
    .style("font-weight", 300)

  toggler.append("text")
    .text("Percent Low Income Ridership")
    .attr("x", 210)
    .attr("y", yPos + 20)
    .style("text-anchor", "middle")
    .style("font-weight", 300)
    .style("font-size", 12)

//Key 

toggler.append("text")
    .text("KEY:")
    .attr("x", 10)
    .attr("y", yPos - 32)
    .style("font-size", 11)

toggler.append("text")
    .text("90% Confidence Interval")
    .attr("x", 145)
    .attr("y", yPos - 17)
    .style("font-weight", 300)
    .style("font-size", 10)

toggler.append("text")
    .text("% Low Income")
    .attr("x", 145)
    .attr("y", yPos - 43)
    .style("font-weight", 300)
    .style("font-size", 10)

toggler.append("rect") //CI key
    .attr("x", 55)
    .attr("y", yPos - 40)
    .attr("width", 50)
    .attr("height", 10)
    .style("fill", "#ddd")
    .style("fill-opacity", .1)

toggler.append("path") //path for CI key
    .attr("d", "M 53 27 L 53 30 L 108 30 L 108 27 L 108 30 L 81 30 L 81 35 L 140 35")
    .style("stroke", "#ddd")
    .style("stroke-width", 1)

toggler.append("rect") //% key
    .attr("x", 80)
    .attr("y", yPos - 40)
    .attr("width", 2)
    .attr("height", 10)
    .style("fill", "#ddd")
    .style("fill-opacity", 1)

toggler.append("path")
    .attr("d", "M 81 12 L 81 8 L 140 8")
    .style("stroke", "#ddd")
    .style("stroke-width", 1)

//Graphing
  toggler.selectAll(".letterLabel")
    .data(source)
    .enter()
    .append("text")
    .text(function(d) { return d.Route})
    .attr("class", function(d) { return "route" + d.Route + " letterName selection"})
    .attr("x", 15)
    .attr("y", function(d) { return yScale(d.Route) + 10})
    .style("fill", "#ddd")
    .style("font-weight", 300)

//graph DI coverage
  toggler.append("rect")
    .attr("class", "affected")
    .attr("x", xScale(0))
    .attr("y", 105)
    .attr("width", xScaleLength(47.5))
    .attr("height", height - 55)
    .style("fill", "#ddd")
    .style("fill-opacity", .05)

toggler.call(tip);

//graph confidence intervals (grey)
  toggler.selectAll(".minorityCI")
    .data(source)
    .enter()
    .append("rect")
      .attr("class", function(d) { return "route" + d.Route + " minorityChart";})
      .attr("x", function(d) { return xScale(d.LI_90pct_Lower); })
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("height", 10)
      .attr("width", function(d) { return xScaleLength(d.LI_90pct_Upper - d.LI_90pct_Lower); })
      .style("fill-opacity", .1)
      .style("fill", "#ddd")
      .style("stroke-width", 1)
      .style("stroke", "none")
      .on("mouseenter", function(d) { tip.show(d); })
      .on("mouseout", function(d) { tip.hide(d); })

//graph Low Income percentage (white bar)
  toggler.selectAll(".minorityPercent")
    .data(source)
    .enter()
    .append("rect")
      .attr("class", function(d) { return "route" + d.Route + " minorityChart";})
      .attr("x", function(d) { return xScale(d.LI_Percent); })
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("height", 10)
      .attr("width", 2)
      .attr("fill-opacity", 1)
      .attr("fill", "#ddd")
      .on("mouseenter", function(d) { tip.show(d); })
      .on("mouseout", function(d) { tip.hide(d); })
  // parameters
var margin = 20,
  width = $("#slider").width();
  height = 40;


// scale function
ratioScale = d3.scale.linear()
  .domain([.7, 1.3])
  .range([0, width - 2 * margin])
  .clamp(true);


// initial value
var startingValue = d3.round(1.0, 2) ;

//////////

// defines brush
brush = d3.svg.brush()
  .x(ratioScale)
  .extent([startingValue, startingValue])
  .on("brush", brushed);

var svg = d3.select("#slider").append("svg")
  .attr("width", width)
  .attr("height", height + margin * 2)
  .append("g")
  // classic transform to position g
  .attr("transform", "translate(" + margin + "," + 2 * margin + ")");

svg.append("g")
  .attr("class", "ratio")
  .attr("transform", "translate(0," + (height / 2 - 10) + ")")
.call(d3.svg.axis()
  .scale(ratioScale)
  .orient("bottom")
  .ticks(7)
  .tickValues([.7, 1.3]))
  .attr("class", "halo");

var slider = svg.append("g")
  .attr("class", "slider")
  .call(brush);

slider.selectAll(".extent,.resize")
  .remove();

slider.select(".background")
  .attr("height", height);

var handle = slider.append("g")
  .attr("class", "handle")

handle.append("path")
  .attr("transform", "translate(0," + (height / 2 - 10)+ ")")
  .attr("d", "M 0 -10 V 10")

handle.append('text')
  .text("1.0")
  .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 35) + ")");

slider
  .call(brush.event)

slider.append("rect")
    .attr("class", "yourChange")
    .attr("x", ratioScale(0))
    .attr("y", 0)
    .attr("width", 3)
    .attr("height", 20)
    .style("fill", "orange")
    .style("fill-opacity", 1)

function brushed() {
  var value = brush.extent()[0];
  brushValue = brush.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value = ratioScale.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
  }

  handle.attr("transform", "translate(" + ratioScale(value) + ",0)")
  handle.select('text').text(d3.round(value, 2));

  d3.select('#sliderPercent').text(d3.round(value * 47.5, 2));
  d3.selectAll('.chosenSliderRatio').text(d3.round(value, 2));
  d3.select('.affected')
      .attr("width", xScaleLength(value * 47.5))

}//end function brushed()


}


CTPS.demoApp.generateSavings = function(source) {

  var routes = [];

  source.forEach(function(i){
      routes.push(i.Route);
      i.Wdky_Riders = +i.Wdky_Riders;
      i.LI_Percent = +i.LI_Percent;
  })

  var height = 550; 

  var toggler = d3.select("#tableRows").append("svg")
                  .attr("width", "100%")
                  .attr("height", height)

  var w = $("#tableRows").width();


  var xScale = d3.scale.linear()
              .domain([0, 100])
              .range([120, w - 30])

  var xScaleLength = d3.scale.linear()
                    .domain([0, 100])
                    .range([0, w - 150])

  var yScale = d3.scale.ordinal()
              .domain(routes)
              .rangePoints([55, height - 15])

  var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-w + 100, 0, 0);
  
  var yLabel = 15;
  //Labelling
   toggler.append("text")
    .text("Route")
    .attr("x", 18)
    .attr("y", yLabel + 8)
    .style("text-anchor", "middle")

  toggler.append("text")
    .text("Total")
    .attr("x", 80)
    .attr("y", yLabel)
    .style("text-anchor", "middle")

  toggler.append("text")
    .text("Ridership")
    .attr("x", 80)
    .attr("y", yLabel + 15)
    .style("text-anchor", "middle")

  toggler.append("text")
    .text("% Low Income")
    .attr("x", 150)
    .attr("y", yLabel)
    .style("text-anchor", "middle")

  toggler.append("text")
    .text("Ridership")
    .attr("x", 150)
    .attr("y", yLabel + 15)
    .style("text-anchor", "middle")

  toggler.append("text")
    .text("Vehicle Revenue Hours")
    .attr("x", 350)
    .attr("y", yLabel)
    .style("text-anchor", "middle")
    .style("font-size", 12)

  //Filling in the table
  toggler.selectAll(".letterName")
    .data(source)
    .enter()
    .append("text")
      .attr("class", function(d) { return "route" + d.Route + " letterName selection"})
      .attr("x", 15)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "#ddd")
      .text(function(d) { return d.Route; })
      .style("text-anchor", "middle")


  toggler.selectAll(".numRiders")
    .data(source)
    .enter()
    .append("text")
      .attr("class", function(d) { return "route" + d.Route + " numRiders selection"})
      .attr("x", 100)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "#ddd")
      .text(function(d) { return comma(d.Wdky_Riders); })
      .style("text-anchor", "end")

  toggler.selectAll(".minPercent")
    .data(source)
    .enter()
    .append("text")
      .attr("class", function(d) { return "route" + d.Route + " minPercent selection"})
      .attr("x", 165)
      .attr("y", function(d) { return yScale(d.Route); })
      .attr("fill", "#ddd")
      .text(function(d) { return comma(d.LI_Percent) + "%"; })
      .style("text-anchor", "end")

  vrhScale = d3.scale.ordinal()
              .domain([-100, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30])
              .rangePoints([200, w - 30])

  vrhScaleLabels = d3.scale.ordinal()
              .domain(["-100%", "-30%", "-25%","-20%","-15%","-10%","-5%","0%","+5%","+10%","+15%","+20%","+25%","+30%",])
              .rangePoints([190, w - 30])

  var vrhScaleLength = d3.scale.linear()
                    .domain([0, 60])
                    .range([0, w - 230])

  var vrhAxis = d3.svg.axis().scale(vrhScaleLabels).orient("top");

  toggler.append("g").attr("class", "x axis")
    .attr("transform", "translate(12, 35)")
    .call(vrhAxis)
    .selectAll("text")
      .style("font-size", 8)

  var increments = [-100, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30];
  increments.forEach(function(i){
    toggler.selectAll("vrhSlider")
      .data(source)
      .enter()
      .append("rect")
        .attr("class", function(d) { 
          if (i == 0) { 
            return "route" + d.Route + " " + "percent" + i + " vrhSlider selection clicked"
          } else { 
            return "route" + d.Route + " " + "percent" + i + " vrhSlider selection"
          }})
        .attr("x", vrhScale(i))
        .attr("y", function(d) { return yScale(d.Route); })
        .style("fill", function() { 
          if (i == -100) { return  "red" } 
          else { return "#ddd";}})
        .style("stroke", "orange")
        .style("stroke-width", function() { 
          if (i == 0 ) { return 1 }
          else { return 0; }
        })
        .attr("width", 20)
        .attr("height", 5)
        .style("fill-opacity", function() { 
          if (i == -100) { return .3 } 
          else { return 1 - 2.5 * Math.abs((i+1)/100);}})

    toggler.selectAll("vrhText")
      .data(source)
      .enter()
      .append("text")
        .attr("class", function(d) { 
          if (i == 0 ) { 
            return "route" + d.Route + " " + "percent" + i + " vrhSlider selection clicked";
          } else { 
            return "route" + d.Route + " " + "percent" + i + " vrhSlider selection";
          }
        })
        .attr("x", vrhScale(i) + 10)
        .attr("y", function(d) { return yScale(d.Route) - 4; })
        .style("fill", function() { 
          if (i == 0 ) { return "#ddd" }
          else { return "none"; }
        }) 
        .text(function(d) { 
          if (i == -100) { return "Remove all"; }
          else { return d3.round(d.TotalHours - (- d.TotalHours * i / 100)) + " hrs"; }})
        .style("font-size", 8)
        .style("text-anchor", "middle")
  })

    
}



