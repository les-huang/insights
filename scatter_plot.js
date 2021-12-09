function drawScatterPlot(svgClass, data) {
    let svg = d3.select(svgClass);
    let width = 600;
    let height = 600;

    // let extentPrice = d3.extent(data.distribution, function (d) { return d.price});
    // let extentSales = d3.extent(data.distribution, function (d) { return d.sales});

    let x = d3.scaleLinear()
        // .domain([0, extentPrice[1]+1])
        .domain([0, 100])
        .range([padding*3, width-padding]);

    let offset = 150;
    let y = d3.scaleLinear()
        .domain([0, 1000])
        // .domain([0, extentSales[1]])
        .range([height-padding*2, padding*2+offset]);

    // draw main circles
    svg.selectAll("dots")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 6)
            .style("fill", allNighterColor)
            .style("opacity", 0.8)
            .style("stroke", "none")
            .style("stroke-width", 2)
            .on("mouseover", function() {
                d3.select(this)
                    .attr("r", 8)
                    .style("stroke", textColor);
                addCrossHair(svg, x(0), this.getAttribute("cx"), y(0), this.getAttribute("cy"))
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("r", 6)
                    .style("stroke", "none");
                d3.selectAll(".crosshair").remove();
            });

    // add axis + labels
    svg.append("g").call(d3.axisLeft(y).ticks(5))
        .attr("transform", "translate(" + (padding*3) + ", 0)")
        .style("font-family", "Cabin")
        .style("font-size", 12)
        .select(".domain").remove();
    svg.append("g").call(d3.axisBottom(x).ticks(5).tickFormat(d => (String(d) + "%")))
        .attr("transform", "translate(" + 0 + ","+(height-padding*2)+")")
        .style("font-family", "Cabin")
        .style("font-size", 12)
        .select(".domain").remove();
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
