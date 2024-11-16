import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import './PizzaTypePieChartPlotly.css'; // Add custom styles if needed

const PizzaTypePieChartPlotly = () => {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 30;

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
                const segmentData = orders.filter(order => order.pizza_type === clickedSegment);
                setSelectedData(segmentData);
                setCurrentPage(0); // Reset to the first page
            })
            .catch(error => {
                console.error('There was an error fetching the pizza orders!', error);
            });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value - 1);
    };

    const indexOfLastRow = (currentPage + 1) * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = selectedData.slice(indexOfFirstRow, indexOfLastRow);
    const pageCount = Math.ceil(selectedData.length / rowsPerPage);

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
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Pizza Type</TableCell>
                                    <TableCell>Time Ordered</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentRows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.pizza_type}</TableCell>
                                        <TableCell>{new Date(row.order_timestamp).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        count={pageCount}
                        page={currentPage + 1}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </div>
            )}
        </div>
    );
};

export default PizzaTypePieChartPlotly;