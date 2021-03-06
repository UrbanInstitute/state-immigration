var IS_MOBILE = d3.select("#isMobile").style("display") == "block"
var IS_PHONE = d3.select("#isPhone").style("display") == "block"

function drawGridMap(container_width){

  if (container_width == undefined || isNaN(container_width)) {
        container_width = 1170;
    }
    if (container_width <= 400) {
        IS_PHONE = true
        var chart_aspect_height = .7;
        var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };
    }
    else if (container_width > 400 && container_width <= 600) {
        IS_PHONE = true
        var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };
    } else {
      IS_PHONE = false

    }
      
  var chartMap=this;


  var color = d3.scaleOrdinal()
      .domain([0, 1, 2])
      .range(["#d2d2d2", "#1696d2", "#fdbf11"]);

  var $map = $("#map");
  var aspect_width = 25;
  var aspect_height = (IS_PHONE) ? 26 : 18;
  var margin = { top: 10, right: 5, bottom: 10, left: 5 };
  var width= container_width - margin.left - margin.right; 
  var height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom; 

  var projection = d3.geoEquirectangular()
    .scale((IS_PHONE) ? width*4 : width*2.7)
    .center([-96.03542,41.69553])
    .translate(IS_PHONE ? [width /2.3, height /2.3] : [width /3.3, height /2.4]);

  var path = d3.geoPath()
    .projection(projection);





  /*DATA SOURCES*/

