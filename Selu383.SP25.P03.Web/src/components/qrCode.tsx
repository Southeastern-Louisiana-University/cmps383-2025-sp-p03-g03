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
        const response = await fetch(
          `https://localhost:7027/api/UserTicket/GetByUserId/${userId}`
        );
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
