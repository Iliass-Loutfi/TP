import { Platform } from "react-native";

// Variable pour stocker les tâches en mémoire sur le web
let webTodos = [];

// Initialiser la base de données
export const initDB = async () => {
  if (Platform.OS === 'web') {
    console.log("Mode web: Utilisation du stockage en mémoire");
    return;
  }
  
  // Seulement sur mobile, utiliser SQLite
  const SQLite = require('expo-sqlite').default;
  try {
    const db = SQLite.openDatabaseSync("todos.db");
    db.execSync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Base de données SQLite initialisée");
  } catch (error) {
    console.error("Erreur SQLite:", error);
  }
};

// Ajouter une tâche
export const addTodoOffline = (title) => {
  if (Platform.OS === 'web') {
    const todo = {
      id: Date.now(),
      title,
      created_at: new Date().toISOString()
    };
    webTodos.push(todo);
    console.log("Tâche ajoutée (web):", title);
    return true;
  }
  
  // Code SQLite pour mobile...
  try {
    const SQLite = require('expo-sqlite').default;
    const db = SQLite.openDatabaseSync("todos.db");
    db.runSync(
      "INSERT INTO todos (id, title) VALUES (?, ?)",
      [Date.now(), title]
    );
    return true;
  } catch (error) {
    console.error("Erreur SQLite:", error);
    return false;
  }
};

// Charger toutes les tâches
export const loadTodos = () => {
  if (Platform.OS === 'web') {
    return webTodos;
  }
  
  // Code SQLite pour mobile...
  try {
    const SQLite = require('expo-sqlite').default;
    const db = SQLite.openDatabaseSync("todos.db");
    return db.getAllSync("SELECT * FROM todos ORDER BY created_at DESC");
  } catch (error) {
    console.error("Erreur SQLite:", error);
    return [];
  }
};

// Mettre à jour une tâche
export const updateTodoOffline = (id, title) => {
  if (Platform.OS === 'web') {
    const todo = webTodos.find(t => t.id === id);
    if (todo) {
      todo.title = title;
      console.log("Tâche mise à jour (web):", id);
      return true;
    }
    return false;
  }
  
  // Code SQLite pour mobile...
  try {
    const SQLite = require('expo-sqlite').default;
    const db = SQLite.openDatabaseSync("todos.db");
    db.runSync(
      "UPDATE todos SET title = ? WHERE id = ?",
      [title, id]
    );
    return true;
  } catch (error) {
    console.error("Erreur SQLite:", error);
    return false;
  }
};

// Supprimer une tâche
export const deleteTodoOffline = (id) => {
  if (Platform.OS === 'web') {
    webTodos = webTodos.filter(t => t.id !== id);
    console.log("Tâche supprimée (web):", id);
    return true;
  }
  
  // Code SQLite pour mobile...
  try {
    const SQLite = require('expo-sqlite').default;
    const db = SQLite.openDatabaseSync("todos.db");
    db.runSync("DELETE FROM todos WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Erreur SQLite:", error);
    return false;
  }
};