import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      {/* Login screen – no header */}
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />

      {/* Register screen – header shown */}
      <Stack.Screen
        name="register"
        options={{
          title: 'Register',
          headerShown: true,
        }}
      />

      {/* Profile screen – header shown */}
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
