import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { commonColors, commonStyles } from '../styles/commonStyles';
import { useFontScale } from '../context/FontScaleContext';

export function SettingsView({ navigation }: { navigation: any }) {
  const { fontScale } = useFontScale();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={[styles.title, { fontSize: 24 * fontScale }]}>Configuración</Text>
        <Text style={[styles.subtitle, { fontSize: 14 * fontScale }]}>Gestiona la configuración de la aplicación</Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, { fontSize: 16 * fontScale }]}>Información de la App</Text>
        <Text style={[styles.cardText, { fontSize: 14 * fontScale }]}>Versión: 1.0.0</Text>
        <Text style={[styles.cardText, { fontSize: 14 * fontScale }]}>Nombre: Appsarion</Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, { fontSize: 16 * fontScale }]}>Tamaño de Fuente</Text>
        <Text style={[styles.cardText, { fontSize: 14 * fontScale }]}>Tamaño actual: {fontScale.toFixed(1)}x</Text>
        <Text style={[styles.cardText, { fontSize: 12 * fontScale }]}>Toca 5 veces el logo en la pantalla de inicio para cambiar el tamaño</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: commonColors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: commonColors.textSecondary,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: commonColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: commonColors.primary,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: commonColors.textPrimary,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default SettingsView;
