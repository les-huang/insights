function addAnnotationText(svg, id, x, y, fontsize, textColor, textLst, isAlignRight = false) {
    let counter = 0;
    for (var text of textLst) {
      svg.append("text")
        .attr("id", id)
        .attr("x", x-padding)
        .attr("y", y-padding+(fontsize+2)*counter)
        .text(text)
        // .attr("transform", "translate(-2.5, -2.5)")
        .style("font-family", "Cabin")
        .style("text-anchor", isAlignRight ? "start": "end")
        .style("font-size", fontsize)
        .style("fill", textColor);

      counter = counter + 1;
    }
}

function addAxisText(svg, x, y, text, isX) {
    svg.append("text")
    .attr("x", x)
    .attr("y", y)
    .text(text)
    .attr("transform", isX ? "translate(0,0)" : "rotate(-90)")
    .style("font-family", "Cabin")
    .style("text-anchor", "center")
    .style("font-weight", "bold")
    .style("font-size", 14);
}


function addLineChartToolTip(svg, id, x, y1, y2, lineColor = darkGreyColor) {
    svg.append("line")
        .attr("id", id)
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", y1)
        .attr("y2", y2+6)
        .style("stroke", lineColor)
        .style("stroke-width", 2)
        .style("opacity", 0.5);
    svg.append("circle")
        .attr("id", id)
        .attr("r", 6)
        .attr("cx", x)
        .attr("cy", y2)
        .style("stroke", lineColor)
        .style("fill", "none")
        .style("stroke-width", 2);
}
