import React from 'react'
import Chart from 'react-apexcharts'

const AirQualityVsRespiratoryCases = () => {
    // Simple scatter data (AQI vs cases)
    const points = Array.from({ length: 10 }, (_, i) => [45 + i * 25, 120 + i * 40])
    const series = [{ name: 'AQI vs Respiratory', data: points }]

    const options = {
        chart: { type: 'scatter', toolbar: { show: false } },
        xaxis: { tickAmount: 10, min: 40, max: 300, title: { text: 'AQI' } },
        yaxis: { min: 100, max: 800, title: { text: 'Respiratory Cases' } },
        colors: ['#8b5cf6'],
        grid: { borderColor: '#eee' },
        title: { text: 'Air Quality vs Respiratory Cases', align: 'left' },
        dataLabels: { enabled: false },
    }
    return <Chart options={options} series={series} type="scatter" height={300} />
}

export default AirQualityVsRespiratoryCases
