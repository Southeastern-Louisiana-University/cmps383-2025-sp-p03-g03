import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import theme from "@/styles/theme";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const router = useRouter();

  if (!auth) {
    return null;
  }

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const success = await auth.signin(username, password);
      if (success) {
        router.push("/profile");
      } else {
        setError("Invalid username or password");
      }
    } catch (e) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please sign in to continue</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor={theme.colors.border}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={theme.colors.border}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[
          styles.signInButton,
          loading && { opacity: 0.7 },
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.signInText}>
          {loading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      {auth.isAuthenticated && (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.profileButtonText}>Go to Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.border,
    textAlign: "center",
    marginTop: 8,
  },
  errorBox: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    borderColor: "rgba(220, 38, 38, 0.6)",
    borderWidth: 1,
    borderRadius: 8,
  },
  errorText: {
    color: "#dc2626",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: theme.colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  signInButton: {
    marginTop: 16,
    backgroundColor: theme.colors.notification,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  signInText: {
    color: theme.colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  profileButton: {
    marginTop: 24,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  profileButtonText: {
    color: theme.colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
});
