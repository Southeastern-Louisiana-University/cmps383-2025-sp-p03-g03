import { QRCodeSVG } from "qrcode.react";

interface QRCodeComponentProps {
  userId: number;
  ticketId: number; // Added to match MyTickets
  value: string; // Added to match MyTickets
}

export default function QRCodeComponent({
  ticketId,
  value,
}: QRCodeComponentProps) {
  return (
    <div className="text-center">
      <QRCodeSVG value={value} size={128} className="mx-auto" />
      <p className="mt-2 text-sm text-gray-600">Ticket ID: {ticketId}</p>
    </div>
  );
}
