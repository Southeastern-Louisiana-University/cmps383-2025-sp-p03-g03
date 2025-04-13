import { View, Text, Image } from "react-native";

export default function CustomHeader() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={require("@/assets/images/Lion Face.png")}
        style={{ width: 30, height: 30, marginRight: 10 }}
        resizeMode="contain"
      />
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
        Lion's Den Cinemas
      </Text>
    </View>
  );
}
