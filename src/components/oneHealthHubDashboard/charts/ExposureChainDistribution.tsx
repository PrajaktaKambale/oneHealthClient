import React from 'react'
import Chart from 'react-apexcharts'

const ExposureChainDistribution = () => {
    const series = [{ name: 'Transmission', data: [2500, 1900, 1500, 1200, 900] }]
    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { columnWidth: '45%' } },
        xaxis: { categories: ['Vector-borne', 'Foodborne', 'Waterborne', 'Airborne', 'Fomite'] },
        colors: ['#10b981'],
        grid: { borderColor: '#eee' },
        title: { text: 'Exposure Chain Distribution', align: 'left' },
        dataLabels: { enabled: false },
    }
    return <Chart options={options} series={series} type="bar" height={300} />
}

export default ExposureChainDistribution
