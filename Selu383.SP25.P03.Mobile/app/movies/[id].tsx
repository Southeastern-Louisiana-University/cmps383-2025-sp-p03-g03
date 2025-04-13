import { useEffect, useState, useLayoutEffect } from "react";
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
import DropDownPicker from "react-native-dropdown-picker";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
import { getMovieById, getTheaters, Movie } from "@/services/movieService";

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  // const navigation = useNavigation();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [theaterOptions, setTheaterOptions] = useState<{ label: string; value: string }[]>([]);
  const [open, setOpen] = useState(false);

 

  useEffect(() => {
    const movieId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id ?? "0");

    async function loadData() {
      try {
        const movieData = await getMovieById(movieId);
        setMovie(movieData);

        const theaters = await getTheaters();
        const dropdownItems = theaters.map((t) => ({
          label: t.name,
          value: t.id.toString(),
        }));
        setTheaterOptions(dropdownItems);
      } catch (err) {
        console.error("Error loading movie or theaters:", err);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#a5b4fc" />
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

  const stretchedTitles = ["duneparttwo", "kingdomoftheplanetoftheapes"];
  const formattedTitle = movie.title?.toLowerCase().replace(/[^a-z0-9]/gi, "");
  const isStretched = stretchedTitles.includes(formattedTitle ?? "");

  const posterSource =
    movie.poster && movie.poster.length > 0
      ? {
          uri: `data:${movie.poster[0].imageType};base64,${movie.poster[0].imageData}`,
        }
      : require("@/assets/images/posters/fallback.jpg");

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={posterSource}
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

        {/* ✅ DropDownPicker for theater selection */}
        <View style={styles.dropdownWrapper}>
          <Text style={styles.label}>Select a Theater:</Text>
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            value={selectedTheater}
            setValue={setSelectedTheater}
            items={theaterOptions}
            setItems={setTheaterOptions}
            placeholder="Choose a theater..."
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownList}
            textStyle={{ fontSize: 14 }}
            listMode="SCROLLVIEW"
            zIndex={999}
          />
        </View>
      </ScrollView>

      {/* ✅ Only show button when a theater is selected */}
      {selectedTheater && (
        <View style={styles.buttonWrapper}>
          <Pressable
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/buytickets",
                params: { id: movie.id, theaterId: selectedTheater },
              })
            }
          >
            <Text style={styles.buttonText}>Buy Tickets</Text>
          </Pressable>
        </View>
      )}
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
    height: 280,
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
  dropdownWrapper: {
    marginTop: 24,
    marginBottom: 16,
    zIndex: 999,
  },
  dropdown: {
    backgroundColor: "#fceda5",
    borderColor: "#ccc",
    borderRadius: 8,
  },
  dropdownList: {
    backgroundColor: "#fceda5",
    borderColor: "#ccc",
    borderRadius: 8,
    maxHeight: 200,
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
