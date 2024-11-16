import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const PizzaTypePieChart = () => {
    const [data, setData] = useState([]);
    const chartRef = useRef();
    const [selectedData, setSelectedData] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/orders')
            .then(response => {
                const ordersData = response.data;
                setOrders(ordersData);
                const pizzaTypeCounts = d3.rollup(
                    ordersData,
                    v => v.length,
                    d => d.pizza_type
                );
                const formattedData = Array.from(pizzaTypeCounts, ([type, count]) => ({ type, count }));
                
                // console.log(formattedData);
                setData(formattedData);
            })
            .catch(error => {
                console.error('There was an error fetching the pizza orders!', error);
            });
    }, []);

    useEffect(() => {

        if (data.length > 0) {
            
            const drawChart = () => {
                const width = 500;
                const height = 500;
                const margin = 50;

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

                const arc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius);

                const outerArc = d3.arc()
                    .innerRadius(radius * 1.1)
                    .outerRadius(radius * 1.1);

                // const path = svg
                //     .selectAll('path')
                //     .data(data_ready)
                //     .enter()
                //     .append('path')
                //     .attr('d', arc)
                //     .attr('fill', d => color(d.data.type))
                //     .attr('stroke', 'white')
                //     .style('stroke-width', '2px')
                //     .style('opacity', 0.7);

             


                const path = svg.selectAll('path')
                    .data(pie(data))
                    .enter().append('path')
                    .attr('d', arc)
                    .style('fill', (d, i) => d3.schemeCategory10[i % 10])
                    .on('click', (event, d) => {
                        console.log('Segment clicked:', d.data.type);
                        const segmentData = orders.filter(item => item.pizza_type === d.data.type).slice(0, 30);
                        console.log('Filtered segment data:', segmentData);
                        setSelectedData(segmentData);
                    });

                // svg.selectAll('text')
                //     .data(pie(data))
                //     .enter().append('text')
                //     .attr('transform', d => `translate(${arc.centroid(d)})`)
                //     .attr('dy', '0.35em')
                //     .text(d => d.data.type)
                //     .style('text-anchor', 'middle')
                //     .style('font-size', '12px');

                       // Add labels
                svg
                    .selectAll('text')
                    .data(data_ready)
                    .enter()
                    .append('text')
                    .text(d => d.data.type)
                    .attr('transform', d => `translate(${outerArc.centroid(d)})`)
                    .attr('class', 'pie-chart-label')
                    .style('text-anchor', 'middle')
                    .style('font-size', '12px');
            };

            drawChart();
        }
    }, [data, orders]);



    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };
        return date.toLocaleString('en-US', options);
    };

    return (
        <div>
            <h1>Pizza Types Pie Chart</h1>
            <svg ref={chartRef}></svg>
            {selectedData.length > 0 && (
                 <div>
                 <h2>Selected Segment Data</h2>
                 <table>
                     <thead>
                         <tr>
                             <th>Order ID</th>
                             <th>Pizza Type</th>
                             <th>Time Ordered</th>
                            
                             {/* Add other relevant columns as needed */}
                         </tr>
                     </thead>
                     <tbody>
                         {selectedData.map((row, index) => (
                             <tr key={index}>
                                 <td>{row.id}</td>
                                 <td>{row.pizza_type}</td>
                                 <td>{formatTimestamp(row.order_timestamp)}</td>
                                 
                                 {/* Add other relevant data as needed */}
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
            )}
        </div>
    );
};

export default PizzaTypePieChart;