import React from 'react'
import Chart from 'react-apexcharts'

const NotifiableDiseaseBreakdown = () => {
    const diseases = ['FMD', 'Brucellosis', 'Anthrax', 'Tuberculosis', 'PPR', 'Rabies']
    const values = [240, 160, 110, 80, 60, 50]
    const series = [{ name: 'Reportable cases', data: values }]

    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { columnWidth: '45%' } },
        xaxis: { categories: diseases },
        colors: ['#ef4444'],
        grid: { borderColor: '#eee' },
        title: { text: 'Notifiable Disease Breakdown', align: 'left' },
        dataLabels: { enabled: false },
    }

    return <Chart options={options} series={series} type="bar" height={300} />
}

export default NotifiableDiseaseBreakdown
