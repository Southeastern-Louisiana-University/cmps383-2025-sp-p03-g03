import { QRCodeSVG } from "qrcode.react";

interface QRCodeComponentProps {
  userId: number;
  ticketId: number;
}

export default function QRCodeComponent({ ticketId }: QRCodeComponentProps) {
  const ticketUrl = `${window.location.origin}/ticket/${ticketId}`;

  return (
    <div className="text-center">
      <QRCodeSVG value={ticketUrl} size={128} className="mx-auto" />
    </div>
  );
}
