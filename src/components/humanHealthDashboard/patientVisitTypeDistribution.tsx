import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const PatientVisitTypeDistribution: React.FC = () => {
  const series = [
    {
      name: "Emergency",
      data: [1500, 1200, 1800],
    },
    {
      name: "Follow-up",
      data: [7000, 6500, 4000],
    },
    {
      name: "New",
      data: [5000, 4800, 3500],
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
        horizontal: false,
        columnWidth: "55%",
      },
    },

    colors: ["#c62828", "#009688", "#2196f3"], // Emergency, Follow-up, New

    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: 1,
      colors: ["#fff"],
    },

    grid: {
      borderColor: "#e0e0e0",
      strokeDashArray: 4,
    },

    xaxis: {
      categories: ["New", "Scheduled", "Walk-in"],
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },

    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },

    legend: {
      position: "bottom",
    },

    tooltip: {
      shared: true,
      intersect: false,
    },
    title: {
        text: 'Patient Visit Type Distribution',
        align: 'left'
    }
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

export default PatientVisitTypeDistribution;
