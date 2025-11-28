import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const AgeSexDistribution: React.FC = () => {
  const series = [
    {
      name: "Female",
      data: [300, 500, 800, 700, 400],
    },
    {
      name: "Male",
      data: [-250, -450, -700, -600, -300],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },

    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "65%",
      },
    },

    colors: ["#e91e63", "#1e88e5"],

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: ["11-20", "21-30", "31-40", "51-60", "71+"],
      labels: {
        formatter: (value: number) => Math.abs(value),
      },
    },

    yaxis: {
      title: { text: "" },
    },

    grid: {
      borderColor: "#e0e0e0",
    },

    tooltip: {
      y: {
        formatter: (value: number) => Math.abs(value),
      },
    },

    legend: {
      position: "bottom",
      markers: { width: 14, height: 14, radius: 5 },
    },
  };

  return (
    <Chart options={options} series={series} type="bar" height={350} />
  );
};

export default AgeSexDistribution;
