import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { ThemeProvider } from "./context/ThemeContext";
import AuthProvider from "./context/AuthContext";
import TodoListFetchScreen from "./screens/TodoListFetchScreen";

// Version simple sans SQLite pour éviter les erreurs
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simuler un temps de chargement
    setTimeout(() => {
      setIsReady(true);
    }, 500);
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ActivityIndicator size="small" color="#34C759" />
        <ActivityIndicator size="small" color="#FF9500" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <TodoListFetchScreen />
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});