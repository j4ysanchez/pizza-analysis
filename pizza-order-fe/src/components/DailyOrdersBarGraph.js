import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const DailyOrdersBarGraph = () => {
    const [dailyOrders, setDailyOrders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/orders')
            .then(response => {
                const orders = response.data;
                const ordersByDayAndType = orders.reduce((acc, order) => {
                    const date = new Date(order.order_timestamp);
                    const day = date.getDate();
                    const type = order.pizza_type;
                    if (!acc[day]) {
                        acc[day] = {};
                    }
                    acc[day][type] = (acc[day][type] || 0) + 1;
                    return acc;
                }, {});

                const formattedData = Array.from({ length: 31 }, (_, i) => ({
                    day: i + 1,
                    types: ordersByDayAndType[i + 1] || {}
                }));
                setDailyOrders(formattedData);
            })
            .catch(error => {
                console.error('There was an error fetching the pizza orders!', error);
            });
    }, []);

    const days = dailyOrders.map(d => d.day);
    const pizzaTypes = Array.from(new Set(dailyOrders.flatMap(d => Object.keys(d.types))));

    const traces = pizzaTypes.map(type => ({
        type: 'bar',
        name: type,
        x: days,
        y: dailyOrders.map(d => d.types[type] || 0),
    }));

    return (
        <div>
            <h1>Daily Orders Bar Graph</h1>
            <Plot
                data={traces}
                layout={{
                    title: 'Number of Orders for Each Day of the Month',
                    barmode: 'stack',
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