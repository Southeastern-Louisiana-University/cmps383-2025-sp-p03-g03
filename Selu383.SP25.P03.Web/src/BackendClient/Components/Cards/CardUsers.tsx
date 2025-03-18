import React from "react";
import TableDropdown from "../../Components/Dropdowns/TableDropdown";
import DownloadCSV from "../../Components/Processes/DownloadCSV";

interface CardTableProps {
    color?: "light" | "dark";
}

interface Project {
    name: string;
    role: string;
    unit: string;
    company: string;
}

const CardUsers: React.FC<CardTableProps> = ({ color = "light" }) => {
    const projects: Project[] = [
        {
            name: "Chad Delatte",
            role: "Admin",
            unit: "X0479",
            company: "Web Weavers",
        },
        {
            name: "Chris Richard",
            role: "Android Developer",
            unit: "X0543",
            company: "Web Weavers"
        },
        {
            name: "Cohen Schlicher",
            role: "Frontend Developer",
            unit: "X0789",
            company: "Web Weavers"
        },
        {
            name: "Meghan Lawrence",
            role: "Frontend Developer",
            unit: "A7017",
            company: "Web Weavers"
        },
        {
            name: "Peyton Perry",
            role: "Backend Developer",
            unit: "A7017",
            company: "Web Weavers"
        }
    ];

    const getTableHeaderClass = () => {
        return `px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${color === "light"
            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700"}`;
    };

    return (
        <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className={`font-semibold text-lg ${color === "light" ? "text-blueGray-700" : "text-white"}`}>Users</h3>
                    </div>
                    {/* <DownloadCSV data={projects} fileName="Users" /> */}
                    <DownloadCSV 
                    data={projects as unknown as Record<string, unknown>[]} 
                    fileName="Users" 
                    />
                </div>
            </div>

            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                        <tr>
                            <th className={getTableHeaderClass()}>Name</th>
                            <th className={getTableHeaderClass()}>Role</th>
                            <th className={getTableHeaderClass()}>Unit</th>
                            <th className={getTableHeaderClass()}>Company</th>
                            <th className={getTableHeaderClass()}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project, index) => (
                            <tr key={index}>
                                <td className="text-left border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <span className={`ml-3 font-bold ${color === "light" ? "text-blueGray-600" : "text-white"}`}>{project.name}</span>
                                </td>
                                <td className="text-left border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{project.role}</td>
                                <td className="text-left border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{project.unit}</td>
                                <td className="text-left border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{project.company}</td>
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

export default CardUsers;
