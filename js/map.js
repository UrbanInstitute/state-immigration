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
  var aspect_height = (IS_PHONE) ? 25 : 18;
  var margin = { top: 10, right: 5, bottom: 10, left: 5 };
  var width= container_width - margin.left - margin.right; 
  var height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom; 

  var projection = d3.geoEquirectangular()
    .scale((IS_PHONE) ? width*4 : width*2.7)
    .center([-96.03542,41.69553])
    .translate(IS_PHONE ? [width /2.3, height /2.1] : [width /3.3, height /2.4]);

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
            lineHeight = 1.5, // ems
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

    // var wrapWidth = (IS_MOBILE && !IS_PHONE) ? 220 : 100;
    var wrapWidth = (IS_PHONE) ? width*.78 : width*.31;
    var mapWidth = (IS_PHONE) ? width*.9 : width*.65

    chartMap.svg = d3.select("#map")
      .append("svg")
      .attr("width", mapWidth)
      .attr("height", height*1.1);

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

    var addLegend = function() {
      var legendColor = d3.scaleOrdinal()
        .range([ "#d2d2d2", "#1696d2", "#fdbf11"]);
      var legendText = ["None of highest-immigrant counties had the policy", "Some of highest-immigrant counties had the policy", "All of highest immigrant counties had the policy"]

      var legendY = (IS_PHONE) ? width*.85 : width*.56
      var legend = chartMap.svg.append('g')
          .attr("width", width*.2)
          .attr("height", width*.2)
          .attr("transform", function(d) { return "translate("+ width*.12+ "," + legendY + ")"; })
          .selectAll("g")
          .data(legendColor.range())
          .enter()
          .append("g")
          .attr("transform", function(d,i) {
            return "translate(0,"+ (width*.03*i) + ")"; 
          })
          .attr("class", "legend")

        legend.append("rect")
          .attr("width", 8 + "px")
          .attr("height", 8 + "px")
          .style("fill", legendColor);

      var legendTextY = (IS_PHONE) ? width*.017 : width*.012
      legend.append("text")
          .data(legendText)
          .attr("x", width*.025)
          .attr("y", legendTextY)
          .text(function(d) { 
            return d
          });
    }

    addLegend();


 //    //STATE TEXT INFO
    var stateTextX = (IS_PHONE) ? width*.09 : width*.26
    var svg2Width = (IS_PHONE) ? width*.9 : width*.33;
    var definition1_Y = (IS_PHONE) ? width*.38 : width*.505
    var definition2_Y = (IS_PHONE) ? width*.43 : width*.565

    chartMap.svg2 = d3.select("#map")
          .append("svg")
          .attr("width", svg2Width)
          .attr("height", height)
      //    .attr("transform", function() {return "translate("+ 0 +", " + -width*.1 + ")"; })  

    var stateText = chartMap.svg2.append("g")

    var textStart = width*.015
    stateText.append("text")
      .attr("class", "header")
      .attr("transform", function() { return "translate("+ textStart+", " + width*.03 + ")"; })
      .text("YEAR")
    stateText.append("text")
      .attr("class", "header")
      .attr("transform", function() { return "translate("+ textStart+", " + width*.12 + ")"; })
      .text("POLICY DESCRIPTION")
  
    stateText.append("text")
      .attr("class", "text-body-year")
      .attr("transform", function() { return "translate("+ textStart+", " + width*.06 + ")"; })
      .text("")  
  
    stateText.append("text")
      .attr("class", "text-body-description")
      .attr("transform", function() { return "translate("+ textStart+", " + width*.15 + ")"; })
      .text("") 

    stateText.append("text") 
      .attr("class", "text-definition-1")
      .attr("transform", function() { return "translate("+ textStart+", " + definition1_Y + ")"; })
      .text("") 
    stateText.append("text") 
      .attr("class", "text-definition-2")
      .attr("transform", function() { return "translate("+ textStart+", " + definition2_Y + ")"; })
      .text("") 
    chartMap.svg.append("text") 
      .attr("class", "text-policy-title")
      .attr("transform", function() { return "translate("+ width*.01+", " + width*.03 + ")"; })
      .text("") 



    $("#dropdown-menu-policy")
      .selectmenu({
         open: function( event, ui ) {
            d3.select("body").style("height", (d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").node().getBoundingClientRect().height*12) + "px")
            pymChild.sendHeight();
          },
          close: function(event, ui){
            d3.select("body").style("height", null)
            pymChild.sendHeight();
          },
         change: function(event, d){
            var selectedPolicy = this.value
            changeProperties(selectedPolicy)
             //  var str = "tuition_00"
             // console.log(str.substring(0, str.lastIndexOf("_") + 1))
              // var selectedIndex = this.selectedIndex
              // var selectedData = (data[selectedIndex])
              // var name = (data[selectedIndex]["CZ"])
              // var idClass = "id_" + value
         
          }
      })     
                  
      .selectmenu( "menuWidget" )
      .addClass( "ui-menu-icons customicons" );

  var changeProperties = function(selectedPolicy) {
          chartMap.map
            .style("fill", function(d) {
                return color(d["properties"][selectedPolicy + "_" + slideYear()]);
            })
            .classed("no_data", function(d) {
              if ((d["properties"][selectedPolicy + "_" + "16"] == null) && slideYear() == '16') {
                console.log(selectedPolicy);return true
              } console.log('false'); return false
            })
          d3.select(".text-body-description")
            .data(descriptions.filter(function(d) {
              return selectedPolicy == d.policy_short
            }))
            .text(function(d) {
              if (chartMap.map.classed("no_data") && slideYear() == '16') {
                console.log(d.definition1);
                return "No data"
              } console.log(d.definition1);
              return d.description
            })
            .call(wrapText, wrapWidth)
          d3.select(".text-definition-1")
            .data(descriptions.filter(function(d) {
              return selectedPolicy == d.policy_short
            }))
            .text(function(d) {
              if (chartMap.map.classed("no_data") && slideYear() == '16') {
                console.log(d.definition1);
                return ""
              } console.log(d.definition1);
              return d.definition1
            })
            .call(wrapText, wrapWidth)
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

          d3.select(".text-policy-title")
            .data(descriptions.filter(function(d) {
              return selectedPolicy == d.policy_short
            }))
            .text(function(d) {
              return d.policy_long
            })

  }
   
/*SLIDER- thanks to https://bl.ocks.org/mbostock/6452972 */
    var sliderWidth = width*.85
    var x = d3.scaleLinear()
        .domain([2000, 2016])
        .range([0, sliderWidth])
        .clamp(true);
    
    $("#slider-div").empty()

    var sliderSvg = d3.select("#slider-div")
      .append("svg")
      .attr("width", width)
      .attr("height", height*.18);
    var slider = sliderSvg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + width*.12 + "," + width*.06 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { 
              year(x.invert(d3.event.x)); 
            }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(8))
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) { return d; });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    var pauseValues = {
      lastT: 0,
      currentT: 0
    };
    var slideAll = function(delay, duration) {
      var i = d3.interpolate(2000, 2016);
      slider.transition()
        .ease(d3.easeLinear)
        .delay(delay)
        .duration(duration - (duration * pauseValues.lastT))
        .tween("year", function() {
          return function(t) { 
            year(i(t))
            if (i(t) == "2016") {
              d3.select(".pause").attr("class", "button play")
            } 
            // else if (d3.select(".pause_button").classed("pause")) { 
            //   console.log('pause')
            // }
          }

        })
        .on("end", function(){
          pauseValues = {
            lastT: 0,
            currentT: 0
          };
         // transition()
        });

    }
    slideAll(0, 0);

    d3.select(".button")
      .on("click", function() {      
            if (d3.select(".button").attr("class") == "button play") {
             d3.select(".play").attr("class","button pause")
               slideAll(0, 10000)
            } else {console.log('pause')
              d3.select(".pause").attr("class", "button play")
            handle.transition().duration(0)
              setTimeout(function(){
                pauseValues.lastT = pauseValues.currentT;
              }, 100);
            }

     
        console.log((handle.attr("cx")/(sliderWidth))*16 + 2000)    
      })

    // d3.select(".pause")
    //   .on("click", function() {
    //     console.log('hi')
    //     d3.select(".pause")
    //     //  .attr("class", "play_button")
    //        .classed("play", true)
    //        .classed("pause", false)
    //  //   slideAll(0, 10000)
    //   })



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
                  console.log(d.category == selectedCategory)
                  return d.category == selectedCategory
            //       if (a.CZ.toLowerCase() < b.CZ.toLowerCase()) return -1;
            // if (a.CZ.toLowerCase() > b.CZ.toLowerCase()) return 1;
            // return 0;
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
     
      handle.attr("cx", x(selectedYear));
      var policyMenu = document.getElementById("dropdown-menu-policy");
      var selectedPolicy = policyMenu[policyMenu.selectedIndex].value
      // var slideYearRounded = Math.round(selectedYear)
      // selectedyear()
      // var slideYear = slideYearRounded.toString().split('20')[1]
      stateText.select(".text-body-year")
        .text("20" + slideYear())
      changeProperties(selectedPolicy)
      // chartMap.map
      //   .style("fill", function(d) {

      //       return color(d["properties"][selectedPolicy + "_" + slideYear()]);
      //   })
      //   .classed("no_data", function(d) {
      //     if ((d["properties"][selectedPolicy + "_" + slideYear()] == null) && slideYear() == '16') {
      //       return true
      //     } return false
      //   })
    
      // d3.select(".text-body-description")
      //   .data(descriptions.filter(function(d) {
      //     return selectedPolicy == d.policy_short
      //   }))
      //   .text(function(d) {
      //     if (chartMap.map.classed("no_data") && slideYear() == '16') {
      //       return "No data"
      //     }
      //     return d.description
      //   })
      //   .call(wrapText, wrapWidth)
      // d3.select(".text-policy-title")
      //   .data(descriptions.filter(function(d) {
      //     return selectedPolicy == d.policy_short
      //   }))
      //   .text(function(d) {
      //     return d.policy_long
      //   })
      // d3.select(".text-definition-1")
      //   .data(descriptions.filter(function(d) {
      //     return selectedPolicy == d.policy_short
      //   }))
      //   .text(function(d) {
      //     if (chartMap.map.classed("no_data") && slideYear() == '16') {
      //       console.log(d.definition1);
      //       return ""
      //     } console.log(d.definition1);
      //     return d.definition1
      //   })
      //   .call(wrapText, wrapWidth)
      // d3.select(".text-definition-2")
      //   .data(descriptions.filter(function(d) {
      //     return selectedPolicy == d.policy_short
      //   }))
      //   .text(function(d) {
      //     if (chartMap.map.classed("no_data") && slideYear() == '16') {
      //       console.log(d.definition2);
      //       return ""
      //     } console.log(d.definition2);
      //     return d.definition2
      //   })
      //   .call(wrapText, wrapWidth)
    }

  


    var slideYear = function(selected) {
      var xHandle = (handle.attr("cx")/(sliderWidth))*16 + 2000
      var xHandleRounded = Math.round(xHandle)
      var xHandleYear = xHandleRounded.toString().split('20')[1]
      return xHandleYear
    }



  }


}

 var pymChild = new pym.Child({ renderCallback: drawGridMap, polling: 500 });


