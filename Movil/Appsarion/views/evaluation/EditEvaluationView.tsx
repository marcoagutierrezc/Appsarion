import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Select from '../../components/SelectComponent';
import { colorOptions, eyeOptions, furOptions, gillOptions, meatOptions, smellOptions, textureOptions } from '../../data/optionsNTC1443';
import { BASE_URL } from '../../services/connection/connection';
import { commonColors, commonStyles } from '../../styles/commonStyles';
import { useFontScale } from '../../context/FontScaleContext';

export function EditEvaluationView({ route, navigation }: any) {
  const { evaluationId } = route.params || {};
  const { fontScale } = useFontScale();
  const userRole = useSelector((state: RootState) => state.auth.user?.role?.toLowerCase() ?? '');
  const idRole = useSelector((state: RootState) => state.auth.user?.idRole);

  const [smell, setSmell] = useState<number | null>(null);
  const [fur, setFur] = useState<number | null>(null);
  const [meat, setMeat] = useState<number | null>(null);
  const [eyes, setEyes] = useState<number | null>(null);
  const [texture, setTexture] = useState<number | null>(null);
  const [color, setColor] = useState<number | null>(null);
  const [gills, setGills] = useState<number | null>(null);
  const [observations, setObservations] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Cargar datos de la evaluación
  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        if (!evaluationId) {
          Alert.alert('Error', 'ID de la evaluación no proporcionado.');
          navigation.goBack();
          return;
        }

        const response = await fetch(`${BASE_URL}/evaluations/${evaluationId}`);
        if (!response.ok) throw new Error('No se pudo cargar la evaluación.');

        const evaluation = await response.json();
        if (mountedRef.current) {
          // Mapear datos de la evaluación a los estados
          // Aquí se asume que la evaluación tiene estos campos
          // Si la API no los retorna, ajusta según tu backend
          setSmell(evaluation.smell ?? null);
          setFur(evaluation.fur ?? null);
          setMeat(evaluation.meat ?? null);
          setEyes(evaluation.eyes ?? null);
          setTexture(evaluation.texture ?? null);
          setColor(evaluation.color ?? null);
          setGills(evaluation.gills ?? null);
          setObservations(evaluation.observations ?? '');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error al cargar la evaluación:', error);
        if (mountedRef.current) {
          Alert.alert('Error', 'No se pudo cargar los datos de la evaluación.');
          setLoading(false);
        }
      }
    };

    loadEvaluation();
  }, [evaluationId]);

  const handleSubmit = async () => {
    const isFormValid = () => {
      return [smell, fur, meat, eyes, texture, color, gills].every((value) => typeof value === 'number' && !Number.isNaN(value));
    };

    if (!isFormValid()) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    const DataEvaluation = {
      smell,
      fur,
      meat,
      eyes,
      texture,
      color,
      gills,
      observations: observations.trim() || null,
    };

    try {
      if (submitting) return;
      setSubmitting(true);

      const response = await fetch(`${BASE_URL}/evaluations/${evaluationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(DataEvaluation),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Error desconocido en la actualización.');
      }

      Alert.alert('Éxito', 'Evaluación actualizada con éxito.');
      navigation.navigate('Drawer', { screen: 'Lotes' });
    } catch (error: any) {
      console.error('Error en la actualización de la evaluación:', error);
      Alert.alert('Error', `Error en la actualización: ${error?.message || 'desconocido'}`);
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
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
        <Text style={[styles.title, { fontSize: 20 * fontScale }]}>Editar Evaluación</Text>
        <View>
          <Select
            label="Olor"
            placeholder="Selecciona una opción"
            objValue="value"
            objLabel="label"
            options={smellOptions}
            value={smell !== null && smell !== undefined ? String(smell) : ""}
            onValueChange={(itemValue: string) => setSmell(Number(itemValue))}
          />
          <Select
            label="Piel"
            placeholder="Selecciona una opción"
            objValue="value"
            objLabel="label"
            options={furOptions}
            value={fur !== null && fur !== undefined ? String(fur) : ""}
            onValueChange={(itemValue: string) => setFur(Number(itemValue))}
          />
          <Select
            label="Carne"
            placeholder="Selecciona una opción"
            objValue="value"
            objLabel="label"
            options={meatOptions}
            value={meat !== null && meat !== undefined ? String(meat) : ""}
            onValueChange={(itemValue: string) => setMeat(Number(itemValue))}
          />
          <Select
            label="Ojos"
            placeholder="Selecciona una opción"
            objValue="value"
            objLabel="label"
            options={eyeOptions}
            value={eyes !== null && eyes !== undefined ? String(eyes) : ""}
            onValueChange={(itemValue: string) => setEyes(Number(itemValue))}
          />
          <Select
            label="Textura"
            placeholder="Selecciona una opción"
            objValue="value"
            objLabel="label"
            options={textureOptions}
            value={texture !== null && texture !== undefined ? String(texture) : ""}
            onValueChange={(itemValue: string) => setTexture(Number(itemValue))}
          />
          <Select
            label="Color"
            placeholder="Selecciona una opción"
            objValue="value"
            objLabel="label"
            options={colorOptions}
            value={color !== null && color !== undefined ? String(color) : ""}
            onValueChange={(itemValue: string) => setColor(Number(itemValue))}
          />
          <Select
            label="Branquias"
            placeholder="Selecciona una opción"
            objValue="value"
            objLabel="label"
            options={gillOptions}
            value={gills !== null && gills !== undefined ? String(gills) : ""}
            onValueChange={(itemValue: string) => setGills(Number(itemValue))}
          />
        </View>

        <Text style={[styles.observationsLabel, { fontSize: 13 * fontScale }]}>Observaciones</Text>
        <TextInput
          style={styles.textArea}
          value={observations}
          onChangeText={setObservations}
          multiline
          numberOfLines={4}
          placeholder="Agrega observaciones adicionales"
          placeholderTextColor={commonColors.textTertiary}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[commonStyles.buttonSecondary, styles.buttonHalf]} onPress={() => navigation.goBack()}>
            <Text style={commonStyles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[commonStyles.buttonPrimary, styles.buttonHalf, submitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={submitting}>
            <Text style={commonStyles.buttonPrimaryText}>{submitting ? 'Actualizando...' : 'Guardar cambios'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: commonColors.background,
  },
  loadingText: {
    fontSize: 16,
    color: commonColors.textPrimary,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: commonColors.textPrimary,
  },
  observationsLabel: {
    fontSize: 13,
    marginBottom: 6,
    color: commonColors.textSecondary,
    marginTop: 16,
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: commonColors.border,
    borderRadius: 12,
    backgroundColor: commonColors.cardBackground,
    padding: 12,
    marginBottom: 16,
    minHeight: 96,
    color: commonColors.textPrimary,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  buttonHalf: {
    flex: 1,
  },
});

export default EditEvaluationView;
