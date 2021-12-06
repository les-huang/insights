function drawPriceChart(svgClass) {
let height = 700;
let width = 800;
let padding = 50;

let fakeData = [
    {"price": 0, "sales": 0},
    {"price": 1, "sales": 30},
    {"price": 2, "sales": 130},
    {"price": 3, "sales": 240},
    {"price": 4, "sales": 330},
    {"price": 5, "sales": 280},
    {"price": 6, "sales": 260},
    {"price": 7, "sales": 170},
    {"price": 8, "sales": 150},
    {"price": 9, "sales": 30},
    {"price": 10, "sales": 10},
    {"price": 11, "sales": 0}
]

let svg = d3.select(svgClass);

let priceX = d3.scaleLinear()
    .domain([0,10])
    .range([padding, width-padding]);

let salesY = d3.scaleLinear()
    .domain([0, 400])
    .range([height-padding*2, padding*3]);

// draw main line chart
svg.append("path")
    .datum(fakeData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("fill", "#E7F1EF")
    .attr("d", d3.line()
        .x(function(d) { return priceX(d.price) })
        .y(function(d) { return salesY(d.sales) })
        .curve(d3.curveCatmullRom.alpha(0.5))
    );

// add axis
svg.append("g").call(d3.axisLeft(salesY).ticks(10))
    .attr("transform", "translate(" + (padding-10) + ", 0)")
    .style("font-family", "Cabin")
    .style("font-size", "12px")
    .select(".domain").remove();
svg.append("g").call(d3.axisBottom(priceX).ticks(10))
    .attr("transform", "translate(" + 0 + ","+(height-padding*2)+")")
    .style("font-family", "Cabin")
    .style("font-size", "12px")
    .select(".domain").remove();

// add tooltip for seller's current price
svg.append("line")
    .attr("x1", priceX(4))
    .attr("x2", priceX(4))
    .attr("y1", salesY(0))
    .attr("y2", salesY(fakeData[4].sales)+6)
    .style("stroke", "black")
    .style("stroke-width", 2)
    .style("opacity", 0.5);
svg.append("circle")
    .attr("r", 6)
    .attr("cx", priceX(4))
    .attr("cy", salesY(fakeData[4].sales))
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 2);

addAnnotationText(svg, priceX(4)+padding/2, salesY(fakeData[4].sales)-padding, 14, textColor, 
    [
        "You are currently charging",
        "$4 for xxx, which is $x.xx",
        "below the median for similar businesses."
    ]);
}