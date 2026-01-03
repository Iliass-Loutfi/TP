import { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function AppBar({ title }) {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.appBar}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  appBar: {
    height: 60,
    backgroundColor: "#007AFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});