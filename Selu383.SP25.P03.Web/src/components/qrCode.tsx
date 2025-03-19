//everything in here is exapmle code from chatgpt -- this is strictly proof of concept at the moment.

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QRCodeComponent() {
  //first get user data
  //fetch movie data by id -- seat number, theater number, and showtime
  //all of this is to be placed
  const [data, setData] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/getUserTickets");
        const result = await response.json();
        // Assume the data you want is in result.data
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Your QR Code</h1>
      <QRCodeSVG value={data} />
    </div>
  );
}
