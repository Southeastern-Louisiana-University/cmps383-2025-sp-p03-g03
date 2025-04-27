import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import { getMovies } from "@/services/movieService";
import { useRouter } from "expo-router";
import type { Movie } from "@/services/movieService";
import theme from "@/styles/theme";

export default function Index() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getMovies()
      .then((data) => {
        setMovies(data);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={styles.listContainer}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          renderItem={({ item }) => {
            const stretchedTitles = [
              "duneparttwo",
              "godzillaxkongthenewempire",
              "kingdomoftheplanetoftheapes",
              "ghostbustersfrozenempire",
            ];
            const formatted = item.title
              ?.toLowerCase()
              .replace(/[^a-z0-9]/gi, "");
            const isStretched = stretchedTitles.includes(formatted ?? "");

            const posterSource =
              item.poster && item.poster.length > 0
                ? {
                    uri: `data:${item.poster[0].imageType};base64,${item.poster[0].imageData}`,
                  }
                : require("@/assets/images/posters/fallback.jpg");

            return (
              <Pressable
                onPress={() => router.push(`/movies/${item.id}`)}
                style={styles.posterCard}
              >
                <Image
                  source={posterSource}
                  style={
                    isStretched ? styles.posterImageFixed : styles.posterImage
                  }
                  resizeMode="cover"
                />
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    paddingBottom: 20,
  },
  posterCard: {
    flex: 1,
    margin: 8,
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  posterImage: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 10,
  },
  posterImageFixed: {
    width: "100%",
    height: 260,
    borderRadius: 10,
    resizeMode: "cover",
  },
});
