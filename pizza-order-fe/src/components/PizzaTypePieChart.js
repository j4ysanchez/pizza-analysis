import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const PizzaTypePieChart = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders')
      .then(response => {
        const orders = response.data;
        const pizzaTypeCounts = d3.rollup(
          orders,
          v => v.length,
          d => d.pizza_type
        );
        const formattedData = Array.from(pizzaTypeCounts, ([type, count]) => ({ type, count }));
        setData(formattedData);
      })
      .catch(error => {
        console.error('There was an error fetching the pizza orders!', error);
      });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const drawChart = () => {
        const width = 450;
        const height = 450;
        const margin = 40;
    
        const radius = Math.min(width, height) / 2 - margin;
    
        const svg = d3.select(chartRef.current)
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);
    
        const color = d3.scaleOrdinal()
          .domain(data.map(d => d.type))
          .range(d3.schemeSet2);
    
        const pie = d3.pie()
          .value(d => d.count);
    
        const data_ready = pie(data);
    
        svg
          .selectAll('path')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
          )
          .attr('fill', d => color(d.data.type))
          .attr('stroke', 'white')
          .style('stroke-width', '2px')
          .style('opacity', 0.7);
      };

      drawChart();
    }
  }, [data]);

  return (
    <div>
      <h1>Pizza Types Pie Chart</h1>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default PizzaTypePieChart;