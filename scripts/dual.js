function drawDual(data, selectedCountry) {

  // =========================
  // 🔥 UPDATE HTML TITLE
  // =========================
  d3.select("#dualTitle")
    .style("opacity", 0)
    .text(
      selectedCountry === "Global"
        ? "Global: Climate(Temperature) vs Pollution(PM2.5)"
        : `${selectedCountry}: Climate(Temperature) vs Pollution(PM2.5)`
    )
    .transition()
    .duration(400)
    .style("opacity", 1);

  // =========================
  // TOOLTIP
  // =========================
  const tooltip = d3.select("#tooltip");

  // =========================
  // FILTER DATA
  // =========================
  let filtered = data;

  if (selectedCountry !== "Global") {
    filtered = filtered.filter(d => d.country === selectedCountry);
  }

  filtered = filtered.filter(d => !isNaN(d.temp_anomaly_celsius));

  // =========================
  // GROUP BY YEAR
  // =========================
  const yearly = d3.rollups(
    filtered,
    v => ({
      pm25: d3.mean(v, d => d.pm25),
      temp: d3.mean(v, d => d.temp_anomaly_celsius)
    }),
    d => d.year
  ).map(d => ({
    year: +d[0],
    pm25: d[1].pm25,
    temp: d[1].temp
  })).sort((a, b) => a.year - b.year);

  // =========================
  // SVG SETUP
  // =========================
  const margin = {top: 50, right: 60, bottom: 60, left: 60};
  const width = 800 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = d3.select("#dual")
    .html("")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // =========================
  // SCALES
  // =========================
  const x = d3.scaleLinear()
    .domain(d3.extent(yearly, d => d.year))
    .range([0, width]);

  const y1 = d3.scaleLinear()
    .domain([0, d3.max(yearly, d => d.pm25) * 1.2])
    .range([height, 0]);

  const y2 = d3.scaleLinear()
    .domain([
      d3.min(yearly, d => d.temp) - 1,
      d3.max(yearly, d => d.temp) + 1
    ])
    .range([height, 0]);

  // =========================
  // AXES
  // =========================
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(yearly.length))
    .selectAll("text")
    .style("fill", "white");

  svg.append("g")
    .call(d3.axisLeft(y1))
    .selectAll("text")
    .style("fill", "white");

  svg.append("g")
    .attr("transform", `translate(${width},0)`)
    .call(d3.axisRight(y2))
    .selectAll("text")
    .style("fill", "white");

  // =========================
  // LINES
  // =========================
  const line1 = d3.line()
    .x(d => x(d.year))
    .y(d => y1(d.pm25));

  const line2 = d3.line()
    .x(d => x(d.year))
    .y(d => y2(d.temp));

  const path1 = svg.append("path")
    .datum(yearly)
    .attr("fill", "none")
    .attr("stroke", "#00b4d8")
    .attr("stroke-width", 3)
    .attr("d", line1);

  const path2 = svg.append("path")
    .datum(yearly)
    .attr("fill", "none")
    .attr("stroke", "#ff4d4d")
    .attr("stroke-width", 3)
    .attr("d", line2);

  // =========================
  // ANIMATION
  // =========================
  const len1 = path1.node().getTotalLength();
  const len2 = path2.node().getTotalLength();

  path1
    .attr("stroke-dasharray", len1)
    .attr("stroke-dashoffset", len1)
    .transition()
    .duration(1200)
    .attr("stroke-dashoffset", 0);

  path2
    .attr("stroke-dasharray", len2)
    .attr("stroke-dashoffset", len2)
    .transition()
    .duration(1200)
    .delay(200)
    .attr("stroke-dashoffset", 0);

  // =========================
  // POINTS (PM2.5)
  // =========================
  svg.selectAll(".pm25-point")
    .data(yearly)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.year))
    .attr("cy", d => y1(d.pm25))
    .attr("r", 5)
    .attr("fill", "#00b4d8")

    .on("mouseover", function(event, d) {
      d3.select(this).attr("r", 7);

      tooltip
        .style("opacity", 1)
        .html(`
          <strong>${selectedCountry}</strong><br>
          Year: ${d.year}<br>
          PM2.5: ${d.pm25.toFixed(2)}<br>
          Temp: ${d.temp.toFixed(2)} °C
        `);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("r", 5);
      tooltip.style("opacity", 0);
    });

  // =========================
  // POINTS (TEMP)
  // =========================
  svg.selectAll(".temp-point")
    .data(yearly)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.year))
    .attr("cy", d => y2(d.temp))
    .attr("r", 5)
    .attr("fill", "#ff4d4d")

    .on("mouseover", function(event, d) {
      d3.select(this).attr("r", 7);

      tooltip
        .style("opacity", 1)
        .html(`
          <strong>${selectedCountry}</strong><br>
          Year: ${d.year}<br>
          PM2.5: ${d.pm25.toFixed(2)}<br>
          Temp: ${d.temp.toFixed(2)} °C
        `);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("r", 5);
      tooltip.style("opacity", 0);
    });

  // =========================
  // LEGEND
  // =========================
  svg.append("circle")
    .attr("cx", 20)
    .attr("cy", -10)
    .attr("r", 6)
    .attr("fill", "#00b4d8");

  svg.append("text")
    .attr("x", 30)
    .attr("y", -8)
    .style("fill", "white")
    .text("PM2.5");

  svg.append("circle")
    .attr("cx", 120)
    .attr("cy", -10)
    .attr("r", 6)
    .attr("fill", "#ff4d4d");

  svg.append("text")
    .attr("x", 130)
    .attr("y", -8)
    .style("fill", "white")
    .text("Temperature");

  // =========================
  // LABELS
  // =========================
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .text("Year");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -45)
    .style("fill", "white")
    .text("PM2.5");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", width + 50)
    .style("fill", "white")
    .text("Temperature");
}