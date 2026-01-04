import { useState, useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet, Switch, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AppBar from "../components/AppBar";

// Configuration du gestionnaire de notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function NotificationsScreen({ navigation }) {
  const [notificationPermission, setNotificationPermission] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const [scheduled, setScheduled] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Vérifier la permission au démarrage
    checkPermission();

    // Écouter les notifications reçues
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // Écouter les interactions avec les notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification cliquée:", response);
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const checkPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotificationPermission(status);
  };

  const requestPermission = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      setNotificationPermission(finalStatus);
      
      if (finalStatus !== "granted") {
        Alert.alert("Permission refusée", "Vous ne recevrez pas de notifications.");
        return;
      }

      // Obtenir le token push
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      console.log("Expo Push Token:", token);
    } else {
      Alert.alert("Erreur", "Les notifications ne fonctionnent que sur les appareils physiques");
    }
  };

  const sendImmediateNotification = async () => {
    if (notificationPermission !== "granted") {
      Alert.alert("Permission requise", "Veuillez d'abord autoriser les notifications");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📱 Notification de test",
        body: "Ceci est une notification immédiate de démonstration!",
        sound: "default",
        data: { testData: "Données de test" },
      },
      trigger: null, // Immédiat
    });

    Alert.alert("Succès", "Notification envoyée!");
  };

  const scheduleNotification = async () => {
    if (notificationPermission !== "granted") {
      Alert.alert("Permission requise", "Veuillez d'abord autoriser les notifications");
      return;
    }

    const trigger = new Date(Date.now() + 10 * 1000); // 10 secondes

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Notification programmée",
        body: "Cette notification était programmée 10 secondes à l'avance!",
        sound: "default",
      },
      trigger,
    });

    setScheduled(true);
    Alert.alert("Succès", "Notification programmée pour dans 10 secondes!");
    
    // Réinitialiser après 15 secondes
    setTimeout(() => setScheduled(false), 15000);
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    setScheduled(false);
    Alert.alert("Succès", "Toutes les notifications programmées ont été annulées");
  };

  return (
    <View style={styles.container}>
      <AppBar title="Notifications" navigation={navigation} back />
      
      <View style={styles.content}>
        <Text style={styles.title}>🔔 Notifications</Text>
        <Text style={styles.description}>
          Gérez les notifications push de l'application
        </Text>

        <View style={styles.permissionSection}>
          <Text style={styles.sectionTitle}>Permission</Text>
          <Text style={styles.permissionStatus}>
            Statut: {notificationPermission === "granted" ? "✅ Autorisé" : "❌ Non autorisé"}
          </Text>
          
          <Button
            title={
              notificationPermission === "granted" 
                ? "Permission déjà accordée" 
                : "Demander la permission"
            }
            onPress={requestPermission}
            disabled={notificationPermission === "granted"}
            color="#007AFF"
          />
        </View>

        {expoPushToken ? (
          <View style={styles.tokenSection}>
            <Text style={styles.sectionTitle}>Token de notification</Text>
            <Text style={styles.tokenText} numberOfLines={2}>
              {expoPushToken}
            </Text>
          </View>
        ) : null}

        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Tester les notifications</Text>
          
          <View style={styles.buttonGroup}>
            <Button
              title="Notification immédiate"
              onPress={sendImmediateNotification}
              color="#34C759"
              disabled={notificationPermission !== "granted"}
            />
            
            <View style={styles.buttonSpacer} />
            
            <Button
              title={scheduled ? "✅ Déjà programmée" : "Programmer (10s)"}
              onPress={scheduleNotification}
              color="#FF9500"
              disabled={notificationPermission !== "granted" || scheduled}
            />
            
            <View style={styles.buttonSpacer} />
            
            <Button
              title="Annuler toutes les notifications"
              onPress={cancelAllNotifications}
              color="#FF3B30"
            />
          </View>
        </View>

        {notification ? (
          <View style={styles.notificationPreview}>
            <Text style={styles.sectionTitle}>Dernière notification reçue:</Text>
            <Text style={styles.notificationTitle}>
              {notification.request.content.title}
            </Text>
            <Text style={styles.notificationBody}>
              {notification.request.content.body}
            </Text>
          </View>
        ) : null}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ Sur iOS, vous devez également autoriser les notifications dans les paramètres système.
            Sur Android, les permissions sont gérées directement par l'application.
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
  permissionSection: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  permissionStatus: {
    fontSize: 16,
    marginBottom: 15,
    color: "#666",
  },
  tokenSection: {
    backgroundColor: "#e8f4f8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  tokenText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
  testSection: {
    backgroundColor: "#f0f8ff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonGroup: {
    marginTop: 10,
  },
  buttonSpacer: {
    height: 10,
  },
  notificationPreview: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#856404",
  },
  notificationBody: {
    fontSize: 14,
    marginTop: 5,
    color: "#856404",
  },
  infoBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});