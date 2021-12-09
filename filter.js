function addFilters(svgClass, data, selectedItem) {
    let svg = d3.select(svgClass);
    let width = 150;
    let rectHeight = 40;

    // display list of items for selected category
    let itemLst = data;
    var counter = 0;
    for (var item of itemLst) {
        let itemName = item.replace(/\s/g, '');
        svg.append("rect")
            .attr("class", "filter")
            .attr("id", "rect_"+itemName)
            .attr("item", itemName)
            .attr("full_item", item)
            .attr("x", padding/2)
            .attr("y", (padding*4)+counter*(10+rectHeight))
            .attr("width", width-padding*1.5)
            .attr("height", rectHeight)
            .style("stroke", "#cdcdcd")
            .style("fill", () => (selectedItem == itemName) ? "#cdcdcd" : "none")
            .style("stroke-width", 2)
            .style("cursor", "pointer")
            .on("mouseover", function(d) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .style("fill", "#cdcdcd");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .style("fill", () => (selectedItem === this.getAttribute("item")) ? "#cdcdcd" : "none");
            })
            .on("click", function() {
                let item = this.getAttribute("full_item");
                let temp = this.getAttribute("item");

                // remake filters + line chart
                changeFilters(item).then(function(newData) {
                    d3.select(".priceDistVis").selectAll("*").remove();
                    drawPriceChart(".priceDistVis", newData);
                    addFilters(".priceDistVis", data, temp);
                });

                // swap selected button color
                d3.select("#rect_" + selectedItem)
                    .transition()
                    .duration(500)
                    .style("fill", "none");
                d3.select(this)
                    .transition()
                    .duration(500)
                    .style("fill", "#cdcdcd");
                selectedItem = temp;

            });
        svg.append("text")
            .attr("class", "filter")
            .attr("id", "filter_"+itemName)
            .attr("item", itemName)
            .attr("full_item", item)
            .attr("x", (padding/4)+(width-padding)/2)
            .attr("y", (padding*4)+(rectHeight/2)+counter*(10+rectHeight))
            .text(item)
            .style("font-family", "Cabin")
            .style("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .style("font-size", 12)
            .style("cursor", "pointer")
            .on("mouseover", function(d) {
                d3.select("#rect_"+this.getAttribute("item"))
                    .transition()
                    .duration(500)
                    .style("fill", "#cdcdcd")
            })
            .on("mouseout", function() {
                d3.select("#rect_"+this.getAttribute("item"))
                    .transition()
                    .duration(500)
                    .style("fill", "none");
            })
            .on("click", function() {
                let item = this.getAttribute("full_item");
                let temp = this.getAttribute("item");

                // remake filters + line chart
                changeFilters(item).then(function(newData) {
                    d3.select(".priceDistVis").selectAll("*").remove();
                    drawPriceChart(".priceDistVis", newData);
                    addFilters(".priceDistVis", data, temp);
                });

                // swap selected button color
                d3.select("#rect_" + selectedItem)
                    .transition()
                    .duration(500)
                    .style("fill", "none");
                d3.select("#rect_" + temp)
                    .transition()
                    .duration(500)
                    .style("fill", "#cdcdcd");
                selectedItem = temp;

            });

        counter++;
    }
}
