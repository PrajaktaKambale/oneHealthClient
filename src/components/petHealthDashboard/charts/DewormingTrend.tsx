import React from 'react'
import Chart from 'react-apexcharts'

const DewormingTrend = () => {
    const series = [{ name: 'Prevention', data: [800, 900, 950, 1000, 1100, 1050, 1200, 1300, 1250, 1280, 1320, 1350] }]

    const options = {
        chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#22c55e'],
        xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
        grid: { borderColor: '#eee' },
        title: { text: 'Deworming Trend', align: 'left' },
        dataLabels: { enabled: false },
    }

    return <Chart options={options} series={series} type="line" height={300} />
}

export default DewormingTrend
