import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Button } from "react-native";
import { getMovieById } from "@/services/movieService";
import { getLocalPoster } from "@/utils/getLocalPoster";
import { Image } from "react-native";

type Movie = {
  id: number;
  title: string;
  description: string;
  category: string;
  runtime: number;
  isActive: boolean;
  ageRating: string;
  releaseDate: string;
};

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Safely handle if id is a string or array
    const movieId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id ?? "0");
  
    if (movieId) {
      getMovieById(movieId)
        .then(setMovie)
        .catch((err) => {
          console.error("❌ Failed to load movie:", err);
          setMovie(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);
  
  

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Movie not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={getLocalPoster(movie.title ?? "")}
        style={styles.poster}
        resizeMode="cover"
      />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.label}>Category: <Text style={styles.text}>{movie.category}</Text></Text>
      <Text style={styles.label}>Rating: <Text style={styles.text}>{movie.ageRating}</Text></Text>
      <Text style={styles.label}>Runtime: <Text style={styles.text}>{movie.runtime} min</Text></Text>
      <Text style={styles.label}>Release Date: <Text style={styles.text}>{new Date(movie.releaseDate).toLocaleDateString()}</Text></Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.text}>{movie.description}</Text>

      {/* 👇 Optional: Buy Tickets Button */}
      <View style={styles.buttonWrapper}>
        <Button title="Buy Tickets" onPress={() => alert("Redirect to Buy Tickets screen")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#111",
    flex: 1,
  },
  poster: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 10,
  },
  text: {
    color: "#eee",
    fontSize: 16,
  },
  buttonWrapper: {
    marginTop: 30,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
  },
});
