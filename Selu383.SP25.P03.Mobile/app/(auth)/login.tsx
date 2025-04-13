import React, { useContext, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import { Link, useRouter } from 'expo-router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const router = useRouter()

  if (!auth)  {
    return null;
  }

  

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await auth.signin(username, password);
      console.log('Login successful');
      router.push('/profile')
      console.log(auth)
    } catch (e) {
      console.error('Login Failed', e);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black justify-center p-6">
      <View className="mb-8">
        <Text className="text-white text-3xl font-bold text-center">Welcome Back</Text>
        <Text className="text-gray-400 text-center mt-2">Please sign in to continue</Text>
      </View>

      {error ? (
        <View className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-md">
          <Text className="text-red-500 text-center">{error}</Text>
        </View>
      ) : null}

      <View className="mb-4">
        <Text className="text-gray-300 mb-2">Username</Text>
        <TextInput
          className="bg-gray-800 text-white p-4 rounded-md border border-gray-700"
          placeholder="Enter your username"
          placeholderTextColor="#9CA3AF"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-300 mb-2">Password</Text>
        <TextInput
          className="bg-gray-800 text-white p-4 rounded-md border border-gray-700"
          placeholder="Enter your password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        className={`mt-4 px-6 py-3 bg-white rounded-md ${loading ? 'opacity-70' : ''}`}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-red-600 font-bold text-center">
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-center">
        <Text className="text-red-400">Don't have an account? </Text>
        <Link href="/(auth)/register" asChild>
  <TouchableOpacity>
    <Text className="text-red-400">Register</Text>
  </TouchableOpacity>
</Link>
      </View>
    </View>
  );
}