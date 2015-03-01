var years = new Array();
for (var i = 2001; i <= 2012; i += 1) {
	years.push(i);
}

var year = 2001;

var margin = {top: 20, right: 25, bottom: 0, left: 130},
	width = 750 - margin.left - margin.right,
	height = 650 - margin.top - margin.bottom;

var OECD = d3.select("figure#OECDfigure");

var x = d3.scale.linear()
	.range([0, width]);

var y = d3.scale.ordinal()
	.rangeRoundBands([0, height], 0.2, 0);

var color = d3.scale.ordinal()
	.range(["#BDF", "#FCF"]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("top")
	.ticks(10, "%")
	.tickSize(-height);

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

var keys = function(d) {
	return d.Country;
}

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

d3.csv('data/OECD_Labour_Force_Participation_Rate_by_Sex_2001-2012_Tabular_20150301c.csv',
	function(error, data) {
	var popData = data.filter(function(element) { return element.Year == year; } )
		.sort(function(a, b) { return +b.Male - +a.Male; });

	color.domain(d3.keys(popData[0]).filter(function(key) {
		return (key !== "Country" && key !== "Year");
	}));

	popData.forEach(function(d, i) {
		var x0 = 0;
		d.sexes = color.domain().map(function(name) {
			console.log(i);
			return {
				name: name,
				x0: x0,
				x1: (x0 += +d[name])
			};
		});
		d.total = d.sexes[d.sexes.length - 1].x1;
		console.log(d);
	});

//	x.domain([0, d3.max(data, function(element) { return element.Year == year; })]);
	y.domain(data.map(function(d) { return keys(d); }));

	var countries = OECDsvg.selectAll("g.countries")
		.data(popData, keys)
		.enter().append("g")
		.attr("class", "countries")
		.attr("id", function(d) { return "c" + d.Country.replace(" ",""); })
		.attr("transform", function(d) { return "translate(0," + y(d.Country) + ")"; });

	var bars = countries.selectAll("rect")
		.data(function(d) { return d.sexes; })
		.enter().append("rect")
		.attr("x", function(d) { return x(d.x0); })
		.attr("height", y.rangeBand())
		.attr("width", function(d) { return x(d.x1) - x(d.x0); })
		.style("fill", function(d) { return color(d.name); });

	OECDsvg.append("g")
		.attr("class", "x-axis")
		.call(xAxis)

	OECDsvg.append("g")
		.attr("class", "y-axis")
		.call(yAxis);

	buttons.on("click", function(d) {
		update(d);
	});

	var update = function(updateYear) {
		d3.select(".selected").classed("selected", false);

		buttons.filter(function(d) { return d == updateYear; })
			.classed("selected", true);

		popData = data.filter(function(element) { return element.Year == updateYear; });

		bars.data(popData, keys)
			.transition()
			.delay(250)
			.duration(500)
			.attr("width", function(d) { return x(d.x1) - x(d.x0); })
			.attr("x", function(d) { return x(d.x0); });
	};
});
