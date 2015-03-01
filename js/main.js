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
	.rangeBands([0, height], 0.2, 0);

var color = d3.scale.ordinal()
//	.range(["#EEE", "#BDF", "#FCF", "#EEE"]);
	.range(["#BDF", "#FCF"]); // NEEDFIX must add 2 more columsn of data and then use 4 colors

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("top")
	.ticks(5, "%") // Not sure if this is right since it is 50/50 split NEEDFIX
	.tickSize(-height); // +/- No clue where this is going to end up... NEEDFIX

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

d3.csv('data/OECD_Labour_Force_Participation_Rate_by_Sex_2001-2012_Tabular_20150301b.csv',
	function(error, data) {
	var popData = data.filter(function(element) { return element.Year == year; } );
//	console.log(popData);

	color.domain(d3.keys(popData[0]).filter(function(key) {
		return (key !== "Country" && key !== "Year");
	}));

	popData.forEach(function(d, i) {
		var x0 = 0;
		d.sexes = color.domain().map(function(name) {
			return {
				name: name,
				x0: x0,
				x1: (x0 += +d[name]),
				y: i * y.rangeBand()
			};
		});
		d.total = d.sexes[d.sexes.length - 1].x1;
		console.log(d);
	});

	var OECDmidpoint = function(countryYear) {
		// Must change to 50 - and 50 + after adapting #s to 100% instead of 200% NEEDFIX
		// can also just use the unemployed value if that happens... NEEDFIX
		return (100 - countryYear.Male + 100 + countryYear.Female) / 2.0;
	}

	// to flip sorting order, reverse b and a on return or just change the sign
	popData.sort(function(a, b) { return OECDmidpoint(b) - OECDmidpoint(a); });

//	x.domain([0, d3.max(popData, function(d) { return d.total; })]);
	x.domain([0, 2]);
	y.domain(data.map(function(d) { return d.Country; }));

	OECDsvg.append("g")
		.attr("class", "x-axis")
		.call(xAxis)

	OECDsvg.append("g")
		.attr("class", "y-axis")
		.call(yAxis);

/*
	var countries = OECDsvg.selectAll(".countries")
		.data(popData, keys)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) { return "translate(0," + x(d.sexes.y) + ")"; });
*/

/*
	countries.selectAll("rect")
		.data(function(d) { return d.sexes; })
		.enter().append("rect")
		.attr("x", function(d) { return x(d.x1); })
//		.attr("y", function(d) { console.log(d); return y(d.Country);  })
		.attr("height", y.rangeBand())
//		.attr("width", function(d) { return x(d.x1) - x(d.x0); })
		.attr("width", function(d) { return x(d.x1) - x(d.x0); })
		.style("fill", function(d) { return color(d.name); });
*/

});
