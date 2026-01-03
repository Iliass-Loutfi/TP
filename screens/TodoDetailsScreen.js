import { View, Text, StyleSheet } from "react-native";

export default function TodoDetailsScreen({ route }) {
  const { id, title } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>📋</Text>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.idContainer}>
          <Text style={styles.idLabel}>ID de la tâche:</Text>
          <Text style={styles.idValue}>{id}</Text>
        </View>
        <Text style={styles.description}>
          Détails complets de votre tâche sélectionnée.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  idContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
  },
  idLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  idValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});