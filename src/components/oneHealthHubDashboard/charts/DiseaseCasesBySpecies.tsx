import React from 'react'
import Chart from 'react-apexcharts'

const DiseaseCasesBySpecies = () => {
    const series = [
        { name: 'Human', data: [200, 180, 160, 140, 120] },
        { name: 'Livestock', data: [300, 260, 220, 180, 150] },
        { name: 'Pet', data: [150, 130, 110, 90, 70] },
    ]
    const options = {
        chart: { type: 'bar', stacked: true, toolbar: { show: false } },
        plotOptions: { bar: { columnWidth: '45%' } },
        xaxis: { categories: ['Rabies', 'Leptospirosis', 'Brucellosis', 'Anthrax', 'Salmonellosis'] },
        colors: ['#3b82f6', '#22c55e', '#f59e0b'],
        legend: { position: 'top' },
        grid: { borderColor: '#eee' },
        title: { text: 'Disease Cases', align: 'left' },
        dataLabels: { enabled: false },
    }
    return <Chart options={options} series={series} type="bar" height={300} />
}

export default DiseaseCasesBySpecies
