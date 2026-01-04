import React, { useEffect, useState, useContext } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  Button, 
  StyleSheet, 
  ActivityIndicator 
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { fetchTodosFetch } from "../services/api";

export default function TodoListFetchScreen() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodosFetch();
      setTodos(data);
    } catch (err) {
      setError("Impossible de charger les tâches. Vérifiez votre connexion.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, theme === "dark" ? styles.dark : styles.light]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des tâches...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, theme === "dark" ? styles.dark : styles.light]}>
      <View style={styles.header}>
        <Text style={[styles.title, theme === "dark" ? styles.textDark : styles.textLight]}>
          📋 Liste des tâches (API)
        </Text>
        <Button
          title={theme === "light" ? "🌙 Mode sombre" : "☀️ Mode clair"}
          onPress={toggleTheme}
          color="#007AFF"
        />
        <Button
          title="🔄 Recharger"
          onPress={loadTodos}
          color="#34C759"
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.todoItem, theme === "dark" ? styles.todoItemDark : styles.todoItemLight]}>
            <Text style={[styles.todoTitle, theme === "dark" ? styles.textDark : styles.textLight]}>
              {item.completed ? "✅" : "⏳"} {item.title}
            </Text>
            <Text style={styles.todoId}>ID: {item.id} | User: {item.userId}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, theme === "dark" ? styles.textDark : styles.textLight]}>
            Aucune tâche disponible
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  light: {
    backgroundColor: "#ffffff",
  },
  dark: {
    backgroundColor: "#121212",
  },
  textLight: {
    color: "#000000",
  },
  textDark: {
    color: "#ffffff",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  todoItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  todoItemLight: {
    backgroundColor: "#f5f5f5",
  },
  todoItemDark: {
    backgroundColor: "#1e1e1e",
  },
  todoTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  todoId: {
    fontSize: 12,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});