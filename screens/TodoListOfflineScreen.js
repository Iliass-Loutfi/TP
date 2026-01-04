import { View, Text, FlatList, Button, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState, useContext } from "react";
import {
  loadTodos,
  addTodoOffline,
  updateTodoOffline,
  deleteTodoOffline,
} from "../services/database";
import { ThemeContext } from "../context/ThemeContext";
import AppBar from "../components/AppBar";

export default function TodoListOfflineScreen() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const refreshTodos = () => {
    const loadedTodos = loadTodos();
    setTodos(loadedTodos);
  };

  const handleAddOrUpdate = () => {
    if (!title.trim()) return;

    if (editingId) {
      // Mettre à jour
      updateTodoOffline(editingId, title);
      setEditingId(null);
    } else {
      // Ajouter
      addTodoOffline(title);
    }

    setTitle("");
    refreshTodos();
  };

  const handleDelete = (id) => {
    deleteTodoOffline(id);
    refreshTodos();
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setEditingId(todo.id);
  };

  const cancelEdit = () => {
    setTitle("");
    setEditingId(null);
  };

  useEffect(() => {
    refreshTodos();
  }, []);

  return (
    <View style={[styles.container, theme === "dark" ? styles.dark : styles.light]}>
      <AppBar title="Tâches hors ligne" />
      
      <View style={styles.content}>
        {/* Bouton changement de thème */}
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Text style={styles.themeButtonText}>
            {theme === "light" ? "🌙 Mode sombre" : "☀️ Mode clair"}
          </Text>
        </TouchableOpacity>

        {/* Formulaire ajout/édition */}
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Tâche hors ligne"
            placeholderTextColor={theme === "dark" ? "#888" : "#666"}
            value={title}
            onChangeText={setTitle}
            style={[
              styles.input,
              theme === "dark" ? styles.inputDark : styles.inputLight,
              theme === "dark" ? styles.textDark : styles.textLight,
            ]}
          />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.addButton, editingId ? styles.updateButton : styles.addButton]}
              onPress={handleAddOrUpdate}
            >
              <Text style={styles.addButtonText}>
                {editingId ? "📝 Mettre à jour" : "➕ Ajouter hors ligne"}
              </Text>
            </TouchableOpacity>
            
            {editingId && (
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                <Text style={styles.cancelButtonText}>❌ Annuler</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Liste des tâches */}
        {todos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, theme === "dark" ? styles.textDark : styles.textLight]}>
              📭 Aucune tâche disponible hors ligne
            </Text>
            <Text style={[styles.emptySubtext, theme === "dark" ? styles.textDark : styles.textLight]}>
              Ajoutez votre première tâche ci-dessus
            </Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.todoItem, theme === "dark" ? styles.todoItemDark : styles.todoItemLight]}>
                <Text style={[styles.todoText, theme === "dark" ? styles.textDark : styles.textLight]}>
                  📋 {item.title}
                </Text>
                <Text style={styles.todoDate}>
                  {new Date(item.created_at).toLocaleDateString('fr-FR')}
                </Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.editButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
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
  themeButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  themeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  inputLight: {
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
  },
  inputDark: {
    backgroundColor: "#1e1e1e",
    borderColor: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#FF9500",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 80,
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
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
  todoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  todoDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  editButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 6,
    minWidth: 40,
    alignItems: "center",
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 8,
    borderRadius: 6,
    minWidth: 40,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});