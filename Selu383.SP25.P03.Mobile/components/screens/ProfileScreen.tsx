import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { getTicketsByUserId } from "@/services/ticketService";
import QRCode from "react-native-qrcode-svg";

interface Ticket {
  id: number;
  movieTitle: string;
  showTime: string;
  theaterName: string;
  seatNumber?: string;
}

const ProfileScreen = () => {
  const auth = useContext(AuthContext);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!auth?.user?.id) return;

      try {
        const data = await getTicketsByUserId(auth.user.id);
        setTickets(data);
      } catch (err: any) {
        console.error("Failed to fetch tickets:", err);
        setError("Failed to load your tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [auth?.user?.id]);

  if (!auth?.user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>You must be logged in to view this page.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome, {auth.user.userName}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#a5b4fc" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : tickets.length === 0 ? (
        <Text style={styles.noTickets}>You don't have any tickets yet.</Text>
      ) : (
        tickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketCard}>
            <Text style={styles.ticketTitle}>{ticket.movieTitle}</Text>
            <Text>Showtime: {ticket.showTime}</Text>
            <Text>Theater: {ticket.theaterName}</Text>
            {ticket.seatNumber && <Text>Seat: {ticket.seatNumber}</Text>}
            <View style={styles.qrContainer}>
              <QRCode value={JSON.stringify(ticket)} size={100} />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#000",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  ticketCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: "#a5b4fc",
    borderWidth: 1,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#fff",
  },
  qrContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  errorText: {
    color: "#ff4d4f",
    textAlign: "center",
    marginTop: 20,
  },
  noTickets: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#000",
  },
});

export default ProfileScreen;
