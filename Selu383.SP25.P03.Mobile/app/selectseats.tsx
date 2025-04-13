import { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const rows = 6;
const seatsPerRow = 8;

const generateSeats = () => {
  const seatMap = [];
  for (let row = 0; row < rows; row++) {
    const seatRow = [];
    for (let col = 0; col < seatsPerRow; col++) {
      seatRow.push({ id: `${String.fromCharCode(65 + row)}${col + 1}`, taken: false });
    }
    seatMap.push(seatRow);
  }
  return seatMap;
};

export default function SelectSeats() {
  const navigation = useNavigation();
  const { movieId, theaterId, time, day } = useLocalSearchParams();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats] = useState(generateSeats());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
          Select Seats
        </Text>
      ),
      headerStyle: {
        backgroundColor: "#fceda5",
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#000"
            style={{ marginLeft: 16 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const toggleSeat = (id: string) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Select Your Seats</Text>
      <Text style={styles.details}>
        {day} at {time}
      </Text>
      <View style={styles.screen}>
        <Text style={styles.screenText}>SCREEN</Text>
      </View>
      <View style={styles.seatGrid}>
        {seats.map((row, i) => (
          <View key={i} style={styles.seatRow}>
            {row.map((seat) => (
              <TouchableOpacity
                key={seat.id}
                style={[
                  styles.seat,
                  selectedSeats.includes(seat.id) && styles.selectedSeat,
                  seat.taken && styles.takenSeat,
                ]}
                onPress={() => !seat.taken && toggleSeat(seat.id)}
              >
                <Text style={styles.seatText}>{seat.id}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <Text style={styles.selectedText}>
        Selected: {selectedSeats.join(", ") || "None"}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#a5b4fc",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  screen: {
    backgroundColor: "#000",
    padding: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    borderRadius: 4,
  },
  screenText: {
    color: "#fceda5",
    fontWeight: "bold",
  },
  seatGrid: {
    width: "100%",
    alignItems: "center",
  },
  seatRow: {
    flexDirection: "row",
    marginVertical: 6,
  },
  seat: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  selectedSeat: {
    backgroundColor: "#4ade80",
  },
  takenSeat: {
    backgroundColor: "#9ca3af",
  },
  seatText: {
    color: "#000",
    fontWeight: "bold",
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: "#000",
  },
});
