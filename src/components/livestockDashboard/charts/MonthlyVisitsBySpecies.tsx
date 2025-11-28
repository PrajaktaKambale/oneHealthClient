import React from 'react'
import Chart from 'react-apexcharts'

const MonthlyVisitsBySpecies = () => {
    const series = [
        { name: 'Buffalo', data: [300, 320, 340, 360, 380, 400] },
        { name: 'Cattle', data: [400, 420, 440, 460, 480, 500] },
        { name: 'Goat', data: [250, 260, 270, 280, 290, 300] },
        { name: 'Poultry', data: [200, 210, 220, 230, 240, 250] },
    ]

    const options = {
        chart: { type: 'bar', stacked: true, toolbar: { show: false } },
        plotOptions: { bar: { columnWidth: '45%' } },
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
        colors: ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'],
        legend: { position: 'top' },
        grid: { borderColor: '#eee' },
        title: { text: 'Monthly visits by species', align: 'left' },
        dataLabels: { enabled: false },
    }

    return <Chart options={options} series={series} type="bar" height={300} />
}

export default MonthlyVisitsBySpecies
