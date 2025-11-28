import React from 'react'
import Chart from 'react-apexcharts'

const PatientCountByBreed = () => {
    const breeds = ['Labrador', 'German Shepherd', 'Golden Retriever', 'Beagle', 'Persian Cat', 'Pug', 'Bulldog', 'Siamese Cat', 'Pomeranian', 'Shih Tzu']
    const values = [980, 820, 700, 640, 520, 480, 430, 380, 320, 280]

    const series = [{ data: values }]

    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, barHeight: '60%' } },
        xaxis: { categories: breeds },
        colors: ['#ff4d8d'],
        grid: { borderColor: '#eee' },
        title: { text: 'By patient count', align: 'left' },
        dataLabels: { enabled: false },
    }

    return <Chart options={options} series={series} type="bar" height={300} />
}

export default PatientCountByBreed
