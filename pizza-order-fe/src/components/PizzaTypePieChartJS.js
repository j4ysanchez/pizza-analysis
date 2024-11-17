import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js

const PizzaTypePieChartChartJS = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/pizza-types')
            .then(response => {
                const pizzaTypesData = response.data;
                setData(pizzaTypesData);
            })
            .catch(error => {
                console.error('There was an error fetching the pizza types!', error);
            });
    }, []);

    const chartData = {
        labels: data.map(d => d.pizza_type),
        datasets: [
            {
                label: 'Pizza Types',
                data: data.map(d => d.count),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FF8042',
                    '#00C49F',
                    '#0088FE',
                    '#FFBB28',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FF8042',
                    '#00C49F',
                    '#0088FE',
                    '#FFBB28',
                ],
            },
        ],
    };

    return (
        <div>
            <h1>Pizza Types Pie Chart</h1>
            <Pie data={chartData} />
        </div>
    );
};

export default PizzaTypePieChartChartJS;