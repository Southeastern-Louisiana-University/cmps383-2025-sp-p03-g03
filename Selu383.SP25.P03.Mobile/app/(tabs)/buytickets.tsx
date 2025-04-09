import React, { useLayoutEffect, useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { getMovieScheduleDetails } from "@/services/movieService";

export default function BuyTickets() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const movieId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id ?? "0");

  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/images/m2i8N4b1H7d3Z5K9.png")}
            style={{ width: 30, height: 30, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
            Buy Tickets
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#fceda5",
      },
    });
  }, [navigation]);

  useEffect(() => {
    if (!movieId) return;
    getMovieScheduleDetails(movieId)
      .then(setSchedule)
      .catch((err) => console.error("❌ Error loading schedule:", err))
      .finally(() => setLoading(false));
  }, [movieId]);

  const groupByDay = (times: string[]) => {
    const grouped: Record<string, string[]> = {};
    times.forEach((t) => {
      const d = new Date(t);
      const date = d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(t);
    });
    return grouped;
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Text style={styles.text}>Loading schedule...</Text>
      ) : schedule.length === 0 ? (
        <Text style={styles.text}>No showtimes found.</Text>
      ) : (
        schedule.map((sched, i) => {
          const grouped = groupByDay(sched.movieTimes);
          return (
            <View key={i} style={styles.groupContainer}>
              {Object.entries(grouped).map(([day, times], j) => (
                <View key={j} style={styles.dayBlock}>
                  <Text style={styles.dayTitle}>{day}</Text>
                  <View style={styles.timeContainer}>
                    {times.map((time, k) => (
                      <TouchableOpacity
                        key={k}
                        style={styles.timeButton}
                        onPress={() =>
                          Alert.alert("🎟️ Showtime Selected", `You selected:\n${new Date(time).toLocaleString()}`)
                        }
                      >
                        <Text style={styles.timeText}>
                          {new Date(time).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a5b4fc",
    padding: 16,
  },
  text: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  groupContainer: {
    marginBottom: 30,
  },
  dayBlock: {
    paddingVertical: 20,
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    marginTop: 10,
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
    elevation: 2,
  },
  timeText: {
    color: "#000",
    fontWeight: "bold",
  },
});
