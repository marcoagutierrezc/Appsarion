import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LogoApp = require('../../assets/LogoName.png');
const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL || 'soporte@appsarion.com';

export function RegisterConfirmationView({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.successBadge}>
          <MaterialCommunityIcons name="check" size={64} color="#fff" />
        </View>
      </View>

      {/* Logo */}
      <Image source={LogoApp} style={styles.logo} />

      {/* Main Message */}
      <Text style={styles.mainTitle}>¡Registro Exitoso!</Text>
      <Text style={styles.subtitle}>Tu cuenta ha sido creada</Text>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <View style={styles.infoItemRow}>
          <MaterialCommunityIcons name="shield-check-outline" size={24} color="#0066cc" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Moderación pendiente</Text>
            <Text style={styles.infoDescription}>Nuestro equipo revisará tu información en breve</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoItemRow}>
          <MaterialCommunityIcons name="clock-outline" size={24} color="#0066cc" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Tiempo estimado</Text>
            <Text style={styles.infoDescription}>Puedes recibir confirmación en 24-48 horas</Text>
          </View>
        </View>
      </View>

      {/* Next Steps */}
      <View style={styles.stepsSection}>
        <Text style={styles.stepsTitle}>Próximos Pasos:</Text>
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>Espera la aprobación de nuestro equipo</Text>
        </View>
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>Recibirás un correo con la confirmación</Text>
        </View>
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>¡Inicia sesión y comienza a usar Appsarion!</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.popToTop()}
      >
        <Text style={styles.buttonText}>Ir a Inicio de Sesión</Text>
        <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      {/* Support Link */}
      <Text style={styles.supportText}>
        ¿Problemas? Contáctanos en{' '}
        <Text style={styles.supportLink}>{SUPPORT_EMAIL}</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  /* Icon Container */
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  successBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  /* Logo */
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 16,
  },

  /* Title */
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },

  /* Info Box */
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066cc',
    marginBottom: 2,
  },
  infoDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },

  /* Steps Section */
  stepsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },

  /* Button */
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  /* Support Text */
  supportText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 18,
  },
  supportLink: {
    color: '#0066cc',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default RegisterConfirmationView;