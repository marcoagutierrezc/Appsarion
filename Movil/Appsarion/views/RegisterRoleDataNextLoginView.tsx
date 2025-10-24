import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BASE_URL } from "../services/connection/connection";
import { obtenerCiudadesPorDepartamento, obtenerListaDepartamentos } from '../utils/filters';
import data from '../data/colombia.json';

export function RegisterRoleDataNextLoginView({ navigation }: { navigation: any }) {
  const id = useSelector((state: RootState) => state.auth.user.id);
  const checkedRol = useSelector((state: RootState) => state.auth.user.role);
  
  const [listDepartamento, setListDepartamento] = useState<string[]>([]);
  const [citiesFilter, setCitiesFilter] = useState<string[]>([]);
  const [formFields, setFormFields] = useState<Record<string, string>>({});

  const roles = {
    Piscicultor: ['estacion', 'vereda', 'departamento', 'municipio'],
    Comercializador: ['empresa', 'barrio', 'departamento', 'municipio'],
    Evaluador: ['entidad', 'cargo'],
    'Académico': ['institucion', 'programa', 'curso'],
  } as const;

  useEffect(() => {
    setListDepartamento(obtenerListaDepartamentos(data));
  }, []);

  useEffect(() => {
    if (formFields.departamento) {
      setCitiesFilter(obtenerCiudadesPorDepartamento(formFields.departamento, data));
    }
  }, [formFields.departamento]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      [field]: value, // Permitir espacios mientras se escribe
    }));
  }, []);

  const handleDepartamentoChange = useCallback((itemValue: string) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      departamento: itemValue,
      municipio: '',
    }));
  }, []);

  const handleMunicipioChange = useCallback((itemValue: string) => {
    setFormFields((prevFields) => ({
      ...prevFields,
      municipio: itemValue,
    }));
  }, []);

  const validateFields = () => {
    const requiredFields = roles[checkedRol as keyof typeof roles] || [];
    return requiredFields.every((field) => formFields[field]?.trim());
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      Alert.alert('Error', 'Por favor, complete todos los campos obligatorios.');
      return;
    }
  
    const cleanedFormFields = Object.keys(formFields).reduce((acc, key) => {
      acc[key] = formFields[key].trim();
      return acc;
    }, {} as Record<string, string>);
  
    const DataRolePayload = {
      piscicultor: checkedRol === 'Piscicultor' ? {
        nameProperty: cleanedFormFields.estacion,
        department: cleanedFormFields.departamento,
        municipality: cleanedFormFields.municipio,
        neighborhood: cleanedFormFields.vereda,
      } : null,
      comercializador: checkedRol === 'Comercializador' ? {
        nameProperty: cleanedFormFields.empresa,
        department: cleanedFormFields.departamento,
        municipality: cleanedFormFields.municipio,
        neighborhood: cleanedFormFields.barrio,
      } : null,
      evaluador: checkedRol === 'Evaluador' ? {
        entidad: cleanedFormFields.entidad,
        cargo: cleanedFormFields.cargo,
      } : null,
      academico: checkedRol === 'Académico' ? {
        institution: cleanedFormFields.institucion,
        career: cleanedFormFields.programa,
        course: cleanedFormFields.curso,
      } : null,
    };
  
    console.log('DataRolePayload', DataRolePayload);
  
    try {
      const response = await fetch(`${BASE_URL}/users/update-role-data/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(DataRolePayload),
      });
  
      const contentType = response.headers.get('content-type');
  
      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json(); // Si es JSON, lo parseamos
      } else {
        result = await response.text(); // Si es texto plano, lo guardamos como string
      }
  
      console.log('Server Response:', result);
  
      if (!response.ok) {
        throw new Error(typeof result === 'string' ? result : result.message || 'Error al actualizar los datos.');
      }
  
      Alert.alert('Éxito', 'Los datos fueron actualizados correctamente.');
      navigation.navigate('DrawerNavigation');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };
  return (
    <ScrollView style={styles.container}>
      {checkedRol && roles[checkedRol as keyof typeof roles] ? (
        roles[checkedRol as keyof typeof roles]
          .filter((field) => field !== 'departamento' && field !== 'municipio')
          .map((field) => (
            <TextInput
              key={field}
              value={formFields[field] || ''}
              onChangeText={(value) => handleInputChange(field, value)}
              placeholder={`Ingrese ${field}`}
              style={styles.input}
            />
          ))
      ) : (
        <Text>No hay campos disponibles para este rol.</Text>
      )}

      {(checkedRol === 'Piscicultor' || checkedRol === 'Comercializador') && (
        <>
          <Text>Departamento</Text>
          <Picker selectedValue={formFields.departamento || ''} onValueChange={handleDepartamentoChange}>
            <Picker.Item label="-- Selecciona un departamento --" value="" />
            {listDepartamento.map((departamento, index) => (
              <Picker.Item key={index} label={departamento} value={departamento} />
            ))}
          </Picker>
          <Text>Municipio</Text>
          <Picker selectedValue={formFields.municipio || ''} onValueChange={handleMunicipioChange}>
            <Picker.Item label="-- Selecciona un municipio --" value="" />
            {citiesFilter.map((municipio, index) => (
              <Picker.Item key={index} label={municipio} value={municipio} />
            ))}
          </Picker>
        </>
      )}

      <TouchableOpacity style={[styles.button, styles.finishButton]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Finalizar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default RegisterRoleDataNextLoginView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: '#28a745',
  },
});
