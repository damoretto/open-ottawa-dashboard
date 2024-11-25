import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './Dashboard.css'; // Import custom CSS

const CensusDashboard = () => {
    const [csvData, setCsvData] = useState([]); // Holds all the parsed data
    const [headers, setHeaders] = useState([]); // Holds column headers
    const [nonEmptyHeaders, setNonEmptyHeaders] = useState([]); // Headers with at least one valid value
    const [filters, setFilters] = useState({
        'Census Year': '',
        Ward: '',
        Category: '',
        SubCategory: '',
        Characteristic: '',
        SubCharacteristic: '',
    }); // Stores user-selected values for each header
    const [filteredValue, setFilteredValue] = useState(null); // Stores the final Value after filtering
    const [isSubCharacteristicDisabled, setIsSubCharacteristicDisabled] = useState(false); // Disable SubCharacteristic

    // Load and parse the CSV file
    const loadCsvData = async () => {
        const response = await fetch('/AgeData.csv');
        const reader = await response.text();

        Papa.parse(reader, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data.map((row) => {
                    // Trim whitespace and replace empty strings with null
                    const cleanedRow = {};
                    for (const key in row) {
                        cleanedRow[key] = row[key]?.trim() || null;
                    }
                    return cleanedRow;
                });
                setCsvData(data); // Store cleaned data

                const validHeaders = Object.keys(data[0]).filter((header) => {
                    return (
                        header !== 'Value' && // Exclude Value from dropdowns
                        data.some((row) => row[header] !== null && row[header] !== '')
                    );
                });

                setHeaders(Object.keys(data[0])); // Extract all headers
                setNonEmptyHeaders(validHeaders); // Store headers with valid data
            },
        });
    };

    const handleFilterChange = (header, value) => {
        setFilters((prev) => ({
            ...prev,
            [header]: value,
        }));
    };

    const handleSubmit = () => {
        if (csvData.length > 0) {
            const filteredRows = csvData.filter((row) =>
                Object.keys(filters).every((header) => {
                    // Skip SubCharacteristic if it is disabled
                    if (header === 'SubCharacteristic' && isSubCharacteristicDisabled) {
                        return true;
                    }

                    return (
                        !nonEmptyHeaders.includes(header) || // Skip headers with all nulls
                        !filters[header] || // Skip headers without selection
                        row[header] === filters[header]
                    );
                })
            );

            if (filteredRows.length === 1) {
                setFilteredValue(filteredRows[0]['Value']);
            } else {
                setFilteredValue(null);
            }
        }
    };

    // Dynamically check if SubCharacteristic is valid based on previous filters
    useEffect(() => {
        if (filters['Characteristic']) {
            const filteredRows = csvData.filter((row) =>
                Object.keys(filters).every(
                    (header) =>
                        !filters[header] || // Skip headers without selection
                        row[header] === filters[header]
                )
            );

            const subCharacteristicOptions = [
                ...new Set(filteredRows.map((row) => row['SubCharacteristic'])),
            ].filter((option) => option !== null && option !== '');

            setIsSubCharacteristicDisabled(subCharacteristicOptions.length === 0);
        } else {
            setIsSubCharacteristicDisabled(true);
        }
    }, [filters, csvData]);

    useEffect(() => {
        loadCsvData();
    }, []);

    return (
        <div className="dashboard-container">
            {/* Main content area */}
            <div className="main-content">
                <div>
                    {filteredValue !== null ? (
                        <p>The value is: <strong>{filteredValue}</strong></p>
                    ) : (
                        <p>Select filters and click submit to view the value.</p>
                    )}
                </div>
            </div>

            {/* Filter selection pane */}
            <div className="filter-pane">
                <h3>Filter Selection</h3>
                {headers.length > 0 ? (
                    <div>
                        {nonEmptyHeaders.map((header) => (
                            <div key={header} className="filter-item">
                                <label>{header}:</label>
                                <select
                                    value={filters[header]}
                                    onChange={(e) => handleFilterChange(header, e.target.value)}
                                    disabled={
                                        header === 'SubCharacteristic' &&
                                        isSubCharacteristicDisabled
                                    } // Disable SubCharacteristic dropdown if no valid options
                                >
                                    <option value="">Select {header}</option>
                                    {[...new Set(csvData.map((row) => row[header]))]
                                        .filter((option) => option !== null && option !== '')
                                        .map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        ))}
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                ) : (
                    <p>Loading filters...</p>
                )}
            </div>
        </div>
    );
};

export default CensusDashboard;
