import React from 'react'
import Chart from 'react-apexcharts'

const LabUtilizationRate = () => {
    const series = [{ name: 'Monthly samples', data: [150, 170, 190, 210, 200, 220, 260, 270, 280, 290, 300, 310] }]

    const options = {
        chart: { type: 'area', toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
        colors: ['#22c55e'],
        xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
        grid: { borderColor: '#eee' },
        title: { text: 'Lab Utilization Rate', align: 'left' },
        dataLabels: { enabled: false },
    }

    return <Chart options={options} series={series} type="area" height={300} />
}

export default LabUtilizationRate
