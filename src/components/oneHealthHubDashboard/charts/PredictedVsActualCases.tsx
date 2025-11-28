import React from 'react'
import Chart from 'react-apexcharts'

const PredictedVsActualCases = () => {
    const categories = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12']
    const series = [
        { name: 'Actual', data: [900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120] },
        { name: 'Predicted', data: [910, 930, 950, 970, 995, 1010, 1030, 1050, 1070, 1095, 1110, 1135] },
    ]
    const options = {
        chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories },
        colors: ['#2563eb', '#60a5fa'],
        grid: { borderColor: '#eee' },
        legend: { position: 'top' },
        title: { text: 'Predicted vs Actual Cases', align: 'left' },
        dataLabels: { enabled: false },
    }
    return <Chart options={options} series={series} type="line" height={300} />
}

export default PredictedVsActualCases
