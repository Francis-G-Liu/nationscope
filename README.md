# nationscope

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Francis-G-Liu/nationscope/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Francis-G-Liu/nationscope/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An independent country-statistics explorer: headline figures for ten major
countries — population, GDP, GDP per person, life expectancy, land area,
urban share, unemployment and fertility — each with its source and year.

- **Overview** (`#/`): world at a glance, a searchable and sortable ranked
  table of all ten countries, and bar charts of population and GDP per person.
- **Country pages** (`#/country/CHN` …): key indicators with sources,
  a 2019–2023 population line chart, a GDP-per-person comparison chart,
  and people/economy sections.
- **Compare** (`#/compare`): pick any two countries for side-by-side figures
  and charts, with the larger figure highlighted.
- **About & method** (`#/about`): what each indicator means, where the
  figures come from, and the limits of the data.

All figures come from the World Bank, World Development Indicators, 2023
(population series 2019–2023). GDP per person and population density are
derived from those World Bank figures and labelled as such.

## Run it

```sh
cd app && python3 -m http.server 8080
```

Then open http://localhost:8080 — it works on desktop and on a phone, with
no network requests: every file the site loads lives under `app/`.

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
into the output directory and writes `dossier.json` with the vendored
make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=weyfgvzj&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
