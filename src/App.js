import React from 'react';
import './App.css'; // Optional: for custom styling
import CensusDashboard from './Dashboard/Dashboard.js'; // Adjust path if needed

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Census Data Dashboard</h1>
            </header>
            {/* Render the CensusDashboard component */}
            <CensusDashboard />
        </div>
    );
}

export default App;

