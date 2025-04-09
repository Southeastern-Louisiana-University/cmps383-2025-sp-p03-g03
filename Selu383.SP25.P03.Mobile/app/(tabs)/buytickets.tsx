import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "expo-router";
import { getMovies, getMovieScheduleDetails } from "@/services/movieService";
import { getLocalPoster } from "@/utils/getLocalPoster"; // Assuming you have this utility to get posters

type MovieSchedule = {
  id: number;
  movieId: number;
  isActive: boolean;
  movieTimes: string[];
};

type Movie = {
  id: number;
  title: string;
};

export default function BuyTickets() {
  const navigation = useNavigation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [schedules, setSchedules] = useState<Record<number, MovieSchedule[]>>({});
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
    async function fetchData() {
      try {
        const movieList = await getMovies();
        setMovies(movieList);

        const scheduleMap: Record<number, MovieSchedule[]> = {};
        for (const movie of movieList) {
          try {
            const sched = await getMovieScheduleDetails(movie.id);
            scheduleMap[movie.id] = sched;
          } catch (err) {
            scheduleMap[movie.id] = [];
          }
        }

        setSchedules(scheduleMap);
      } catch (err) {
        console.error("❌ Error loading movies or schedules:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Text style={styles.text}>Loading showtimes...</Text>
      ) : (
        movies.map((movie) => {
          const movieSchedule = schedules[movie.id] ?? [];

          return (
            <View key={movie.id} style={styles.movieBlock}>
              <Image
                source={getLocalPoster(movie.title)} // Assuming this function gives you the poster
                style={styles.poster}
                resizeMode="cover"
              />
              <Text style={styles.movieTitle}>{movie.title}</Text>

              {movieSchedule.length === 0 ? (
                <Text style={styles.text}>No showtimes available.</Text>
              ) : (
                movieSchedule.map((sched, i) => {
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
                                  Alert.alert(
                                    "🎟️ Showtime Selected",
                                    `You selected:\n${new Date(time).toLocaleString()}`
                                  )
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
  movieBlock: {
    marginBottom: 40,
    alignItems: "center",
  },
  poster: {
    width: "100%",
    height: 260,
    borderRadius: 10,
    marginBottom: 12,
  },
  movieTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
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
