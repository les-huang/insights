function drawScatterPlot(svgClass, data) {
    let svg = d3.select(svgClass);
    let width = 600;
    let height = 600;

    let extentRepeat = d3.extent(data.distribution, function (d) { return d.repeat_customer});
    let extentRevenue = d3.extent(data.distribution, function (d) { return Number(d.revenue)});

    let x = d3.scaleLinear()
        .domain([0, 1])
        .range([padding*3, width-padding]);

    let offset = 150;
    let yRepeat = d3.scaleSymlog()
        .domain([0, extentRepeat[1]])
        .range([height-padding*2, padding*2+offset]);
    let yRevenue = d3.scaleSymlog()
        .domain([0, extentRevenue[1]])
        .range([height-padding*2, padding*2+offset]);

    // draw main circles
    addDots(svg, data, x, yRepeat, yRevenue);

    // add axis + labels
    svg.append("g").call(d3.axisLeft(yRepeat)) //.ticks(5).tickFormat(d => d/1000)
        .attr("transform", "translate(" + (padding*3) + ", 0)")
        .style("font-family", "Cabin")
        .style("font-size", 12)
        .select(".domain").remove();
    svg.append("g").call(d3.axisBottom(x).ticks(5).tickFormat(d => (String(d*100) + "%")))
        .attr("transform", "translate(" + 0 + ","+(height-padding*2)+")")
        .style("font-family", "Cabin")
        .style("font-size", 12)
        .select(".domain").remove();

    // add legend
    addLegendFilter(svg, width*0.8, 150, [
        {"name": "Repeated Customers", "y": yRepeat},
        {"name": "Weekly Revenue", "y": yRevenue}
    ], data, x, yRepeat, yRevenue);
}

function addCrossHair(svg, x1, x2, y1, y2) {
    svg.append("line")
        .attr("class", "crosshair")
        .attr("x1", x1)
        .attr("x2", x2-6)
        .attr("y1", y2)
        .attr("y2", y2)
        .style("stroke-width", 2)
        .style("stroke", textColor)
        .style("stroke-dasharray", ("5, 3"));
    svg.append("line")
        .attr("class", "crosshair")
        .attr("x1", x2)
        .attr("x2", x2)
        .attr("y1", y1)
        .attr("y2", Number(y2)+10)
        .style("stroke-width", 2)
        .style("stroke", textColor)
        .style("stroke-dasharray", ("5, 3"))
}

function addLegendFilter(svg, x, y, data, fullData, xFunc, yRepeat, yRevenue) {
    let counter = 0;
    for (var r of data) {
        svg.append("circle")
          .attr("class", "legend_button")
          .attr("cx", x)
          .attr("cy", y+20*counter)
          .attr("r", 7)
          .attr("index", counter)
          .style("fill", "#fbfbfb")
          .style("stroke", darkGreyColor)
          .style("stroke-width", 2)
          .style("cursor", "pointer")
          .on("click", function(d) {
            // change button color
            d3.selectAll(".legend_button")
              .style("fill", "#fbfbfb")
                .style("opacity", 1);
            d3.select(this).transition()
                .duration(700)
                .style("fill", greenColor)
                .style("opacity", 0.7);

            d3.selectAll("#dots").remove();
            addDots(svg, fullData, xFunc, yRepeat, yRevenue, false);
          });
        svg.append("text")
          .attr("x", x + 15)
          .attr("y", y+20*counter)
          .text(r.name)
          .style("alignment-baseline", "middle")
          .style("font-family", "Cabin")
          .style("font-size", 12)
          .style("fill", textColor);

        counter++;
    }
}

function addDots(svg, data, x, yRepeat, yRevenue, isRepeat = true) {
    svg.selectAll("dots")
    .data(data.distribution)
    .enter()
    .append("circle")
        .attr("id", "dots")
        .attr("cx", d => x(d.discount_percentage))
        .attr("cy", d => (isRepeat) ? yRepeat(Number(d.repeat_customer)) : yRevenue(d.revenue))
        .attr("r", 6)
        .style("fill", allNighterColor)
        .style("opacity", 0.8)
        .style("stroke", "none")
        .style("stroke-width", 2)
        .on("mouseover", function() {
            d3.select(this)
                .attr("r", 8)
                .style("stroke", textColor);
            addCrossHair(svg, x(0), this.getAttribute("cx"), yRepeat(0), this.getAttribute("cy"));

        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("r", 6)
                .style("stroke", "none");
            d3.selectAll(".crosshair").remove();
    });
}
