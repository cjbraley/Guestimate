<template>
    <Line
        :chart-data="chartData"
        :chart-options="chartOptions"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
        :plugins="plugins"
    />
</template>

<script setup>
//IMPORTS
import { reactive } from "vue";
import { Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler,
} from "chart.js";

// CHART
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler
);

// DATA
const chartData = reactive({
    labels: [2022, 2023, 2024, 2025, 2026, 2027, 2028],
    datasets: [
        {
            label: "Savings",
            backgroundColor: "rgba(255, 150, 150, 0.5)",
            borderColor: "rgba(255, 150, 150, 0.5)",
            data: [40, 39, 10, 40, 39, 80, 40],
            fill: true,
        },
        {
            label: "Income",
            backgroundColor: "#1B9C73",
            borderColor: "#1B9C73",
            data: [10, 20, 30, 40, 50, 60, 70],
            fill: true,
        },
    ],
});
const chartOptions = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: (ctx) =>
                "Chart.js Line Chart - stacked=" +
                ctx.chart.options.scales.y.stacked,
        },
        tooltip: {
            mode: "index",
        },
    },
    interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "Month",
            },
        },
        y: {
            display: false,
            stacked: true,
            title: {
                display: true,
                text: "Value",
            },
        },
    },
};
</script>

<style lang="scss" scoped></style>
