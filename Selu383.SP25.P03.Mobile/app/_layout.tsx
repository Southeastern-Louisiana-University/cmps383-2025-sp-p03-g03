import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext';
import CustomHeader from '@/components/ui/CustomHeader';
import theme from '@/styles/theme';  // ✅ Importing your theme here

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
     
     <ThemeProvider value={theme}>  


        <Stack
          screenOptions={{
            headerTitle: () => <CustomHeader />,
            headerStyle: {
              backgroundColor: theme.colors.card, 
            },
            headerTintColor: theme.colors.text,    
            contentStyle: {
              backgroundColor: theme.colors.background, 
            },
          }}
        >
         
          <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" /> 
      </ThemeProvider>
    </AuthProvider>
  );
}
