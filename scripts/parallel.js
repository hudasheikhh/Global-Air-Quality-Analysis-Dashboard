function drawParallel(data, selectedCountry, selectedYear) {

  d3.select("#parallel").selectAll("*").remove();

  let filtered = data.filter(d =>
    (selectedCountry === "Global" || d.country === selectedCountry) &&
    (selectedYear === "All" || d.year === selectedYear)
  );

  const dimensions = ["pm25", "temperature_celsius", "air_quality_index", "gdp_per_capita_usd"];

  const labels = {
    pm25: "PM2.5 (µg/m³)",
    temperature_celsius: "Temperature (°C)",
    air_quality_index: "AQI",
    gdp_per_capita_usd: "GDP per Capita ($)"
  };

  const margin = { top: 60, right: 40, bottom: 20, left: 40 },
        width = 900 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#parallel")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const y = {};
  for (let dim of dimensions) {
    y[dim] = d3.scaleLinear()
      .domain(d3.extent(filtered, d => +d[dim]))
      .range([height, 0]);
  }

  const x = d3.scalePoint()
    .domain(dimensions)
    .range([0, width])
    .padding(0.5); // spacing fix

  const color = d3.scaleSequential(d3.interpolatePlasma)
    .domain(d3.extent(filtered, d => d.pm25));

  function path(d) {
    return d3.line()(dimensions.map(p => [x(p), y[p](d[p])]));
  }

  // =========================
  // DRAW LINES
  // =========================
  svg.selectAll("path")
    .data(filtered)
    .join("path")
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", d => color(d.pm25))
    .attr("stroke-width", 1)
    .attr("opacity", 0)
    .transition()
    .duration(600)
    .attr("opacity", 0.5);

svg.selectAll("path")
  .on("mouseover", function(event, d) {

    // Fade ALL lines (soft focus instead of hiding)
    svg.selectAll("path")
      .transition()
      .duration(200)
      .attr("opacity", 0.1);

    // Highlight hovered line
    d3.select(this)
      .transition()
      .duration(200)
      .attr("opacity", 1)
      .attr("stroke-width", 2.5);
  })
  .on("mouseout", function() {

    // Restore all lines
    svg.selectAll("path")
      .transition()
      .duration(200)
      .attr("opacity", 0.5)
      .attr("stroke-width", 1);
  });
  
  // =========================
  // AXES
  // =========================
  const axis = svg.selectAll(".axis")
    .data(dimensions)
    .join("g")
    .attr("class", "axis")
    .attr("transform", d => `translate(${x(d)})`)
    .each(function(d) {
      d3.select(this)
        .call(d3.axisLeft(y[d]).ticks(5))
        .selectAll("text")
        .style("fill", "#ccc")
        .style("font-size", "11px");
    });

  // =========================
  // CLEAN LABELS (FIXED)
  // =========================
  svg.selectAll(".axis-label")
    .data(dimensions)
    .join("text")
    .attr("class", "axis-label")
    .attr("x", d => x(d))
    .attr("y", -25)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "13px")
    .style("font-weight", "600")
    .text(d => labels[d]);

  // =========================
  // BRUSHING (UNCHANGED)
  // =========================
  svg.selectAll(".axis")
    .append("g")
    .attr("class", "brush")
    .each(function(dim) {
      d3.select(this).call(
        d3.brushY()
          .extent([[-10, 0], [10, height]])
          .on("brush end", brushed)
      );
    });

  function brushed() {
    let actives = [];

    svg.selectAll(".brush")
      .filter(function(d) {
        return d3.brushSelection(this);
      })
      .each(function(d) {
        actives.push({
          dimension: d,
          extent: d3.brushSelection(this).map(y[d].invert)
        });
      });

    svg.selectAll("path")
      .attr("display", function(d) {
        return actives.every(active => {
          return d[active.dimension] <= active.extent[0] &&
                 d[active.dimension] >= active.extent[1];
        }) ? null : "none";
      });
  }

  // =========================
  // TITLE (NO OVERLAP NOW)
  // =========================
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "14px")
}