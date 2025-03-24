import * as d3 from "d3";

export let drawBarChart = (barChartLayer, data, xScale, yScale, barChartWidth, barChartHeight) => {

    //Task 7: Complete the code to draw the bars
    //Hint:
    //1. The bars are drawn as rectangles
    //2. Add a mouseover event to the bar
    //3. The mouseover event should also highlight the corresponding points in the scatter plot
    //4. The mouseout event should remove the highlight from the corresponding points in the scatter plot 
    //5. You can refer to the code in the drawScatterPlot function 

    //Task 8: Connect the bar chart with the scatter plot
    //Hint:
    //1. Add a mouseover event to the bar
    //2. The mouseover event should also highlight the corresponding points in the scatter plot

    // Create tooltip for bar chart
    let tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("position", "absolute");

    // Draw the bars
    barChartLayer.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', d => `bar ${d.station.replace(/[^a-zA-Z]/g, "")}`)
        .attr('x', d => xScale(d.station))
        .attr('y', d => yScale(d.start))
        .attr('width', xScale.bandwidth())
        .attr('height', d => barChartHeight - yScale(d.start))
        .style('fill', '#69b3a2')
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .on('mouseover', (event, d) => {
            d3.select(event.currentTarget)
                .style('fill', 'red')
                .raise();

            tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);
            tooltip.html(`Station: ${d.station}<br/>Start Trips: ${d.start}<br/>End Trips: ${d.end}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');

            barChartLayer.append('rect')
                .attr('class', 'highlight-rect')
                .attr('width', barChartWidth)
                .attr('height', barChartHeight)
                .attr('fill', 'yellow')
                .attr('opacity', 0.1)
                .lower();

            const className = d.station.replace(/[^a-zA-Z]/g, "");
            d3.selectAll(`.${className}`)
                .style('fill', 'red')
                .raise();
        })
        .on('mouseout', (event, d) => {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);

            barChartLayer.selectAll('.highlight-rect').remove();

            d3.select(event.currentTarget)
                .style('fill', '#69b3a2');

            const className = d.station.replace(/[^a-zA-Z]/g, "");
            
            d3.selectAll(`.bar.${className}`)
                .style('fill', '#69b3a2')
                .lower();
                
            d3.selectAll(`.point.${className}`)
                .style('fill', 'steelblue')
                .lower();
        });
  }