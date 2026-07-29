// =========================
// GLOBAL STATE
// =========================
let selectedCountry = "Global";
let selectedYear = 2019;
let selectedPollutant = "all";

let globalData = [];


// =========================
// LOAD DATA
// =========================
d3.csv("Data/Final_Dataset.csv")
  .then(data => {

    console.log("Data loaded:", data);

    // =========================
    // CLEAN + STANDARDIZE
    // =========================
    data.forEach(d => {

      d.year = +d.year;
      d.country = d.country || d.Country;

      d.pm25 = +(
        d.pm25 ||
        d.pm10 ||
        d.pm25_ugm3 ||
        d["pm2_5_µg_m³_"]
      );

      d.pm10 = +d.pm10;
      d.no2 = +d.no2;
      d.so2 = +d.so2;
      d.co = +d.co;
      d.o3 = +d.o3;

      d.hdi = +(d.hdi || d.HDI || d.hdi_value);
      d.respiratory_disease_rate = +d.respiratory_disease_rate;

      d.co2_production = +d.co2_production;
      d.air_quality_index = +d.air_quality_index;
      d.gdp_per_capita_usd = +d.gdp_per_capita_usd;
    });

    // remove invalid rows
    data = data.filter(d => !isNaN(d.pm25));

    globalData = data;

    // =========================
    // COUNTRY DROPDOWN
    // =========================
    const countries = ["Global", ...new Set(data.map(d => d.country))];

    d3.select("#countryFilter")
      .selectAll("option")
      .data(countries)
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d => d);

    // =========================
    // YEAR DROPDOWN
    // =========================
    const years = [...new Set(data.map(d => d.year))].sort();

    d3.select("#yearFilter")
      .selectAll("option")
      .data(years)
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d => d);

    // =========================
    // DEFAULT VALUES
    // =========================
    d3.select("#countryFilter").property("value", selectedCountry);
    d3.select("#yearFilter").property("value", selectedYear);

    // =========================
    // EVENT LISTENERS
    // =========================

    // COUNTRY CHANGE
    d3.select("#countryFilter").on("change", function () {
      setCountry(this.value);
    });

    // YEAR CHANGE
    d3.select("#yearFilter").on("change", function () {
      selectedYear = +this.value;
      updateAll();
    });

    // =========================
    // 🔥 GROUP FILTER BUTTONS (FIXED PROPERLY)
    // =========================
    d3.selectAll(".group-filters button")
      .on("click", function () {

        const newPollutant = this.dataset.var;

        // UI active state (ALWAYS APPLY)
        d3.selectAll(".group-filters button").classed("active", false);
        d3.select(this).classed("active", true);

        if (newPollutant === "all") {
          selectedPollutant = "all";

          // 🔥 FORCE RESET (KEY FIX)
          setCountry("Global", true);

          return;
        }

        selectedPollutant = newPollutant;
        updateAll();
      });

    // =========================
    // INITIAL RENDER
    // =========================
    updateAll();

  })
  .catch(error => {
    console.error("Error loading CSV:", error);
  });


// =========================
// UPDATE FUNCTION
// =========================
function updateAll() {

  console.log("Selected:",
    selectedCountry,
    selectedYear,
    selectedPollutant
  );

  drawMap(globalData, selectedCountry, selectedYear);
  drawDual(globalData, selectedCountry);
  drawSpan(globalData, selectedYear);
  drawGroup(globalData, selectedCountry, selectedYear, selectedPollutant);
  drawBubble(globalData, selectedCountry, selectedYear);
  drawHexbin(globalData, selectedCountry, selectedYear);
  drawParallel(globalData, selectedCountry, selectedYear);
  drawAQIBar(globalData, selectedCountry, selectedYear);
  console.log("Updated!");
}


// =========================
// 🔥 FIXED CENTRAL CONTROL
// =========================
function setCountry(country, force = false) {

  // 🔥 THIS IS THE ROOT FIX
  if (!force && selectedCountry === country) return;

  selectedCountry = country;

  d3.select("#countryFilter")
    .property("value", country);

  updateAll();
}