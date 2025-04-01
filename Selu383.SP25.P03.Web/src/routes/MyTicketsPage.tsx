import QRCodeComponent from "../components/qrCode";
import { useAuth } from "../components/authContext";

export default function MyTickets() {
  const { userId } = useAuth();
  if (!userId) {
    return <p>You need to login to see tickets</p>;
  }

  return <QRCodeComponent userId={parseInt(userId)} />;
}
