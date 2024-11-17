import React from 'react';
import logo from './logo.svg';
import './App.css';
import PizzaTypePieChart from './components/PizzaTypePieChart';
import PizzaTypePieChartPlotly from './components/PizzaTypePieChartPlotly';
import DailyOrdersBarGraph from './components/DailyOrdersBarGraph';
import PizzaTypePieChartECharts from './components/PizzaTypePieChartECharts';
import PizzaTypePieChartRecharts from './components/PizzaTypePieChartRecharts';
import PizzaTypePieChartJS from './components/PizzaTypePieChartJS';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <PizzaTypePieChart /> */}
        
        <PizzaTypePieChartRecharts />
        
        <PizzaTypePieChartPlotly />
        <PizzaTypePieChartECharts />
        <PizzaTypePieChartJS />
        <DailyOrdersBarGraph />
      </header>
    </div>
  );
}

export default App;