function drawPriceChart(svgClass, data) {
let height = 500;
let svgWidth = 700;
let offset = 150;
let width = svgWidth-offset;
let padding = 50;

let svg = d3.select(svgClass);

let extentPrice = d3.extent(data.distribution, function (d) { return d.price});
let extentSales = d3.extent(data.distribution, function (d) { return d.sales});

let priceX = d3.scaleLinear()
    .domain([0, extentPrice[1]+1])
    .range([padding+offset, svgWidth-padding]);

let salesY = d3.scaleLinear()
    .domain([0, extentSales[1]])
    .range([height-padding*1.5, padding*2]);

// pad data so that the line chart starts and ends at 0
let sortedData = (data.distribution).sort(function(a, b) {return a.price - b.price});
sortedData.unshift({"price": d3.max([sortedData[0].price - 1, 0]), "sales": 0});
sortedData.push({"price": (sortedData[sortedData.length - 1].price + 1), "sales": 0})

// draw main line chart
svg.append("path")
    .datum(sortedData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("fill", "#E7F1EF")
    .attr("d", d3.line()
        .x(function(d) { return priceX(d.price) })
        .y(function(d) { return salesY(d.sales) })
        .curve(d3.curveCatmullRom.alpha(0.5))
    );

// add axis + labels
svg.append("g").call(d3.axisLeft(salesY).ticks(5))
    .attr("transform", "translate(" + (padding-10+offset) + ", 0)")
    .style("font-family", "Cabin")
    .style("font-size", 12)
    .select(".domain").remove();
svg.append("g").call(d3.axisBottom(priceX).ticks(5).tickFormat(d => ("$" + String(d).charAt(0) + ".00")))
    .attr("transform", "translate(" + 0 + ","+(height-padding*1.5)+")")
    .style("font-family", "Cabin")
    .style("font-size", 12)
    .select(".domain").remove();
addAxisText(svg, offset+(width-padding*2)/2, height-padding/2, "Price of " + data.item, true);
addAxisText(svg, -1*((width-padding*2)/2)-offset/2, offset, "Transactions", false);


// add tooltip for seller's current price + median price
// addLineChartToolTip(svg, "seller_tooltip", priceX(3), salesY(0), salesY(fakeData[3].sales))
// addAnnotationText(svg, "seller_tooltip", priceX(3)+padding/2, salesY(fakeData[3].sales)+padding/4, 14, textColor,
//     [
//         "your current price"
//     ]);
addLineChartToolTip(svg, "median_tooltip", priceX(data.median_price), salesY(0), salesY(getSalesFromPrice(sortedData, data.median_price)), "orange")
addAnnotationText(svg, "seller_tooltip", priceX(data.median_price)+padding/2, salesY(getSalesFromPrice(sortedData, data.median_price))+padding/4, 14, textColor,
    [
        "median price"
    ], true);
addAnnotationText(svg, "seller_tooltip", svgWidth*0.73, height*0.13, 12, textColor,
    [
        "You are currently charging $x.xx for ",
        data.item.toLowerCase() + " which is $x.xx",
        "below the median for similar businesses."
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
    .datum(sortedData)
    .attr("x", padding+offset)
    .attr("y", padding*2)
    .attr("width", width-padding)
    .attr("height", height-padding*3.5)
    .style("opacity", 0)
    .on("mousemove", function(d) {
        let price = getXFromEvent(d3.pointer(d)[0], sortedData, priceX);
        circle.attr("transform", "translate("+ priceX(price) +","+ salesY(getSalesFromPrice(sortedData, price)) +")")
            .style("opacity", 1);
        circleText.attr("x", priceX(price))
            .attr("y", salesY(getSalesFromPrice(sortedData, price))-15)
            .text(getSalesFromPrice(sortedData, price) + " sales")
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

function getXFromEvent(eventX, sortedData, priceX) {
    let list = [];
    for (var i = 0; i < sortedData.length; i++) {
        let temp = sortedData[i];
        list.push({"v": temp.price, "pxloc": priceX(temp.price)});
    }
    let price = 0;
    list.reduce((a, b) => {
        var isLarger = Math.abs(b["pxloc"] - eventX) < Math.abs(a["pxloc"] - eventX);

        if (isLarger) {
        price = b["v"];
        return b;
        }

        price = a["v"];
        return a;
    });
    return Number(price);
}

function getSalesFromPrice(data, price) {
    for (var d of data) {
        if (price == d.price) {
            return d.sales;
        }
    }
    return 0;
}
