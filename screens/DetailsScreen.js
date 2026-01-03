import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 Écran de détails</Text>
      {route.params && (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>ID reçu:</Text>
          <Text style={styles.infoValue}>{route.params.id}</Text>
        </View>
      )}
      <Text style={styles.description}>
        Vous avez navigué depuis l'écran d'accueil avec succès!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f4f8',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007AFF',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});