import React from 'react'
import Chart from 'react-apexcharts'

const VisitTrend = () => {
    const series = [{ name: 'Weekly visits', data: [850, 900, 950, 1000, 1050, 1100, 1180, 1150, 1200, 1170, 1230, 1280] }]

    const options = {
        chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#3b82f6'],
        xaxis: { categories: ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'] },
        grid: { borderColor: '#eee' },
        title: { text: 'Visit Trend', align: 'left' },
        dataLabels: { enabled: false },
    }

    return <Chart options={options} series={series} type="line" height={300} />
}

export default VisitTrend
