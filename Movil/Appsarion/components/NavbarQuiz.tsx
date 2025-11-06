import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootState } from '../store';
import { useSelector } from "react-redux";
import { commonColors } from '../styles/commonStyles';

interface NavRoute {
  name: string;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

export const NavbarQuiz = ({ navigation }: any) => {
  const rawRole = useSelector((state: RootState) => state.auth.user?.role);
  const role = rawRole ? rawRole.toLowerCase() : '';

  const routes: NavRoute[] = [
    { name: "TrainingHome", label: "Estudio", icon: "book-open-outline" },
    { name: "Prueba", label: "Prueba", icon: "pencil-box-outline" },
  ];

  if (role === "admin") {
    routes.push({ name: "Gestión", label: "Gestión", icon: "cog-outline" });
  }

  return (
    <View style={styles.bottomNav}>
      {routes.map((route) => (
        <TouchableOpacity
          key={route.name}
          style={styles.navItem}
          onPress={() => navigation.navigate(route.name)}
          activeOpacity={0.7}
        >
          <View style={styles.navIconContainer}>
            <MaterialCommunityIcons name={route.icon} size={24} color={commonColors.primary} />
          </View>
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
    backgroundColor: commonColors.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: commonColors.border,
    gap: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  navIconContainer: {
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: commonColors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 