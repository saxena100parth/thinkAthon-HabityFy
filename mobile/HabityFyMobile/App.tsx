import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/contexts/AuthContext";
import { HabitProvider } from "./src/contexts/HabitContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <HabitProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </HabitProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
