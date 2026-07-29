function drawGroup(data, selectedCountry, selectedYear, selectedPollutant) {

  const pollutants = ["pm10", "no2", "so2", "co", "o3"];

  const labelMap = {
    pm10: "PM10",
    no2: "NO₂",
    so2: "SO₂",
    co: "CO",
    o3: "O₃"
  };

  // =====================
  // FILTER DATA
  // =====================
  let filtered = data.filter(d =>
    (selectedCountry === "Global" || d.country === selectedCountry) &&
    (selectedYear === "All" || d.year === selectedYear)
  );

  if (filtered.length === 0) return;

  // CLEAN
  filtered.forEach(d => {
    pollutants.forEach(p => d[p] = +d[p]);
  });

  // =====================
  // AGGREGATE (GLOBAL)
  // =====================
  if (selectedCountry === "Global") {
    filtered = d3.rollups(
      filtered,
      v => ({
        pm10: d3.mean(v, d => d.pm10),
        no2: d3.mean(v, d => d.no2),
        so2: d3.mean(v, d => d.so2),
        co: d3.mean(v, d => d.co),
        o3: d3.mean(v, d => d.o3)
      }),
      d => d.country
    ).map(([country, values]) => ({ country, ...values }));
  }

  // =====================
  // TOP 10
  // =====================
  if (selectedCountry === "Global") {
    filtered = filtered
      .sort((a, b) =>
        d3.mean(pollutants, k => b[k]) -
        d3.mean(pollutants, k => a[k])
      )
      .slice(0, 10);
  }

  const displayPollutants = selectedPollutant === "all"
    ? pollutants
    : [selectedPollutant];

  // =====================
  // SVG SETUP
  // =====================
  const margin = { top: 40, right: 120, bottom: 70, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

  const svg = d3.select("#group")
    .selectAll("svg")
    .data([null])
    .join("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg.selectAll("g.main")
    .data([null])
    .join("g")
    .attr("class", "main")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const tooltip = d3.select("#tooltip");

  // =====================
  // SCALES
  // =====================
  const x = d3.scaleBand()
    .domain(filtered.map(d => d.country))
    .range([0, width])
    .padding(0.2);

  const xSub = d3.scaleBand()
    .domain(displayPollutants)
    .range([0, x.bandwidth()])
    .padding(selectedPollutant === "all" ? 0.1 : 0.6);

  const y = d3.scaleLinear()
    .domain([0, d3.max(filtered, d =>
      d3.max(displayPollutants, key => d[key])
    )])
    .nice()
    .range([height, 0]);

  const color = d3.scaleOrdinal()
    .domain(pollutants)
    .range(["#ff4d4d", "#ffa500", "#00c3ff", "#00ff9d", "#d94dff"]);

  // =====================
  // AXES
  // =====================
  g.selectAll(".x-axis")
    .data([null])
    .join("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-30)")
    .style("text-anchor", "end")
    .style("fill", "white");

  g.selectAll(".y-axis")
    .data([null])
    .join("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("fill", "white");

  // =====================
  // BAR GROUPS
  // =====================
  const barGroups = g.selectAll(".bar-group")
    .data(filtered, d => d.country)
    .join("g")
    .attr("class", "bar-group")
    .attr("transform", d => `translate(${x(d.country)},0)`)
    .style("cursor", "pointer")
    .on("click", function(event, d) {
      setCountry(d.country);
    });

  // =====================
  // BARS + TOOLTIP
  // =====================
  const bars = barGroups.selectAll("rect")
    .data(d => displayPollutants.map(key => ({
      key,
      value: d[key],
      country: d.country,
      full: d
    })));

  bars.join("rect")
    .attr("fill", d => color(d.key))
    .on("mouseover", function (event, d) {

      const f = d.full;

      tooltip.style("opacity", 1)
        .html(`
          <strong>${d.country}</strong><br>
          PM10: ${f.pm10.toFixed(2)}<br>
          NO₂: ${f.no2.toFixed(2)}<br>
          SO₂: ${f.so2.toFixed(2)}<br>
          CO: ${f.co.toFixed(2)}<br>
          O₃: ${f.o3.toFixed(2)}
        `);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0))
    .transition()
    .duration(500)
    .attr("x", d => selectedPollutant === "all"
      ? xSub(d.key)
      : (x.bandwidth() - xSub.bandwidth()) / 2)
    .attr("width", xSub.bandwidth())
    .attr("y", d => y(d.value))
    .attr("height", d => height - y(d.value));

  // =====================
  // LEGEND
  // =====================
  const legend = svg.selectAll(".legend")
    .data([null])
    .join("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width + margin.left + 20}, ${margin.top})`);

  const legendItems = legend.selectAll(".legend-item")
    .data(pollutants)
    .join("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 25})`);

  legendItems.append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", d => color(d));

  legendItems.append("text")
    .attr("x", 18)
    .attr("y", 10)
    .text(d => labelMap[d])
    .style("fill", "white")
    .style("font-size", "12px");
}