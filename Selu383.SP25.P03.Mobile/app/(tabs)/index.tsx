import { useState, useEffect } from 'react';
import { Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const API_URL = 'https://your-backend.com/api/movies';

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(API_URL);
      const text = await response.text(); // Get raw text first
      console.log("Raw API Response:", text); // Debugging

      const data = JSON.parse(text); // Try parsing manually
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image source={require('../../assets/images/Kerfin7-NEA-2191.jpg')} style={styles.banner} />
      }>

      <ThemedView style={styles.container}>
        <ThemedText type="title">Now Playing</ThemedText>

        {loading ? (
          <ActivityIndicator size="large" color="#FF4500" />
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.movieItem}
                onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}>
                <Image source={{ uri: item.posterUrl }} style={styles.movieImage} />
                <ThemedText type="subtitle">{item.title}</ThemedText>
              </TouchableOpacity>
            )}
          />
        )}
      </ThemedView>

      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Quick Actions</ThemedText>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Reservations')}>
          <ThemedText type="defaultSemiBold">View My Reservations</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Concessions')}>
          <ThemedText type="defaultSemiBold">Order Concessions</ThemedText>
        </TouchableOpacity>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#FF4500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});
