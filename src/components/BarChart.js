'use client'; 


import { useEffect, useRef } from "react";
import * as d3 from 'd3';
import { drawBarChart } from "./drawBarChart";


function BarChart(props){
    const { svgWidth, svgHeight, marginLeft, marginTop, data, xScale, yScale } = props;

    const d3Selection = useRef();
        
        useEffect(()=>{
            d3.select(d3Selection.current).selectAll("*").remove();
            
            const svg = d3.select(d3Selection.current);
            let width = svgWidth - marginLeft ;
            let height = svgHeight - marginTop-120;

            const xAxis_bar = d3.axisBottom(xScale); 
            const yAxis_bar = d3.axisLeft(yScale).ticks(5);

            let barChart = svg.append("g")
            .attr("transform", "translate(" + marginLeft + "," + marginTop +")");

            barChart.append('g')
            .attr("transform", "translate(" +0+ "," + height +")")
            .attr('class', 'x-axis')
            .call(xAxis_bar)
            .selectAll('text')
            .attr('class', 'x-axis-label')
            .style('text-anchor', 'end')
            .attr('dx', '-0.8em')
            .attr('dy', '.015em')
            .attr('transform', 'rotate(-65)');

            barChart.append('g')
            .attr('class', 'y-axis')
            .call(yAxis_bar);
            
            barChart.append("g")
            .attr("transform", `translate(${-30}, ${height/2})`)
            .append("text")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Bikers start from");
            
            drawBarChart(barChart, data, xScale, yScale, width, height);
            
        }, [data]) 
    return <svg width={svgWidth} height={svgHeight} ref={d3Selection}> </svg>; 
}

export default BarChart