import { View, Text, TextInput, Pressable, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter, Link } from 'expo-router';
import React, { useState } from 'react';
import { BASE_URL } from '../../utils/baseUrl';

function Register() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const[username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
   

    const onSubmit = async () => {
        setError("");
        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }
        try {
            const clientUri = BASE_URL;
             await axios.post(`${BASE_URL}/api/users`, {
                firstName, 
                lastName, 
                email,
                username, 
                password, 
                roles: ['User'],
                clientUri,
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            router.push('/login');
        } catch (e) {
            if (axios.isAxiosError(e)) {
                setError(e.response?.data?.message || "Registration failed");
            } else {
                setError("An unexpected error occurred");
            }
            console.error("Registration Failed", e);
        }
    }

    return (
        <View className="flex-1 items-center justify-center bg-black">
            {/* Background Gradient */}
            <View className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
            
            {/* Card Container */}
            <View className="w-full max-w-md bg-black/70 backdrop-blur-md rounded-lg p-8 border border-gray-700">
               

                {/* Title */}
                <Text className="text-white text-2xl font-bold text-center mb-6">
                    Create an Account
                </Text>

                {/* Form */}
                <TextInput
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 mb-3"
                    placeholder="First Name"
                    placeholderTextColor="#9CA3AF"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 mb-3"
                    placeholder="Last Name"
                    placeholderTextColor="#9CA3AF"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 mb-3"
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                 <TextInput
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 mb-3"
                    placeholder="username"
                    placeholderTextColor="#9CA3AF"
                    value={username}
                    onChangeText={setUsername}
                    
                />
                <TextInput
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 mb-3"
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-red-500 mb-3"
                    placeholder="Confirm Password"
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                {/* Error Message */}
                {error && (
                    <Text className="text-red-500 text-sm text-center mb-3">
                        {error}
                    </Text>
                )}

                {/* Submit Button */}
                <Pressable
                    className="w-full bg-red-600 hover:bg-red-500 py-2 mt-4 rounded-md"
                    onPress={onSubmit}
                >
                    <Text className="text-white font-semibold text-center">
                        Register
                    </Text>
                </Pressable>

                {/* Login Link */}
                <View className="mt-4 flex-row justify-center">
                    <Text className="text-gray-400">
                        Already have an account?{' '}
                    </Text>
                    <Link href = "/(auth)/login" asChild>
                    <TouchableOpacity>
                        <Text className='text-red-400'>Login</Text>
                    </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}

export default Register;