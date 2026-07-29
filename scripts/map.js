function drawMap(data, selectedCountry, selectedYear) {

  const width = 900;
  const height = 450;

  const svg = d3.select("#map")
    .html("")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const projection = d3.geoNaturalEarth1()
    .scale(160)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  //  AGGREGATE DATA
  let filtered = data;

  if (selectedYear) {
    filtered = filtered.filter(d => d.year === selectedYear);
  }

  const countryData = d3.rollup(
    filtered,
    v => d3.mean(v, d => d.pm25),
    d => d.country
  );

  // COLOR SCALE
  const color = d3.scaleSequential()
    .domain([0, d3.max(Array.from(countryData.values()))])
    .interpolator(d3.interpolateReds);

  const tooltip = d3.select("#tooltip");

  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .then(geo => {

      svg.selectAll("path")
        .data(geo.features)
        .enter()
        .append("path")
        .attr("d", path)

        .attr("fill", d => {
          const val = countryData.get(d.properties.name);
          return val ? color(val) : "#444";
        })

        .attr("stroke", "#999")

        // 🔥 MOUSE OVER
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("stroke", "white")
            .attr("stroke-width", 2);

          const val = countryData.get(d.properties.name);

          tooltip
            .style("opacity", 1)
            .html(`
              <strong>${d.properties.name}</strong><br>
              PM2.5: ${val ? val.toFixed(2) : "No data"}
            `);
        })

        // 🔥 MOVE TOOLTIP
        .on("mousemove", function(event) {
          tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
        })

        // 🔥 MOUSE OUT
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke", "#999")
            .attr("stroke-width", 1);

          tooltip.style("opacity", 0);
        })

        // ✅ CLICK INTERACTION (NOW WORKS)
        .on("click", function(event, d) {
          const clickedCountry = d.properties.name;

          selectedCountry = clickedCountry;

          d3.select("#countryFilter")
            .property("value", clickedCountry);

          updateAll();
        });

  });

// COLOR LEGEND
const legendHeight = 200;
const legendWidth = 12;

const legendScale = d3.scaleLinear()
  .domain(color.domain())
  .range([legendHeight, 0]);

const legend = svg.append("g")
  .attr("transform", `translate(${width - 70}, 50)`);

// GRADIENT
const defs = svg.append("defs");

const gradient = defs.append("linearGradient")
  .attr("id", "map-gradient")
  .attr("x1", "0%")
  .attr("y1", "100%")
  .attr("x2", "0%")
  .attr("y2", "0%");

gradient.selectAll("stop")
  .data(d3.range(0, 1.01, 0.1))
  .enter()
  .append("stop")
  .attr("offset", d => `${d * 100}%`)
  .attr("stop-color", d =>
    color(color.domain()[0] + d * (color.domain()[1] - color.domain()[0]))
  );

// COLOR BAR
legend.append("rect")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .style("fill", "url(#map-gradient)");

// REMOVE 0 FROM TICKS
const ticks = legendScale.ticks(5).filter(d => d !== 0);

legend.append("g")
  .attr("transform", `translate(${legendWidth},0)`)
  .call(d3.axisRight(legendScale).tickValues(ticks))
  .selectAll("text")
  .style("fill", "white");  

// TITLE
legend.append("text")
  .attr("x", -5)
  .attr("y", -15)
  .style("fill", "white")
  .style("font-weight", "bold")
  .text("PM2.5");

// HIGH LABEL
legend.append("text")
  .attr("x", 18)
  .attr("y", 12)
  .style("fill", "white")
  .style("font-size", "11px")
  .text("High");

// LOW LABEL (FIXED POSITION)
legend.append("text")
  .attr("x", 18)
  .attr("y", legendHeight + 12)
  .style("fill", "white")
  .style("font-size", "11px")
  .text("Low");
}
