'use client';


import { useEffect, useRef } from "react";
import * as d3 from 'd3';
import { drawScatterPlot } from "./drawScatterPlot";


export default function ScatterPlot(props){
    const { svgWidth, svgHeight, marginLeft, marginTop, data, xScale, yScale} = props;
    
    const d3Selection = useRef();
    
    useEffect(()=>{
            const svg = d3.select(d3Selection.current);
            let width = svgWidth - marginLeft;
            let height = svgHeight - marginTop;
            const xAxis_spl = d3.axisBottom(xScale).ticks(10);
            //Task 2. create the y-axis
            //Hint: use the code for the x-axis as a reference
            const yAxis_spl = d3.axisLeft(yScale).ticks(10);
        

            let tooltip = d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)
                        .style("background-color", "white")
                        .style("position", "absolute");

            // Remove existing points before redrawing
            d3.selectAll('.point').remove();
           
            const spl = svg.append("g")
            .attr("id", "scatter-plot")
            .attr("transform", "translate(" + marginLeft + "," + marginTop +")");

            spl.append('g')
            .attr('transform', 'translate(0, ' + `${height-20}` + ")")
            .attr('class', 'x-axis')
            .call(xAxis_spl);

            spl.append("g")
            .attr("transform", `translate(${width-90}, ${height-30})`)
            .append("text")
            .style("text-anchor", "middle")
            .text("Trip duration start from");
            
            //Task 3: Create the y-axis and y-axis label
            //Hint: 
            // 1. use the code for the x-axis and x-axis label as a reference
            // 2.the y-axis label should be rotated by -90 degrees; use the rotate(-90) attribute
            spl.append('g')
            .attr('class', 'y-axis')
            .call(yAxis_spl);

            spl.append("g")
            .attr("transform", `translate(${-30}, ${height/2})`)
            .append("text")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("Trip duration end at");
           
            drawScatterPlot(spl, data, xScale, yScale, tooltip, width-20, height-20);

    }, [data]) // Update when data changes

    return <svg width={svgWidth} height={svgHeight} ref={d3Selection}> </svg>; 
}
