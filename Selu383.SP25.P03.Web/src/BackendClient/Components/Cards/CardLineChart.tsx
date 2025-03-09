import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from 'chart.js/auto';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CardLineChart: React.FC = () => {
    React.useEffect(() => {
        const options: ChartOptions<'line'> = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                title: {
                    display: false,
                    text: "Sales Charts",
                    color: "white",
                },
                legend: {
                    position: 'bottom',
                    align: 'end',
                    labels: {
                        color: "white",
                    },
                },
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    ticks: {
                        color: "rgba(255,255,255,.7)",
                    },
                    display: true,
                    title: {
                        display: false,
                        text: "Month",
                        color: "white",
                    },
                    grid: {
                        display: false,
                        color: "rgba(33, 37, 41, 0.3)",
                    },
                },
                y: {
                    ticks: {
                        color: "rgba(255,255,255,.7)",
                    },
                    display: true,
                    title: {
                        display: false,
                        text: "Value",
                        color: "white",
                    },
                    grid: {
                        //drawBorder: false,
                        color: "rgba(255, 255, 255, 0.15)",
                    },
                },
            },
        };

        const data: ChartData<'line'> = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: new Date().getFullYear().toString(),
                    backgroundColor: "#4c51bf",
                    borderColor: "#4c51bf",
                    data: [65, 78, 66, 44, 56, 67, 75],
                    fill: false,
                },
                {
                    label: (new Date().getFullYear() - 1).toString(),
                    backgroundColor: "#fff",
                    borderColor: "#fff",
                    data: [40, 68, 86, 74, 56, 60, 87],
                    fill: false,
                },
            ],
        };

        const ctx = (document.getElementById("line-chart") as HTMLCanvasElement).getContext("2d")!;
        new ChartJS(ctx, {
            type: 'line',
            data,
            options
        });
    }, []);

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                            Overview
                        </h6>
                        <h2 className="text-white text-xl font-semibold">Sales value</h2>
                    </div>
                </div>
            </div>
            <div className="p-4 flex-auto">
                <div className="relative h-350-px">
                    <canvas id="line-chart"></canvas>
                </div>
            </div>
        </div>
    );
};

export default CardLineChart;