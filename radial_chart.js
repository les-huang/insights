function drawRadialChart(svgClass) {
    let svg = d3.select(svgClass);

    let innerRadius = 70;
    let center = 150;
    let outerRadius = 250;

    let centerX = 800/2;
    let centerY = 700/2;

    let data = [
        {"month": 1, "sales": 30},
        {"month": 2, "sales": 130},
        {"month": 3, "sales": 240},
        {"month": 4, "sales": 190},
        {"month": 5, "sales": 90},
        {"month": 6, "sales": 200},
        {"month": 7, "sales": 570},
        {"month": 8, "sales": 350},
        {"month": 9, "sales": 230},
        {"month": 10, "sales": 110},
        {"month": 11, "sales": 10},
        {"month": 12, "sales": 20},
        {"month": 13, "sales": 30},
    ];

    let discountData = [
        {"month": 1, "sales": 50},
        {"month": 2, "sales": 210},
        {"month": 3, "sales": 200},
        {"month": 4, "sales": 260},
        {"month": 5, "sales": 330},
        {"month": 6, "sales": 200},
        {"month": 7, "sales": 600},
        {"month": 8, "sales": 450},
        {"month": 9, "sales": 230},
        {"month": 10, "sales": 200},
        {"month": 11, "sales": 110},
        {"month": 12, "sales": 80},
        {"month": 13, "sales": 50},
    ];

    let x = d3.scaleLinear()
        .domain([1,13])
        .range([0, 2 * Math.PI]);

    let extent = d3.extent(data.flat(), (d) => { return Number(d.sales)})

    let y = d3.scaleLinear()
        .domain([0, extent[1]])
        .range([innerRadius, outerRadius]);

    let xByDay = d3.lineRadial()
        .angle(function(d) {
            return d["month"]/12*(2*Math.PI);
        })
        .radius(function(d) {
            return y(d["sales"]);
        });

    let mainG = svg.append("g").attr("transform", "translate("+centerX+","+centerY+")");

    let area = d3.radialArea()
        .angle(function(d) {
        return x(d.month);
        })
        .curve(d3.curveCatmullRom.alpha(1))
        .innerRadius(y(0))
        .outerRadius(function(d) {
        return y(Number(d.sales));
        });

    let radLine = d3.lineRadial()
        .angle(function(d) {
        return x(d.month);
        })
        .curve(d3.curveCatmullRom.alpha(1))
        .radius(function(d) {
        return y(Number(d.sales));
        });

    // draw radial axis for donut vis
    let xAxis = mainG.append("g");
    var xTick = xAxis
        .selectAll("g")
        .data(x.ticks(12))
        .enter().append("g")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
            return "rotate(" + ((x(d)) * 180 / Math.PI - 90) + ")translate(" + (innerRadius-5) + ",0)";
            });
    xTick.append("line")
        .attr("x2", -5)
        .attr("stroke", "#000")
        .attr("opacity", 0.8);
    xTick.append("text")
        .attr("transform", function(d) {
            var angle = x(d);
            return ((angle < Math.PI / 2) || (angle > (Math.PI * 3 / 2))) ? "rotate(90)translate(0,17)" : "rotate(-90)translate(0, -10)"; })
        .text((d) => {return (d != 13) ? formatMonth(d) : ""})
        .style("font-family", "Cabin")
        .style("font-size", 10)
        .attr("opacity", 0.5);

    // draw main circle blob
    mainG.datum(data)
        .append("path")
        .attr("class", "mainArea")
        .attr("fill", allNighterColor)
        .attr("fill-opacity", 0.5)
        .attr("d", (d) => area(d));
    mainG.datum(discountData)
        .append("path")
        .attr("class", "discountLine")
        .attr("d", (d) => radLine(d))
        .style("stroke", greenColor)
        .style("stroke-width", 2)
        .style("fill", "none");

    //draw concentric circles for yaxis
    var counterRing = 0;
    for (var i = innerRadius; i < outerRadius; i+=50) {
        mainG.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", i)
            .style("fill", "none")
            .style("stroke", "grey")
            .style("stroke-width", 1.5)
            .style("opacity", 0.1);
        mainG.append("text")
            .attr("x", -1*i)
            .attr("y", 0)
            .text(((extent[1]/5)*(counterRing)).toFixed(0))
            .attr("transform", "translate(-2.5, -2.5)")
            .style("font-family", "Cabin")
            .style("font-size", 10)
            .style("opacity", 0.5)
            .style("text-anchor", "end");
        counterRing = counterRing + 1;
    }
    // add label for y axis
    mainG.append("text")
        .attr("x", -1*outerRadius)
        .attr("y", 0)
        .text("sales")
        .attr("transform", "translate(-2.5, -2.5)")
        .style("font-family", "Cabin")
        .style("font-size", 10)
        .style("opacity", 0.5)
        .style("text-anchor", "end")
        .style("background", "white")
        .style("font-weight", "bold");

    // annotations
    addAnnotation(svg, centerX, centerY, xByDay, 4, discountData[4].sales, true, [
        "may is the best time",
        "to apply discounts to your pricing"
    ], "orange", true)
}

function createFakePieData() {
    return {"Jan": 1, "Feb": 1, "Mar": 1, "Apr": 1, "May": 1, "Jun": 1,"July": 1,
        "Aug": 1, "Sep": 1, "Oct": 1, "Nov": 1, "Dec": 1 };
}

function formatMonth(num) {
    let arr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return arr[num-1];
}

function addAnnotation(svg, centerX, centerY, xByDay, month, sales, isEvent, textLst, textColor, isEnd) {
    let xy = xByDay([{"month": month, "sales": sales}]).slice(1).slice(0, -1);
    let xy1 = xByDay([{"month": month, "sales": sales+225}]).slice(1).slice(0, -1);
    let xy15 = xByDay([{"month": month, "sales": sales}]).slice(1).slice(0, -1);
    let xy2 = xByDay([{"month": month, "sales": 0}]).slice(1).slice(0, -1);

    // add circle annotation
    svg.append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", isEvent ? 3 : 6)
      .attr("transform", function() {
        return "translate(" + xy + ")";
      })
      .style("fill", isEvent ? "black" : "none")
      .style("stroke", "black")
      .style("stroke-width", 1.5)
      .style("opacity", 1);

    // add line annotation
    svg.append("line")
      .attr("x1", isEvent ? xy15.split(",")[0] : xy1.split(",")[0])
      .attr("x2", xy2.split(",")[0])
      .attr("y1", isEvent ? xy15.split(",")[1] : xy1.split(",")[1])
      .attr("y2", xy2.split(",")[1])
      .attr("transform", function() {
        return "translate("+centerX+","+centerY+")";
      })
      .style("stroke", "black")
      .style("stroke-width", 1.5)
      .style("opacity", 1);

    let xOffset = isEnd ? -15 : 15;
    addAnnotationText(svg, "radial_tooltip", Number(xy1.split(",")[0])+centerX+xOffset, Number(xy1.split(",")[1])+centerY, 14, "black", textLst, isEnd);
  }
