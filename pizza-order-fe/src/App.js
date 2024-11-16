import React from 'react';
import logo from './logo.svg';
import './App.css';
import PizzaTypePieChart from './components/PizzaTypePieChart';
import PizzaTypePieChartPlotly from './components/PizzaTypePieChartPlotly';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PizzaTypePieChart />
        <PizzaTypePieChartPlotly />
      </header>
    </div>
  );
}

export default App;