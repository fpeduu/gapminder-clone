/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

const basewidth = 600;
const baseheight = 400;

const margin = { left: 60, right: 10, top: 10, bottom: 60 };
const width = basewidth - margin.left - margin.right;
const height = baseheight - margin.top - margin.bottom;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", basewidth)
  .attr("height", baseheight);

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height})`);
const yAxisGroup = g.append("g").attr("class", "y axis");

const year = g
  .append("text")
  .attr("class", "year")
  .attr("x", width)
  .attr("y", height - 10)
  .attr("font-size", "40px")
  .attr("text-anchor", "end")
  .attr("fill", "grey");

const x = d3.scaleLog(3).domain([100, 150000]).range([0, width]);
const y = d3.scaleLinear().domain([0, 90]).range([height, 0]);
const r = d3.scaleLinear().domain([200, 1400000000]).range([5, 25]);
const area = d3
  .scaleLinear()
  .domain([2000, 1400000000])
  .range([25 * Math.PI, 1500 * Math.PI]);
const color = d3.scaleOrdinal(d3.schemePastel1);

d3.json("data/data.json").then(function (data) {
  data = data.map((d) => {
    return {
      countries: d.countries.filter(
        (c) => c.income && c.life_exp && c.population
      ),
      year: d.year,
    };
  });

  color.domain(data[0].countries.map((d) => d.continent));

  let index = 0;
  d3.interval(() => {
    index = index < data.length - 1 ? index + 1 : 0;
    update(data[index]);
  }, 100);

  update(data[index]);
});

const update = (data) => {
  const chart = g.selectAll("circle").data(data.countries);

  chart.exit().remove();

  chart
    .attr("cx", (d) => x(d.income))
    .attr("cy", (d) => y(d.life_exp))
    .attr("r", (d) => r(d.population))
    .attr("fill", (d) => color(d.continent));

  chart
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.income))
    .attr("cy", (d) => y(d.life_exp))
    .attr("r", (d) => r(d.population))
    .attr("fill", (d) => color(d.continent))
    .attr("stroke", "gray");

  const xAxis = d3
    .axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format("$"));
  xAxisGroup
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 15)
    .attr("fill", "black")
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("GDP per capita ($)");

  const yAxis = d3.axisLeft(y);
  yAxisGroup
    .call(yAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .attr("fill", "black")
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Life expectancy (years)");

  year.text(data.year);
};
