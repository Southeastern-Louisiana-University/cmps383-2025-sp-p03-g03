import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import QRCode from 'react-native-qrcode-svg';

const ProfileScreen = () => {
  const auth = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = auth?.user?.id;

  useEffect(() => {
    const fetchTickets = async () => {
      if (!userId) return;

      try {
        const res = await fetch(`https://cmps383-2025-sp25-p03-g03.azurewebsites.net/api/userticket/GetByUserId/${userId}`);
        const data = await res.json();
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#a5b4fc" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-black p-4">
      <Text className="text-white text-2xl font-bold mb-4">Welcome, {auth?.user?.userName}</Text>

      {tickets.length === 0 ? (
        <Text className="text-gray-400">No tickets found.</Text>
      ) : (
        tickets.map((ticket: any, index) => (
          <View key={index} className="bg-gray-800 p-4 mb-4 rounded-lg border border-gray-700">
            <Text className="text-white font-bold">Movie: {ticket.movieTitle || 'Unknown'}</Text>
            <Text className="text-gray-300">Date: {ticket.date}</Text>
            <Text className="text-gray-300">Time: {ticket.time}</Text>

            <View className="mt-4 items-center">
              <QRCode value={JSON.stringify(ticket)} size={150} />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default ProfileScreen;
