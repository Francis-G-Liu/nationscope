/* NationScope app — hash router, views and tables. No network calls:
   everything renders from data.js, loaded before this file. */

var YEARS = [2019, 2020, 2021, 2022, 2023];
var SRC = DATA_SOURCE + ", " + DATA_YEAR;

function fmtPop(m) { return m.toLocaleString("en-US", { maximumFractionDigits: 1 }) + " million"; }
function fmtGdp(bn) {
  if (bn >= 1000) return "$" + (bn / 1000).toFixed(2) + " trillion";
  return "$" + bn.toLocaleString("en-US") + " billion";
}
function fmtMoney(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
function fmtInt(n) { return Math.round(n).toLocaleString("en-US"); }

var view = document.getElementById("view");
var navLinks = document.querySelectorAll(".main-nav a");

function setActive(route) {
  for (var i = 0; i < navLinks.length; i++) {
    var r = navLinks[i].getAttribute("data-route");
    if (route === "country") {
      navLinks[i].classList.toggle("active", r === "home");
    } else {
      navLinks[i].classList.toggle("active", r === route);
    }
  }
}

function countryLink(c) {
  return '<a href="#/country/' + c.code + '">' + c.name + '</a>';
}

function tile(label, value, sub) {
  return '<div class="stat-tile"><div class="label">' + label + '</div>' +
    '<div class="value">' + value + '</div><div class="sub">' + sub + '</div></div>';
}

function sourceNote() {
  return '<p class="muted small">Source: ' + SRC + '. GDP per capita and population density are derived from the World Bank 2023 GDP and population figures shown here.</p>';
}

/* ---------------- home ---------------- */

var homeSort = { key: "pop", desc: true };
var homeQuery = "";

function indicatorRows(list) {
  var rows = list.map(function (c, i) {
    return "<tr><td class='rank-cell'>" + (i + 1) + "</td><td>" + countryLink(c) + "</td>" +
      "<td class='num'>" + fmtPop(c.pop) + "</td>" +
      "<td class='num'>" + fmtGdp(c.gdp) + "</td>" +
      "<td class='num'>" + fmtMoney(gdpPerCapita(c)) + "</td>" +
      "<td class='num'>" + c.life.toFixed(1) + "</td></tr>";
  });
  return rows.join("");
}

function homeView() {
  setActive("home");
  var totalPop = 0, totalGdp = 0;
  for (var i = 0; i < COUNTRIES.length; i++) { totalPop += COUNTRIES[i].pop; totalGdp += COUNTRIES[i].gdp; }
  var sharePop = Math.round(totalPop / WORLD.populationMillions * 100);
  var shareGdp = Math.round(totalGdp / (WORLD.gdpTrillion * 1000) * 100);

  var q = homeQuery.trim().toLowerCase();
  var list = sortedBy(homeSort.key, homeSort.desc).filter(function (c) {
    return !q || c.name.toLowerCase().indexOf(q) !== -1 || c.region.toLowerCase().indexOf(q) !== -1;
  });

  view.innerHTML =
    '<p class="eyebrow">Country statistics, plainly presented</p>' +
    '<h1>How big is a country, really?</h1>' +
    '<p class="lede">NationScope puts the headline numbers for ten major countries side by side — population, economy, health and how people live — each with its source and year, so you can check it yourself.</p>' +
    '<div class="grid4">' +
    tile("Countries profiled", "10", "Across 5 continents") +
    tile("People covered", (totalPop / 1000).toFixed(2) + " billion", sharePop + "% of the world in 2023") +
    tile("Combined GDP", "$" + (totalGdp / 1000).toFixed(1) + " trillion", shareGdp + "% of world GDP in 2023") +
    tile("World population", "8.09 billion", "World Bank, 2023") +
    "</div>" +

    '<div class="card"><h2 style="margin-top:0">Find a country</h2>' +
    '<div class="controls"><input type="search" id="q" placeholder="Search by name or region…" value="' + homeQuery.replace(/"/g, "&quot;") + '" aria-label="Search countries">' +
    '<select id="picker" aria-label="Jump to a country"><option value="">Jump to a country…</option>' +
    COUNTRIES.map(function (c) { return '<option value="' + c.code + '">' + c.name + "</option>"; }).join("") +
    "</select></div>" +
    '<div class="chip-row">' +
    COUNTRIES.map(function (c) { return '<a class="chip" href="#/country/' + c.code + '">' + c.name + "</a>"; }).join("") +
    '<a class="chip" href="#/compare">Compare two countries →</a>' +
    "</div></div>" +

    '<div class="card"><h2 style="margin-top:0">Ranked: the ten countries</h2>' +
    '<p class="muted">Click a column heading to sort. Figures: ' + SRC + '.</p>' +
    '<div style="overflow-x:auto"><table id="rankTable"><thead><tr>' +
    '<th>#</th><th class="sortable" data-key="name">Country</th>' +
    '<th class="sortable num" data-key="pop">Population</th>' +
    '<th class="sortable num" data-key="gdp">GDP</th>' +
    '<th class="sortable num" data-key="gdpPerCapita">GDP per person</th>' +
    '<th class="sortable num" data-key="life">Life expectancy</th>' +
    "</tr></thead><tbody>" + indicatorRows(list) + "</tbody></table></div>" +
    (list.length === 0 ? "<p>No country matches that search.</p>" : "") +
    sourceNote() + "</div>" +

    '<div class="grid2"><div class="card"><h3>Biggest populations, 2023</h3>' +
    barChart(sortedBy("pop", true).slice(0, 5).map(function (c) {
      return { label: c.name, value: c.pop, format: fmtPop(c.pop) };
    }), { labelW: 90 }) +
    '<p class="legend">Population in millions. Source: ' + SRC + '.</p></div>' +
    '<div class="card"><h3>Highest GDP per person, 2023</h3>' +
    barChart(sortedBy("gdpPerCapita", true).slice(0, 5).map(function (c) {
      return { label: c.name, value: gdpPerCapita(c), format: fmtMoney(gdpPerCapita(c)) };
    }), { labelW: 90 }) +
    '<p class="legend">GDP per capita, current US$. Source: ' + SRC + ' (derived).</p></div></div>' +

    '<div class="card"><h2 style="margin-top:0">The world at a glance, 2023</h2>' +
    '<p>World population reached <strong>8.09 billion</strong> and world GDP <strong>$105.4 trillion</strong> in 2023. Average life expectancy worldwide was <strong>71.7 years</strong>. The ten countries profiled here hold about 47% of all people and produce about 63% of world output — which is why their numbers are a useful first stop for understanding the global picture. <a href="#/about">How we compile these figures →</a></p></div>';

  document.getElementById("q").addEventListener("input", function (e) {
    homeQuery = e.target.value;
    var pos = e.target.selectionStart;
    render();
    var q2 = document.getElementById("q");
    q2.focus();
    q2.setSelectionRange(pos, pos);
  });
  document.getElementById("picker").addEventListener("change", function (e) {
    if (e.target.value) location.hash = "#/country/" + e.target.value;
  });
  var heads = document.querySelectorAll("#rankTable th.sortable");
  function markSort() {
    for (var m = 0; m < heads.length; m++) {
      var k = heads[m].getAttribute("data-key");
      heads[m].setAttribute("aria-sort", k === homeSort.key ? (homeSort.desc ? "descending" : "ascending") : "none");
    }
  }
  markSort();
  for (var h = 0; h < heads.length; h++) {
    heads[h].addEventListener("click", function (e) {
      var key = e.currentTarget.getAttribute("data-key");
      if (homeSort.key === key) homeSort.desc = !homeSort.desc;
      else homeSort = { key: key, desc: key !== "name" };
      render();
    });
  }
}

/* ---------------- country page ---------------- */

function indicatorTable(c) {
  var rows = [
    ["Population", fmtPop(c.pop), "World Bank, 2023"],
    ["GDP", fmtGdp(c.gdp), "World Bank, 2023"],
    ["GDP per person", fmtMoney(gdpPerCapita(c)), "World Bank, 2023 (derived)"],
    ["Life expectancy at birth", c.life.toFixed(1) + " years", "World Bank, 2023"],
    ["Land area", fmtInt(c.land) + " thousand km²", "World Bank, 2023"],
    ["Population density", density(c).toFixed(1) + " people per km²", "World Bank, 2023 (derived)"],
    ["Urban population", c.urban.toFixed(1) + "%", "World Bank, 2023"],
    ["Unemployment rate", c.unemployment.toFixed(1) + "% of labour force", "World Bank / ILO, 2023"],
    ["Fertility rate", c.fertility.toFixed(1) + " births per woman", "World Bank, 2023"]
  ];
  return "<table><thead><tr><th>Indicator</th><th class='num'>Value</th><th>Source</th></tr></thead><tbody>" +
    rows.map(function (r) {
      return "<tr><td>" + r[0] + "</td><td class='num'><strong>" + r[1] + "</strong></td><td class='small'>" + r[2] + "</td></tr>";
    }).join("") + "</tbody></table>";
}

function countryView(code) {
  var c = byCode(code);
  if (!c) { view.innerHTML = "<h1>Country not found</h1><p>We profile ten countries. <a href='#/'>Back to the overview</a>.</p>"; return; }
  setActive("country");
  var idx = COUNTRIES.indexOf(c);
  var prev = COUNTRIES[(idx + COUNTRIES.length - 1) % COUNTRIES.length];
  var next = COUNTRIES[(idx + 1) % COUNTRIES.length];

  var popPoints = YEARS.map(function (y, i) {
    return { x: String(y), y: c.popSeries[i], label: fmtPop(c.popSeries[i]) };
  });
  var gdpBars = sortedBy("gdpPerCapita", true).map(function (o) {
    return { label: o.name, value: gdpPerCapita(o), highlight: o.code === c.code, format: fmtMoney(gdpPerCapita(o)) };
  });

  view.innerHTML =
    '<p class="eyebrow">' + c.region + " · Country profile</p>" +
    '<h1>' + c.name + '</h1>' +
    '<p class="lede">' + c.blurb + '</p>' +
    '<div class="grid4">' +
    tile("Population", fmtPop(c.pop), "World Bank, 2023") +
    tile("GDP", fmtGdp(c.gdp), "World Bank, 2023") +
    tile("GDP per person", fmtMoney(gdpPerCapita(c)), "World Bank, 2023") +
    tile("Life expectancy", c.life.toFixed(1) + " years", "World Bank, 2023") +
    "</div>" +

    '<div class="grid2"><div class="card"><h3>Population, 2019–2023</h3>' +
    lineChart(popPoints, { tickFormat: function (v) { return v.toFixed(0) + "m"; } }) +
    '<p class="legend">Millions of people. Source: ' + SRC + ', 2019–2023.</p></div>' +
    '<div class="card"><h3>GDP per person vs the other nine</h3>' +
    barChart(gdpBars, { labelW: 100 }) +
    '<p class="legend">Current US$, 2023. ' + c.name + ' is highlighted. Source: ' + SRC + ' (derived).</p></div></div>' +

    '<div class="card"><h2 style="margin-top:0">Key indicators</h2>' + indicatorTable(c) + sourceNote() + "</div>" +

    '<div class="grid3">' +
    '<div class="card"><h3>People</h3><dl class="kv">' +
    "<dt>Population</dt><dd>" + fmtPop(c.pop) + "</dd>" +
    "<dt>Density</dt><dd>" + density(c).toFixed(1) + " / km²</dd>" +
    "<dt>Urban</dt><dd>" + c.urban.toFixed(1) + "%</dd>" +
    "<dt>Fertility</dt><dd>" + c.fertility.toFixed(1) + "</dd>" +
    "<dt>Life expectancy</dt><dd>" + c.life.toFixed(1) + " years</dd></dl></div>" +
    '<div class="card"><h3>Economy</h3><dl class="kv">' +
    "<dt>GDP</dt><dd>" + fmtGdp(c.gdp) + "</dd>" +
    "<dt>GDP per person</dt><dd>" + fmtMoney(gdpPerCapita(c)) + "</dd>" +
    "<dt>Unemployment</dt><dd>" + c.unemployment.toFixed(1) + "%</dd></dl>" +
    '<p class="muted small">Unemployment is the modelled ILO estimate, World Bank, 2023.</p></div>' +
    '<div class="card"><h3>Explore more</h3>' +
    '<p><a href="#/compare?c1=' + c.code + '&c2=USA">Compare ' + c.name + ' with the United States →</a></p>' +
    '<p><a href="#/compare?c1=' + c.code + '&c2=CHN">Compare ' + c.name + ' with China →</a></p>' +
    '<p><a href="#/about">What each indicator means →</a></p></div>' +
    "</div>" +

    '<p><a href="#/country/' + prev.code + '">← ' + prev.name + '</a> &nbsp;·&nbsp; <a href="#/">All countries</a> &nbsp;·&nbsp; <a href="#/country/' + next.code + '">' + next.name + ' →</a></p>';
}

/* ---------------- compare ---------------- */

function compareView(params) {
  setActive("compare");
  var a = byCode(params.c1) || byCode("CHN");
  var b = byCode(params.c2) || byCode("USA");
  if (a.code === b.code) b = byCode(a.code === "USA" ? "CHN" : "USA");

  function options(sel) {
    return COUNTRIES.map(function (c) {
      return '<option value="' + c.code + '"' + (c.code === sel.code ? " selected" : "") + ">" + c.name + "</option>";
    }).join("");
  }
  function row(label, va, vb, fmt) {
    var ca = fmt(va), cb = fmt(vb);
    var wa = va > vb, wb = vb > va;
    return "<tr><td>" + label + "</td><td class='num" + (wa ? " winner" : "") + "'>" + ca + "</td><td class='num" + (wb ? " winner" : "") + "'>" + cb + "</td></tr>";
  }

  view.innerHTML =
    '<p class="eyebrow">Head to head</p><h1>Compare countries</h1>' +
    '<p class="lede">Pick any two countries. The larger figure in each row is highlighted. All figures: ' + SRC + '.</p>' +
    '<div class="card"><div class="controls">' +
    '<label>Country A <select id="selA">' + options(a) + "</select></label>" +
    '<label>Country B <select id="selB">' + options(b) + "</select></label>" +
    '<button id="swapBtn" class="ghost" type="button">Swap</button>' +
    "</div></div>" +

    '<div class="compare-grid">' +
    '<div class="card"><h2 style="margin-top:0">' + a.name + '</h2><p class="muted">' + a.region + '</p><p>' + a.blurb + '</p></div>' +
    '<div class="vs">VS</div>' +
    '<div class="card"><h2 style="margin-top:0">' + b.name + '</h2><p class="muted">' + b.region + '</p><p>' + b.blurb + '</p></div>' +
    "</div>" +

    '<div class="card"><h2 style="margin-top:0">Side by side</h2>' +
    '<div style="overflow-x:auto"><table><thead><tr><th>Indicator</th><th class="num">' + a.name + '</th><th class="num">' + b.name + '</th></tr></thead><tbody>' +
    row("Population", a.pop, b.pop, fmtPop) +
    row("GDP", a.gdp, b.gdp, fmtGdp) +
    row("GDP per person", gdpPerCapita(a), gdpPerCapita(b), fmtMoney) +
    row("Life expectancy", a.life, b.life, function (v) { return v.toFixed(1) + " years"; }) +
    row("Land area", a.land, b.land, function (v) { return fmtInt(v) + "k km²"; }) +
    row("Population density", density(a), density(b), function (v) { return v.toFixed(1) + " / km²"; }) +
    row("Urban population", a.urban, b.urban, function (v) { return v.toFixed(1) + "%"; }) +
    row("Unemployment", a.unemployment, b.unemployment, function (v) { return v.toFixed(1) + "%"; }) +
    row("Fertility rate", a.fertility, b.fertility, function (v) { return v.toFixed(1); }) +
    "</tbody></table></div>" + sourceNote() + "</div>" +

    '<div class="grid2"><div class="card"><h3>GDP per person</h3>' +
    barChart([
      { label: a.name, value: gdpPerCapita(a), format: fmtMoney(gdpPerCapita(a)) },
      { label: b.name, value: gdpPerCapita(b), format: fmtMoney(gdpPerCapita(b)) }
    ], { labelW: 110 }) + '<p class="legend">Current US$, 2023. Source: ' + SRC + ' (derived).</p></div>' +
    '<div class="card"><h3>Population</h3>' +
    barChart([
      { label: a.name, value: a.pop, format: fmtPop(a.pop) },
      { label: b.name, value: b.pop, format: fmtPop(b.pop) }
    ], { labelW: 110 }) + '<p class="legend">Millions, 2023. Source: ' + SRC + '.</p></div></div>' +

    '<p><a href="#/country/' + a.code + '">' + a.name + ' profile →</a> &nbsp;·&nbsp; <a href="#/country/' + b.code + '">' + b.name + ' profile →</a> &nbsp;·&nbsp; <a href="#/">All countries</a></p>';

  function go() {
    var ca = document.getElementById("selA").value;
    var cb = document.getElementById("selB").value;
    location.hash = "#/compare?c1=" + ca + "&c2=" + cb;
  }
  document.getElementById("selA").addEventListener("change", go);
  document.getElementById("selB").addEventListener("change", go);
  document.getElementById("swapBtn").addEventListener("click", function () {
    location.hash = "#/compare?c1=" + b.code + "&c2=" + a.code;
  });
}

/* ---------------- about ---------------- */

function aboutView() {
  setActive("about");
  view.innerHTML =
    '<p class="eyebrow">Method &amp; sources</p><h1>About NationScope</h1>' +
    '<p class="lede">NationScope is an independent country-statistics explorer. It presents headline figures for ten major countries in plain language, with the source and year next to every number.</p>' +
    '<div class="card"><h2 style="margin-top:0">Where the figures come from</h2>' +
    '<p>All headline figures come from the <strong>World Bank, World Development Indicators</strong>, reference year <strong>2023</strong> (population series 2019–2023). Unemployment is the World Bank\'s modelled ILO estimate for 2023. Two figures are derived from those World Bank numbers and labelled as such: <strong>GDP per person</strong> (GDP divided by population) and <strong>population density</strong> (population divided by land area).</p>' +
    '<p>Figures are rounded for display — population to one decimal place in millions, GDP to the nearest billion dollars, GDP per person to the nearest dollar. Rounding can make a derived figure differ by a dollar or two from the World Bank\'s own published per-capita value.</p></div>' +
    '<div class="card"><h2 style="margin-top:0">What each indicator means</h2>' +
    "<table><thead><tr><th>Indicator</th><th>Meaning</th></tr></thead><tbody>" +
    "<tr><td>Population</td><td>All residents, regardless of citizenship, at mid-year.</td></tr>" +
    "<tr><td>GDP</td><td>Gross domestic product in current US dollars: the value of all goods and services produced in a year.</td></tr>" +
    "<tr><td>GDP per person</td><td>GDP divided by population — a rough gauge of average income, not of how income is shared.</td></tr>" +
    "<tr><td>Life expectancy</td><td>How long a newborn would live if mortality rates stayed as they are today.</td></tr>" +
    "<tr><td>Land area</td><td>Total land excluding inland waters and coastal areas.</td></tr>" +
    "<tr><td>Population density</td><td>People per square kilometre of land area.</td></tr>" +
    "<tr><td>Urban population</td><td>Share of people living in areas defined as urban by each country's statistics office.</td></tr>" +
    "<tr><td>Unemployment</td><td>Share of the labour force without work but available and seeking it (modelled ILO estimate).</td></tr>" +
    "<tr><td>Fertility rate</td><td>Average births per woman over her lifetime at current rates.</td></tr>" +
    "</tbody></table></div>" +
    '<div class="card"><h2 style="margin-top:0">Limits</h2>' +
    "<p>Ten countries cannot stand for the whole world: small states, low-income countries and island nations are not profiled here. Figures for 2023 are the latest complete year in the World Development Indicators at the time of writing; newer estimates may differ. Urban shares depend on each country's own definition of 'urban', so they are not strictly comparable. Nothing on this site is financial advice.</p>" +
    '<p><a href="#/">Back to the overview →</a></p></div>';
}

/* ---------------- router ---------------- */

function parseHash() {
  var raw = location.hash.replace(/^#\/?/, "");
  var parts = raw.split("?");
  var path = parts[0].split("/");
  var params = {};
  if (parts[1]) {
    parts[1].split("&").forEach(function (kv) {
      var pair = kv.split("=");
      if (pair[0]) params[pair[0]] = decodeURIComponent(pair[1] || "");
    });
  }
  return { path: path, params: params };
}

function render() {
  var r = parseHash();
  window.scrollTo(0, 0);
  if (r.path[0] === "country" && r.path[1]) countryView(r.path[1].toUpperCase());
  else if (r.path[0] === "compare") compareView(r.params);
  else if (r.path[0] === "about") aboutView();
  else homeView();
}

window.addEventListener("hashchange", render);
render();
