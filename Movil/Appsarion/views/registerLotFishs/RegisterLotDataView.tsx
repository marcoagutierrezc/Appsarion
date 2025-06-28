import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import * as Location from 'expo-location';
import { BASE_URL } from '../../services/connection/connection';
import { obtenerCiudadesPorDepartamento, obtenerListaDepartamentos } from '../../utils/filters';
import data from '../../data/colombia.json';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormScreenWrapper from '../../components/FormScreenWrapper'; 

export function RegisterLotDataView({ route, navigation }: any) {
  const idRole = useSelector((state: RootState) => state.auth.user?.idRole);
  const rol = useSelector((state: RootState) => state.auth.user.role.toLowerCase());

  const [citiesFilter, setCitiesFilter] = useState<string[]>([]);
  const [listDepartamento, setListDepartamento] = useState<string[]>([]);
  const [lote, setLote] = useState('');
  const [coordenadas, setCoordenadas] = useState('');
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
  const [barrio, setBarrio] = useState('');
  const [vereda, setVereda] = useState('');

  const loteRef = useRef<any>(null);
  const coordenadasRef = useRef<any>(null);
  const departamentoRef = useRef<any>(null);
  const municipioRef = useRef<any>(null);
  const barrioRef = useRef<any>(null);
  const veredaRef = useRef<any>(null);

  useEffect(() => {
    setListDepartamento(obtenerListaDepartamentos(data));
    const timer = setTimeout(() => {
      loteRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCitiesFilter(obtenerCiudadesPorDepartamento(selectedDepartamento, data));
  }, [selectedDepartamento]);

  const obtenerCoordenadas = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se requieren permisos para acceder a la ubicación.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCoordenadas(`${location.coords.latitude}, ${location.coords.longitude}`);
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
    try {
      const LotData = {
        lotName: lote,
        coordinates: coordenadas,
        department: selectedDepartamento,
        municipality: selectedMunicipio,
        neighborhood: barrio,
        vereda: vereda,
      };

      const response = await fetch(`${BASE_URL}/fish_lot/${rol}/${idRole}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(LotData),
      });

      if (!response.ok) {
        throw new Error('Error en el servicio de registro de Lotes');
      }
      navigation.navigate('Lotes');
    } catch (error) {
      console.error('Error en el registro del Lote:', error);
    }
  };

  return (
    <FormScreenWrapper>
      <TextInput
        label="Nombre del Lote"
        value={lote}
        onChangeText={setLote}
        mode="outlined"
        style={styles.input}
        ref={loteRef}
        returnKeyType="next"
        onSubmitEditing={() => coordenadasRef.current?.focus()}
      />

      <TextInput
        ref={coordenadasRef}
        value={coordenadas}
        onChangeText={setCoordenadas}
        placeholder="Coordenadas"
        style={styles.input}
        returnKeyType="next"
        onSubmitEditing={() => departamentoRef.current?.focus()}
      />
      <Button title="Obtener Coordenadas" onPress={obtenerCoordenadas} />
  
      <Text style={styles.label}>Departamento</Text>
      <Picker
        ref={departamentoRef}
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
        ref={municipioRef}
        selectedValue={selectedMunicipio}
        onValueChange={(itemValue) => setSelectedMunicipio(itemValue)}
      >
        <Picker.Item label="-- Selecciona un municipio --" value="" />
        {citiesFilter.map((mun, index) => (
          <Picker.Item key={index} label={mun} value={mun} />
        ))}
      </Picker>
  
      <TextInput
        label="Barrio"
        value={barrio}
        onChangeText={setBarrio}
        mode="outlined"
        style={styles.input}
        ref={barrioRef}
        returnKeyType="next"
        onSubmitEditing={() => veredaRef.current?.focus()}
      />
      
      <TextInput
        label="Vereda"
        value={vereda}
        onChangeText={setVereda}
        mode="outlined"
        style={styles.input}
        ref={veredaRef}
        returnKeyType="done"
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
        >
          <Text style={styles.buttonText}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    </FormScreenWrapper>
  );
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
  label: {
    marginTop: 10,
    fontWeight: 'bold',
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
