import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AppBar from "../components/AppBar";

export default function TodoListScreen({ navigation }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Chargement des tâches...");
    setTimeout(() => {
      setTodos([
        { id: 1, title: "Faire les courses" },
        { id: 2, title: "Sortir le chien" },
        { id: 3, title: "Coder une app RN" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>⏳ Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar title="Mes tâches" />
      
      <View style={styles.content}>
        <Text style={styles.header}>📝 Liste des tâches</Text>
        
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.todoItem}
              onPress={() =>
                navigation.navigate("Détails", { id: item.id, title: item.title })
              }
            >
              <Text style={styles.todoText}>{item.title}</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 24,
    color: "#666",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  todoItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todoText: {
    fontSize: 18,
    color: "#333",
    flex: 1,
  },
  arrow: {
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "bold",
  },
});