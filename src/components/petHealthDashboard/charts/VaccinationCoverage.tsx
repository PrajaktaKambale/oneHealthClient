import React from 'react'
import Chart from 'react-apexcharts'

const VaccinationCoverage = () => {
    const vaccines = ['Rabies', 'Distemper', 'Parvovirus', 'Bordetella', 'Leptospirosis', 'Feline Leukemia']
    const values = [85, 78, 74, 68, 62, 57]

    const series = [{ name: 'Immunization', data: values }]

    const options = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, barHeight: '60%' } },
        xaxis: { categories: vaccines, max: 100 },
        colors: ['#10b981'],
        grid: { borderColor: '#eee' },
        title: { text: 'Vaccination Coverage', align: 'left' },
        dataLabels: { enabled: true, formatter: (v) => `${v}%` },
        tooltip: { y: { formatter: (v) => `${v}%` } },
    }

    return <Chart options={options} series={series} type="bar" height={300} />
}

export default VaccinationCoverage
