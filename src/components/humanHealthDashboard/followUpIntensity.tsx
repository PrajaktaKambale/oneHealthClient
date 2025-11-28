import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const FollowUpIntensity: React.FC = () => {

    const series = [
        {
            name: 'Visits Count',
            data: [3200, 2800, 1600, 600, 300],
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
        },

        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
                borderRadius: 4,
            },
        },

        colors: ['#009688'],   // teal color like screenshot

        dataLabels: {
            enabled: false,
        },

        xaxis: {
            categories: [
                '1 visit',
                '2-3 visits',
                '4-6 visits',
                '7-10 visits',
                '11+ visits',
            ],
            labels: { style: { fontSize: '12px' } },
        },

        yaxis: {
            labels: { style: { fontSize: '12px' } },
        },

        grid: {
            borderColor: '#e0e0e0',
            strokeDashArray: 4,
        },

        title: {
            text: 'Follow-up Intensity',
            align: 'left',
            style: { fontSize: '16px', fontWeight: 600 },
        },

        subtitle: {
            text: 'Visits per patient',
            align: 'left',
            style: { fontSize: '12px', color: '#888' },
        },
    };

    return (
        <Chart
            options={options}
            series={series}
            type="bar"
            height={350}
        />
    );
};

export default FollowUpIntensity;
