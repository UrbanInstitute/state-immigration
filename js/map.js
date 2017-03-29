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
 var wrapWidth2 = width*.1;


  /*DATA SOURCES*/

  // d3.json("data/state_squares.geojson", function(error1, jsonResults) {
  //     d3.csv("data/integration.csv", function(error2, csvResults) { 
  //       csvResults.forEach(function(csvState){
  //         var state = csvState.abbr
  //         jsonState = jsonResults.features.filter(function(d){
  //           return d.properties.abbr == state
  //         })
  //         for (i=0; i<=16; i++){
  //           if(typeof(jsonState[0]) != "undefined"){
              
  //           jsonState[0].properties["tuition_" + i] = csvState["tuition_" + i];
  //           jsonState[0].properties["financial_" + i] = csvState["financial_" + i];
  //           jsonState[0].properties["driver_" + i] = csvState["driver_" + i];
  //           jsonState[0].properties["ban_" + i] = csvState["ban_" + i];
  //           jsonState[0].properties["english_" + i] = csvState["english_" + i];

  //           }

  //         }
  //       })

  //       choropleth = new Choropleth(jsonResults);

  //   });

  // });
d3.csv("data/policy_year_description.csv", function(error1, csv_data_1){
  d3.csv("data/policy_values_only.csv", function(error1, csv_data_2){

          var policy_year_data = d3.nest()
                .key(function(d) { return d.category; })
                .key(function(d) { return d.policy_short; })
                .key(function(d) { return d.policy_year; })

                .entries(csv_data_1);

                console.log(policy_year_data)
   
          // var policy_value_data = d3.nest()
          //       .key(function(d, i) { 
          //         for (i=0; i<=16; i++){

          //         return d.category;
          //         } 
          //       })
          //       .key(function(d) { return d.policy_short; })
          //       .entries(csv_data_1);       


  })
})

  function Choropleth(states) {

   $map.empty();


  // var showStats = function(selectedState) {
  //   console.log(selectedState)
  //        var stateName = d3.select("." + selectedState).datum().properties.name
  //        var stateSpending = d3.select("." + selectedState).datum().properties.spending
  //        var stateChildGrowth = d3.select("." + selectedState).datum().properties.growth_child_pop
  //        var stateTotal = d3.select("." + selectedState).datum().properties.spending_total_same
  //        var stateBudget= d3.select("." + selectedState).datum().properties.state_budget_millions
  //        var stateBudgetEnding = function() {
  //         if (stateBudget > 999 || stateBudget < -999) {
  //           return  " billion"
  //           } return " million"
  //         }
  //         stateBudgetEnding = stateBudgetEnding();
  //        var divide = (stateBudget >999 || stateBudget < -999) ? 1000: 1

  //        var dollarFormatter = d3.format("$,")
  //         d3.select("." + selectedState)
  //           .style("fill", "#fdbf11")
  //         d3.select(".text0")
  //            .html(stateName)
  //         d3.select(".text1")
  //            .html(dollarFormatter(stateSpending))
  //         d3.select(".text2")
  //            .html(stateChildGrowth)
  //         d3.select(".text3")
  //            .html(dollarFormatter(stateBudget/divide) + stateBudgetEnding)
  //         d3.select(".text4")
  //            .html(dollarFormatter(stateTotal))
  //         d3.selectAll("text.text-body-deselected")
  //           .call(wrapText, wrapWidth)
  //         d3.selectAll("text.text-body-selected")
  //           .call(wrapText, wrapWidth)
  // }

 //    chartMap.svg = d3.select("#map")
 //      .append("svg")
 //      .attr("width", width*.65)
 //      .attr("height", height*.8);

 //    chartMap.map = chartMap.svg.append('g')
 //      .selectAll('path')
 //      .data(states.features)
 //      .enter().append('path')
 //      .attr('d', path)
 //      .attr("id", function(d){return "square-" + d.properties.abbr})
 //      .attr('class', function(d) {
 //        return 'state ' + d.properties.abbr + ' dehovered '
 //      })

 //    chartMap.svg
 //      .selectAll(".place-label")
 //      .data(states.features)
 //      .enter().append("text")
 //      .attr("class", "place-label")
 //      .attr("id", function(d){ return "label-" + d.properties.abbr})
 //      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
 //      .attr("dy", ".5em")
 //      .attr("dx", "-.7em")
 //      .text(function(d) { 
 //        return d.properties.abbr;
 //      });
        
 // //  chartMap.states = states;


 //    chartMap.map
 //      .style("fill", function(d) {
 //          return color(d.properties.tuition_16);
 //      })


 //    //STATE TEXT INFO
 //    var stateTextX = (IS_PHONE) ? width*.09 : width*.26
 //    chartMap.svg2 = d3.select("#map")
 //          .append("svg")
 //          .attr("width", width*.3)
 //          .attr("height", height*.8)
 //    var stateText = chartMap.svg2.append("g")

 //    stateText.append("text")
 //      .attr("class", "header")
 //      .attr("transform", function() { return "translate("+ width*.26+", " + width*.1 + ")"; })
 //      .html("Year")
 //    stateText.append("text")
 //      .attr("class", "header")
 //      .attr("transform", function() { return "translate("+ width*.13+", " + width*.2 + ")"; })
 //      .html("Policy Description")
  
 //    stateText.append("text")
 //      .attr("class", "text-body")
 //      .attr("transform", function() { return "translate("+ width*.26+", " + width*.15 + ")"; })
 //      .html("")  




 //    $("#dropdown-menu-category")
 //      .selectmenu({
 //         open: function( event, ui ) {
 //            // d3.select("body").style("height", (d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").node().getBoundingClientRect().height*1.3) + "px")
 //            // pymChild.sendHeight();
 //          },
 //          close: function(event, ui){
 //            // d3.select("body").style("height", null)
 //            // pymChild.sendHeight();
 //          },
 //         change: function(event, d){
 //              // var value = this.value
 //              // var selectedIndex = this.selectedIndex
 //              // var selectedData = (data[selectedIndex])
 //              // var name = (data[selectedIndex]["CZ"])
 //              // var idClass = "id_" + value
         
 //          }
 //      })     
                  
 //      .selectmenu( "menuWidget" )
 //      .addClass( "ui-menu-icons customicons" );


 //    $("#dropdown-menu-policy")
 //      .selectmenu({
 //         open: function( event, ui ) {
 //            // d3.select("body").style("height", (d3.select(".ui-selectmenu-menu.ui-front.ui-selectmenu-open").node().getBoundingClientRect().height*1.3) + "px")
 //            // pymChild.sendHeight();
 //          },
 //          close: function(event, ui){
 //            // d3.select("body").style("height", null)
 //            // pymChild.sendHeight();
 //          },
 //         change: function(event, d){
 //              // var value = this.value
 //              // var selectedIndex = this.selectedIndex
 //              // var selectedData = (data[selectedIndex])
 //              // var name = (data[selectedIndex]["CZ"])
 //              // var idClass = "id_" + value
         
 //          }
 //      })     
                  
 //      .selectmenu( "menuWidget" )
 //      .addClass( "ui-menu-icons customicons" );
    // d3.select(".text-header.header0").call(wrapText,wrapWidth)
    // d3.select(".text-header.header1").call(wrapText,wrapWidth2)
    // d3.select(".text-header.header2").call(wrapText,wrapWidth)
    // d3.select(".text-header.header4").call(wrapText,wrapWidth2)
    // d3.select(".text-header.header3").call(wrapText,wrapWidth)
    // d3.selectAll(".text-subheader").call(wrapText,wrapWidth)

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

   




    // dispatch.on("clickState", function (selectedState) {
    //       var mobileClass = (IS_PHONE) ? "-mobile" : ""
    //       var dollarFormatter = d3.format("$,")
    //       if (d3.select(this).classed("selected")) {
    //       d3.select(this)
    //           .classed("selected", false)
    //           .classed("dehovered", true)
    //           .style("fill", function(d) {
    //             return color(d.properties.spending);
    //           })
          
    //       d3.selectAll("text.text-body-selected" + mobileClass)
    //         .html("")
    //       d3.selectAll(".text-body-selected" + mobileClass)
    //         .classed("text-body-selected" + mobileClass, false)
    //         .classed("text-body-deselected" + mobileClass, true)
    //        //     .call(wrapText,wrapWidth)
    //     } else {
    //         selectState(selectedState)
    //         d3.selectAll(".state.dehovered")
    //           .style("fill", function(d) {
    //             return color(d.properties.spending);
    //           });
    //           showStats(selectedState);
    //             d3.selectAll(".text-body-deselected" + mobileClass)
    //               .classed("text-body-deselected" + mobileClass, false)
    //               .classed("text-body-selected" + mobileClass, true)
    //          //     .call(wrapText,wrapWidth)
    //         // d3.select(this)
    //         //   .style("fill", "#fdbf11")
    //         //   .classed("selected", true)

    //       }

    //   });

    // dispatch.on("dehoverState", function() {
    //   if (d3.selectAll(".state.selected").size() == 1) {
    //     var state = d3.select(".state.selected").attr('class').split(" ")[1]
    //     console.log(state)
    //     showStats(state)
    //      d3.selectAll(".state.hover")
    //       .classed("hover", false)
    //       .style("fill", function(d) {
    //       return color(d.properties.spending);
    //       })
    //   } else {
    //     d3.selectAll(".state.hover")
    //       .classed("hover", false)
    //       .style("fill", function(d) {
    //       return color(d.properties.spending);
    //       })
    //     d3.selectAll(".text-body-deselected")
    //       .html("")
    //   }
    // })
     


  }


}

 var pymChild = new pym.Child({ renderCallback: drawGridMap, polling: 500 });


