function drawSpan(data, selectedYear) {

  let filtered = data.filter(d =>
    d.year === selectedYear &&
    !isNaN(d.pm25)
  );

  const grouped = d3.rollups(
    filtered,
    v => ({
      min: d3.min(v, d => d.pm25),
      max: d3.max(v, d => d.pm25)
    }),
    d => d.country
  ).map(d => ({
    country: d[0],
    min: d[1].min,
    max: d[1].max
  }));

  grouped.sort((a, b) => b.max - a.max);

  const margin = {top: 60, right: 60, bottom: 60, left: 140};
  const width = 800 - margin.left - margin.right;
  const height = 420 - margin.top - margin.bottom;

  const svg = d3.select("#span")
    .html("")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const y = d3.scaleBand()
    .domain(grouped.map(d => d.country))
    .range([0, height])
    .padding(0.5);

  const x = d3.scaleLinear()
    .domain([0, d3.max(grouped, d => d.max)])
    .nice()
    .range([0, width]);

  // =====================
  // AXES
  // =====================
  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("fill", "white");

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("fill", "white");

  // =====================
  // TOOLTIP
  // =====================
  const tooltip = d3.select("body")
    .selectAll(".tooltip")
    .data([null])
    .join("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "black")
    .style("color", "white")
    .style("padding", "6px")
    .style("border-radius", "5px")
    .style("font-size", "12px")
    .style("display", "none");

  // =====================
  // SPAN LINE (ONLY IF DIFFERENT)
  // =====================
  svg.selectAll(".span-line")
    .data(grouped.filter(d => d.min !== d.max))
    .enter()
    .append("line")
    .attr("x1", d => x(d.min))
    .attr("x2", d => x(d.max))
    .attr("y1", d => y(d.country))
    .attr("y2", d => y(d.country))
    .attr("stroke", "white")
    .attr("stroke-width", 2);

  // =====================
  // 🔥 HOVER AREA (FAST)
  // =====================
  svg.selectAll(".hover-area")
    .data(grouped.filter(d => d.min !== d.max))
    .enter()
    .append("line")
    .attr("x1", d => x(d.min))
    .attr("x2", d => x(d.max))
    .attr("y1", d => y(d.country))
    .attr("y2", d => y(d.country))
    .attr("stroke", "transparent")
    .attr("stroke-width", 15)
    .on("mouseover", function(event, d) {
      tooltip.style("display", "block")
        .html(`
          <strong>${d.country}</strong><br>
          Min: ${d.min}<br>Max: ${d.max}
        `);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px");
    })
    .on("mouseout", function() {
      tooltip.style("display", "none");
    });

  // =====================
  // 🔵 MIN DOT
  // =====================
  svg.selectAll(".min-dot")
    .data(grouped.filter(d => d.min !== d.max))
    .enter()
    .append("circle")
    .attr("cx", d => x(d.min))
    .attr("cy", d => y(d.country))
    .attr("r", 6)
    .attr("fill", "#00b4d8");

  // =====================
  // 🔴 MAX DOT
  // =====================
  svg.selectAll(".max-dot")
    .data(grouped.filter(d => d.min !== d.max))
    .enter()
    .append("circle")
    .attr("cx", d => x(d.max))
    .attr("cy", d => y(d.country))
    .attr("r", 6)
    .attr("fill", "#ff4d4d");

  // =====================
  // 🟣 SINGLE VALUE DOT (ONLY ONE)
  // =====================
  svg.selectAll(".single-dot")
    .data(grouped.filter(d => d.min === d.max))
    .enter()
    .append("circle")
    .attr("cx", d => x(d.min))
    .attr("cy", d => y(d.country))
    .attr("r", 8)
    .attr("fill", "#9b5de5")
    .on("mouseover", function(event, d) {
      tooltip.style("display", "block")
        .html(`
          <strong>${d.country}</strong><br>
          Value: ${d.min}
        `);
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px");
    })
    .on("mouseout", function() {
      tooltip.style("display", "none");
    });

  // =====================
  // LABEL
  // =====================
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-weight", "bold")
    .text("PM2.5 Level");

  // =====================
  // LEGEND
  // =====================
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 150}, -25)`);

  legend.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 6)
    .attr("fill", "#00b4d8");

  legend.append("text")
    .attr("x", 12)
    .attr("y", 4)
    .style("fill", "white")
    .text("Min");

  legend.append("circle")
    .attr("cx", 60)
    .attr("cy", 0)
    .attr("r", 6)
    .attr("fill", "#ff4d4d");

  legend.append("text")
    .attr("x", 72)
    .attr("y", 4)
    .style("fill", "white")
    .text("Max");
}