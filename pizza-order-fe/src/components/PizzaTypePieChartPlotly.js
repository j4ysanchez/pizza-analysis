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
    const rowsPerPage = 50;

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

    const handleClick = (event) => {
        const clickedSegment = event.points[0].label;
        axios.get(`http://localhost:5000/api/orders?pizza_type=${clickedSegment}`)
            .then(response => {
                const segmentData = response.data;
                setSelectedData(segmentData);
                setCurrentPage(1); // Reset to the first page
            })
            .catch(error => {
                console.error('There was an error fetching the pizza orders!', error);
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = selectedData.slice(indexOfFirstRow, indexOfLastRow);


    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
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
                        dataSource={currentRows}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                    />
                    <Pagination
                        current={currentPage}
                        total={selectedData.length}
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