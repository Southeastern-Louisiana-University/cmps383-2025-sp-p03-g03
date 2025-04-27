import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

interface Seat {
  id: number;
  seatTypeId: number;
  roomsId: number;
  isAvailable: boolean;
  row: string;
  seatNumber: number;
  xPosition: number;
  yPosition: number;
}

export default function SelectSeats() {
  const { movieId, scheduleId, roomId, theaterName, movieTitle, time } =
    useLocalSearchParams();
  const router = useRouter();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      if (!roomId) {
        console.warn("No room ID provided. Using test data.");
        setSeats(generateTestSeats(0));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://cmps383-2025-sp25-p03-g03.azurewebsites.net/api/seat/GetByRoomId/${roomId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch seats: ${response.status}`);
        }
        const data = await response.json();
        setSeats(data);
      } catch (error) {
        console.error("Error fetching seats:", error);
        Alert.alert("Error", "Failed to load seats. Using test data.");
        setSeats(generateTestSeats(Number(roomId)));
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [roomId]);

  const generateTestSeats = (roomId: number): Seat[] => {
    const rows = ["A", "B", "C", "D", "E"];
    const seatsPerRow = 8;
    const testSeats: Seat[] = [];

    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        testSeats.push({
          id: rowIndex * seatsPerRow + i,
          seatTypeId: 1,
          roomsId: roomId,
          isAvailable: Math.random() > 0.3,
          row,
          seatNumber: i,
          xPosition: i * 40,
          yPosition: rowIndex * 40,
        });
      }
    });

    return testSeats;
  };

  const handleSeatSelect = (seat: Seat) => {
    if (!seat.isAvailable) return;
    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#a5b4fc" />
      </View>
    );
  }

  const seatParams = {
    selectedSeats: JSON.stringify(selectedSeats),
    movieTitle: movieTitle?.toString() || "",
    theaterName: theaterName?.toString() || "",
    time: time?.toString() || "",
    scheduleId: scheduleId?.toString() || "",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Seats for {movieTitle}</Text>
      <Text style={styles.subtitle}>
        {theaterName} • {time}
      </Text>

      <View style={styles.seatMap}>
        {seats.map((seat) => (
          <TouchableOpacity
            key={seat.id}
            style={[
              styles.seatButton,
              !seat.isAvailable && styles.seatUnavailable,
              selectedSeats.some((s) => s.id === seat.id) && styles.seatSelected,
            ]}
            onPress={() => handleSeatSelect(seat)}
            disabled={!seat.isAvailable}
          >
            <Text style={styles.seatText}>
              {seat.row}
              {seat.seatNumber}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          selectedSeats.length === 0 && { opacity: 0.5 },
        ]}
        onPress={() => {
          if (selectedSeats.length === 0) {
            Alert.alert("No seats selected", "Please select at least one seat.");
            return;
          }
          router.push({
            pathname: "/checkout",
            params: seatParams,
          });
        }}
        disabled={selectedSeats.length === 0}
      >
        <Text style={styles.confirmText}>Proceed to Checkout</Text>
      </TouchableOpacity>

      {/* 🟢 Add to Cart / Add Concessions Button */}
      <TouchableOpacity
        style={styles.concessionsButton}
        onPress={() => {
          router.push({
            pathname: "/concessions",
            params: seatParams, // ✅ Pass seat data into concessions page
          });
        }}
      >
        <Text style={styles.concessionsText}>🍿 Add Concessions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#a5b4fc" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  seatMap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  seatButton: {
    width: 40,
    height: 40,
    margin: 5,
    backgroundColor: "#4b5563",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  seatUnavailable: { backgroundColor: "red" },
  seatSelected: { backgroundColor: "green" },
  seatText: { color: "white" },
  confirmButton: {
    backgroundColor: "#fceda5",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  confirmText: { textAlign: "center", fontWeight: "bold", color: "#000" },
  concessionsButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  concessionsText: { color: "#a5b4fc", fontWeight: "bold", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
