
import React from "react";
// components
import CardLineChart from "../../Cards/CardLineChart";
import CardBarChart from "../../Cards/CardBarChart";
import HeaderStats from "../../Headers/HeaderStats";
//import CardPageVisits from "../../Cards/CardPageVisits";
//import CardSocialTraffic from "../../Cards/CardSocialTraffic";

const Dashboard: React.FC = () => {
    return (
        <>
            <HeaderStats />
            <div className="-md-48">
            
            <div className="flex flex-wrap">
                <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4" >
                    <CardLineChart />
                </div>
                <div className="w-full xl:w-4/12 px-4">
                    <CardBarChart />
                </div>
            </div>
            </div>
            {/*<div className="flex flex-wrap mt-4">
                <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                    <CardPageVisits />
                </div>
                <div className="w-full xl:w-4/12 px-4">
                    <CardSocialTraffic />
                </div>
            </div>*/}
        </>
    );
};

export default Dashboard;