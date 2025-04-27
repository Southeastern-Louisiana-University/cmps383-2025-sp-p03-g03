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
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import {
  getMovieById,
  getMovieScheduleDetails,
  getActiveTheaters,
} from "@/services/movieService";
import type { Movie } from "@/services/movieService";
import theme from "@/styles/theme";

type MovieSchedule = {
  id: number;
  movieId: number;
  isActive: boolean;
  movieTimes: string[];
  roomId: number;
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
  const [selectedFullTime, setSelectedFullTime] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

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
        backgroundColor: theme.colors.notification,
      },
      headerTintColor: "#000",
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
          const theaters = await getActiveTheaters();
          const theater = theaters.find((t) => t.id.toString() === theaterId.toString());
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
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const posterSource =
    movie.poster && movie.poster.length > 0
      ? { uri: `data:${movie.poster[0].imageType};base64,${movie.poster[0].imageData}` }
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
                            setSelectedFullTime(time);
                            setSelectedScheduleId(sched.id);
                            setSelectedRoomId(sched.roomId);
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
                router.push({
                  pathname: "/selectseats",
                  params: {
                    movieId: movieId.toString(),
                    scheduleId: selectedScheduleId?.toString() || "",
                    roomId: selectedRoomId?.toString() || "",
                    theaterName: selectedTheaterName || "",
                    movieTitle: movie.title,
                    time: selectedFullTime || "",
                  },
                });
              }}
            >
              <Text style={styles.confirmButtonText}>Select Seats</Text>
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
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  poster: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: theme.colors.card,
  },
  movieTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 6,
  },
  theaterName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  text: {
    color: theme.colors.text,
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
    borderBottomColor: theme.colors.border,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 12,
    marginTop: 10,
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeButton: {
    backgroundColor: theme.colors.notification,
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
    backgroundColor: theme.colors.notification,
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
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: theme.colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
});
