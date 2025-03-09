import React from "react";
import TableDropdown from "../../Components/Dropdowns/TableDropdown";


interface CardTableProps {
    color?: "light" | "dark";
}

interface Project {
    name: string;
    image: string;
    budget: string;
    status: {
        color: string;
        text: string;
    };
    users: string[];
    completion: {
        percent: number;
        color: string;
    };
}

const CardTable: React.FC<CardTableProps> = ({ color = "light" }) => {
    const projects: Project[] = [
        {
            name: "Argon Design System",
            image: "../src/assets/img/bootstrap.jpg",
            budget: "$2,500 USD",
            status: { color: "text-orange-500", text: "pending" },
            users: [
                "../src/assets/img/team-1-800x800.jpg",
                "../src/assets/img/team-2-800x800.jpg",
                "../src/assets/img/team-3-800x800.jpg",
                "../src/assets/img/team-4-470x470.png"
            ],
            completion: { percent: 60, color: "red" }
        },
        {
            name: "Angular Now UI Kit PRO",
            image: "../src/assets/img/angular.jpg",
            budget: "$1,800 USD",
            status: { color: "text-emerald-500", text: "completed" },
            users: [
                "../src/assets//img/team-1-800x800.jpg",
                "../src/assets//img/team-2-800x800.jpg",
                "../src/assets//img/team-3-800x800.jpg",
                "../src/assets//img/team-4-470x470.png"
            ],
            completion: { percent: 100, color: "emerald" }
        }
        // Add other projects...
    ];

    const getTableHeaderClass = () => {
        return `px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${color === "light"
            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700"
            }`;
    };

    return (
        <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"
            }`}>
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className={`font-semibold text-lg ${color === "light" ? "text-blueGray-700" : "text-white"
                            }`}>
                            Card Tables
                        </h3>
                    </div>
                </div>
            </div>

            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                        <tr>
                            <th className={getTableHeaderClass()}>Project</th>
                            <th className={getTableHeaderClass()}>Budget</th>
                            <th className={getTableHeaderClass()}>Status</th>
                            <th className={getTableHeaderClass()}>Users</th>
                            <th className={getTableHeaderClass()}>Completion</th>
                            <th className={getTableHeaderClass()}></th>
                        </tr>
                    </thead>

                    <tbody>
                        {projects.map((project, index) => (
                            <tr key={index}>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                                    <img
                                        src={project.image}
                                        className="h-12 w-12 bg-white rounded-full border"
                                        alt="project"
                                    />
                                    <span className={`ml-3 font-bold ${color === "light" ? "text-blueGray-600" : "text-white"
                                        }`}>
                                        {project.name}
                                    </span>
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    {project.budget}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <i className={`fas fa-circle ${project.status.color} mr-2`}></i>
                                    {project.status.text}
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex">
                                        {project.users.map((user, i) => (
                                            <img
                                                key={i}
                                                src={user}
                                                alt="user"
                                                className={`w-10 h-10 rounded-full border-2 border-blueGray-50 shadow ${i > 0 ? "-ml-4" : ""
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex items-center">
                                        <span className="mr-2">{project.completion.percent}%</span>
                                        <div className="relative w-full">
                                            <div className={`overflow-hidden h-2 text-xs flex rounded bg-${project.completion.color}-200`}>
                                                <div
                                                    style={{ width: `${project.completion.percent}%` }}
                                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${project.completion.color}-500`}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                    <TableDropdown />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CardTable;