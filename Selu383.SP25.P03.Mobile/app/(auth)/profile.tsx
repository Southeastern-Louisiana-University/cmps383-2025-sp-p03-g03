import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const ProfileScreen = () => {
  const router = useRouter();
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const handleSignOut = async () => {
    await auth.signout();
    router.replace("/");
  };

  return (
    
    <View className="flex-1 justify-center items-center bg-black">
    <View className="w-4/5 bg-black bg-opacity-80 p-6 rounded-xl border border-gray-700 shadow-lg items-center">
      {/* Profile Avatar */}
      <View className="w-20 h-20 rounded-full bg-gray-700 border-4 border-gray-500 flex items-center justify-center shadow-md mb-4">
        <Text className="text-3xl font-bold text-white">
          {auth.user?.userName?.charAt(0)?.toUpperCase()}
        </Text>
      </View>

      {/* User Info */}
      <Text className="text-xl font-bold text-red-500">{auth.user?.userName}</Text>
      <Text className="text-red-400 text-sm mt-1">{auth.user?.roles?.join(", ")}</Text>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="mt-6 flex-row items-center bg-red-600 px-5 py-3 rounded-lg shadow-lg hover:bg-red-500"
      >
        <FontAwesome name="sign-out" size={20} color="white" />
        <Text className="text-white font-semibold ml-2">Logout</Text>
      </TouchableOpacity>
    </View>
  </View>
);
};

export default ProfileScreen;