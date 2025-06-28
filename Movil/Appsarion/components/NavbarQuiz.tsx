import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RootState } from '../store';
import { useSelector } from "react-redux";

export const NavbarQuiz = ({ navigation }: any) => {
  const role = useSelector((state: RootState) => state.auth.user.role.toLowerCase());

  let routes = [
    { name: "TrainingHome", label: "Estudio" },
    { name: "Prueba", label: "Prueba" },
    { name: "Resultados", label: "Resultados" },
  ];

  if (role === "admin") {
    routes.push({ name: "Gestión", label: "Gestión" });
  }

  return (
    <View style={styles.bottomNav}>
      {routes.map((route) => (
        <TouchableOpacity
          key={route.name}
          style={styles.navItem}
          onPress={() => navigation.navigate(route.name)}
        >
          <Text style={styles.navText}>{route.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#363d41",
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: "#4199b5",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: 'bold',
  },
}); 