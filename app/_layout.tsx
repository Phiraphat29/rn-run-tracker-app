import { HeaderMenu } from "@/components/HeaderMenu";
import { NotoSansThai_400Regular, NotoSansThai_700Bold, useFonts } from "@expo-google-fonts/noto-sans-thai";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSansThai_400Regular,
    NotoSansThai_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2C5DFF"
        },
        headerTitleStyle: { fontFamily: "NotoSansThai_700Bold", color: "#ffffff", fontSize: 18 },
        headerTintColor: "#ffffff",
        headerTitleAlign: "center",
        headerBackButtonDisplayMode: "minimal"
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="run" options={{ headerTitle: "Run Tracker", headerRight: () => <HeaderMenu /> }} />
      <Stack.Screen name="add" options={{ headerTitle: "เพิ่มรายการวิ่ง", headerRight: () => <HeaderMenu /> }} />
      <Stack.Screen name="[id]" options={{ headerTitle: "รายละเอียดการวิ่ง", headerRight: () => <HeaderMenu /> }} />
    </Stack>
  );
}
