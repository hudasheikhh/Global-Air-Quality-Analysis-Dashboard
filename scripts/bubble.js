function drawBubble(data, selectedCountry, selectedYear) {

  // =====================
  // CLEAN DATA
  // =====================
  data.forEach(d => {
    d.hdi = +(d.hdi || d.HDI || d.hdi_value);
    d.pm25 = +d.pm25;
    d.respiratory_disease_rate = +d.respiratory_disease_rate;
    d.year = +d.year;
  });

  // =====================
  // FILTER DATA
  // =====================
  let filtered = data.filter(d =>
    (selectedCountry === "Global" || d.country === selectedCountry) &&
    d.year === selectedYear &&
    !isNaN(d.hdi) &&
    !isNaN(d.pm25) &&
    !isNaN(d.respiratory_disease_rate)
  );

  if (filtered.length === 0) return;

  // =====================
  // AGGREGATE
  // =====================
  if (selectedCountry === "Global") {
    filtered = d3.rollups(
      filtered,
      v => ({
        hdi: d3.mean(v, d => d.hdi),
        pm25: d3.mean(v, d => d.pm25),
        respiratory_disease_rate: d3.mean(v, d => d.respiratory_disease_rate)
      }),
      d => d.country
    ).map(([country, values]) => ({
      country,
      ...values
    }));
  } else {
    const avg = {
      country: selectedCountry,
      hdi: d3.mean(filtered, d => d.hdi),
      pm25: d3.mean(filtered, d => d.pm25),
      respiratory_disease_rate: d3.mean(filtered, d => d.respiratory_disease_rate)
    };

    filtered = [avg];
  }

  // =====================
  // SVG SETUP
  // =====================
  const margin = {top: 50, right: 80, bottom: 60, left: 70};
  const width = 800 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = d3.select("#bubble")
    .html("")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const tooltip = d3.select("#tooltip");

  // =====================
  // SCALES
  // =====================
  const x = d3.scaleLinear()
    .domain(d3.extent(filtered, d => d.hdi))
    .nice()
    .range([20, width - 20]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(filtered, d => d.pm25) * 1.2])
    .range([height, 10]);

  const size = d3.scaleSqrt()
    .domain([0, d3.max(filtered, d => d.respiratory_disease_rate)])
    .range([8, 30]);

  const color = d3.scaleSequential()
    .domain(d3.extent(filtered, d => d.pm25))
    .interpolator(d3.interpolateYlOrRd);

  // =====================
  // AXES
  // =====================
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("fill", "white");

  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("fill", "white");

  // =====================
  // BUBBLES
  // =====================
  const bubbles = svg.append("g")
    .selectAll("circle")
    .data(filtered)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.hdi))
    .attr("cy", d => y(d.pm25))
    .attr("r", 0)
    .attr("fill", d => color(d.pm25))
    .attr("opacity", 0.85)
    .style("cursor", "pointer")

    // CLICK → global update
    .on("click", function(event, d) {
      setCountry(d.country);
    })

    // =====================
    //  HOVER (CROSS-HIGHLIGHT)
    // =====================
    .on("mousemove", function(event, d) {

      tooltip
        .style("opacity", 1)
        .html(`
          <strong>${d.country}</strong><br>
          HDI: ${d.hdi.toFixed(2)}<br>
          PM2.5: ${d.pm25.toFixed(2)}<br>
          Respiratory Disease Rate: ${d.respiratory_disease_rate.toFixed(2)}
        `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px");

      d3.select(this)
        .attr("stroke", "white")
        .attr("stroke-width", 2);

      //  Highlight matching bar group
      d3.selectAll("#group .bar-group")
        .style("opacity", g => g.country === d.country ? 1 : 0.3);
    })

    .on("mouseout", function() {

      tooltip.style("opacity", 0);

      d3.select(this).attr("stroke", "none");

      // reset bars
      d3.selectAll("#group .bar-group")
        .style("opacity", 1);
    });

  // =====================
  // ANIMATION
  // =====================
  bubbles.transition()
    .duration(800)
    .attr("r", d => size(d.respiratory_disease_rate));

  // =====================
  //  PERSISTENT SELECTION HIGHLIGHT
  // =====================
  bubbles
    .attr("stroke", d => d.country === selectedCountry ? "white" : "none")
    .attr("stroke-width", d => d.country === selectedCountry ? 3 : 0);

  // =====================
  // LABELS
  // =====================
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .text("HDI");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .style("fill", "white")
    .text("PM2.5 Level");
}