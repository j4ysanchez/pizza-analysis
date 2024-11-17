import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PizzaTypePieChartRecharts = () => {
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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56'];

    return (
        <div>
            <h1>Pizza Types Pie Chart</h1>
            <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="pizza_type"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PizzaTypePieChartRecharts;