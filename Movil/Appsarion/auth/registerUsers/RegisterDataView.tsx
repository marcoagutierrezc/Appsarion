import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export function RegisterDataView({ navigation }: any) {
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [repeatDocumentNumber, setRepeatDocumentNumber] = useState('');
  const [inputColorDoc, setInputColorDoc] = useState('#ff0000');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [inputColorPass, setInputColorPass] = useState('#ff0000');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true);

  const [isSaved, setIsSaved] = useState(false);

  const isValidPhoneNumber = phoneNumber && phoneNumber.length >= 10;
  const isValidEmail = email && email.includes('@') && email.includes('.');

  const hasUnsavedChanges = Boolean(
    (name || documentType || documentNumber || phoneNumber || email || password) && !isSaved
  );

  const handleSubmit = () => {
    if (
      !name ||
      !documentType ||
      !documentNumber ||
      documentNumber !== repeatDocumentNumber ||
      !password ||
      password !== repeatPassword ||
      !isValidPhoneNumber ||
      !isValidEmail
    ) {
      Alert.alert('Error', 'Por favor, complete todos los campos correctamente.');
      return;
    }

    setIsSaved(true);

    navigation.navigate('Registro - Datos del Rol', {
      name,
      documentType,
      documentNumber,
      phoneNumber,
      email,
      password,
    });
  };

  useEffect(() => {
    setInputColorDoc(documentNumber === repeatDocumentNumber ? '#00ff00' : '#ff0000');
  }, [documentNumber, repeatDocumentNumber]);

  useEffect(() => {
    setInputColorPass(password === repeatPassword ? '#00ff00' : '#ff0000');
  }, [password, repeatPassword]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!hasUnsavedChanges) {
        return;
      }
      e.preventDefault();

      Alert.alert(
        '¿Descartar Cambios?',
        'Tiene cambios sin guardar. ¿Estás seguro de descartarlos y salir de la pantalla?',
        [
          { text: 'Conservar', style: 'cancel', onPress: () => {} },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, hasUnsavedChanges]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Crear Cuenta</Text>
          <Text style={styles.headerSubtitle}>Paso 1 de 2: Datos Personales</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressSegment, { backgroundColor: '#0066cc' }]} />
          <View style={[styles.progressSegment, { backgroundColor: '#e0e0e0' }]} />
        </View>
      </View>

      {/* Form */}
      <View style={styles.formSection}>
        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nombre Completo *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="account-outline" size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ej: Juan Pérez"
              placeholderTextColor="#aaa"
            />
          </View>
        </View>

        {/* Document Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Tipo de Documento *</Text>
          <View style={styles.pickerWrapper}>
            <MaterialCommunityIcons name="card-account-details-outline" size={20} color="#0066cc" style={styles.inputIcon} />
            <Picker
              style={styles.picker}
              selectedValue={documentType}
              onValueChange={(itemValue) => setDocumentType(itemValue)}
            >
              <Picker.Item label="Seleccione el tipo de documento" value="" />
              <Picker.Item label="Cédula de Ciudadania" value="CC" />
              <Picker.Item label="Cédula de extranjería" value="CE" />
            </Picker>
          </View>
        </View>

        {/* Document Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Número de Documento *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="numeric" size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={documentNumber}
              onChangeText={(value) => setDocumentNumber(value.replace(/\D/g, ''))}
              keyboardType="numeric"
              placeholder="Ej: 123456789"
              placeholderTextColor="#aaa"
            />
            {documentNumber && (
              <MaterialCommunityIcons
                name={documentNumber === repeatDocumentNumber ? "check-circle" : "alert-circle"}
                size={20}
                color={documentNumber === repeatDocumentNumber ? "#28a745" : "#ff6b6b"}
                style={{ marginRight: 8 }}
              />
            )}
          </View>
        </View>

        {/* Repeat Document Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Repetir Número *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="numeric" size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={repeatDocumentNumber}
              onChangeText={(value) => setRepeatDocumentNumber(value.replace(/\D/g, ''))}
              keyboardType="numeric"
              placeholder="Confirma el número"
              placeholderTextColor="#aaa"
            />
            {repeatDocumentNumber && (
              <MaterialCommunityIcons
                name={documentNumber === repeatDocumentNumber ? "check-circle" : "alert-circle"}
                size={20}
                color={documentNumber === repeatDocumentNumber ? "#28a745" : "#ff6b6b"}
                style={{ marginRight: 8 }}
              />
            )}
          </View>
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Número de Teléfono *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="phone-outline" size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={(value) => setPhoneNumber(value.replace(/\D/g, ''))}
              keyboardType="numeric"
              placeholder="Ej: 3001234567"
              placeholderTextColor="#aaa"
            />
            {phoneNumber && (
              <MaterialCommunityIcons
                name={isValidPhoneNumber ? "check-circle" : "alert-circle"}
                size={20}
                color={isValidPhoneNumber ? "#28a745" : "#ff6b6b"}
                style={{ marginRight: 8 }}
              />
            )}
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Correo Electrónico *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="email-outline" size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
            />
            {email && (
              <MaterialCommunityIcons
                name={isValidEmail ? "check-circle" : "alert-circle"}
                size={20}
                color={isValidEmail ? "#28a745" : "#ff6b6b"}
                style={{ marginRight: 8 }}
              />
            )}
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Contraseña *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="lock-outline" size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#aaa"
              secureTextEntry={hidePassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.eyeIcon}>
              <MaterialCommunityIcons
                name={hidePassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#0066cc"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Repeat Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Repetir Contraseña *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="lock-outline" size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              placeholder="Confirma tu contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry={hideRepeatPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setHideRepeatPassword(!hideRepeatPassword)} style={styles.eyeIcon}>
              <MaterialCommunityIcons
                name={hideRepeatPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#0066cc"
              />
            </TouchableOpacity>
            {repeatPassword && (
              <MaterialCommunityIcons
                name={password === repeatPassword ? "check-circle" : "alert-circle"}
                size={20}
                color={password === repeatPassword ? "#28a745" : "#ff6b6b"}
                style={{ marginRight: 8 }}
              />
            )}
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
        >
          <Text style={styles.primaryButtonText}>Siguiente</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
  },
  headerContent: {
    marginBottom: 12,
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

  /* Progress Bar */
  progressBar: {
    flexDirection: 'row',
    gap: 8,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },

  /* Form Section */
  formSection: {
    padding: 20,
    gap: 18,
  },

  /* Input Group */
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 2,
  },
  inputWrapper: {
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
  eyeIcon: {
    padding: 8,
    marginRight: -8,
  },

  /* Picker */
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    paddingLeft: 12,
    height: 52,
    overflow: 'hidden',
  },
  picker: {
    flex: 1,
    height: 52,
    color: '#1a1a1a',
  },

  /* Button Container */
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 20,
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
});

export default RegisterDataView;
