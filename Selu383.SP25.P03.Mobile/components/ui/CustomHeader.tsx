import { View, Text, Image, Pressable, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function CustomHeader() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const { colorScheme, setColorScheme } = useColorScheme();

  const toggleTheme = (theme: "light" | "dark") => {
    setColorScheme(theme);
    setModalVisible(false);
  };

  return (
    <View style={styles.header}>
      {/* Logo + Title */}
      <Pressable
        style={styles.logoRow}
        onPress={() => router.push("/")}
        android_ripple={{ color: "#ddd", borderless: true }}
      >
        <Image
          source={require("@/assets/images/Lion Face.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Lion's Den Cinemas</Text>
      </Pressable>

      {/* Icons */}
      <View style={styles.iconRow}>
        <Pressable
          onPress={() => router.push(auth?.isAuthenticated ? "/profile" : "/login")}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}
          hitSlop={10}
        >
          <Ionicons name="person-circle-outline" size={32} color="#000" />
        </Pressable>

        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [styles.lastIconButton, pressed && styles.iconPressed]}
          hitSlop={10}
        >
          <Feather name="settings" size={30} color="#000" />
        </Pressable>
      </View>

      {/* Theme Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose Theme</Text>
            <TouchableOpacity onPress={() => toggleTheme("light")} style={styles.modalOption}>
              <Text style={styles.modalText}>🌞 Light Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleTheme("dark")} style={styles.modalOption}>
              <Text style={styles.modalText}>🌚 Dark Mode</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fceda5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 4,
    columnGap: 14,
  },
  iconButton: {
    padding: 10,
    marginLeft: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  lastIconButton: {
    padding: 10,
    borderRadius: 20,
  },
  iconPressed: {
    backgroundColor: "#e0e0e0",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  modalOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#000",
  },
});
