## Global Air Quality Analysis

## Overview

This project presents an **interactive data visualization dashboard** that explores how **air pollution, climate conditions, and socioeconomic factors** influence **public health across countries over time (2019-2021)**.

The central question guiding this work is:

> **How does air pollution interact with climate and socioeconomic conditions to impact health outcomes globally?**

The project combines multiple datasets and transforms them into a cohesive **data storytelling experience using D3.js**.

---

## Data Description

This project integrates **three major datasets** to provide a multidimensional perspective:

### 1. Global Air Quality & Environmental Indicators

* Covers long-term trends
* Includes:

  * CO₂ emissions
  * Human Development Index (HDI)
  * Life expectancy
  * Income indicators

Helps explain **development vs environmental impact**

---

### 2. Climate–Health Impact Dataset

* High-frequency (weekly) data across multiple countries
* Includes:

  * Temperature & climate anomalies
  * PM2.5 and AQI
  * Respiratory and cardiovascular health data
  * Extreme weather indicators

Used to analyze **pollution + climate → health effects**

---

### 3. Socioeconomic Development Dataset

* Covers global development indicators across decades
* Includes:

  * GDP per capita
  * HDI
  * Life expectancy

Explains **why some countries are more vulnerable than others**

---

## Key Objectives

* Analyze **global pollution patterns**
* Understand **climate–pollution interactions**
* Study **health impacts of air quality**
* Compare **countries across economic conditions**
* Identify **inequality in environmental health risks**

---

## Visualizations

The dashboard includes multiple interactive visualizations:

### Global Pollution Map

* Displays PM2.5 levels across countries
* Highlights geographic pollution patterns

---

### Climate vs Pollution (Dual Axis Chart)

* Compares **temperature trends vs PM2.5 levels**
* Shows temporal relationships

---

### Pollution Variability Across Countries

* Displays **min–max pollution ranges**
* Helps compare stability vs fluctuation

---

### Multi-Pollutant Composition

* Compares pollutants like:

  * PM10
  * NO₂
  * SO₂
  * CO
  * O₃

---

### HDI vs PM2.5 Bubble Chart

* Shows relationship between:

  * Development (HDI)
  * Pollution levels
  * Health impact

---

### Pollution vs Health (Hexbin Plot)

* Shows **density of pollution vs respiratory disease**
* Reveals clusters of high-risk regions

---

### Parallel Coordinates Plot

* Multivariate comparison across:

  * PM2.5
  * Temperature
  * AQI
  * GDP
* Allows interactive exploration of relationships

---

## Key Insights

* Higher **PM2.5 levels** correlate strongly with increased **respiratory diseases**
* Climate conditions (heat, anomalies) **intensify pollution effects**
* Countries with lower **GDP and healthcare access** face higher risk
* Air pollution is not just environmental — it's a **public health inequality issue**

---

## Tech Stack

* **D3.js (v7)** – Interactive visualizations
* **JavaScript (ES6)** – Logic & interactivity
* **HTML5** – Structure
* **CSS3** – Styling
* **Python** – Data preprocessing

---

## How to Run
Open directly:
```bash
index.html
Right Click → Open with Live Server
```
### Project Structure
```bash
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
