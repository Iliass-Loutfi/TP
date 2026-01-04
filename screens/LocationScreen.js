import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as Location from "expo-location";
import AppBar from "../components/AppBar";

export default function LocationScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        setErrorMsg("Permission d'accès à la localisation refusée");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(location.coords);
    } catch (error) {
      console.error("Erreur de localisation:", error);
      setErrorMsg("Erreur lors de l'obtention de la position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar title="Localisation" navigation={navigation} back />
      
      <View style={styles.content}>
        <Text style={styles.title}>📍 Géolocalisation</Text>
        <Text style={styles.description}>
          Obtenez votre position actuelle grâce au GPS de votre appareil
        </Text>

        <Button
          title={loading ? "Chargement..." : "Obtenir ma position"}
          onPress={getLocation}
          disabled={loading}
          color="#007AFF"
        />

        {errorMsg && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationTitle}>Votre position:</Text>
            <Text style={styles.locationText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Altitude: {location.altitude ? `${location.altitude.toFixed(2)}m` : "N/A"}
            </Text>
            <Text style={styles.locationText}>
              Précision: ±{location.accuracy ? `${location.accuracy.toFixed(2)}m` : "N/A"}
            </Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ Pour des résultats précis, activez le GPS et assurez-vous d'être en extérieur.
          </Text>
        </View>
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
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
  locationContainer: {
    backgroundColor: "#e8f4f8",
    padding: 20,
    borderRadius: 10,
    marginTop: 30,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007AFF",
  },
  locationText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  infoBox: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});