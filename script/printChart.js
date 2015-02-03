function printProjects(path) {
    var inner = "",i;

    $.getJSON(path, function(data) {
        for (i = 0; i < data.length; i++) {
            inner += '<tr><th>Project Prefix</th><td>' + data[0].prefix + '</td></tr>';
            inner += '<tr><th>Id</th><td>' + data[0].id + '</td></tr>';
            inner += '<tr><th>Priority</th><td>' + data[0].priority + '</td></tr>';
            inner += '<tr><th>Type</th><td>' + data[0].type + '</td></tr>';
            inner += '<tr><th>Summary</th><td>' + data[0].summary + '</td></tr>';
            inner += '<tr><th>Description</th><td>' + data[0].description + '</td></tr>';
            inner += '<tr><th>Assignee</th><td>' + data[0].assignee + '</td></tr>';
            inner += '<tr><th>Project Manager</th><td>' + data[0].projectManager + '</td></tr>';
            inner += '<tr><th>Complete Date</th><td>' + data[0].completeDate + '</td></tr></tbody>';
        }
        $(".infoProject").html(inner);
    });

}
function printBarChart(path, divId) {
    var margin, parseDate, x, y, xAxis, yAxis, svg;


    margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 450 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // Parse the date / time
    parseDate = d3.time.format("%Y-%m").parse;
    // axa x cu dreptunghiurile despartite la distanta de 09.
    x = d3.scale.ordinal().rangeRoundBands([0, width], .09);

    y = d3.scale.linear().range([height, 0]);

    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%Y-%m"));

    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(8);

    svg = d3.select(divId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    d3.csv(path, function(error, data) {

        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.value = +d.value;
        });


        x.domain(data.map(function(d) {
            return d.date;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.value;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 8)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Value vs people");

        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d) {
                return x(d.date);
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("height", function(d) {
                return height - y(d.value);
            });
    });


}


function printPieChart(rout, divId) {
    var width, height, radius, color, arc, pie, svg, donutWidth, legendRectSize, legendSpacing, g, legend;

    width = 450,
        height = 250,
        radius = Math.min(width, height) / 2;

    color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    donutWidth = 75;
    legendRectSize = 8;
    legendSpacing = 2;

    pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });

    svg = d3.select(divId).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    arc = d3.svg.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);


    d3.csv(rout, function(error, data) {

        data.forEach(function(d) {
            d.value = +d.value;
        });

        g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) {
                return color(d.data.date);
            });

        g.append("text")
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.date;
            });

        legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color);

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) {
                return d;
            });

    });
}

function printLineChart(rout, divId) {
    var margin, parseDate, x, y, xAxis, yAxis, valueline, svg;


    margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 450 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // Parse the date / time
    parseDate = d3.time.format("%Y-%m").parse;

    // Set the ranges
    x = d3.time.scale().range([0, width]);
    y = d3.scale.linear().range([height, 0]);

    // Define the axes
    xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(8);

    yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(8);

    // Define the line
    valueline = d3.svg.line()
        .x(function(d) {
            return x(d.date);
        })
        .y(function(d) {
            return y(d.value);
        });

    // Adds the svg canvas
    svg = d3.select(divId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv(rout, function(error, data) {
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.value = +d.value;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) {
            return d.date;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.value;
        })]);

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Worked hours");



    });

}