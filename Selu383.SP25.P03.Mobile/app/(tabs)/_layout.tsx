import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#a5b4fc", // Active icon/text color
        tabBarInactiveTintColor: "#555", // Inactive icon/text color
        tabBarStyle: {
          backgroundColor: "#fceda5",
          borderTopColor: "#a5b4fc",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "concessions") {
            iconName = focused ? "fast-food" : "fast-food-outline";
          } else {
            iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="concessions"
        options={{
          title: "Concessions",
        }}
      />
    </Tabs>
  );
}
