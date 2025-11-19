import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { commonColors, commonStyles } from '../../styles/commonStyles';
import { useFontScale } from '../../context/FontScaleContext';

export function EvaluationDataBasicView({route, navigation }:any) {
  const { fontScale } = useFontScale();
  const params = route?.params ?? {};
  const fishLotId = params?.fishLotId ?? null;
  const ubication = params?.ubication ?? null;
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  // ISO-friendly fields for API
  const [dateISO, setDateISO] = useState(''); // YYYY-MM-DD
  const [hourISO, setHourISO] = useState(''); // HH:MM:SS (24h)
  const [condAmbientals, setCondAmbientals] = useState('');
  const [condStorage, setCondStorage] = useState('');
  const [temperature, setTemperature] = useState('');
  const [species, setSpecies] = useState('');
  const [averageWeight, setAverageWeight] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);

  useEffect(() => {
    if (fishLotId == null) {
      Alert.alert('Faltan datos', 'No se encontró el identificador del lote.', [
        { text: 'Aceptar', onPress: () => navigation.goBack?.() }
      ]);
      return;
    }
    const now = new Date();
    setDate(now.toLocaleDateString());
    setHour(now.toLocaleTimeString());
    // Reliable API formats
    setDateISO(now.toISOString().slice(0, 10));
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    setHourISO(`${hh}:${mm}:${ss}`);
  }, []);

  const handleSubmit = () => {
    if (
      !date ||
      !hour ||
      // !condAmbientals ||
      // !condStorage ||
      !temperature ||
      !species ||
      !averageWeight ||
      !quantity
    ) {
      Alert.alert(
        'Error',
        'Por favor, complete todos los campos correctamente.'
      )
      return;
    }
    navigation.navigate('Evaluacion', {
      fishLotId,
      ubication,
      date,
      hour,
      dateISO,
      hourISO,
      // condAmbientals,
      // condStorage,
      temperature,
      species,
      averageWeight,
      quantity
    });
    console.log('Datos enviados', fishLotId, ubication, date, hour, temperature, species, averageWeight, quantity);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
        <Text style={[styles.sectionTitle, { fontSize: 16 * fontScale }]}>Información básica</Text>

        <View style={styles.dateTimeContainer}>
          <View style={styles.iconTextContainer}>
            <MaterialCommunityIcons name="clock-outline" size={22} color={commonColors.primary} />
            <Text style={[styles.dateTimeText, { fontSize: 13 * fontScale }]}>{hour}</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <MaterialCommunityIcons name="calendar-month" size={22} color={commonColors.primary} />
            <Text style={[styles.dateTimeText, { fontSize: 13 * fontScale }]}>{date}</Text>
          </View>
        </View>

        <Text style={[styles.inputLabel, { fontSize: 13 * fontScale }]}>Condiciones ambientales</Text>
        <TextInput
          style={styles.textArea}
          value={condAmbientals}
          onChangeText={setCondAmbientals}
          multiline
          numberOfLines={4}
          placeholder="Describe las condiciones ambientales"
          placeholderTextColor={commonColors.textTertiary}
        />

        <Text style={[styles.inputLabel, { fontSize: 13 * fontScale }]}>Condiciones de almacenamiento</Text>
        <TextInput
          style={styles.textArea}
          value={condStorage}
          onChangeText={setCondStorage}
          multiline
          numberOfLines={4}
          placeholder="Describe las condiciones de almacenamiento"
          placeholderTextColor={commonColors.textTertiary}
        />

        <Text style={[styles.inputLabel, { fontSize: 13 * fontScale }]}>Temperatura (°C)</Text>
        <View style={commonStyles.inputGroup}>
          <TextInput
            style={commonStyles.input}
            value={temperature}
            onChangeText={(value) => {
              const numericValue = value.replace(/[^0-9.]/g, '');
              setTemperature(numericValue);
            }}
            keyboardType="numeric"
            placeholder="Ej: 24.5"
            placeholderTextColor={commonColors.textTertiary}
          />
        </View>

        <Text style={[styles.inputLabel, { fontSize: 13 * fontScale }]}>Especie</Text>
        <View style={commonStyles.inputGroup}>
          <TextInput
            style={commonStyles.input}
            value={species}
            onChangeText={setSpecies}
            placeholder="Ej: Tilapia"
            placeholderTextColor={commonColors.textTertiary}
          />
        </View>

        <Text style={[styles.inputLabel, { fontSize: 13 * fontScale }]}>Peso promedio</Text>
        <View style={commonStyles.inputGroup}>
          <TextInput
            value={averageWeight !== null ? averageWeight.toString() : ''}
            onChangeText={(value) => {
              const numericValue = value.replace(/\D/g, '');
              setAverageWeight(Number(numericValue));
            }}
            keyboardType="numeric"
            placeholder="Peso promedio del lote"
            placeholderTextColor={commonColors.textTertiary}
            style={commonStyles.input}
          />
        </View>

        <Text style={[styles.inputLabel, { fontSize: 13 * fontScale }]}>Cantidad</Text>
        <View style={commonStyles.inputGroup}>
          <TextInput
            value={quantity !== null ? quantity.toString() : ''}
            onChangeText={(value) => {
              const numericValue = value.replace(/\D/g, '');
              setQuantity(Number(numericValue));
            }}
            keyboardType="numeric"
            placeholder="Cantidad de peces del lote"
            placeholderTextColor={commonColors.textTertiary}
            style={commonStyles.input}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[commonStyles.buttonSecondary, styles.buttonHalf]} onPress={() => navigation.goBack?.()}>
            <Text style={commonStyles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[commonStyles.buttonPrimary, styles.buttonHalf]} onPress={handleSubmit}>
            <Text style={commonStyles.buttonPrimaryText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: commonColors.textPrimary,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: commonColors.textPrimary,
  },
  inputLabel: {
    fontSize: 13,
    marginBottom: 6,
    color: commonColors.textSecondary,
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

export default EvaluationDataBasicView;