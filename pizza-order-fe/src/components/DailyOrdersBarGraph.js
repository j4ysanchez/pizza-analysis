import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const DailyOrdersBarGraph = () => {
    const [dailyOrders, setDailyOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/orders')
            .then(response => {
                const orders = response.data;
                const ordersByDay = orders.reduce((acc, order) => {
                    const date = new Date(order.order_timestamp);
                    const day = date.getDate();
                    acc[day] = (acc[day] || 0) + 1;
                    return acc;
                }, {});
                const formattedData = Array.from({ length: 31 }, (_, i) => ({
                    day: i + 1,
                    count: ordersByDay[i + 1] || 0
                }));
                setDailyOrders(formattedData);
            })
            .catch(error => {
                console.error('There was an error fetching the pizza orders!', error);
            });
    }, []);

    const days = dailyOrders.map(d => d.day);
    const counts = dailyOrders.map(d => d.count);

    return (
        <div>
            <h1>Daily Orders Bar Graph</h1>
            <Plot
                data={[
                    {
                        type: 'bar',
                        x: days,
                        y: counts,
                        marker: {
                            color: 'rgba(55, 128, 191, 0.7)',
                            line: {
                                color: 'rgba(55, 128, 191, 1.0)',
                                width: 2
                            }
                        }
                    }
                ]}
                layout={{
                    title: 'Number of Orders for Each Day of the Month',
                    xaxis: {
                        title: 'Day of the Month',
                        dtick: 1
                    },
                    yaxis: {
                        title: 'Number of Orders'
                    },
                    width: 800,
                    height: 600
                }}
            />
        </div>
    );
};

export default DailyOrdersBarGraph;