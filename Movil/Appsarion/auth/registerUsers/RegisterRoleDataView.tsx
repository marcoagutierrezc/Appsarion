import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import {BASE_URL} from "../../services/connection/connection";
import ImageUploader from '../../components/ImageUploader';

  export function RegisterRoleDataView({ route, navigation }: any) {
    const params = route?.params ?? {};
    const { name, documentType, documentNumber, phoneNumber, email, password } = params as any;
    const [checkedRol, setCheckedRoll] = useState<string>('');
    const [justification, setJustification] = useState('');
    const [supportingDocument, setSupportingDocument] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageSelected = (uri: string) => {
      setSupportingDocument(uri); 
      console.log("image: ", uri);
    };
  
    const handleSubmit = async () => {
      if (isSubmitting) return;
      
      if (!name || !documentType || !documentNumber || !phoneNumber || !email || !password) {
        Alert.alert('Faltan datos', 'No se encontró la información del usuario. Vuelve al paso anterior.');
        return;
      }
      if (!checkedRol) {
        Alert.alert('Error', 'Por favor, seleccione un rol.');
        return;
      }
      if (!justification && !supportingDocument) {
        Alert.alert('Error', 'Por favor, complete todos los campos.');
        return;
      }
  
      setIsSubmitting(true);
      try {
        const formData = new FormData();

        formData.append('name', name);
        formData.append('documentType', documentType);
        formData.append('documentNumber', documentNumber.toString());
        formData.append('phoneNumber', phoneNumber.toString());
        formData.append('email', email);
        formData.append('password', password);
        formData.append('justification', justification);
        formData.append('role', checkedRol);
        
        if (supportingDocument) {
          // @ts-expect-error: FormData de React Native acepta objeto con uri
          formData.append('supportingDocument', {
            uri: supportingDocument,
            type: 'image/jpeg',
            name: `${documentNumber}.jpg`,
          });
        }

        const response = await fetch(`${BASE_URL}/users-to-verify`, {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error en el servicio:', errorText);
          throw new Error('Error en el servicio de verificación de usuario');
        }
        
        navigation.navigate('Confirmacion de Registro');

      } catch (error) {
        console.error('Error en el registro:', error);
        Alert.alert('Error', 'No fue posible completar el registro. Intenta de nuevo.');
        setIsSubmitting(false);
      }
    };
  
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Crear Cuenta</Text>
            <Text style={styles.headerSubtitle}>Paso 2 de 2: Información del Rol</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressSegment, { backgroundColor: '#0066cc' }]} />
            <View style={[styles.progressSegment, { backgroundColor: '#0066cc' }]} />
          </View>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          {/* Role Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Selecciona tu Rol *</Text>
            <View style={styles.pickerWrapper}>
              <MaterialCommunityIcons name="briefcase-outline" size={20} color="#0066cc" style={styles.inputIcon} />
              <Picker
                style={styles.picker}
                selectedValue={checkedRol}
                onValueChange={(itemValue) => setCheckedRoll(itemValue)}
              >
                <Picker.Item label="Seleccione un rol" value="" />
                <Picker.Item label="Piscicultor" value="Piscicultor" />
                <Picker.Item label="Comercializador" value="Comercializador" />
                <Picker.Item label="Agente de sanidad" value="Evaluador" />
                <Picker.Item label="Académico" value="Académico" />
              </Picker>
            </View>
          </View>

          {/* Justification */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Justificación *</Text>
            <View style={styles.textAreaWrapper}>
              <MaterialCommunityIcons name="text-box-outline" size={20} color="#0066cc" style={styles.inputIcon} />
              <TextInput
                style={styles.textArea}
                multiline={true}
                numberOfLines={4}
                value={justification}
                onChangeText={setJustification}
                placeholder="Cuéntanos por qué quieres usar Appsarion..."
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          {/* Supporting Document */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Documento de Soporte *</Text>
            <View style={styles.documentSection}>
              <MaterialCommunityIcons name="file-document-outline" size={20} color="#0066cc" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.documentText}>Carga un documento que respalde tu rol</Text>
                <ImageUploader onImageSelected={handleImageSelected} />
                {supportingDocument && (
                  <View style={styles.successMessage}>
                    <MaterialCommunityIcons name="check-circle" size={16} color="#28a745" style={{ marginRight: 6 }} />
                    <Text style={styles.successText}>Imagen seleccionada con éxito</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <MaterialCommunityIcons name="arrow-left" size={18} color="#0066cc" style={{ marginRight: 6 }} />
            <Text style={styles.secondaryButtonText}>Atrás</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={() => navigation.popToTop()}
            disabled={isSubmitting}
          >
            <MaterialCommunityIcons name="close" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.tertiaryButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="check" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.primaryButtonText}>Finalizar</Text>
              </>
            )}
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
  inputIcon: {
    marginRight: 8,
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

  /* Text Area */
  textAreaWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  textArea: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
    paddingVertical: 4,
    maxHeight: 120,
  },

  /* Document Section */
  documentSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  documentText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4edda',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
  },
  successText: {
    fontSize: 13,
    color: '#155724',
    fontWeight: '500',
  },

  /* Button Container */
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 20,
  },

  /* Buttons */
  primaryButton: {
    flex: 1,
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
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
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
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#0066cc',
  },
  secondaryButtonText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600',
  },

  tertiaryButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  tertiaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});

export default RegisterRoleDataView;