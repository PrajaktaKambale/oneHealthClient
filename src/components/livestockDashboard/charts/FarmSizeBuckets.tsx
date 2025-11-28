import React from 'react'
import Chart from 'react-apexcharts'

const FarmSizeBuckets = () => {
    const series = [{ name: 'Farm Size', data: [80, 130, 90, 50, 30] }]
    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { columnWidth: '45%' } },
        xaxis: { categories: ['1-10', '11-20', '21-50', '51-100', '101+'] },
        colors: ['#22c55e'],
        grid: { borderColor: '#eee' },
        title: { text: 'Farm size buckets', align: 'left' },
        dataLabels: { enabled: false },
    }
    return <Chart options={options} series={series} type="bar" height={300} />
}

export default FarmSizeBuckets
