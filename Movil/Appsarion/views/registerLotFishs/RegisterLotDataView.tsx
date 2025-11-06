import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  TextInput,
  Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import * as Location from 'expo-location';
import { BASE_URL } from '../../services/connection/connection';
import { obtenerCiudadesPorDepartamento, obtenerListaDepartamentos } from '../../utils/filters';
import data from '../../data/colombia.json';
import FormScreenWrapper from '../../components/FormScreenWrapper'; 

export function RegisterLotDataView({ route, navigation }: any) {
  const idRole = useSelector((state: RootState) => state.auth.user?.idRole);
  const userRole = useSelector((state: RootState) => state.auth.user?.role ?? '');

  const [citiesFilter, setCitiesFilter] = useState<string[]>([]);
  const [listDepartamento, setListDepartamento] = useState<string[]>([]);
  const [lote, setLote] = useState('');
  const [coordenadas, setCoordenadas] = useState('');
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
  const [barrio, setBarrio] = useState('');
  const [vereda, setVereda] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Removed focus chaining refs to avoid focusing non-editable inputs and reduce IME edge cases

  const mountedRef = useRef(true);

  useEffect(() => {
    setListDepartamento(obtenerListaDepartamentos(data));
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setCitiesFilter(obtenerCiudadesPorDepartamento(selectedDepartamento, data));
    // Reset municipio when departamento changes to avoid inconsistent state
    setSelectedMunicipio('');
  }, [selectedDepartamento]);

  const obtenerCoordenadas = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requieren permisos para acceder a la ubicación.');
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert('Ubicación desactivada', 'Activa los servicios de ubicación en tu dispositivo e inténtalo de nuevo.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        mayShowUserSettingsDialog: true,
      });
      if (mountedRef.current) {
        setCoordenadas(`${location.coords.latitude}, ${location.coords.longitude}`);
      }
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      Alert.alert('Error', 'No se pudieron obtener las coordenadas.');
    }
  };

  const handleSubmit = async () => {
    if (!lote || !selectedDepartamento || !selectedMunicipio || !barrio || !vereda || !coordenadas) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
    const rol = normalizeRole(userRole);
    if (!rol || !idRole) {
      Alert.alert('Sesión requerida', 'No encontramos la información del usuario. Vuelve a iniciar sesión.');
      return;
    }
    try {
      if (submitting) return;
      setSubmitting(true);
      Keyboard.dismiss();
      const LotData = {
        lotName: lote.trim(),
        coordinates: coordenadas.trim(),
        department: selectedDepartamento.trim(),
        municipality: selectedMunicipio.trim(),
        neighborhood: barrio.trim(),
        vereda: vereda.trim(),
      };

      const response = await fetch(`${BASE_URL}/fish_lot/${rol}/${idRole}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(LotData),
      });

      if (!response.ok) {
        const msg = await response.text().catch(() => 'Error en el servicio de registro de Lotes');
        throw new Error(msg || 'Error en el servicio de registro de Lotes');
      }
      // Defer navigation to the next frame to avoid setState-after-unmount and navigation race conditions
      await new Promise((r) => setTimeout(r, 0));
      if (navigation?.navigate) {
        navigation.navigate('Drawer', { screen: 'Lotes' });
      }
    } catch (error) {
      console.error('Error en el registro del Lote:', error);
      Alert.alert('Error', (error as any)?.message ?? 'No se pudo registrar el lote.');
    } finally {
      if (mountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  return (
    <FormScreenWrapper>
      <Text style={styles.fieldLabel}>Nombre del Lote</Text>
      <TextInput
        value={lote}
        onChangeText={setLote}
        style={[styles.input, styles.textInput]}
      />

      <Text style={styles.fieldLabel}>Coordenadas</Text>
      <TextInput
        value={coordenadas}
        editable={false}
        style={[styles.input, styles.textInput, styles.readonly]}
      />
      <Button title="Obtener Coordenadas" onPress={obtenerCoordenadas} />
  
      <Text style={styles.label}>Departamento</Text>
      <Picker
        selectedValue={selectedDepartamento}
        onValueChange={(itemValue) => setSelectedDepartamento(itemValue)}
      >
        <Picker.Item label="-- Selecciona un departamento --" value="" />
        {listDepartamento.map((dep, index) => (
          <Picker.Item key={index} label={dep} value={dep} />
        ))}
      </Picker>
  
      <Text style={styles.label}>Municipio</Text>
      <Picker
        selectedValue={selectedMunicipio}
        onValueChange={(itemValue) => setSelectedMunicipio(itemValue)}
      >
        <Picker.Item label="-- Selecciona un municipio --" value="" />
        {citiesFilter.map((mun, index) => (
          <Picker.Item key={index} label={mun} value={mun} />
        ))}
      </Picker>
  
      <Text style={styles.fieldLabel}>Barrio</Text>
      <TextInput
        value={barrio}
        onChangeText={setBarrio}
        style={[styles.input, styles.textInput]}
        autoCorrect={false}
        autoCapitalize="words"
      />
      
      <Text style={styles.fieldLabel}>Vereda</Text>
      <TextInput
        value={vereda}
        onChangeText={setVereda}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        style={[styles.input, styles.textArea]}
        autoCorrect={false}
        autoCapitalize="words"
      />
  
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.finishButton]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{submitting ? 'Enviando...' : 'Finalizar'}</Text>
        </TouchableOpacity>
      </View>
    </FormScreenWrapper>
  );
}

function normalizeRole(role: string): string {
  if (!role) return '';
  const base = role
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (base.includes('admin')) return 'admin';
  if (base.includes('piscicultor')) return 'piscicultor';
  if (base.includes('comercializador')) return 'comercializador';
  if (base.includes('evaluador') || base.includes('agente')) return 'evaluador';
  if (base.includes('academico')) return 'academico';
  return base;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingBottom: 0,
    backgroundColor: '#fff',
    height: '100%',
  },
  input: {
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 80,
    backgroundColor: '#fff',
  },
  readonly: {
    backgroundColor: '#f5f5f5',
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  fieldLabel: {
    marginTop: 6,
    marginBottom: 6,
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 15,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 12,
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
  deleteButton: {
    backgroundColor: '#dc3545',
  },
});

export default RegisterLotDataView;
