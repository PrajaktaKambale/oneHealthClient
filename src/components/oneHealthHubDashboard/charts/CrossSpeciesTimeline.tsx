import React from 'react'
import Chart from 'react-apexcharts'

const CrossSpeciesTimeline = () => {
    const series = [
        { name: 'human', data: [1400, 1500, 1600, 1700, 1800, 2000, 2100, 2200, 2300, 2500, 2400, 2600] },
        { name: 'livestock', data: [900, 950, 1000, 1100, 1200, 1300, 1400, 1500, 1550, 1600, 1650, 1700] },
        { name: 'pet', data: [700, 730, 760, 800, 850, 900, 940, 980, 1000, 1050, 1100, 1150] },
    ]
    const options = {
        chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
        colors: ['#2563eb', '#16a34a', '#f59e0b'],
        grid: { borderColor: '#eee' },
        legend: { position: 'top' },
        title: { text: 'Cross-Species Timeline', align: 'left' },
        dataLabels: { enabled: false },
    }
    return <Chart options={options} series={series} type="line" height={300} />
}

export default CrossSpeciesTimeline
