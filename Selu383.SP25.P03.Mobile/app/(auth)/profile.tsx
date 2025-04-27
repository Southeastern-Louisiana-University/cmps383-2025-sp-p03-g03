import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import QRCode from "react-native-qrcode-svg";
import theme from "@/styles/theme";

const ProfileScreen = () => {
  const auth = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = auth?.user?.id;

  useEffect(() => {
    const fetchTickets = async () => {
      if (!userId) return;

      try {
        const res = await fetch(
          `https://cmps383-2025-sp25-p03-g03.azurewebsites.net/api/userticket/GetByUserId/${userId}`
        );
        const data = await res.json();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Welcome, {auth?.user?.userName}</Text>

      {tickets.length === 0 ? (
        <Text style={styles.noTicketsText}>No tickets found.</Text>
      ) : (
        tickets.map((ticket: any, index) => (
          <View key={index} style={styles.ticketCard}>
            <Text style={styles.ticketMovie}>Movie: {ticket.movieTitle || "Unknown"}</Text>
            <Text style={styles.ticketDetail}>Date: {ticket.date}</Text>
            <Text style={styles.ticketDetail}>Time: {ticket.time}</Text>

            <View style={styles.qrCodeContainer}>
              <QRCode value={JSON.stringify(ticket)} size={150} />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  headerText: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  noTicketsText: {
    color: theme.colors.border,
  },
  ticketCard: {
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ticketMovie: {
    color: theme.colors.text,
    fontWeight: "bold",
    marginBottom: 6,
  },
  ticketDetail: {
    color: theme.colors.text,
  },
  qrCodeContainer: {
    marginTop: 16,
    alignItems: "center",
  },
});

export default ProfileScreen;
