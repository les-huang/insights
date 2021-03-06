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
        .curve(d3.curveStepAfter)
        // .curve(d3.curveMonotoneX)
    );

// add axis + labels
svg.append("g").call(d3.axisLeft(salesY).ticks(5))
    .attr("transform", "translate(" + (padding-10+offset) + ", 0)")
    .style("font-family", "Cabin")
    .style("font-size", 12)
    .select(".domain").remove();
svg.append("g").call(d3.axisBottom(priceX).ticks(5).tickFormat(d => ("$" + d + ".00")))
    .attr("transform", "translate(" + 0 + ","+(height-padding*1.5)+")")
    .style("font-family", "Cabin")
    .style("font-size", 12)
    .select(".domain").remove();
addAxisText(svg, offset+(width-padding*2)/2, height-padding/2, "Price of " + data.item, true);
addAxisText(svg, -1*((width-padding*2)/2)-offset*0.4, offset, "Avg Weekly Units Sold", false);


// add tooltip for seller's current price + median price
let sellerPrice = data.seller_current_price;
addLineChartToolTip(svg, "seller_tooltip", priceX(sellerPrice), salesY(0), salesY(extentSales[1])+padding, greenColor)
addAnnotationText(svg, "seller_tooltip", priceX(sellerPrice)+padding/2, salesY(extentSales[1])+padding*1.25, 12, "black",
    [
        "your price"
    ]);
console.log(data)
//salesY(getSalesFromPrice(sortedData, data.median_price))
addLineChartToolTip(svg, "median_tooltip", priceX(data.median_price), salesY(0), salesY(extentSales[1])-padding/2, "orange")
addAnnotationText(svg, "seller_tooltip", priceX(data.median_price)+padding/2, salesY(extentSales[1])-padding/4, 12, "black",
    [
        "median price"
    ], true);
    let dollar = Math.abs(data.seller_current_price - data.median_price).toFixed(2);
    let qual = (data.seller_current_price > data.median_price) ? "above" : "below";
addAnnotationText(svg, "seller_tooltip", svgWidth*0.73, height*0.13, 14, textColor,
    [
        "You are currently charging $"+  data.seller_current_price +" for ",
        data.item.toLowerCase() + " which is $" + dollar,
        qual + " the median for similar","businesses."
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
            .text(getSalesFromPrice(sortedData, price) + " units at $" + price)
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
