var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter").append("svg")
    .attr("width", svgWidth).attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then( data => {
    console.log(data);
    data.forEach( d => {
        d.income = +d.income;
        d.obesity = +d.obesity;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.income), d3.max(data, d => d.income)])
        .range([0, width]);
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.obesity), d3.max(data, d => d.obesity)])
        .range([height, 0]);
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
    chartGroup.append("g").call(leftAxis);

    var circlesGroup = chartGroup.selectAll("g")
        .data(data).enter().append("g").classed("circlesGroup", true);

    circlesGroup.append("circle")
        .attr("cx", d => xLinearScale(d.income)).attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "10").attr("fill", "skyblue").attr("opacity", "0.75");

    chartGroup.selectAll('.circlesGroup').append("text")
        .attr("x", d => xLinearScale(d.income)).attr("y", d => yLinearScale(d.obesity))
        .attr("text-anchor", "middle").attr("alignment-baseline", "middle")
        .attr("font-size", "10").attr("fill", "white").text(d => d.abbr);

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText").text("Income");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40).attr("x", 0 - (height / 2))
        .attr("dy", "1em").attr("class", "axisText").text("Obesity");
}).catch( error => {console.log(error)});