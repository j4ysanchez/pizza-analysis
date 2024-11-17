import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { Table, Pagination } from 'antd';
// import 'antd/dist/antd.css'; // Import Ant Design styles
import { StyleProvider } from '@ant-design/cssinjs';

const PizzaTypePieChartPlotly = () => {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [selectedPizzaType, setSelectedPizzaType] = useState(null);
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


    const pizzaTypes = data.map(d => d.pizza_type);
    const pizzaCounts = data.map(d => d.count);

    const fetchOrders = (pizzaType, page) => {
        const offset = (page - 1) * rowsPerPage;
        axios.get(`http://localhost:5000/api/orders?pizza_type=${pizzaType}&limit=${rowsPerPage}&offset=${offset}`)
            .then(response => {
                setSelectedData(response.data);
                setCurrentPage(page);
                const totalCount = response.headers['x-total-count'];
                if (totalCount) {
                    setTotalOrders(parseInt(totalCount, 10)); // Ensure totalOrders is updated
                } else {
                    console.error('x-total-count header is missing');
                }
            })
            .catch(error => {
                console.error('There was an error fetching the pizza orders!', error);
            });
    };

    const handleClick = (event) => {
        const clickedSegment = event.points[0].label;
        setSelectedPizzaType(clickedSegment);
        axios.get(`http://localhost:5000/api/orders?pizza_type=${clickedSegment}&limit=${rowsPerPage}&offset=0`)
            .then(response => {
                setSelectedData(response.data);
                setCurrentPage(1); // Reset to the first page
                setTotalOrders(parseInt(response.headers['x-total-count'], 10)); // Ensure totalOrders is updated
                console.log(response.headers);
            })
            .catch(error => {
                console.error('There was an error fetching the pizza orders!', error);
            });
    };

    const handlePageChange = (page) => {
        if (selectedPizzaType) {
            fetchOrders(selectedPizzaType, page);
        }
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a,b) => a.id - b.id,
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
                    <Table
                        dataSource={selectedData}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                    />
                    <Pagination
                        current={currentPage}
                        total={totalOrders}
                        pageSize={rowsPerPage}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default PizzaTypePieChartPlotly;