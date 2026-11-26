/* NationScope data — figures from the World Bank, World Development
   Indicators, 2023 (population series 2019–2023). GDP per capita and
   population density are derived from the World Bank 2023 GDP and
   population figures shown here. Values are rounded for display; the
   source and year are shown next to every figure on the site. */

var DATA_SOURCE = "World Bank, World Development Indicators";
var DATA_YEAR = 2023;

var WORLD = {
  populationMillions: 8092,
  gdpTrillion: 105.4,
  lifeExpectancy: 71.7,
  note: "World totals: World Bank, World Development Indicators, 2023."
};

/* pop: millions, 2023. popSeries: millions, 2019–2023.
   gdp: $ billion, current US$, 2023. land: thousand km² (land area).
   urban: % of population in urban areas, 2023.
   unemployment: % of labour force, modelled ILO estimate, 2023.
   fertility: births per woman, 2023. life: life expectancy at birth, years, 2023. */
var COUNTRIES = [
  {
    code: "CHN", name: "China", region: "East Asia",
    pop: 1411.8, popSeries: [1407.7, 1411.1, 1412.4, 1411.8, 1411.8],
    gdp: 17794, life: 78.2, land: 9388, urban: 64.6, unemployment: 5.2, fertility: 1.0,
    blurb: "The world's second-largest economy and, until recently, its most populous country. Manufacturing and exports anchor an economy that has shifted steadily toward services and domestic consumption."
  },
  {
    code: "IND", name: "India", region: "South Asia",
    pop: 1428.6, popSeries: [1366.4, 1380.0, 1393.4, 1407.6, 1428.6],
    gdp: 3550, life: 67.7, land: 2973, urban: 36.0, unemployment: 4.2, fertility: 2.0,
    blurb: "The world's most populous country since 2023, with a young population and one of the fastest-growing large economies, driven by services, digital payments and a large domestic market."
  },
  {
    code: "USA", name: "United States", region: "North America",
    pop: 334.9, popSeries: [328.5, 331.5, 332.2, 333.3, 334.9],
    gdp: 27721, life: 78.4, land: 9148, urban: 83.0, unemployment: 3.6, fertility: 1.6,
    blurb: "The world's largest economy, home to the deepest capital markets and the largest technology sector. High income per person sits alongside wide regional and health inequalities."
  },
  {
    code: "JPN", name: "Japan", region: "East Asia",
    pop: 124.4, popSeries: [126.2, 125.8, 125.5, 125.1, 124.4],
    gdp: 4204, life: 84.0, land: 365, urban: 91.8, unemployment: 2.6, fertility: 1.2,
    blurb: "The world's longest-lived population and its fourth-largest economy. A shrinking, ageing population is reshaping its workforce, pensions and regional towns."
  },
  {
    code: "DEU", name: "Germany", region: "Europe",
    pop: 84.5, popSeries: [83.2, 83.2, 83.2, 84.1, 84.5],
    gdp: 4456, life: 81.7, land: 349, urban: 77.6, unemployment: 3.0, fertility: 1.4,
    blurb: "Europe's largest economy, built on manufacturing, engineering and exports. It combines high incomes with a strong welfare state and an ageing population."
  },
  {
    code: "GBR", name: "United Kingdom", region: "Europe",
    pop: 68.4, popSeries: [66.8, 67.1, 67.3, 67.8, 68.4],
    gdp: 3340, life: 81.8, land: 242, urban: 84.4, unemployment: 4.1, fertility: 1.6,
    blurb: "A services-led economy with London as a global finance centre. Four nations share one state, with distinct health and education systems in Scotland, Wales and Northern Ireland."
  },
  {
    code: "FRA", name: "France", region: "Europe",
    pop: 68.2, popSeries: [67.4, 67.5, 67.8, 68.0, 68.2],
    gdp: 3032, life: 83.3, land: 548, urban: 81.5, unemployment: 7.3, fertility: 1.6,
    blurb: "Western Europe's second-largest economy, with large agriculture, aerospace and luxury sectors and one of the world's most extensive public services."
  },
  {
    code: "BRA", name: "Brazil", region: "South America",
    pop: 216.4, popSeries: [211.0, 212.6, 213.3, 214.3, 216.4],
    gdp: 2174, life: 75.5, land: 8358, urban: 87.4, unemployment: 8.0, fertility: 1.6,
    blurb: "South America's largest country and economy, rich in farmland, minerals and rainforest. Most Brazilians live in cities along the Atlantic coast."
  },
  {
    code: "CAN", name: "Canada", region: "North America",
    pop: 39.1, popSeries: [37.6, 38.0, 38.2, 38.9, 39.1],
    gdp: 2141, life: 82.6, land: 9094, urban: 81.8, unemployment: 5.4, fertility: 1.4,
    blurb: "The world's second-largest country by land, with a small population spread across a few large cities. Energy, minerals and timber sit beside a large services economy."
  },
  {
    code: "AUS", name: "Australia", region: "Oceania",
    pop: 26.5, popSeries: [25.4, 25.7, 25.8, 26.0, 26.5],
    gdp: 1729, life: 83.2, land: 7682, urban: 86.5, unemployment: 3.7, fertility: 1.6,
    blurb: "A high-income island continent whose exports of iron ore, coal and gas fund a largely urban, services-based society with long life expectancy."
  }
];

function gdpPerCapita(c) {
  return Math.round((c.gdp * 1000) / c.pop);
}

function density(c) {
  return Math.round((c.pop * 1000) / c.land * 10) / 10;
}

function byCode(code) {
  for (var i = 0; i < COUNTRIES.length; i++) {
    if (COUNTRIES[i].code === code) return COUNTRIES[i];
  }
  return null;
}

function sortedBy(key, desc) {
  var list = COUNTRIES.slice();
  list.sort(function (a, b) {
    var va = key === "gdpPerCapita" ? gdpPerCapita(a) : key === "density" ? density(a) : a[key];
    var vb = key === "gdpPerCapita" ? gdpPerCapita(b) : key === "density" ? density(b) : b[key];
    return desc ? vb - va : va - vb;
  });
  return list;
}
