import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import theme from "@/styles/theme";

export default function CustomHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable
        style={styles.logoRow}
        onPress={() => router.push("/")}
        android_ripple={{ color: theme.colors.border, borderless: true }}
      >
        <Image
          source={require("@/assets/images/Lion Face.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Lion's Den Cinemas</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.notification,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});
