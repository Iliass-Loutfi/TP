import { useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import * as Contacts from "expo-contacts";
import AppBar from "../components/AppBar";

export default function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestContactsPermission = async () => {
    setLoading(true);
    
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status === "granted") {
        setPermissionGranted(true);
        await loadContacts();
      } else {
        alert("Permission d'accès aux contacts refusée");
      }
    } catch (error) {
      console.error("Erreur permission contacts:", error);
      alert("Erreur lors de la demande de permission");
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
        ],
        sort: Contacts.SortTypes.FirstName,
      });

      if (data.length > 0) {
        setContacts(data);
      } else {
        alert("Aucun contact trouvé");
      }
    } catch (error) {
      console.error("Erreur chargement contacts:", error);
      alert("Erreur lors du chargement des contacts");
    }
  };

  return (
    <View style={styles.container}>
      <AppBar title="Contacts" navigation={navigation} back />
      
      <View style={styles.content}>
        <Text style={styles.title}>👥 Contacts</Text>
        <Text style={styles.description}>
          Accédez à la liste de vos contacts avec leur permission
        </Text>

        {!permissionGranted ? (
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              Cette application a besoin d'accéder à vos contacts pour afficher la liste
            </Text>
            <Button
              title={loading ? "Chargement..." : "Autoriser l'accès aux contacts"}
              onPress={requestContactsPermission}
              disabled={loading}
              color="#007AFF"
            />
          </View>
        ) : (
          <>
            <View style={styles.contactsHeader}>
              <Text style={styles.contactsCount}>
                {contacts.length} contact(s) trouvé(s)
              </Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={loadContacts}
                disabled={loading}
              >
                <Text style={styles.refreshText}>🔄 Actualiser</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={contacts}
              keyExtractor={(item) => item.id}
              style={styles.contactsList}
              renderItem={({ item }) => (
                <View style={styles.contactCard}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  
                  {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactLabel}>📞 Téléphone:</Text>
                      <Text style={styles.contactValue}>
                        {item.phoneNumbers[0].number}
                      </Text>
                    </View>
                  )}
                  
                  {item.emails && item.emails.length > 0 && (
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactLabel}>📧 Email:</Text>
                      <Text style={styles.contactValue}>
                        {item.emails[0].email}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Aucun contact à afficher</Text>
                </View>
              }
            />
          </>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ Vos contacts ne sont pas sauvegardés sur nos serveurs.
            Ils restent uniquement sur votre appareil.
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
  permissionContainer: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  contactsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  contactsCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  refreshButton: {
    padding: 8,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  refreshText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  contactsList: {
    flex: 1,
  },
  contactCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  contactInfo: {
    flexDirection: "row",
    marginBottom: 5,
  },
  contactLabel: {
    fontWeight: "600",
    marginRight: 10,
    color: "#666",
    minWidth: 80,
  },
  contactValue: {
    flex: 1,
    color: "#333",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  infoBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});