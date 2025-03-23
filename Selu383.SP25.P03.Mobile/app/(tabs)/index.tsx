import { Text, View, StyleSheet, Image, ImageBackground } from "react-native";

export default function Index() {
  return (
    <ImageBackground
      source={require("../../assets/images/istockphoto-1978204046-612x612.jpg")} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.text}>Lion's Den Cinemas</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

