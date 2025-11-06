import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_URL } from '../services/connection/connection';
import { showAlert } from '../utils/alerts';

export function PasswordRecoveryView({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleRequestReset = async () => {
    if (!email || !email.includes('@')) {
      showAlert('Error', 'Por favor ingresa un email válido.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/emails/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSent(true);
        showAlert('Éxito', 'Se ha enviado un enlace de recuperación a tu email. Revísalo en los próximos 10 minutos.');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        showAlert('Error', data.message || 'No se pudo procesar la solicitud.');
      }
    } catch (error: any) {
      console.error('Error solicitando reset:', error);
      showAlert('Error', 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0066cc" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Recuperar Contraseña</Text>
          <Text style={styles.headerSubtitle}>Reestablece tu contraseña</Text>
        </View>
      </View>

      {!sent ? (
        <View style={styles.formContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="lock-reset" size={64} color="#0066cc" />
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Text>

          {/* Email Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Correo Electrónico</Text>
            <View style={styles.inputGroup}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#0066cc" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="information" size={20} color="#ff9800" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.infoTitle}>Información importante</Text>
              <Text style={styles.infoText}>
                El enlace de recuperación es válido por <Text style={styles.bold}>10 minutos</Text>. Revisa tu carpeta de spam si no ves el correo.
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleRequestReset}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="send" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>Enviar Enlace</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.successContainer}>
          {/* Success Icon */}
          <View style={styles.successIconContainer}>
            <MaterialCommunityIcons name="check-circle" size={80} color="#28a745" />
          </View>

          {/* Success Message */}
          <Text style={styles.successTitle}>¡Enlace Enviado!</Text>
          
          <View style={styles.successMessageBox}>
            <Text style={styles.successMessage}>
              Hemos enviado un enlace de recuperación a:
            </Text>
            <Text style={styles.emailHighlight}>{email}</Text>
            <Text style={styles.successInstructions}>
              1. Abre tu correo (revisa spam si es necesario)\n
              2. Haz clic en el enlace de recuperación\n
              3. Sigue las instrucciones para cambiar tu contraseña\n
              4. Inicia sesión con tu nueva contraseña
            </Text>
          </View>

          {/* Warning */}
          <View style={styles.warningBox}>
            <MaterialCommunityIcons name="clock-outline" size={18} color="#ff9800" style={{ marginRight: 8 }} />
            <Text style={styles.warningText}>El enlace expira en <Text style={styles.bold}>10 minutos</Text></Text>
          </View>
        </View>
      )}
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
    paddingBottom: 40,
  },

  /* Header */
  header: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },

  /* Form Container */
  formContainer: {
    padding: 20,
    gap: 20,
  },

  /* Icon Container */
  iconContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },

  /* Description */
  description: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },

  /* Input Section */
  inputSection: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 2,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    padding: 0,
    fontWeight: '500',
  },

  /* Info Box */
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc107',
    padding: 12,
    alignItems: 'flex-start',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
  },

  /* Button Container */
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  /* Buttons */
  primaryButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: '#f0f5ff',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0066cc',
  },
  secondaryButtonText: {
    color: '#0066cc',
    fontSize: 15,
    fontWeight: '600',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  /* Success Container */
  successContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
  },

  /* Success Icon */
  successIconContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },

  /* Success Title */
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#28a745',
    marginTop: 8,
  },

  /* Success Message Box */
  successMessageBox: {
    backgroundColor: '#d4edda',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#28a745',
    padding: 16,
    gap: 10,
    width: '100%',
  },
  successMessage: {
    fontSize: 14,
    color: '#155724',
    fontWeight: '500',
  },
  emailHighlight: {
    fontSize: 15,
    fontWeight: '700',
    color: '#28a745',
    textAlign: 'center',
  },
  successInstructions: {
    fontSize: 13,
    color: '#155724',
    lineHeight: 22,
    marginTop: 8,
    fontWeight: '500',
  },

  /* Warning Box */
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc107',
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  warningText: {
    fontSize: 13,
    color: '#856404',
    fontWeight: '500',
    flex: 1,
  },
});

export default PasswordRecoveryView;
