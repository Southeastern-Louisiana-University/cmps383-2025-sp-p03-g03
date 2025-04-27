import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import theme from "@/styles/theme";

export default function Checkout() {
  const router = useRouter();
  const { ticket, selectedSeats, concessions } = useLocalSearchParams();
  const [showQRCode, setShowQRCode] = useState(false);

  let parsedTicket: any = null;
  let parsedSeats: any[] = [];
  let parsedConcessions: any[] = [];

  try {
    parsedTicket = ticket ? JSON.parse(ticket as string) : null;
  } catch (e) {
    console.warn("Invalid ticket data", e);
  }

  try {
    parsedSeats = selectedSeats ? JSON.parse(selectedSeats as string) : [];
  } catch (e) {
    console.warn("Invalid seats data", e);
  }

  try {
    parsedConcessions = concessions ? JSON.parse(concessions as string) : [];
  } catch (e) {
    console.warn("Invalid concessions data", e);
  }

  const concessionTotal = parsedConcessions.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const ticketPricePerSeat = 10.0;
  const ticketTotal = parsedSeats.length * ticketPricePerSeat;
  const finalTotal = concessionTotal + ticketTotal;

  // ✅ FIXED QR DATA - Only sending small essential data:
  const qrData = JSON.stringify({
    ticketId: parsedTicket?.id,
    seats: parsedSeats.map((seat) => ({
      row: seat.row,
      seatNumber: seat.seatNumber,
    })),
    concessions: parsedConcessions.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    })),
    total: finalTotal.toFixed(2),
  });

  const handleConfirm = () => {
    setShowQRCode(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧾 Checkout Summary</Text>

      {parsedTicket && (
        <View style={styles.ticketBox}>
          <Text style={styles.sectionTitle}>🎟️ Ticket Info</Text>
          <Text style={styles.detail}>Movie: {parsedTicket.movieTitle}</Text>
          <Text style={styles.detail}>Date: {parsedTicket.date}</Text>
          <Text style={styles.detail}>Time: {parsedTicket.time}</Text>
          <Text style={styles.detail}>Theater: {parsedTicket.theater}</Text>
        </View>
      )}

      {parsedSeats.length > 0 && (
        <View style={styles.ticketBox}>
          <Text style={styles.sectionTitle}>🪑 Selected Seats</Text>
          {parsedSeats.map((seat, index) => (
            <Text key={index} style={styles.detail}>
              Row {seat.row} Seat {seat.seatNumber}
            </Text>
          ))}
          <Text style={styles.price}>
            Ticket Price: ${ticketTotal.toFixed(2)}
          </Text>
        </View>
      )}

      {parsedConcessions.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>🍿 Concessions</Text>
          {parsedConcessions.map((item) => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.itemText}>
                {item.name} × {item.quantity}
              </Text>
              <Text style={styles.itemText}>
                ${(item.quantity * item.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </>
      )}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalPrice}>${finalTotal.toFixed(2)}</Text>
      </View>

      {!showQRCode ? (
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm Purchase</Text>
        </Pressable>
      ) : (
        <View style={styles.qrContainer}>
          <Text style={styles.sectionTitle}>🎉 Purchase Confirmed!</Text>
          <Text style={styles.detail}>Here is your QR code:</Text>
          <QRCode value={qrData} size={200} />
          <Pressable
            style={[styles.confirmButton, { marginTop: 20 }]}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.confirmText}>Back to Home</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 20,
  },
  ticketBox: {
    backgroundColor: theme.colors.notification,
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    color: "#000",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginTop: 6,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.notification,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: "#000",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: theme.colors.text,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});
