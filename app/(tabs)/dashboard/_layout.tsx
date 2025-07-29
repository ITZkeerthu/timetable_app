import { Stack } from 'expo-router/stack';

export default function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="profile-setup" options={{ title: 'Profile Setup' }} />
    </Stack>
  );
}