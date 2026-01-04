import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AppBar from "../components/AppBar";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function NativeFeaturesScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const features = [
    { title: "📷 Caméra", screen: "Camera" },
    { title: "📍 Géolocalisation", screen: "Location" },
    { title: "👥 Contacts", screen: "Contacts" },
    { title: "🔔 Notifications", screen: "Notifications" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppBar title="Fonctionnalités Natives" navigation={navigation} back />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>
          Fonctionnalités Natives
        </Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Testez les fonctionnalités natives de votre appareil
        </Text>

        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.featureCard, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate(feature.screen)}
          >
            <Text style={[styles.featureText, { color: theme.text }]}>
              {feature.title}
            </Text>
            <Text style={[styles.arrow, { color: theme.primary }]}>→</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Text style={[styles.infoText, { color: theme.text }]}>
            ℹ️ Certaines fonctionnalités nécessitent des permissions.
            Testez-les sur un appareil physique pour de meilleurs résultats.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    opacity: 0.8,
  },
  featureCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  featureText: {
    fontSize: 18,
    fontWeight: "600",
  },
  arrow: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoBox: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "rgba(0,122,255,0.1)",
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
  },
});