//everything in here is exapmle code from chatgpt -- this is strictly proof of concept at the moment.

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeComponentProps {
  userId: number;
}

export default function QRCodeComponent({ userId }: QRCodeComponentProps) {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        const response = await fetch(`/api/UserTicket/GetByUserId/${userId}`);
        const result = await response.json();

        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserTickets();
  }, []);

  return (
    <div>
      <h1>Your QR Code</h1>
      <QRCodeSVG value={data} />
    </div>
  );
}
