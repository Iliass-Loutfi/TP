import { useState, useRef } from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import AppBar from "../components/AppBar";

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <AppBar title="Caméra" navigation={navigation} back />
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Nous avons besoin de votre permission pour utiliser la caméra
          </Text>
          <Button onPress={requestPermission} title="Autoriser la caméra" />
        </View>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhoto(photo.uri);
      } catch (error) {
        console.error("Erreur prise de photo:", error);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <AppBar title="Caméra" navigation={navigation} back />
      
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.previewButtons}>
            <Button title="Reprendre" onPress={() => setPhoto(null)} />
            <Button
              title="Partager"
              onPress={() => {
                // Ici vous pourriez implémenter le partage
                alert("Photo prise! (Fonctionnalité de partage à implémenter)");
              }}
            />
          </View>
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.controls}>
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <Text style={styles.flipText}>🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 50,
  },
  flipButton: {
    position: "absolute",
    left: 30,
    bottom: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    borderRadius: 30,
  },
  flipText: {
    fontSize: 24,
    color: "white",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
  previewButtons: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
});