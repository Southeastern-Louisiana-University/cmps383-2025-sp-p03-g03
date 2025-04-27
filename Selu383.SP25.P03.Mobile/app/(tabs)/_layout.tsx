import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/styles/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.border,
        tabBarStyle: {
          backgroundColor: theme.colors.notification,
          borderTopColor: theme.colors.primary,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "index":
              iconName = focused ? "home" : "home-outline";
              break;
            case "concessions":
              iconName = focused ? "fast-food" : "fast-food-outline";
              break;
            case "login":
              iconName = focused ? "person-circle" : "person-circle-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="concessions" options={{ title: "Concessions" }} />
      <Tabs.Screen name="login" options={{ title: "Login" }} />
    </Tabs>
  );
}