d3.json("data/combined-data.geojson", function(error1, states) {
  d3.csv("data/policy_descriptions_only.csv", function(error2, descriptions) {

  

        choropleth = new Choropleth(states, descriptions);


  });

});

  function Choropleth(states, descriptions) {

   $map.empty();


    function wrapText(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = (IS_PHONE) ? 1.1 : 1.5, // ems
            y = width*.05,
            x = 0,
            dy = -1,
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

    var wrapWidth = (IS_PHONE) ? width*.78 : width*.31;
    var wrapWidthTitle = (IS_PHONE) ? width*.78 : width*.65;
    var wrapWidthLegend = (IS_PHONE) ? width*.78 : width*.6;

    var mapWidth = (IS_PHONE) ? width*.9 : width*.65

    chartMap.svg = d3.select("#map")
      .append("svg")
      .attr("width", mapWidth)
      .attr("height", (container_width < 400 ? height* 1.2 : height*1.07))
      .attr("transform", function(d) { return "translate(0,"+ ((container_width <400) ? -20 : 0) + ")"; })

    chartMap.map = chartMap.svg.append('g')
      .selectAll('path')
      .data(states.features)
      .enter().append('path')
      .attr('d', path)
      .attr("id", function(d){return "square-" + d.properties.abbr})
      .attr('class', function(d) {
        return 'state ' + d.properties.abbr + ' dehovered '
      })

    chartMap.map
      .style("fill", "#fff")
    chartMap.svg
      .selectAll(".place-label")
      .data(states.features)
      .enter().append("text")
      .attr("class", "place-label")
      .attr("id", function(d){ return "label-" + d.properties.abbr})
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("dy", ".5em")
      .attr("dx", "-.7em")
      .text(function(d) { 
        return d.properties.abbr;
      });


 // STATE TEXT INFO
    var stateTextX = (IS_PHONE) ? width*.09 : width*.26
    var svg2Width = (IS_PHONE) ? width*.9 : width*.33;
   // var definition2_Y = (IS_PHONE) ? width*.45 : width*.565

    chartMap.svg2 = d3.select("#map")
          .append("svg")
          .attr("width", svg2Width)
          .attr("height", height)


    var stateText = chartMap.svg2.append("g")
          .attr("transform", function() {
            if (IS_PHONE) {
              return "translate("+ 0 +", " + width*.02 + ")"
            }; 
          })  
    var textStart = 0
    var textDescriptionHeader = (container_width < 400) ? width*.17 : width*.12
    // function definition1_Y() {
    //     if (container_width >= 400 && container_width < 600) {
    //     return textDescriptionHeader *3.5
    //   } else if (container_width < 400) {
    //       return textDescriptionHeader *4.7
    //   } return width*.55
    // }

    // var definition1_Y = definition1_Y();

    // function definition2_Y() {
    //     if (container_width >= 400 && container_width < 600) {
    //     return textDescriptionHeader *3.8
    //   } else if (container_width < 400) {
    //     return textDescriptionHeader *5
    //   } return width*.62
    // }

    // var definition2_Y = definition2_Y();

    var textYearHeader = (container_width < 400) ? width*.02 : width*.02

    stateText.append("text")
      .attr("class", "header")
      .attr("transform", function() { return "translate("+ textStart+", " + textYearHeader + ")"; })
      .text("YEAR")
    stateText.append("text")
      .attr("class", "header")
      .attr("transform", function() { return "translate("+ textStart+", " + textDescriptionHeader + ")"; })
      .text("POLICY DESCRIPTION")
  
    stateText.append("text")
      .attr("class", "text-body-year")
      .attr("transform", function() { return "translate("+ textStart+", " + (textYearHeader*3.4) + ")"; })
      .text("")  
  
    stateText.append("text")
      .attr("class", "text-body-description")
      .attr("transform", function() { return "translate("+ textStart+", " + (textDescriptionHeader*1.25)+ ")"; })
      .text("") 

    stateText.append("text") 
      .attr("class", "text-definition-1")
      .text("") 
    stateText.append("text") 
      .attr("class", "text-definition-2")
      .text("") 

    var titleY = (IS_PHONE) ? width*.06 : width*.022;
    function subtitleY() {
      if ((IS_PHONE) && (container_width >= 400)) {
        return width*.1
      }  else if (container_width <400) {
        return width*.15
      } return width*.075
    }

    var subtitleY = subtitleY();

    chartMap.svg.append("text") 
      .attr("class", "text-policy-title")
      .attr("transform", function() { return "translate("+ 0 +", " + titleY + ")"; })
      .text("") 
    chartMap.svg.append("text") 
      .attr("class", "text-policy-subtitle")
      .attr("transform", function() { return "translate("+ 0 +", " + subtitleY + ")"; })
      .text("") 


    $("#dropdown-menu-policy")
      .selectmenu({
         open: function( event, ui ) {
            // d3.select("body").style("height", (d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").node().getBoundingClientRect().height*6) + "px")
            // pymChild.sendHeight();
          },
          close: function(event, ui){
            d3.select("body").style("height", null)
            pymChild.sendHeight();
          },
         change: function(event, d){
            var selectedPolicy = this.value
            changeProperties(selectedPolicy)
          }
      })     
                  
      .selectmenu( "menuWidget" )
      .addClass( "ui-menu-icons customicons" );

  var changeProperties = function(selectedPolicy) {
 
    var addLegend = function() {
          var legendColor = d3.scaleOrdinal()
            .range([ "#d2d2d2", "#fdbf11", "#1696d2"]);
          var legendColor2 = d3.scaleOrdinal()
            .range([ "#d2d2d2", "#1696d2", "#ffffff"]);

       //   var legendText = ["None of highest-immigrant counties had the policy", "Some of highest-immigrant counties had the policy", "All of highest immigrant counties had the policy"]
      //THESE VARIABLES POSITION THE ENTIRE LEGEND:
          var legendX = (IS_PHONE) ? width*.027 : width*.035
          var legendY = (IS_PHONE) ? width*.83 : width*.56
      //THESE VARIABLES POSITION EACH ROW: 
       //  var legendXEach = (IS_PHONE) ? 0 : ((width*.2*i) - width*.085)
          function legendYEach() {
            if (container_width < 400) { console.log('1')
              return width*.11
            } return width*.06 
           // return d3.select('.legend-text-0').node().getBoundingClientRect().height
           }
          var legendYEach = legendYEach();
          
          d3.select(".legendG").remove()

          var legend = chartMap.svg.append('g')
            .attr("width", width*.2)
            .attr("height", width*.2)
            .attr("transform", function(d) { return "translate("+ legendX+ "," + legendY + ")"; })
            .attr("class", "legendG")
            .selectAll("g")
            .data(legendColor.range())
            .enter()
            .append("g")
            .attr("transform", function(d,i) {
              return "translate(0,"+ legendYEach*i + ")"; 
            })
            .attr("class", function(d, i) {
              return "legend-row legend" + i 
            })

            var legendTextX = (IS_PHONE) ? width*.01 : width*.035
            var legendTextY = (IS_PHONE) ? width*.017 : width*.015
            
            for (i=0; i<=2; i++) {
              d3.select(".legend" + i).append("text")
                //.data(legendText)
                .data(descriptions.filter(function(d) { 
                  return selectedPolicy == d.policy_short
                }))
                .attr("x", legendTextX)
                .attr("y", legendTextY)
                .attr("class", function(d) { 
                  return "legend-text legend-text-" + i
                })
                .text(function(d) { 
                  return d["legend" + i]             
                })
                .call(wrapText, wrapWidthLegend)
                // .attr("transform", function(d,i) {
                //   return "translate(0,"+ 300*i + ")"; 
                // })

          // d3.select(".legend-text-" + i)
          //   .attr("transform", function(d,i) {console.log(d3.select('.legend' + previousRow).node().getBoundingClientRect().height * (i));  return "translate(0," + (d3.select('.legend-text-' + previousRow).node().getBoundingClientRect().height * (i) ) + ")"; })

            }

          var row1 = d3.select('.legend0').node().getBoundingClientRect().height
          var row2 = d3.select('.legend1').node().getBoundingClientRect().height
          var row3 = d3.select('.legend2').node().getBoundingClientRect().height

          d3.select(".legend1")
            .attr("transform", function(d,i) {   return "translate(0," + (d3.select('.legend0').node().getBoundingClientRect().height + 10 ) + ")"; })
          d3.select(".legend2")
            .attr("transform", function(d,i) {   return "translate(0," + (d3.select('.legend0').node().getBoundingClientRect().height + d3.select('.legend1').node().getBoundingClientRect().height + 20 ) + ")"; })

          function legendColorScheme() {
            if (d3.select(".legend2").text() !== "") { 
              return legendColor
            }              
             return legendColor2
          }
          var legendColorScheme = legendColorScheme();

          function rectY() {
            if (container_width < 400) {
              return -width*.014
            } return 0
          }

          var rectY = rectY();
          

          d3.selectAll(".legend-row")
            .append("rect")
            .attr("width", width*.02 + "px")
            .attr("height", width*.02 + "px")
            .style("fill", legendColorScheme)
            .attr("transform", function(d) { 
              return "translate("+ (width*-.026)+","+ rectY* i+ ")"; 
            })
            .attr("class", "legend-rect")
        


    }


    addLegend();
          chartMap.map
            .style("fill", function(d) { console.log(d.properties[selectedPolicy + "_" + slideYear()])
                return color(d["properties"][selectedPolicy + "_" + slideYear()]);
            })
            .classed("no_data", function(d) { 
              if ((d["properties"][selectedPolicy + "_" + "16"] == null) && slideYear() == '16') {
                return true
              }
              return false
            })
          d3.select(".text-body-description")
            .data(descriptions.filter(function(d) {
              return selectedPolicy == d.policy_short
            }))
            .text(function(d) {
              if (chartMap.map.classed("no_data") && slideYear() == '16') {
                return "No policy information available for 2016."
              } 
              return d.description 
            })
            .call(wrapText, wrapWidth)
          
          var descriptionHeight = d3.select('.text-body-description').node().getBoundingClientRect().height + 20


          d3.select(".text-definition-1")
            .data(descriptions.filter(function(d) {
              return selectedPolicy == d.policy_short
            }))
            .text(function(d) {
              if (chartMap.map.classed("no_data") && slideYear() == '16') {
                return ""
              }
              return d.definition1
            })
            .call(wrapText, wrapWidth)
            .attr("transform", function() { return "translate("+ textStart+", " + ((textDescriptionHeader*1.25) + descriptionHeight + 20) + ")"; })

          var definition1Height = d3.select('.text-definition-1').node().getBoundingClientRect().height

          d3.select(".text-definition-2")
            .data(descriptions.filter(function(d) {
              return selectedPolicy == d.policy_short
            }))
            .text(function(d) {
              if (chartMap.map.classed("no_data") && slideYear() == '16') {
                return ""
              } 
              return d.definition2
            })
            .call(wrapText, wrapWidth)
            .attr("transform", function() { return "translate("+ textStart+", " + ((textDescriptionHeader*1.25) + definition1Height + descriptionHeight + 30) + ")"; })

          d3.select(".text-policy-title")
            .data(descriptions.filter(function(d) {
              return selectedPolicy == d.policy_short
            }))
            .text(function(d) {
              return d.policy_long
            })
            .call(wrapText, wrapWidthTitle)
          // d3.select(".text-policy-subtitle")
          //   .data(descriptions.filter(function(d) {
          //     return selectedPolicy == d.policy_short
          //   }))
            // .text(function(d) {
            //   return d.policy_anti
            // })


  }
   
/*SLIDER- thanks to https://bl.ocks.org/mbostock/6452972 */
    var sliderWidth = (container_width < 400) ? width*.71 : width*.85
    var x = d3.scaleLinear()
        .domain([2000, 2016])
        .range([0, sliderWidth])
        .clamp(true)
     //   .snap(true);
    
    $("#slider-div").empty()
    var sliderX =  (container_width < 400) ? width*.17 : width* .12
    var sliderSvg = d3.select("#slider-div")
      .append("svg")
      .attr("width", width)
      .attr("height", height*.18);
    var slider = sliderSvg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + sliderX + "," + width*.06 + ")");

    var sliderPath = slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() {
              d3.select(".button")
                .classed("pause", false)
                .classed("play", true)
              slider.interrupt();
            })
            .on("start drag", function() { 
              year(x.invert(d3.event.x)); 
            }));
    
    var tickText = ["'00", "'02", "'04", "'06", "'08", "'10", "'12", "'14", "'16"] 
    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(8))
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) {
          if (IS_PHONE) {
            return "'" + d.toString().split('20')[1]
          }   return d; 
        });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);


    function getYear(){
      var cx = parseFloat(d3.select(".handle").attr("cx"))
      return x.invert(cx)
    }
    var slideAll = function(delay, duration, startYear) {
      var i = d3.interpolate(startYear, 2016);
      duration = duration * (2016-startYear)/(2016-2000)
      slider.transition()
        .ease(d3.easeLinear)
        .delay(delay)
        .duration(duration)
        .tween("year", function() {
          return function(t) { 
            var totalLength = sliderPath.node().getTotalLength();
            year(i(t))
            var point = sliderPath.node().getPointAtLength(totalLength*t)
            if (i(t) == "2016") {
              d3.select(".button")
                .classed("pause", false)
                .classed("play", true)
            } 
          }

        })


    }
    slideAll(0, 0, 2000);

    d3.select(".button")
      .on("click", function() {      
            if (d3.select(".button").classed("play") == true) {
                d3.select(this)
                  .classed("pause", true)
                  .classed("play", false)
               var startYear = (getYear() == 2016) ? 2000 : getYear()
               slideAll(0, 10000, startYear)
            } else {
              d3.select(".slider").transition()
              d3.select(this)
                .classed("pause", false)
                .classed("play", true)
            }
      })



    d3.selectAll(".category_button")
      .on("mouseover", function() {
        d3.select(this)
          .classed("hover", true)
      })
      .on("mouseout", function() {
        d3.select(this)
          .classed("hover", false)
      })
      .on("click", function() {
        d3.selectAll(".category_button.active").classed("active",false)
        d3.select(this).classed("active", true)
        var selectedCategory = d3.select(".category_button.active").node().id
        var dropdown = d3.select("#dropdown-menu-policy")
            dropdown.selectAll("option").remove()
            dropdown.selectAll("option")
                .data(descriptions.filter(function(d) {
                  return d.category == selectedCategory
              }))
              .enter()
              .append("option")
              .attr("value", function(d){ return d.policy_short;})
              .text(function(d){return d.policy_long;})
      $("#dropdown-menu-policy").selectmenu( "refresh" );
      var policyMenu = document.getElementById("dropdown-menu-policy");
      var selectedPolicy = policyMenu[policyMenu.selectedIndex].value 
      changeProperties(selectedPolicy);
      })
    function year(selectedYear) {
      handle.attr("cx", x(Math.round(selectedYear)));
      var policyMenu = document.getElementById("dropdown-menu-policy");
      var selectedPolicy = policyMenu[policyMenu.selectedIndex].value
      stateText.select(".text-body-year")
        .text("20" + slideYear())
      changeProperties(selectedPolicy)
   
    }

  


    var slideYear = function() {
      var xHandle = (handle.attr("cx")/(sliderWidth))*16 + 2000
      var xHandleRounded = Math.round(xHandle)
      var xHandleYear = xHandleRounded.toString().split('20')[1]
      return xHandleYear
    }



  }


}

 var pymChild = new pym.Child({ renderCallback: drawGridMap, polling: 500 });


