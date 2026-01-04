import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com";

// Version avec fetch (corrigée)
export const fetchTodosFetch = async () => {
  try {
    // URL CORRIGÉE : retirer "_wrong"
    const response = await fetch(`${API_URL}/todos?_limit=10`);
    
    if (!response.ok) {
      throw new Error("Erreur serveur: " + response.status);
    }
    
    // Délai artificiel réduit pour les tests
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return await response.json();
  } catch (error) {
    console.error("Erreur fetch:", error);
    throw error;
  }
};