import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { ThemeContext } from "../context/ThemeContext";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

export default function LoginScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Google Auth (WEB - Expo)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID,
    iosClientId: WEB_CLIENT_ID, // Pour iOS
    androidClientId: WEB_CLIENT_ID, // Pour Android
    webClientId: WEB_CLIENT_ID,
  });

  // Handle Google response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((e) => {
        console.error("Erreur Google Sign-In:", e);
        setError("Erreur lors de la connexion avec Google");
      });
    }
  }, [response]);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Connexion
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Inscription
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Succès", "Compte créé avec succès!");
      }
    } catch (e) {
      console.error("Erreur auth:", e.code);
      switch (e.code) {
        case "auth/invalid-email":
          setError("Email invalide");
          break;
        case "auth/user-disabled":
          setError("Compte désactivé");
          break;
        case "auth/user-not-found":
          setError("Utilisateur non trouvé");
          break;
        case "auth/wrong-password":
          setError("Mot de passe incorrect");
          break;
        case "auth/email-already-in-use":
          setError("Cet email est déjà utilisé");
          break;
        case "auth/weak-password":
          setError("Le mot de passe est trop faible");
          break;
        default:
          setError("Erreur d'authentification");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {isLogin ? "🔐 Connexion" : "📝 Inscription"}
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { color: theme.text, borderColor: theme.primary }]}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { color: theme.text, borderColor: theme.primary }]}
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.spinner} />
      ) : (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleEmailAuth}
          >
            <Text style={styles.buttonText}>
              {isLogin ? "Se connecter" : "Créer un compte"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.googleButton, { opacity: request ? 1 : 0.5 }]}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Text style={styles.googleButtonText}>🔗 Continuer avec Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsLogin(!isLogin)}
            style={styles.switchButton}
          >
            <Text style={[styles.switchText, { color: theme.primary }]}>
              {isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            <Text style={[styles.themeText, { color: theme.primary }]}>
              {theme.mode === "light" ? "🌙 Mode sombre" : "☀️ Mode clair"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  errorText: {
    color: "#ff3b30",
    marginBottom: 15,
    textAlign: "center",
    padding: 10,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "#DB4437",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    padding: 15,
    alignItems: "center",
  },
  switchText: {
    fontSize: 14,
    fontWeight: "600",
  },
  themeButton: {
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  themeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  spinner: {
    marginVertical: 20,
  },
});