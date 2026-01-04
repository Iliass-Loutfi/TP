import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
import AppBar from "../components/AppBar";

export default function HomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const todosRef = collection(db, "todos");
      const querySnapshot = await getDocs(todosRef);
      const todosData = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(todo => todo.userId === user.uid)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setTodos(todosData);
    } catch (error) {
      console.error("Erreur chargement todos:", error);
      Alert.alert("Erreur", "Impossible de charger les tâches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [user]);

  const addTodo = async () => {
    if (!newTodo.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un titre");
      return;
    }

    try {
      await addDoc(collection(db, "todos"), {
        title: newTodo,
        completed: false,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
      
      setNewTodo("");
      setModalVisible(false);
      loadTodos();
      Alert.alert("Succès", "Tâche ajoutée avec succès!");
    } catch (error) {
      console.error("Erreur ajout todo:", error);
      Alert.alert("Erreur", "Impossible d'ajouter la tâche");
    }
  };

  const deleteTodo = async (id) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cette tâche ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "todos", id));
              loadTodos();
            } catch (error) {
              console.error("Erreur suppression:", error);
              Alert.alert("Erreur", "Impossible de supprimer la tâche");
            }
          },
        },
      ]
    );
  };

  const toggleTodo = async (id, completed) => {
    try {
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, { completed: !completed });
      loadTodos();
    } catch (error) {
      console.error("Erreur toggle:", error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppBar title="Mes Tâches Firebase" navigation={navigation} />
      
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Ajouter une tâche</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.text }]}>
              Chargement des tâches...
            </Text>
          </View>
        ) : todos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              📭 Aucune tâche disponible
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.text }]}>
              Ajoutez votre première tâche!
            </Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.todoItem, { backgroundColor: theme.card }]}>
                <TouchableOpacity
                  style={styles.todoContent}
                  onPress={() => toggleTodo(item.id, item.completed)}
                >
                  <Text style={[styles.todoCheck, { color: theme.primary }]}>
                    {item.completed ? "✅" : "⏳"}
                  </Text>
                  <Text
                    style={[
                      styles.todoText,
                      { color: theme.text },
                      item.completed && styles.completedText,
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTodo(item.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      {/* Modal d'ajout */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Nouvelle tâche
            </Text>
            <TextInput
              placeholder="Titre de la tâche"
              placeholderTextColor="#999"
              value={newTodo}
              onChangeText={setNewTodo}
              style={[
                styles.modalInput,
                { color: theme.text, borderColor: theme.primary },
              ]}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={addTodo}
              >
                <Text style={styles.modalButtonText}>Ajouter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: "#666" }]}>
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  addButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  todoCheck: {
    fontSize: 20,
    marginRight: 10,
  },
  todoText: {
    fontSize: 16,
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});