import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your account and preferences</Text>

      <View style={styles.userInfo}>
        <Text style={styles.userLabel}>Username:</Text>
        <Text style={styles.userValue}>{user?.username}</Text>

        <Text style={styles.userLabel}>Email:</Text>
        <Text style={styles.userValue}>{user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
  },
  userInfo: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
    marginTop: 12,
  },
  userValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SettingsScreen;
