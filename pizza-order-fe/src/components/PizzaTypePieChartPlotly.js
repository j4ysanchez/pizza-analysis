import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const PizzaTypePieChartPlotly = () => {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/orders')
            .then(response => {
                const orders = response.data;
                const pizzaTypeCounts = orders.reduce((acc, order) => {
                    acc[order.pizza_type] = (acc[order.pizza_type] || 0) + 1;
                    return acc;
                }, {});
                const formattedData = Object.entries(pizzaTypeCounts).map(([type, count]) => ({ type, count }));
                setData(formattedData);
            })
            .catch(error => {
                console.error('There was an error fetching the pizza orders!', error);
            });
    }, []);

    const pizzaTypes = data.map(d => d.type);
    const pizzaCounts = data.map(d => d.count);

    const handleClick = (event) => {
        const clickedSegment = event.points[0].label;
        axios.get('http://localhost:5000/api/orders')
            .then(response => {
                const orders = response.data;
                const segmentData = orders.filter(order => order.pizza_type === clickedSegment).slice(0, 30);
                setSelectedData(segmentData);
            })
            .catch(error => {
                console.error('There was an error fetching the pizza orders!', error);
            });
    };

    return (
        <div>
            <h1>Pizza Types Pie Chart</h1>
            <Plot
                data={[
                    {
                        type: 'pie',
                        labels: pizzaTypes,
                        values: pizzaCounts,
                        textinfo: 'label+percent',
                        textposition: 'outside',
                        automargin: true,
                    },
                ]}
                layout={{
                    width: 500,
                    height: 500,
                    margin: { t: 0, b: 0, l: 0, r: 0 },
                    showlegend: false,
                }}
                onClick={handleClick}
            />
            {selectedData.length > 0 && (
                <div>
                    <h2>Selected Segment Data</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Pizza Type</th>
                                <th>Time Ordered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.id}</td>
                                    <td>{row.pizza_type}</td>
                                    <td>{new Date(row.order_timestamp).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PizzaTypePieChartPlotly;