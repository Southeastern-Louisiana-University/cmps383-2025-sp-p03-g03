import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { getMovieById } from "@/services/movieService";
import { getLocalPoster } from "@/utils/getLocalPoster";

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
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const movieId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id ?? "0");

    if (movieId) {
      getMovieById(movieId)
        .then(setMovie)
        .catch((err) => {
          console.error("Failed to load movie:", err);
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

  const stretchedTitles = [
    "duneparttwo",
    "kingdomoftheplanetoftheapes"
  ];
  
  const formattedTitle = movie.title?.toLowerCase().replace(/[^a-z0-9]/gi, "");
  const isStretched = stretchedTitles.includes(formattedTitle ?? "");
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <Image
        source={getLocalPoster(movie.title ?? "")}
        style={isStretched ? styles.posterFixed : styles.poster}
        resizeMode="contain"
      />

        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.label}>
          Category: <Text style={styles.text}>{movie.category}</Text>
        </Text>
        <Text style={styles.label}>
          Rating: <Text style={styles.text}>{movie.ageRating}</Text>
        </Text>
        <Text style={styles.label}>
          Runtime: <Text style={styles.text}>{movie.runtime} min</Text>
        </Text>
        <Text style={styles.label}>
          Release Date:{" "}
          <Text style={styles.text}>
            {new Date(movie.releaseDate).toLocaleDateString()}
          </Text>
        </Text>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.text}>{movie.description}</Text>
      </ScrollView>

      {/* Custom Styled Buy Tickets Button */}
      <View style={styles.buttonWrapper}>
        <Pressable
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/buytickets",
              params: { id: movie.id },
            })
          }
        >
          <Text style={styles.buttonText}>Buy Tickets</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: "center",
  },
  posterFixed: {
    width: "100%",
    height: 240,
    borderRadius: 10,
    marginBottom: 20,
  },
  
  title: {
    color: "#a5b4fc",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    color: "#a5b4fc",
    fontSize: 16,
    marginTop: 10,
  },
  text: {
    color: "#eee",
    fontSize: 16,
  },
  buttonWrapper: {
    padding: 16,
    backgroundColor: "#111",
  },
  button: {
    backgroundColor: "#a5b4fc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
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
