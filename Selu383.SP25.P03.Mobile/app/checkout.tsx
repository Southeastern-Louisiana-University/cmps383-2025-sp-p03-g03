// app/checkout.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

// Mock cart data — replace with global state or API in production
const mockConcessions = [
  { id: "1", name: "Popcorn", quantity: 2, price: 5.0 },
  { id: "2", name: "Soda", quantity: 1, price: 3.0 },
];

export default function Checkout() {
  const router = useRouter();
  const { ticket } = useLocalSearchParams();

  let parsedTicket: any = null;
  try {
    parsedTicket = ticket ? JSON.parse(ticket as string) : null;
  } catch (e) {
    console.warn("Invalid ticket data", e);
  }

  const concessionTotal = mockConcessions.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const ticketTotal = parsedTicket ? 10.0 : 0; // Example ticket price
  const finalTotal = concessionTotal + ticketTotal;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾 Checkout Summary</Text>

      {parsedTicket && (
        <View style={styles.ticketBox}>
          <Text style={styles.sectionTitle}>🎟️ Ticket</Text>
          <Text style={styles.detail}>Movie: {parsedTicket.movieTitle}</Text>
          <Text style={styles.detail}>Date: {parsedTicket.date}</Text>
          <Text style={styles.detail}>Time: {parsedTicket.time}</Text>
          <Text style={styles.detail}>Theater: {parsedTicket.theater}</Text>
          <Text style={styles.price}>Ticket: ${ticketTotal.toFixed(2)}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>🍿 Concessions</Text>
      <FlatList
        data={mockConcessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.name} × {item.quantity}
            </Text>
            <Text style={styles.itemText}>
              ${(item.quantity * item.price).toFixed(2)}
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 12 }}
      />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalPrice}>${finalTotal.toFixed(2)}</Text>
      </View>

      <Pressable
        style={styles.confirmButton}
        onPress={() => {
          Alert.alert("✅ Success", "Your purchase has been confirmed!");
          router.replace("/"); // Or navigate to confirmation screen
        }}
      >
        <Text style={styles.confirmText}>Confirm Purchase</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a5b4fc",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  ticketBox: {
    backgroundColor: "#fceda5",
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
    backgroundColor: "#fceda5",
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
    borderTopColor: "#000",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "#a5b4fc",
    fontSize: 16,
    fontWeight: "bold",
  },
});
