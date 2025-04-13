import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";

interface MovieProps {
    name: string;
    image: string;
    duration?: string;
    releaseDate: string
}

const MovieCard: React.FC<MovieProps> = ({ name, image, duration, releaseDate }) => {
    // Calculate the width based on screen size (48% of screen width minus padding)
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = (screenWidth - 48) / 2; // 48px accounts for outer padding and gap
    
    return (
        <TouchableOpacity 
            className="mb-4 rounded-lg overflow-hidden"
            style={{ width: cardWidth }}
            activeOpacity={0.8}
        >
            <View>
                <Image 
                    source={{ uri: image }} 
                    style={{
                        width: cardWidth,
                        height: cardWidth * 1.5, // Standard movie poster ratio (2:3)
                        borderRadius: 8
                    }}
                    resizeMode="cover" 
                />
                
                <View className="p-2">
                    <Text className="text-white font-medium text-sm" numberOfLines={1} ellipsizeMode="tail">
                        {name}
                    </Text>
                    {duration && (
                        <Text className="text-gray-400 text-xs mt-1">{duration}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default MovieCard;