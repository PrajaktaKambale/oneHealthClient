import React from 'react'
import Chart from 'react-apexcharts'

const ComparativeAnalysis = () => {
    const series = [
        { name: 'Dog', data: [500, 450, 400, 350, 300] },
        { name: 'Cat', data: [300, 280, 250, 230, 120] },
        { name: 'Bird', data: [60, 50, 40, 30, 20] },
    ]

    const options = {
        chart: { type: 'bar', stacked: true, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: '45%' } },
        xaxis: { categories: ['Gastrointestinal', 'Respiratory', 'Parasitic', 'Dental', 'Orthopedic'] },
        colors: ['#2f8ef7', '#ff6b6b', '#2ecc71'],
        grid: { borderColor: '#eee' },
        legend: { position: 'top' },
        title: { text: 'Comparative analysis', align: 'left' },
        dataLabels: { enabled: false },
    }

    return <Chart options={options} series={series} type="bar" height={300} />
}

export default ComparativeAnalysis
