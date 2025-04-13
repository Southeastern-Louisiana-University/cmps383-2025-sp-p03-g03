import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import {
  getMovieById,
  getMovieScheduleDetails,
  getTheaters,
} from "@/services/movieService";
import type { Movie } from "@/services/movieService";
import { Ionicons } from "@expo/vector-icons";

type MovieSchedule = {
  id: number;
  movieId: number;
  isActive: boolean;
  movieTimes: string[];
};

export default function BuyTickets() {
  const { id, theaterId } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  const movieId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id ?? "0");

  const [movie, setMovie] = useState<Movie | null>(null);
  const [schedule, setSchedule] = useState<MovieSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheaterName, setSelectedTheaterName] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
            Showtimes
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#fceda5",
      },
      // headerLeft: () => (
      //   <TouchableOpacity onPress={() => router.back()}>
      //     <Ionicons
      //       name="arrow-back"
      //       size={24}
      //       color="#000"
      //       style={{ marginLeft: 16 }}
      //     />
      //   </TouchableOpacity>
      // ),
    });
  }, [navigation]);

  useEffect(() => {
    async function fetchData() {
      try {
        const movieData = await getMovieById(movieId);
        setMovie(movieData);

        const scheduleData = await getMovieScheduleDetails(movieId);
        setSchedule(scheduleData);

        if (theaterId) {
          const theaters = await getTheaters();
          const theater = theaters.find(
            (t) => t.id.toString() === theaterId.toString()
          );
          if (theater) {
            setSelectedTheaterName(theater.name);
          }
        }
      } catch (err) {
        console.error("❌ Failed to load movie or schedule:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [movieId, theaterId]);

  const groupByDay = (times: string[]) => {
    const grouped: Record<string, string[]> = {};
    times.forEach((t) => {
      const d = new Date(t);
      const date = d.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(t);
    });
    return grouped;
  };

  if (loading || !movie) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#a5b4fc" />
      </View>
    );
  }

  const posterSource =
    movie.poster && movie.poster.length > 0
      ? {
          uri: `data:${movie.poster[0].imageType};base64,${movie.poster[0].imageData}`,
        }
      : require("@/assets/images/posters/fallback.jpg");

  return (
    <ScrollView style={styles.container}>
      <Image source={posterSource} style={styles.poster} resizeMode="contain" />
      <Text style={styles.movieTitle}>{movie.title}</Text>

      {selectedTheaterName && (
        <Text style={styles.theaterName}>📍 {selectedTheaterName}</Text>
      )}

      {schedule.length === 0 ? (
        <Text style={styles.text}>No showtimes available.</Text>
      ) : (
        schedule.map((sched, i) => {
          const grouped = groupByDay(sched.movieTimes);
          return (
            <View key={i} style={styles.groupContainer}>
              {Object.entries(grouped).map(([day, times], j) => (
                <View key={j} style={styles.dayBlock}>
                  <Text style={styles.dayTitle}>{day}</Text>
                  <View style={styles.timeContainer}>
                    {times.map((time, k) => {
                      const d = new Date(time);
                      const showTime = d.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      });
                      const dayStr = d.toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      });

                      return (
                        <TouchableOpacity
                          key={k}
                          style={styles.timeButton}
                          onPress={() => {
                            setSelectedTime(showTime);
                            setSelectedDay(dayStr);
                            setModalVisible(true);
                          }}
                        >
                          <Text style={styles.timeText}>{showTime}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          );
        })
      )}

      {/* 🎟️ Custom Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎟️ Showtime Selected</Text>
            <Text style={styles.modalText}>
              {selectedDay} at {selectedTime}
            </Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                setModalVisible(false);
                Alert.alert("✅ Confirmed", "Your ticket is reserved!");
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a5b4fc",
    padding: 16,
  },
  poster: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#000",
  },
  movieTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 6,
  },
  theaterName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
  },
  text: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
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
    backgroundColor: "#fceda5",
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fceda5",
    padding: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#a5b4fc",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
