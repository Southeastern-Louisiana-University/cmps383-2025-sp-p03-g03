import React, { useLayoutEffect } from "react";
import { Text, View, StyleSheet, ImageBackground, Image } from "react-native";
import { useNavigation } from "expo-router";

export default function BuyTickets() {
  const navigation = useNavigation();

  // Set header styles here
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

  return (
    <ImageBackground
      source={require("../../assets/images/ticketbooth.png")} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.text}>Buy Ticket Screen</Text>
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
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});
