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
  var aspect_height = (IS_PHONE) ? 30: 18;
  var margin = { top: 10, right: 5, bottom: 10, left: 5 };
  var width= container_width - margin.left - margin.right; 
  var height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom; 

  var projection = d3.geoEquirectangular()
    .scale((IS_PHONE) ? width*3.2 : width*2.7)
    .center([-96.03542,41.69553])
    .translate(IS_PHONE ? [width /2.3, height /2.7] : [width /3.3, height /2.3]);

  var path = d3.geoPath()
    .projection(projection);




  function wrapText(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          x = text.attr("x"),
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
 var wrapWidth = width*.17;


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
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            x = text.attr("x"),
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
    var wrapWidth = width*.5;

    chartMap.svg = d3.select("#map")
      .append("svg")
      .attr("width", width*.65)
      .attr("height", height*.8);

    chartMap.map = chartMap.svg.append('g')
      .selectAll('path')
      .data(states.features)
      .enter().append('path')
      .attr('d', path)
      .attr("id", function(d){return "square-" + d.properties.abbr})
      .attr('class', function(d) {
        return 'state ' + d.properties.abbr + ' dehovered '
      })

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
        
 // //  chartMap.states = states;




 //    //STATE TEXT INFO
    var stateTextX = (IS_PHONE) ? width*.09 : width*.26
    chartMap.svg2 = d3.select("#map")
          .append("svg")
          .attr("width", width*.33)
          .attr("height", height*.8)
    var stateText = chartMap.svg2.append("g")

    stateText.append("text")
      .attr("class", "header")
      .attr("transform", function() { return "translate("+ width*.255+", " + width*.1 + ")"; })
      .html("YEAR")
    stateText.append("text")
      .attr("class", "header")
      .attr("transform", function() { return "translate("+ width*.09+", " + width*.2 + ")"; })
      .html("POLICY DESCRIPTION")
  
    stateText.append("text")
      .attr("class", "text-body-year")
      .attr("transform", function() { return "translate("+ width*.253+", " + width*.13 + ")"; })
      .html("")  
  
    stateText.append("text")
      .attr("class", "text-body-description")
      .attr("transform", function() { return "translate("+ width*.05+", " + width*.23 + ")"; })
      .html("")  



    $("#dropdown-menu-category")
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
            var selectedCategory = this.value;
            console.log(selectedCategory)
            var dropdown = d3.select("#dropdown-menu-policy")
              
          var newOptions = dropdown.selectAll("option").remove()
              .data(descriptions.filter(function(d) {
                console.log(d.category == selectedCategory)
                return d.category == selectedCategory
            //       if (a.CZ.toLowerCase() < b.CZ.toLowerCase()) return -1;
            // if (a.CZ.toLowerCase() > b.CZ.toLowerCase()) return 1;
            // return 0;
              }))
              .enter()
              .append("option")
              .attr("value", function(d){console.log(d.policy_short); return d.policy_short;})
              .text(function(d){console.log(d.policy_long); return d.policy_long;})
         $("#dropdown-menu-policy").selectmenu( "refresh" );
          }
      })     
                  
      .selectmenu( "menuWidget" )
      .addClass( "ui-menu-icons customicons" );


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
         change: function(event, d, selectedYear){
            var policy = this.value
               console.log(policy)
            d3.select(".text-body-description")
              .data(descriptions.filter(function(d) {
                return policy == d.policy_short
              }))
              .text(function(d) {
                console.log(d.description);
                return d.description
              })
              .call(wrapText, wrapWidth)
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


    // showStats("AZ");
    // selectState("AZ")



    // d3.select(".map-container")
    //     .selectAll(".place-label")
    //     .style("fill", function(d) {
    //       if (d.properties.spending > 9000) {
    //         return "#ffffff";
    //       } else {
    //         return "#000000"
    //       }
    //     })
    // function hoverState(selectedState) {
    //   if (d3.select("." + selectedState).classed('selected')) {
    //   } else {
    //     d3.selectAll(".state")
    //       .classed('dehovered', true)
    //       .classed('hover', false)
    //     d3.selectAll("." + selectedState)
    //       .classed('hover', true)
    //       .classed("dehovered", false)
    //   }
    // }
    // function selectState(selectedState) {
    //   d3.selectAll(".state.selected")
    //     .classed('dehovered', true)
    //     .classed('selected', false)
    //   d3.selectAll("." + selectedState)
    //     .classed('selected', true)
    //     .classed("dehovered", false)
    //     .classed('hover', false)
    // }

   
/*SLIDER- thanks to https://bl.ocks.org/mbostock/6452972 */
    var x = d3.scaleLinear()
        .domain([2000, 2016])
        .range([0, width*.55])
        .clamp(true);
    
    var sliderSvg = d3.select("#slider")
      .append("svg")
      .attr("width", width*.65)
      .attr("height", height*.3);
    var slider = sliderSvg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + width*.02 + "," + 10 + ")");

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
            .on("start drag", function() { year(x.invert(d3.event.x)); }));

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

    slider.transition() // Gratuitous intro!
      .duration(1200)
      .tween("year", function() {
        var i = d3.interpolate(2000, 2016);
        return function(t) { year(i(t)); }; 
      });

    function year(selectedYear) {
      handle.attr("cx", x(selectedYear));
      var slideYearRounded = Math.round(selectedYear)
      var slideYear = slideYearRounded.toString().split('20')[1]
      console.log(slideYear)
      chartMap.map
        .style("fill", function(d) {
            return color(d["properties"]["tuition_" + slideYear]);
        })
      stateText.select(".text-body-year")
        .html(slideYearRounded)
    }





  }


}

 var pymChild = new pym.Child({ renderCallback: drawGridMap, polling: 500 });


