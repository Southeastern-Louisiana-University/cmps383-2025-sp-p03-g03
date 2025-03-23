import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

function CustomHeader() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={require("../../assets/images/Lion Face.png")} 
        style={{ width: 30, height: 30, marginRight: 10 }}
        resizeMode="contain"
      />
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>
        Lion's Den Cinemas
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#a5b4fc",
        tabBarStyle: {
          backgroundColor: "#fceda5",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => <CustomHeader />,
          headerStyle: {
            backgroundColor: "#fceda5"
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={30}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="buytickets"
        options={{
          headerTitle: "Buy Tickets",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "cart-sharp" : "cart-outline"}
              color={color}
              size={30}
            />
          ),
        }}
      />
    </Tabs>
  );
}
