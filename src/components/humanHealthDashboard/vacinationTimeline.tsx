import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const VaccinationTimeline: React.FC = () => {
  const series = [
    {
      name: "Vaccinations",
      data: [2000, 2300, 2600, 2700, 2500, 2700, 3000, 3100, 2800, 3200, 3400, 3600],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    fill: {
      type: "solid",
      opacity: 0.25,
      colors: ["#4b9fe8"],
    },

    dataLabels: { enabled: false },

    markers: {
      size: 0,
    },

    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      labels: {
        style: { colors: "#666" },
      },
      axisTicks: { show: false },
    },

    yaxis: {
      min: 0,
      max: 3600,
      tickAmount: 6,
      labels: {
        style: { colors: "#666" },
      },
    },

    grid: {
      borderColor: "#e0e0e0",
    },

    title: {
      text: "Human Vaccination Timeline",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: 600,
      },
    },

    subtitle: {
      text: "Monthly doses administered",
      align: "left",
      style: {
        fontSize: "12px",
        color: "#888",
      },
    },
  };

  return (
    <Chart options={options} series={series} type="area" height={350} />
  );
};

export default VaccinationTimeline;
