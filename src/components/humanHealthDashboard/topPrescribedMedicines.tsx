import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const TopPrescribedMedicines: React.FC = () => {
    const series = [
        {
            name: "Prescriptions",
            data: [5000, 4200, 3600, 3400, 3000, 2600, 2400, 2200, 1800, 1600],
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
        },

        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 4,
            },
        },

        colors: ["#4caf50"],

        dataLabels: {
            enabled: false,
        },

        xaxis: {
            categories: [
                "Paracetamol",
                "Amoxicillin",
                "Metformin",
                "Amlodipine",
                "Omeprazole",
                "Atorvastatin",
                "Salbutamol",
                "Cetirizine",
                "Ibuprofen",
                "Azithromycin",
            ],
        },

        grid: {
            borderColor: "#e0e0e0",
            strokeDashArray: 4,
        },
    };

    return (
        <Chart
            options={options}
            series={series}
            type="bar"
            height={380}
        />
    );
};

export default TopPrescribedMedicines;
