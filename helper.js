function addAnnotationText(svg, x, y, fontsize, textColor, textLst) {
    let counter = 0;
    for (var text of textLst) {
      svg.append("text")
        .attr("x", x)
        .attr("y", y+(fontsize+2)*counter)
        .text(text)
        // .attr("transform", "translate(-2.5, -2.5)")
        .style("font-family", "Cabin")
        .style("text-anchor", "left")
        .style("font-size", fontsize)
        .style("fill", textColor);
        
      counter = counter + 1;
    }
}