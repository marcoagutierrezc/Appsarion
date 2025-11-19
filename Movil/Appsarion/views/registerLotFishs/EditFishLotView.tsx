import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import * as Location from 'expo-location';
import { BASE_URL } from '../../services/connection/connection';
import { obtenerCiudadesPorDepartamento, obtenerListaDepartamentos } from '../../utils/filters';
import data from '../../data/colombia.json';
import { useFontScale } from '../../context/FontScaleContext';

export function EditFishLotView({ route, navigation }: any) {
  const { fontScale } = useFontScale();
  const { fishLotId } = route.params || {};
  const idRole = useSelector((state: RootState) => state.auth.user?.idRole);
  const userRole = useSelector((state: RootState) => state.auth.user?.role ?? '');
  const userId = useSelector((state: RootState) => state.auth.user?.idRole);

  const [citiesFilter, setCitiesFilter] = useState<string[]>([]);
  const [listDepartamento, setListDepartamento] = useState<string[]>([]);
  const [lote, setLote] = useState('');
  const [coordenadas, setCoordenadas] = useState('');
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
  const [barrio, setBarrio] = useState('');
  const [vereda, setVereda] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(true);

  // Opciones para Pickers
  const departamentoOptions = useMemo(() => listDepartamento, [listDepartamento]);
  const municipioOptions = useMemo(() => citiesFilter, [citiesFilter]);

  useEffect(() => {
    setListDepartamento(obtenerListaDepartamentos(data));
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setCitiesFilter(obtenerCiudadesPorDepartamento(selectedDepartamento, data));
    setSelectedMunicipio('');
  }, [selectedDepartamento]);

  // Cargar datos del lote
  useEffect(() => {
    const loadFishLot = async () => {
      try {
        if (!fishLotId) {
          Alert.alert('Error', 'ID del lote no proporcionado.');
          navigation.goBack();
          return;
        }

        const response = await fetch(`${BASE_URL}/fish_lot/${fishLotId}`);
        if (!response.ok) throw new Error('No se pudo cargar el lote.');

        const fishLot = await response.json();
        if (mountedRef.current) {
          setLote(fishLot.lotName || '');
          setCoordenadas(fishLot.coordinates || '');
          setSelectedDepartamento(fishLot.department || '');
          setSelectedMunicipio(fishLot.municipality || '');
          setBarrio(fishLot.neighborhood || '');
          setVereda(fishLot.vereda || '');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al cargar el lote:', error);
        if (mountedRef.current) {
          Alert.alert('Error', 'No se pudo cargar los datos del lote.');
          setLoading(false);
        }
      }
    };

    loadFishLot();
  }, [fishLotId]);

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

      const response = await fetch(`${BASE_URL}/fish_lot/${fishLotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(LotData),
      });

      if (!response.ok) {
        const msg = await response.text().catch(() => 'Error en el servicio de actualización');
        throw new Error(msg || 'Error en el servicio de actualización de lotes');
      }

      await new Promise((r) => setTimeout(r, 0));
      if (navigation?.navigate) {
        navigation.navigate('Drawer', { screen: 'Lotes' });
      }
    } catch (error) {
      console.error('Error en la actualización del Lote:', error);
      Alert.alert('Error', (error as any)?.message ?? 'No se pudo actualizar el lote.');
    } finally {
      if (mountedRef.current) {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { fontSize: 14 * fontScale }]}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { fontSize: 20 * fontScale }]}>Editar Lote</Text>
          <Text style={[styles.headerSubtitle, { fontSize: 14 * fontScale }]}>Actualizar datos del lote</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressSegment, { backgroundColor: '#0066cc' }]} />
          <View style={[styles.progressSegment, { backgroundColor: '#0066cc' }]} />
        </View>
      </View>

      {/* Formulario */}
      <View style={styles.formSection}>
        {/* Nombre del lote */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { fontSize: 14 * fontScale }]}>Nombre del Lote *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="fish" size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={lote}
              onChangeText={setLote}
              placeholder="Ej: Lote 1"
              placeholderTextColor="#aaa"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
        </View>

        {/* Coordenadas */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { fontSize: 14 * fontScale }]}>Coordenadas *</Text>
          <View style={[styles.inputWrapper, styles.readonlyWrapper]}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={coordenadas}
              editable={false}
              placeholder="Latitud, Longitud"
              placeholderTextColor="#aaa"
            />
          </View>
          <TouchableOpacity style={[styles.secondaryButtonInline, { marginTop: 8 }]} onPress={obtenerCoordenadas}>
            <Text style={[styles.secondaryButtonText, { fontSize: 13 * fontScale }]}>Actualizar Coordenadas</Text>
          </TouchableOpacity>
        </View>

        {/* Departamento */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { fontSize: 14 * fontScale }]}>Departamento *</Text>
          <View style={styles.pickerWrapper}>
            <MaterialCommunityIcons name="map-outline" size={20} color="#0066cc" style={styles.inputIcon} />
            <Picker
              style={styles.picker}
              selectedValue={selectedDepartamento}
              onValueChange={(itemValue) => setSelectedDepartamento(String(itemValue))}
            >
              <Picker.Item label="Seleccione un departamento" value="" />
              {departamentoOptions.map((dep) => (
                <Picker.Item key={dep} label={dep} value={dep} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Municipio */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { fontSize: 14 * fontScale }]}>Municipio *</Text>
          <View style={styles.pickerWrapper}>
            <MaterialCommunityIcons name="home-city-outline" size={20} color="#0066cc" style={styles.inputIcon} />
            <Picker
              style={styles.picker}
              selectedValue={selectedMunicipio}
              onValueChange={(itemValue) => setSelectedMunicipio(String(itemValue))}
            >
              <Picker.Item label="Seleccione un municipio" value="" />
              {municipioOptions.map((mun) => (
                <Picker.Item key={mun} label={mun} value={mun} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Barrio */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { fontSize: 14 * fontScale }]}>Barrio *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="home-outline" size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={barrio}
              onChangeText={setBarrio}
              placeholder="Ej: Centro"
              placeholderTextColor="#aaa"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
        </View>

        {/* Vereda */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { fontSize: 14 * fontScale }]}>Vereda *</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="map" size={20} color="#0066cc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={vereda}
              onChangeText={setVereda}
              placeholder="Ej: El Paraíso"
              placeholderTextColor="#aaa"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.secondaryButtonText, { fontSize: 13 * fontScale }]}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.primaryButton, submitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={submitting}>
          <Text style={[styles.primaryButtonText, { fontSize: 14 * fontScale }]}>{submitting ? 'Actualizando...' : 'Guardar'}</Text>
          {!submitting && <MaterialCommunityIcons name="check" size={18} color="#fff" style={{ marginLeft: 8 }} />}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  /* Header */
  header: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 24,
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
  readonlyWrapper: {
    backgroundColor: '#f5f7fa',
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
    fontSize: 16,
  },
  /* Buttons */
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 8,
  },
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
  secondaryButtonInline: {
    backgroundColor: '#f0f5ff',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0066cc',
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
});

export default EditFishLotView;
