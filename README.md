# 🌍 Global-Air-Quality-Analysis-Dashboard

This project explores the relationship between air pollution, climate conditions, socioeconomic development, and public health outcomes through an interactive data visualization dashboard. By integrating multiple global datasets, the project uncovers environmental health patterns and highlights how pollution impacts populations across different countries and economic conditions.

# Project Overview

This project aims to:

* Analyze global air pollution patterns and trends.
* Explore the relationship between climate conditions and pollution levels.
* Assess the impact of air quality on public health outcomes.
* Compare countries across different socioeconomic conditions.
* Identify environmental health inequalities through interactive visualizations.
* Communicate insights using data storytelling and visual analytics.

# Datasets Used

This project combines three complementary datasets to provide a multidimensional view of environmental health.

### Global Air Quality & Environmental Indicators

Includes:

* CO₂ emissions
* Human Development Index (HDI)
* Life expectancy
* Income indicators

### Climate & Health Impact Dataset

Includes:

* PM2.5 concentrations
* Air Quality Index (AQI)
* Temperature trends and climate anomalies
* Respiratory and cardiovascular health indicators
* Extreme weather events

### Socioeconomic Development Dataset

Includes:

* GDP per capita
* HDI
* Life expectancy
* Development and economic indicators

Together, these datasets enable analysis of how environmental, climate, and socioeconomic factors interact to influence health outcomes globally.

# Visualizations Implemented

| Visualization                            | Purpose                                                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| **Global Pollution Map**                 | Displays PM2.5 levels across countries                                            |
| **Climate vs Pollution Analysis**        | Compares temperature trends with pollution levels                                 |
| **Pollution Variability Chart**          | Examines pollution fluctuations across countries                                  |
| **Multi-Pollutant Composition Analysis** | Compares PM10, NO₂, SO₂, CO, and O₃                                               |
| **HDI vs PM2.5 Bubble Chart**            | Explores development and pollution relationships                                  |
| **Pollution vs Health Hexbin Plot**      | Visualizes pollution impact on respiratory diseases                               |
| **Parallel Coordinates Plot**            | Enables multivariate comparison across environmental and socioeconomic indicators |

# Key Findings

* Higher PM2.5 levels are associated with increased respiratory health risks.
* Climate anomalies can intensify the effects of air pollution.
* Countries with lower GDP and healthcare resources often face greater environmental health challenges.
* Air pollution is both an environmental and public health inequality issue.
* Socioeconomic conditions play a significant role in pollution vulnerability and health outcomes.

# Technologies Used

* D3.js (v7)
* JavaScript (ES6)
* Python
* HTML5
* CSS3
* Data Visualization & Storytelling Techniques

## How to Run

1. Clone or download the repository.
2. Open the project folder in **Visual Studio Code**.
3. Install the **Live Server** extension if not already installed.
4. Right-click on `index.html`.
5. Select **Open with Live Server**.

The application will launch automatically in your default web browser.

### Project Structure

```text
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   ├── main.js
│   ├── map.js
│   ├── dual.js
│   ├── span.js
│   ├── group.js
│   ├── bubble.js
│   ├── scatter.js
│   ├── hexbin.js
│   └── parallel.js
├── Data/
│   ├── Final_Dataset.csv
│   └── world.geojson
├── preprocessing.ipynb
├── EDA & Key Insights.ipynb
└── README.md
```

