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
addLineChartToolTip(svg, "seller_tooltip", priceX(3), salesY(0), salesY(fakeData[3].sales))
addLineChartToolTip(svg, "median_tooltip", priceX(5), salesY(0), salesY(fakeData[5].sales), "orange")


addAnnotationText(svg, "seller_tooltip", priceX(3)+padding/2, salesY(fakeData[3].sales)+padding/4, 14, textColor,
    [
        "your current price"
    ]);
addAnnotationText(svg, "seller_tooltip", priceX(5)+padding/2, salesY(fakeData[5].sales)+padding/4, 14, textColor,
    [
        "median price"
    ], true);
addAnnotationText(svg, "seller_tooltip", priceX(8), 225, 14, textColor,
    [
        "You are currently charging $4 for xxx",
        "which is $x.xx below the median for",
        "similar businesses."
    ], true);

// overlay for mouseover
let circle = svg.append("circle")
    .attr("r", 6)
    .style("opacity", 0)
    .style("fill", "none")
    .style("stroke", darkGreyColor)
    .style("stroke-width", 2);
let circleText = svg.append("text")
    .style("font-family", "Cabin")
    .style("font-weight", "bold")
    .style("opacity", 1)
    .style("font-size", 12);
svg.append("rect")
    .datum(fakeData)
    .attr("x", padding)
    .attr("y", padding*3)
    .attr("width", width-padding)
    .attr("height", height-padding*5)
    .style("opacity", 0)
    .on("mousemove", function(d) {
    let price = getXFromEvent(d3.pointer(d)[0]);
    circle.attr("transform", "translate("+ priceX(price) +","+ salesY(fakeData[price].sales) +")")
        .style("opacity", 1);
    circleText.attr("x", priceX(price))
        .attr("y", salesY(fakeData[price].sales)-15)
        .text((fakeData[price].sales) + " sales")
        .style("opacity", 1)
        .style("font-family", "Cabin")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("font-size", 14);
    })
    .on("mouseout", function() {
    circle.style("opacity", 0)
    circleText.style("opacity", 0);
    });
}

function getXFromEvent(eventX) {
    let svgWidth = 800;
    let segmentSize = (svgWidth-padding)/10; // range
    let list = [];
    let counter = 0;
    for (var i = padding; i<= svgWidth-padding; i+=segmentSize) {
        list.push({"price": counter, "pxloc": i});
        counter++;
    }
    let price = 0;
    list.reduce((a, b) => {
        var isLarger = Math.abs(b["pxloc"] - eventX) < Math.abs(a["pxloc"] - eventX);

        if (isLarger) {
        price = b["price"];
        return b;
        }

        price = a["price"];
        return a;
    });
    return Number(price);
}
