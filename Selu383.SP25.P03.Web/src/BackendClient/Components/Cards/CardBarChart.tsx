import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js/auto';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const CardBarChart: React.FC = () => {
    React.useEffect(() => {
        const options: ChartOptions<'bar'> = {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                title: {
                    display: false,
                    text: "Orders Chart",
                },
                legend: {
                    position: 'bottom',
                    align: 'end',
                    labels: {
                        color: "rgba(0,0,0,.4)",
                    },
                },
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    display: false,
                    title: {
                        display: true,
                        text: "Month"
                    },
                    grid: {
                        //borderDash: [2,2],

                        //borderDashOffset: 2,
                        color: "rgba(33, 37, 41, 0.3)",
                    },
                },
                y: {
                    display: true,
                    title: {
                        display: false,
                        text: "Value"
                    },
                    grid: {
                        //borderDash: [2],
                        //drawBorder: false,
                        //borderDashOffset: 2,
                        color: "rgba(33, 37, 41, 0.2)",
                    },
                },
            },
        };

        const data: ChartData<'bar'> = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: new Date().getFullYear().toString(),
                    backgroundColor: "#ed64a6",
                    borderColor: "#ed64a6",
                    data: [30, 78, 56, 34, 100, 45, 13],
                    barThickness: 8,
                },
                {
                    label: (new Date().getFullYear() - 1).toString(),
                    backgroundColor: "#4c51bf",
                    borderColor: "#4c51bf",
                    data: [27, 68, 86, 74, 10, 4, 87],
                    barThickness: 8,
                },
            ],
        };

        const ctx = (document.getElementById("bar-chart") as HTMLCanvasElement).getContext("2d")!;
        new ChartJS(ctx, {
            type: 'bar',
            data,
            options
        });
    }, []);

    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                            Performance
                        </h6>
                        <h2 className="text-blueGray-700 text-xl font-semibold">
                            Total orders
                        </h2>
                    </div>
                </div>
            </div>
            <div className="p-4 flex-auto">
                <div className="relative h-350-px">
                    <canvas id="bar-chart"></canvas>
                </div>
            </div>
        </div>
    );
};

export default CardBarChart;