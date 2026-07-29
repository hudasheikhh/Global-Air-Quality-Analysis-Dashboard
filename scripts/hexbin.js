function drawHexbin(data, selectedCountry, selectedYear) {

  d3.select("#hexbin").selectAll("*").remove();

  let filtered = data.filter(d =>
    (selectedCountry === "Global" || d.country === selectedCountry) &&
    (selectedYear === "All" || d.year === selectedYear)
  );

  filtered = filtered.filter(d => d.pm25 && d.respiratory_disease_rate);

  if (filtered.length === 0) return;

  const margin = { top: 40, right: 30, bottom: 60, left: 70 },
        width = 800 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

  const svg = d3.select("#hexbin")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const tooltip = d3.select("#tooltip");

  const x = d3.scaleLinear()
    .domain([0, d3.max(filtered, d => d.pm25)])
    .range([0, width]);
  const yExtent = d3.extent(filtered, d => d.respiratory_disease_rate);

  const y = d3.scaleLinear()
    .domain([
     yExtent[0] * 0.9,   // little space at bottom
     yExtent[1] * 1.15   // more space at top
  ])
  .range([height, 0]);

  const hexbin = d3.hexbin()
    .x(d => x(d.pm25))
    .y(d => y(d.respiratory_disease_rate))
    .radius(10)
    .extent([[0, 0], [width, height]]);

  const bins = hexbin(filtered);

  const color = d3.scaleSequential(d3.interpolateInferno)
    .domain([0, d3.max(bins, d => d.length)]);

  // =========================
  // HEXAGONS (ENHANCED)
  // =========================
  svg.append("g")
    .selectAll("path")
    .data(bins)
    .join("path")
    .attr("d", hexbin.hexagon())
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .attr("fill", d => color(d.length))
    .attr("stroke", "#111")
    .attr("stroke-width", 0.4)
    .attr("opacity", 0) // 🔥 animation start
    .style("filter", "brightness(1.3)")
    .transition()
    .duration(600)
    .attr("opacity", 1)
    .selection()
    .on("mousemove", (event, d) => {
      tooltip
        .style("opacity", 1)
        .html(`
          <strong>Density:</strong> ${d.length}<br>
          PM2.5 vs Health Impact
        `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseover", function() {
      d3.select(this)
        .attr("stroke", "white")
        .attr("stroke-width", 2);
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
      d3.select(this)
        .attr("stroke", "#111")
        .attr("stroke-width", 0.4);
    });

  // =========================
  // AXES
  // =========================
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  // =========================
  // COLOR LEGEND
  // =========================
  const legendWidth = 120;
  const legendHeight = 10;

  const legend = svg.append("g")
    .attr("transform", `translate(${width - 150}, -25)`);

  const defs = svg.append("defs");

  const gradient = defs.append("linearGradient")
    .attr("id", "hex-gradient");

  gradient.selectAll("stop")
    .data(d3.range(0, 1.01, 0.1))
    .enter()
    .append("stop")
    .attr("offset", d => `${d * 100}%`)
    .attr("stop-color", d => color(d * color.domain()[1]));

  legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#hex-gradient)");

  legend.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .style("fill", "white")
    .style("font-size", "12px")
    .text("Low");

  legend.append("text")
    .attr("x", legendWidth)
    .attr("y", 25)
    .attr("text-anchor", "end")
    .style("fill", "white")
    .style("font-size", "12px")
    .text("High");

  legend.append("text")
    .attr("x", legendWidth / 2)
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "12px")
    .text("Density");

  // =========================
  // AXIS LABELS
  // =========================
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .text("PM2.5 Concentration");

  svg.append("text")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .text("Respiratory Disease Rate");

  // =========================
  // TITLE INSIDE SVG (NEW)
  // =========================
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "14px")
}