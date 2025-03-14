
import React from "react";
import CardSettings from "../../Cards/CardSettings";
import CardProfile from "../../Cards/CardProfile";

const Settings: React.FC = () => {
    return (
        <div className="flex flex-wrap">
            <div className="w-full lg:w-8/12 px-4">
                <CardSettings />
            </div>
            <div className="w-full lg:w-4/12 px-4">
                <CardProfile />
            </div>
        </div>
    );
};

export default Settings;