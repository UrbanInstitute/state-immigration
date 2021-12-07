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
      right: 0,
      bottom: 0,
      left: 0
    };
  }
  else if (container_width > 400 && container_width <= 600) {
    IS_PHONE = true
    var margin = {
      top: 10,
      right: 0,
      bottom: 0,
      left: 0
    };
  } else {
    IS_PHONE = false

  }

  var chartMap=this;

  var color = d3.scaleOrdinal()
  .domain([0, 1, 2, null])
  .range(["#d2d2d2", "#1696d2", "#fdbf11", "ffffff"]);

  var $map = $("#map");
  var aspect_width = 20;
  var aspect_height = (IS_PHONE) ? 17 : 9.7;
  var margin = { top: 10, right: 0, bottom: 10, left: 0 };
  var width= container_width - margin.left - margin.right;
  var height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom;

  var projection = d3.geoEquirectangular()
  .scale((IS_PHONE) ? width*4.4 : width*2.8)
  .center([-96.03542,41.69553])
  .translate(IS_PHONE ? [width / 2.05, height /2] : [width /3.29, height / 2.3]);

  var path = d3.geoPath()
  .projection(projection);


  /*DATA SOURCES*/

  d3.json("data/combined-data-test.geojson", function(error1, states) {
    d3.csv("data/policy_descriptions_only.csv", function(error2, descriptions) {

      choropleth = new Choropleth(states, descriptions);

    });

  });

  function Choropleth(states, descriptions) {

    $map.empty();

    var wrapWidth = (IS_PHONE) ? width*.78 : width*.31;
    var wrapWidthTitle = (IS_PHONE) ? width*.78 : width*.65;
    var wrapWidthLegend = (IS_PHONE) ? width*.78 : width*.6;

    var mapWidth = (IS_PHONE) ? width : width*.65

    chartMap.svg = d3.select("#map")
    .append("svg")
    .attr("width", mapWidth)
    .attr("height", (container_width < 400 ? height : height))
    .attr("transform", function(d) { return "translate(0,"+ ((container_width < 400) ? -20 : 0) + ")"; })

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
    .attr("dy", "0.4em")
    .attr("text-anchor", "middle")
    .text(function(d) {
      return d.properties.abbr;
    });


    // STATE TEXT INFO
    var stateTextX = (IS_PHONE) ? width*.09 : width*.26
    var svg2Width = (IS_PHONE) ? width*.9 : width*.33;
    // var definition2_Y = (IS_PHONE) ? width*.45 : width*.565

    divDescription = d3.select("#description-policy")
    .append("div")
    .attr("class", "div-descritions")

    var stateText = divDescription;

    titleChart = d3.select("#policy-text")
    .append("div")
    .attr("class", "text-policy-title")

    $("#dropdown-menu-policy")
    .selectmenu({
      open: function( event, ui ) {
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
        .range(["#d2d2d2", "#fdbf11", "#1696d2", "#ffffff"]);
        var legendColor2 = d3.scaleOrdinal()
        .range(["#d2d2d2", "#1696d2", "#ffffff", "#ffffff"]);

        for(t = 0; t < 4; t++) {
          d3.select(".legend-block" + t)
          .data(descriptions.filter(function(d) {
            return selectedPolicy == d.policy_short
          }))
          .html(function(d) {
            if(t === 3) {
              return "<div class='blockSquare'></div><p>No data</p>"
            } else {
              return "<div class='blockSquare'></div><p>" + d["legend" + t] + "</p>"
            }
          })

          d3.select(".legend-block" + t).select("div")
          .style("background", function(d) {
            if(d.legend2 === "") {
              if(t === 0) {
                return legendColor2(0)
              } else if(t === 1) {
                return legendColor2(1)
              } else if(t === 2) {
                return legendColor2(2)
              } else {
                return legendColor2(3)
              }
            } else {
              if(t === 0) {
                return legendColor(0)
              } else if(t === 1) {
                return legendColor(1)
              } else if(t === 2) {
                return legendColor(2)
              } else {
                return legendColor(3)
              }
            }
          })
          .style("border", function(d) {
            if(d.legend2 === "") {
              if(t === 0) {
                return "1px " + legendColor2(0) + " solid"
              } else if(t === 1) {
                return "1px " + legendColor2(1) + " solid"
              } else if(t === 2) {
                return "1px " + legendColor2(2) + " solid"
              } else {
                return "1px black solid"
              }
            } else {
              if(t === 0) {
                return "1px " + legendColor(0) + " solid"
              } else if(t === 1) {
                return "1px " + legendColor(1) + " solid"
              } else if(t === 2) {
                return "1px " + legendColor(2) + " solid"
              } else {
                return "1px black solid"
              }
            }
          })
        }

        var legend2Text2 = d3.select(".legend-block2").select("p").text();

        if(legend2Text2 === "") {
          document.getElementsByClassName("legend-block2")[0].style.display = "none";
        } else {
          document.getElementsByClassName("legend-block2")[0].style.display = "block";
        }

      } // addLegend ends here

      addLegend();

      chartMap.map
      .style("fill", function(d) {
        if(d["properties"][selectedPolicy + "_" + slideYear()] === null) {
          return "#ffffff";
        } else {
          return color(d["properties"][selectedPolicy + "_" + slideYear()]);
        }
      })
      .style("stroke", function(d) {
        if(d["properties"][selectedPolicy + "_" + slideYear()] === null) {
          return "#d2d2d2";
        } else {

        }
      })

      d3.select(".text-body-description")
      .data(descriptions.filter(function(d) {
        return selectedPolicy == d.policy_short
      }))
      .html(function(d) {
        return d.description
      })

      d3.select(".text-definition-1")
      .data(descriptions.filter(function(d) {
        return selectedPolicy == d.policy_short
      }))
      .html(function(d) {
        return d.definition1
      })

      d3.select(".text-definition-2")
      .data(descriptions.filter(function(d) {
        return selectedPolicy == d.policy_short
      }))
      .html(function(d) {
        return d.definition2
      })

      d3.select(".text-policy-title")
      .data(descriptions.filter(function(d) {
        return selectedPolicy == d.policy_short
      }))
      .html(function(d) {
        return '<p>' + d.policy_long + '</p>'
      })
    }

    /*SLIDER- thanks to https://bl.ocks.org/mbostock/6452972 */
    var sliderWidth = (container_width < 400) ? width*.71 : width*.85
    var x = d3.scaleLinear()
    .domain([2000, 2020])
    .range([0, sliderWidth])
    .clamp(true)
    //   .snap(true);

    $("#slider-div").empty()

    var sliderX =  (container_width < 400) ? width * .17 : width * .09
    var sliderSvg = d3.select("#slider-div")
    .append("svg")
    .attr("width", width)
    .attr("height", height *.38);
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

    slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(function(d) {
      if (IS_PHONE) {
        return x.ticks(5)
      } else {
        return x.ticks(8)
      }
    })
    .enter().append("text")
    .attr("x", x)
    .attr("dy", "0.3em")
    .attr("text-anchor", "middle")
    .text(function(d) {
      if (IS_PHONE) {
        return "'" + d.toString().substring(2,4)
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
      var i = d3.interpolate(startYear, 2020);
      duration = duration * (2020-startYear)/(2020-2000)
      slider.transition()
      .ease(d3.easeLinear)
      .delay(delay)
      .duration(duration)
      .tween("year", function() {
        return function(t) {
          var totalLength = sliderPath.node().getTotalLength();
          year(i(t))
          var point = sliderPath.node().getPointAtLength(totalLength*t)
          if (i(t) == "2020") {
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
        var startYear = (getYear() == 2020) ? 2000 : getYear()
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
      d3.select(".text-body-year")
      .html("20" + slideYear())
      changeProperties(selectedPolicy)

    }

    var slideYear = function() {
      var xHandle = (handle.attr("cx")/(sliderWidth))*20 + 2000
      var xHandleRounded = Math.round(xHandle)
      var xHandleYear = xHandleRounded.toString().substring(2, 4)

      return xHandleYear
    }

  } //choropleth ends here
}

var pymChild = new pym.Child({ renderCallback: drawGridMap, polling: 500 });

var downloadMenu = document.getElementById("secondaryButton"),
linksDownload = downloadMenu.getElementsByTagName("a");

downloadMenu.addEventListener("mouseover", function(e) {
  for(j=0; j < linksDownload.length; j++) {
    linksDownload[j].style.display = "block";
  }

  pymChild.sendHeight();
})

downloadMenu.addEventListener("mouseout", function(e) {
  for(j=0; j < linksDownload.length; j++) {
    linksDownload[j].style.display = "none";
  }

  pymChild.sendHeight();
})
