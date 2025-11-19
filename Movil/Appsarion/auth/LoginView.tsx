import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ActivityIndicator, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';  
import { useDispatch } from 'react-redux';
import { logIn } from '../store/slices/auth/authSlice';
import { BASE_URL } from '../services/connection/connection';
import { showAlert } from '../utils/alerts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { commonColors } from '../styles/commonStyles';
import { useFontScale } from '../context/FontScaleContext';

const LogoApp = require('../assets/LogoName.png');

export function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const { fontScale, setFontScale } = useFontScale();
  const [logoTapCount, setLogoTapCount] = useState(0);
  const tapTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();
  const [fontModalVisible, setFontModalVisible] = useState(false);

  const handleLogoTap = () => {
    // Cancelar el timeout anterior si existe
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    setLogoTapCount(prev => {
      const newCount = prev + 1;
      
      if (newCount === 5) {
        setFontModalVisible(true);
        setLogoTapCount(0);
        return 0;
      }
      
      // Reset count after 2 seconds of no taps
      tapTimeoutRef.current = setTimeout(() => {
        setLogoTapCount(0);
      }, 2000);
      
      return newCount;
    });
  };

  const saveFontScale = async (scale: number) => {
    try {
      await setFontScale(scale);
      setFontModalVisible(false);
    } catch (error) {
      console.error('Error saving font scale:', error);
    }
  };

  const fetchUserRole = async (userId: number) => {
    try {
      const roleResponse = await fetch(`${BASE_URL}/users/role-id/${userId}`);
      if (!roleResponse.ok) {
        throw new Error('No se pudo obtener la información del rol.');
      }
      const { roleId } = await roleResponse.json();
      return roleId;
    } catch (error) {
      console.error('Error obteniendo el rol del usuario:', error);
      showAlert('Error', 'No se pudo obtener el rol del usuario.');
      return null;
    }
  };

  const login = async () => {
    if (!email || !password) {
      showAlert('Error', 'Por favor, ingrese su correo electrónico y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Credenciales incorrectas.');
      }

      const data = await response.json();
      const roleId = await fetchUserRole(data.id);

      if (roleId !== null) {
        dispatch(logIn({ ...data, idRole: roleId }));
        if (roleId !== 1) {
          showAlert('Éxito', 'Inicio de sesión exitoso.');
        }
        navigation.reset({
          index: 0,
          routes: [{ name: "SoportePQR" }],
        });        
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      showAlert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Header con logo y título */}
          <View style={styles.headerSection}>
            <TouchableOpacity onPress={handleLogoTap} activeOpacity={0.7}>
              <Image source={LogoApp} style={styles.logo} />
            </TouchableOpacity>
          </View>

          {/* Sección de Login */}
          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { fontSize: 18 * fontScale }]}>Iniciar Sesión</Text>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#0066cc" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { fontSize: 16 * fontScale }]}
                placeholder="Correo electrónico"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#0066cc" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { flex: 1, fontSize: 16 * fontScale }]}
                placeholder="Contraseña"
                placeholderTextColor="#aaa"
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hidePassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setHidePassword(!hidePassword)}
                style={styles.eyeIcon}
              >
                <MaterialCommunityIcons
                  name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#0066cc"
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={login}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons name="login" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={[styles.primaryButtonText, { fontSize: 16 * fontScale }]}>Iniciar Sesión</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Password Recovery Link */}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Recuperar Contraseña')}
              disabled={loading}
            >
              <MaterialCommunityIcons name="lock-reset" size={18} color="#0066cc" style={{ marginRight: 6 }} />
              <Text style={[styles.linkButtonText, { fontSize: 14 * fontScale }]}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={[styles.dividerText, { fontSize: 14 * fontScale }]}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sección de Registro */}
          <View style={styles.actionSection}>
            <Text style={[styles.actionTitle, { fontSize: 16 * fontScale }]}>¿No tienes cuenta?</Text>
            <Text style={[styles.actionSubtitle, { fontSize: 13 * fontScale }]}>Crea una nueva cuenta para acceder</Text>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Registro')}
              disabled={loading}
            >
              <MaterialCommunityIcons name="account-plus" size={20} color="#0066cc" style={{ marginRight: 8 }} />
              <Text style={[styles.secondaryButtonText, { fontSize: 15 * fontScale }]}>Crear Cuenta</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
          </View>

          {/* Sección de Soporte */}
          <View style={styles.actionSection}>
            <Text style={[styles.actionTitle, { fontSize: 16 * fontScale }]}>¿Necesitas ayuda?</Text>
            <Text style={[styles.actionSubtitle, { fontSize: 13 * fontScale }]}>Contáctanos si tienes problemas con la app</Text>
            <TouchableOpacity
              style={styles.tertiaryButton}
              onPress={() => navigation.navigate('SoportePQR')}
              disabled={loading}
            >
              <MaterialCommunityIcons name="help-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={[styles.tertiaryButtonText, { fontSize: 15 * fontScale }]}>Soporte PQRS</Text>
            </TouchableOpacity>
          </View>

          <StatusBar style="light" />
        </View>
      </ScrollView>

      {/* Font Size Modal */}
      <Modal visible={fontModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { fontSize: 18 * fontScale }]}>Tamaño de Fuente</Text>
            
            <View style={styles.fontOptionsContainer}>
              {[0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5].map((scale) => (
                <TouchableOpacity
                  key={scale}
                  style={[
                    styles.fontOption,
                    fontScale === scale && styles.fontOptionActive
                  ]}
                  onPress={() => saveFontScale(scale)}
                >
                  <Text style={[
                    styles.fontOptionText,
                    { fontSize: 14 * scale },
                    fontScale === scale && styles.fontOptionTextActive
                  ]}>
                    {scale === 0.7 ? 'Muy Pequeño' : scale === 0.8 ? 'Pequeño' : scale === 0.9 ? 'Mediano' : scale === 1 ? 'Normal' : scale === 1.1 ? 'Grande' : scale === 1.2 ? 'Muy Grande' : scale === 1.3 ? 'Extra Grande' : scale === 1.4 ? 'Gigante' : 'Máximo'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFontModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, { fontSize: 16 * fontScale }]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  
  /* Header Section */
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: 4,
    letterSpacing: 0.5,
    display: 'none',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
    display: 'none',
  },

  /* Form Section */
  formSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  /* Input Group */
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    padding: 0,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 8,
    marginRight: -8,
  },

  /* Buttons */
  primaryButton: {
    backgroundColor: '#0066cc',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  /* Link Button */
  linkButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 4,
  },
  linkButtonText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },

  /* Divider */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },

  /* Action Section */
  actionSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    fontWeight: '400',
    lineHeight: 18,
  },

  /* Secondary Button */
  secondaryButton: {
    backgroundColor: '#f0f5ff',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#0066cc',
  },
  secondaryButtonText: {
    color: '#0066cc',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  /* Tertiary Button */
  tertiaryButton: {
    backgroundColor: '#28a745',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  tertiaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  /* Font Size Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  fontOptionsContainer: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  fontOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  fontOptionActive: {
    borderColor: '#0066cc',
    backgroundColor: '#f0f5ff',
  },
  fontOptionText: {
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  fontOptionTextActive: {
    color: '#0066cc',
    fontWeight: '700',
  },
  closeButton: {
    backgroundColor: '#0066cc',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;