
import React from "react";
// components

import CardTableOrders from "../../Cards/CardTableOrders"

const Orders: React.FC = () => {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full  px-4">
                    <CardTableOrders />
                </div>

            </div>

        </>
    );
};

export default Orders;