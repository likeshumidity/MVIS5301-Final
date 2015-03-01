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
	.ticks(10, "%") // Not sure if this is right since it is 50/50 split NEEDFIX
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

	var OECDmidpointCompare = function(a, b) {
		// Must change to 50 - and 50 + after adapting #s to 100% instead of 200% NEEDFIX
		// can also just use the unemployed value if that happens... NEEDFIX
		if (+a < +b) {
			return -1;
		} else if (+a > +b) {
			return 1;
		} else if (+a == +b) {
			return 0;
		} else {
			return NaN;
		}

		return mp;
	}

	var OECDmidpoint = function(m, f) {
		// Must change to 50 - and 50 + after adapting #s to 100% instead of 200% NEEDFIX
		// can also just use the unemployed value if that happens... NEEDFIX
		mp = (100 - +m + 100 + +f) / 2.0;

		return mp;
	}

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
		d.midpoint = OECDmidpoint(d.Male, d.Female);
		d.total = d.sexes[d.sexes.length - 1].x1;
		console.log(d);
	});

	// to flip sorting order, reverse b and a on return or just change the sign
//	popData.sort(function(a, b) { return b.order - a.order; });
//	popData.sort(function(a, b) { return OECDmidpointCompare(a.midpoint, b.midpoint); });

	x.domain([0, 2]); //NEEDFIX... change to 0, 1 after converted to 100% scale or -100 to 100
	y.domain(data.map(function(d) { return d.Country; }));

	var countries = OECDsvg.selectAll("g.countries")
		.sort(function(a, b) { return OECDmidpointCompare(a.midpoint, b.midpoint); })
		.data(popData, keys)
		.enter().append("g")
		.attr("class", "countries")
		.attr("id", function(d) { return "c" + d.Country.replace(" ",""); })
		.attr("transform", function(d) { return "translate(0," + y(d.Country) + ")"; });
//		.attr("transform", function(d) { return "translate(0,15)"; });

	countries.selectAll("rect")
		.data(function(d) { return d.sexes; })
		.enter().append("rect")
		.attr("x", function(d) { return x(d.x0); })
//		.attr("y", function(d) { console.log(d); return y(d.Country);  })
		.attr("height", y.rangeBand())
		.attr("width", function(d) { return x(d.x1) - x(d.x0); })
		.style("fill", function(d) { return color(d.name); });

	OECDsvg.append("g")
		.attr("class", "x-axis")
		.call(xAxis)

	OECDsvg.append("g")
		.attr("class", "y-axis")
		.call(yAxis);

});
