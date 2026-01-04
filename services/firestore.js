import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

// Récupérer les todos d'un utilisateur
export async function fetchTodosFromFirestore(uid) {
  try {
    const todosRef = collection(db, "todos");
    const q = query(
      todosRef, 
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );
    
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Erreur Firestore fetch:", error);
    return [];
  }
}

// Ajouter un todo
export async function addTodoToFirestore(uid, todo) {
  try {
    const docRef = await addDoc(collection(db, "todos"), {
      title: todo.title,
      completed: false,
      userId: uid,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...todo };
  } catch (error) {
    console.error("Erreur Firestore add:", error);
    throw error;
  }
}

// Supprimer un todo
export async function deleteTodoFromFirestore(id) {
  try {
    await deleteDoc(doc(db, "todos", id));
    return true;
  } catch (error) {
    console.error("Erreur Firestore delete:", error);
    return false;
  }
}

// Mettre à jour un todo
export async function updateTodoInFirestore(id, updates) {
  try {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, updates);
    return true;
  } catch (error) {
    console.error("Erreur Firestore update:", error);
    return false;
  }
}