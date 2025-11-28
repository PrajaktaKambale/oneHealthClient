import React from 'react'
import Chart from 'react-apexcharts'

const HumanVisitTrend = () => {
    const series = [
        {
            name: 'Human Visits',
            data: [3100, 3300, 3000, 3500, 3600, 3300, 3800, 4000, 3700, 4200, 4100, 4400],
        },
    ]

    const options = {
        chart: {
            type: 'line',
            toolbar: { show: false },
            zoom: { enabled: false },
        },

        stroke: {
            curve: 'smooth',
            width: 3,
        },

        markers: {
            size: 8,
            strokeWidth: 3,
            strokeColors: '#fff',
            colors: ['#2f8ef7'],
            hover: {
                size: 10,
            },
        },

        xaxis: {
            categories: ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: '#666' },
            },
        },

        yaxis: {
            min: 0,
            max: 6000,
            tickAmount: 6,
            labels: {
                style: { colors: '#666' },
            }
        },

        grid: {
            borderColor: '#eee',
        },

        tooltip: {
            y: {
                formatter: (value) => `${value.toLocaleString()} visits`,
            },
        },

        title: {
            text: 'Human Visit Trend',
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 600,
            },
        },

        subtitle: {
            text: 'Weekly visits over 12 weeks',
            align: 'left',
            style: {
                fontSize: '12px',
                color: '#888',
            },
        },
    }

    return (
        <Chart
            options={options}
            series={series}
            type="line"
            height={320}
        />
    )
}

export default HumanVisitTrend
