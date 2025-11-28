
import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

const DiseaseDistribution = () => {
    const data = [
        {
            data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
    ]

    return (
        <Chart
            options={{
                plotOptions: {
                    bar: {
                        horizontal: true,
                    },
                },
                colors: COLORS,
                dataLabels: {
                    enabled: false,
                },
                xaxis: {
                    categories: [
                        'South Upper RespiratoryInfection',
                        'Hypertension',
                        'Type 2 Diabetes',
                        'Netherlands',
                        'Gastroenteritis',
                        'Dermatitis',
                        'Migraine',
                        'Asthma States',
                        'Arthritis',
                       
                    ],
                },
                title: {
                    text: 'Disease Distribution',
                    align: 'left',
                },
            }}
            series={data}
            type="bar"
            height={300}
        />
    )
}

export default DiseaseDistribution

