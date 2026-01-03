import { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    if (name.trim()) {
      login(name);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>🔐 Connexion</Text>
        <Text style={styles.subtitle}>Bienvenue! Entrez votre nom pour continuer</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Votre nom"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loginBox: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});