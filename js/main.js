// Fill array with values for years 2001 to 2012
var years = new Array();
for (var i = 2000; i <= 2011; i += 1) {
	years.push(i);
}

// Set start year
var year = 2000;

var margin = {top: 0, right: 25, bottom: 0, left: 130},
	width = 750 - margin.left - margin.right,
	height = 650 - margin.top - margin.bottom;

var OECD = d3.select("figure#OECDfigure");

var x = d3.scale.linear()
	.range([0, width]);

var y = d3.scale.ordinal()
	.rangeRoundBands([0, height], 0.2, 0);

var color = d3.scale.ordinal()
	.range(["#FFF", "#BDF", "#FCF", "#FFF"]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("top")
	.ticks(10)
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

var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-2, 0])
	.html(function(d) {
		if (d.name == 'fRight' || d.name == 'mLeft') {
			return '<span style="display: none;"></span>';
		} else {
			return "<strong>" + d.name + ": " + (+d.x1 - +d.x0).toFixed(1) + "%</strong>";
		}
	});

OECD.append("div")
	.attr("class", "clearfix");

OECD.append("div")
	.attr("class", "top-label year-label")
	.style("width", margin.left + "px")
	.append("p");
//	.text("Country");

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

OECDsvg.call(tip);

d3.csv('data/OECD_Proportion_of_Emloyed_Persons_with_Managerial_Responsibilities_by_Sex_2000-2011b.csv',
	function(error, data) {
	var popData = data.filter(function(element) { return element.Year == year; })
		.sort(function(a, b) { return (+b.Male + +b.Female) - (+a.Male + +a.Female); });

	color.domain(d3.keys(popData[0]).filter(function(key) {
		return (key !== "Country" && key !== "Year");
	}));

	var calcPoints = function(data) {
		data.forEach(function(d, i) {
			var x0 = 0;
			d.sexes = color.domain().map(function(name) {
//				console.log(i);
				return {
					name: name,
					x0: x0,
					x1: (x0 += +d[name])
				};
			});
			d.total = d.sexes[d.sexes.length - 1].x1;
//			console.log(d);
		});
	};

	calcPoints(popData);

	x.domain([0, 50]);
	y.domain(popData.map(function(d) { return d.Country; }));

	var countries = OECDsvg.selectAll("g.countries")
		.data(popData)
		.enter().append("g")
		.attr("class", "countries")
		.attr("id", function(d) { return "c" + d.Country.replace(" ",""); })
		.attr("transform", function(d) { return "translate(0," + y(d.Country) + ")"; });

	var bars = countries.selectAll("rect")
		.data(function(d) { return d.sexes; })
		.enter().append("rect")
		.attr("class", function(d) { return d.name; })
		.attr("x", function(d) { return x(d.x0); })
		.attr("height", y.rangeBand())
		.attr("width", function(d) { return x(d.x1) - x(d.x0); })
		.style("fill", function(d) { return color(d.name); })


		bars.filter(function(element) { return !(element.name == 'fRight' || element.name == 'mLeft'); })
			.on("mouseover", tip.show)
			.on("mouseout", tip.hide);

/*
	var xAxisCall = OECDsvg.append("g")
		.attr("class", "x-axis")
		.call(xAxis)
*/

	var yAxisCall = OECDsvg.append("g")
		.attr("class", "y-axis")
		.call(yAxis);

	buttons.on("click", function(d) {
		update(d);
		cyclePause();
	});

	var playInterval;

	var cyclePause = function() {
		clearInterval(playInterval);
		playAll.text("PLAY ALL YEARS");
		playAll.on("click", function() { cyclePlay(); });
	};

	cyclePause();

	var cyclePlay = function() {
		clearInterval(playInterval);

		var i = 0;
		waitTime = 1200;

		playInterval = setInterval(function () {
			playAll.text("PAUSE");
			playAll.on("click", function() { cyclePause(); });

			update(years[i]);

			i++;

			if (i > years.length - 1) {
				cyclePause();
			}
		}, waitTime);
	}

	var update = function(updateYear) {
		d3.select("div.yearsContainer > div.selected").classed("selected", false);

		buttons.filter(function(d) { return d == updateYear; })
			.classed("selected", true);

		popData = data.filter(function(element) { return element.Year == updateYear; })
			.sort(function(a, b) { return (+b.Male + +b.Female) - (+a.Male + +a.Female); });

		calcPoints(popData);

		y.domain(popData.map(function(d) { return d.Country; }));

		countries.data(popData)
			.attr("id", function(d) { return "c" + d.Country.replace(" ",""); })
			.attr("transform", function(d) { return "translate(0," + y(d.Country) + ")"; });

		bars.data(function(d) { return d.sexes; })
			.transition()
			.delay(250)
			.duration(600)
			.attr("class", function(d) { return d.name; })
			.attr("x", function(d) { return x(d.x0); })
			.attr("height", y.rangeBand())
			.attr("width", function(d) { return x(d.x1) - x(d.x0); })
			.style("fill", function(d) { return color(d.name); });

		yAxisCall.transition().delay(250).duration(600).call(yAxis);
	};
});
