import React from 'react'
import Chart from 'react-apexcharts'

const PetsPerOwner = () => {
    const series = [{ name: 'Owners', data: [3000, 1600, 600, 300, 100] }]
    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { columnWidth: '45%' } },
        xaxis: { categories: ['1 pet', '2 pets', '3 pets', '4 pets', '5+ pets'] },
        colors: ['#8b5cf6'],
        grid: { borderColor: '#eee' },
        title: { text: 'Pets per Owner', align: 'left' },
        dataLabels: { enabled: false },
    }
    return <Chart options={options} series={series} type="bar" height={300} />
}

export default PetsPerOwner
