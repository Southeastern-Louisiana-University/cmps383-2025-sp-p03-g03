import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme'; // custom hook
import CustomHeader from '@/components/ui/CustomHeader';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme(); // ✅ fixed
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerTitle: () => <CustomHeader />,
            headerStyle: {
              backgroundColor: '#fceda5',
            },
            contentStyle: {
              backgroundColor: '#a5b4fc',
            },
          }}
        >
          <Stack.Screen name="tabs" options={{ headerShown: false }} />
          <Stack.Screen name="buytickets" />
          <Stack.Screen name="movies/[id]" />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="profile" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
