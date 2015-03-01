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

var color = d3.scale.ordinal()
	.range(["#EEE", "#BDF", "#FCF", "#EEE"]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(10, "%") // Not sure if this is right since it is 50/50 split NEEDFIX
	.tickSize(-height); // No clue where this is going to end up... NEEDFIX

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

var playAll = OECD.append("div")
	.attr("class", "play-button")
	.text("PLAY ALL YEARS"); // Remove when Pause is added. NEEDFIX

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

var OECDsvg = OECD.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv('data/OECD_Labour_Force_Participation_Rate_by_Sex_2001-2012_Tabular_20150301a.csv',
	function(error, data) {
		var popData = data.filter(function(element) { return element.Year == year; } );
		console.log(popData);

//		console.log(d3.keys(data[0]).filter(function(key) { return key !== "Country"; }));
		color.domain(d3.keys(popData[0]).filter(function(key) { return key !== "Country"; }));

		popData.forEach(function(d) {
			var y0 = 0;
			d.sexes = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
			d.total = d.sexes[d.sexes.length - 1].y1;
			console.log(d);
		});

//		data.sort(function(a
	});
