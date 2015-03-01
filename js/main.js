var years = new Array();
for (var i = 2001; i <= 2012; i += 1) {
	years.push(i);
}

var year = 2001;

var margin = {top: 20, right: 0, bottom: 0, left: 100},
	width = 700 - margin.left - margin.right,
	height = 450 - margin.top - margin.bottom;

var OECD = d3.select("figure#OECDfigure");

var x = d3.scale.linear()
	.range([0, width]);

var y = d3.scale.ordinal()
	.rangeBands([0, height], 0.2, 0);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(10, "%")
	.tickSize(-height);

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

var playAll = OECD.append("div")
	.attr("class", "play-button")
	.text("PLAY ALL YEARS"); // Remove when Pause is added.

var buttons = OECD.append("div")
	.attr("class", "yearsContainer")
	.selectAll("div").data(years)
	.enter().append("div")
	.text(function(d) { return d; })
	.attr("class", function(d) {
		if (d == year) {
			return "button selected";
		} else {
			return "button";
		}
	});

OECD.append("div")
	.attr("class", "clearfix");

OECD.append("div")
	.attr("class", "top-label year-label")
	.style("width", margin.left + "px")
	.append("p")
	.text("Country");

OECD.append("div")
	.attr("class", "top-label")
	.append("p")
	.text("Percentage of the Labour Force");

OECD.append("div")
	.attr("class", "clearfix");

d3.csv('data/OECD Labour Force Participation Rate by Sex 2001-2012 Linear 20150228a.csv',
	function(error, data) {
	});
