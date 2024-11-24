import CensusData from './2021censusdata.csv';
import Papa from 'papaparse';
import {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

function Page() {
    return(
        <div>
            <h1>
                Page
            </h1>
        </div>
    )
}

export default Page