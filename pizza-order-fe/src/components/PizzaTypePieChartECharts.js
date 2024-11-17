import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import { Table } from 'antd';
// import 'antd/dist/antd.min.css'; // Import Ant Design styles

const PizzaTypePieChartECharts = () => {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const rowsPerPage = 20;

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

    const getOption = () => {
        const pizzaTypes = data.map(d => d.pizza_type);
        const pizzaCounts = data.map(d => ({ value: d.count, name: d.pizza_type }));

        return {
            title: {
                text: 'Pizza Types Pie Chart',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Pizza Types',
                    type: 'pie',
                    radius: '50%',
                    data: pizzaCounts,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        formatter: '{b}: {c} ({d}%)'
                    }
                }
            ]
        };
    };

    const handleChartClick = (params) => {
        const clickedSegment = params.name;
        axios.get(`http://localhost:5000/api/orders?pizza_type=${clickedSegment}&limit=${rowsPerPage}&offset=0`)
            .then(response => {
                setSelectedData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the pizza orders!', error);
            });
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Pizza Type',
            dataIndex: 'pizza_type',
            key: 'pizza_type',
        },
        {
            title: 'Time Ordered',
            dataIndex: 'order_timestamp',
            key: 'order_timestamp',
            sorter: (a, b) => new Date(a.order_timestamp) - new Date(b.order_timestamp),
            render: (text) => new Date(text).toLocaleString(),
        },
    ];

    return (
        <div>
            <h1>Pizza Types Pie Chart</h1>
            <ReactECharts
                option={getOption()}
                style={{ height: 500, width: '100%' }}
                onEvents={{ 'click': handleChartClick }}
            />
            {selectedData.length > 0 && (
                <div>
                    <h2>Selected Segment Data</h2>
                    <Table
                        dataSource={selectedData}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                    />
                </div>
            )}
        </div>
    );
};

export default PizzaTypePieChartECharts;