import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import theme from "@/styles/theme";

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

const seatTypeColors: Record<number, string> = {
  1: "#fceda5",
  2: "#a855f7",
  3: "#f97316",
  4: "#3b82f6",
};

export default function SelectSeats() {
  const {
    movieId,
    scheduleId,
    roomId,
    theaterName,
    movieTitle,
    time,
    ticket,
  } = useLocalSearchParams();

  const router = useRouter();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testSeats = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      seatTypeId: (index % 4) + 1,
      roomsId: 1,
      isAvailable: true,
      row: String.fromCharCode(65 + Math.floor(index / 10)),
      seatNumber: (index % 10) + 1,
      xPosition: (index % 10) + 1,
      yPosition: Math.floor(index / 10) + 1,
    }));
    setSeats(testSeats);
    setLoading(false);
  }, []);

  const uniqueRows = [...new Set(seats.map((seat) => seat.row.toUpperCase()))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  const seatsByRow = uniqueRows.map((row) =>
    seats.filter((seat) => seat.row.toUpperCase() === row).sort((a, b) => a.seatNumber - b.seatNumber)
  );

  const maxSeatsPerRow = Math.max(...seatsByRow.map((row) => row.length));
  const seatSize = Math.min(30, Math.floor((300 - 40) / maxSeatsPerRow));

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
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const ticketData = {
    id: scheduleId,
    movieTitle: movieTitle?.toString() || "",
    date: "", 
    time: time?.toString() || "",
    theater: roomId?.toString() || "",
    roomId: roomId?.toString() || "", 
  };
  
  const seatParams = {
    ticket: JSON.stringify(ticketData), 
    selectedSeats: JSON.stringify(selectedSeats),
    movieTitle: movieTitle?.toString() || "",
    theaterName: theaterName?.toString() || "",
    time: time?.toString() || "",
    scheduleId: scheduleId?.toString() || "",
  };
  

  const formattedTime = new Date(time as string).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seats for {movieTitle}</Text>
      <Text style={styles.subtitle}>{theaterName} • {formattedTime}</Text>

      <View style={styles.screenBox}>
        <Text style={styles.screenText}>SCREEN</Text>
      </View>

      <ScrollView horizontal>
        <ScrollView>
          <View style={styles.seatMap}>
            {seatsByRow.map((rowSeats, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {rowSeats.map((seat) => (
                  <TouchableOpacity
                    key={seat.id}
                    style={[
                      styles.seatButton,
                      {
                        width: seatSize,
                        height: seatSize,
                        backgroundColor: selectedSeats.some((s) => s.id === seat.id)
                          ? "#22c55e"
                          : seat.isAvailable
                          ? seatTypeColors[seat.seatTypeId] || "#dc2626"
                          : "#dc2626",
                      },
                      selectedSeats.some((s) => s.id === seat.id) && styles.seatSelected,
                    ]}
                    onPress={() => handleSeatSelect(seat)}
                    disabled={!seat.isAvailable}
                  >
                    <Text style={styles.seatText}>{seat.row}{seat.seatNumber}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      <View style={styles.legend}>
        {Object.entries(seatTypeColors).map(([id, color]) => (
          <View key={id} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{["Standard", "Premium", "Recliner", "Accessible"][parseInt(id) - 1]}</Text>
          </View>
        ))}
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#dc2626" }]} />
          <Text style={styles.legendText}>Reserved</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#22c55e" }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.confirmButton, { padding: 12 }, selectedSeats.length === 0 && { opacity: 0.5 }]}
        onPress={() => {
          if (selectedSeats.length === 0) {
            Alert.alert("No seats selected", "Please select at least one seat.");
            return;
          }
          router.push({ pathname: "/checkout", params: seatParams });
        }}
        disabled={selectedSeats.length === 0}
      >
        <Text style={styles.confirmText}>Proceed to Checkout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.concessionsButton, { padding: 12 }]}
        onPress={() => router.push({ pathname: "/concessions", params: seatParams })}
      >
        <Text style={styles.concessionsText}>🍿 Add Concessions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
    color: theme.colors.text,
  },
  screenBox: {
    backgroundColor: theme.colors.notification,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  screenText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 28,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
    marginVertical: 4,
  },
  legendDot: {
    width: 14,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  legendText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  seatMap: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 28,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 4,
  },
  seatButton: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 50,
  },
  seatSelected: {
    borderWidth: 2,
    borderColor: "#000",
  },
  seatText: {
    fontSize: 9,
    color: "#fff",
  },
  confirmButton: {
    backgroundColor: theme.colors.notification,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  confirmText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
  },
  concessionsButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    marginTop: 18,
    marginBottom: 26,
    alignItems: "center",
  },
  concessionsText: {
    color: theme.colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});