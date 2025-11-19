import React, { useState, useEffect} from 'react';
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
import {colorOptions, eyeOptions, furOptions, gillOptions, meatOptions, smellOptions, textureOptions} from '../../data/optionsNTC1443';
import {BASE_URL} from '../../services/connection/connection';
import { commonColors, commonStyles } from '../../styles/commonStyles';
import { useFontScale } from '../../context/FontScaleContext';

export function EvaluationDataView({route, navigation}:any){
  const userRole = useSelector((state: RootState) => state.auth.user?.role?.toLowerCase() ?? '');
  const idRole = useSelector((state: RootState) => state.auth.user?.idRole);
  const { fontScale } = useFontScale();
  const params = route?.params ?? {};
  const {
    fishLotId = null,
    ubication = null,
    date,
    hour,
    dateISO,
    hourISO,
    condAmbientals,
    condStorage,
    temperature,
    species,
    averageWeight,
    quantity,
  } = params as any;
    const [smell, setSmell] = useState<number | null>(null);
    const [fur, setFur] = useState<number | null>(null);
    const [meat, setMeat] = useState<number | null>(null);
    const [eyes, setEyes] = useState<number | null>(null);
    const [texture, setTexture] = useState<number | null>(null);
    const [color, setColor] = useState<number | null>(null);
    const [gills, setGills] = useState<number | null>(null);
    const [observations, setObservations] = useState<string>('');


    const [piscicultorId, setPiscicultorId] = useState<number | null>(null);
    const [evaluadorId, setEvaluadorId] = useState<number | null>(null);
    const [comercializadorId, setComercializadorId] = useState<number | null>(null);

    useEffect(() => {
      const numericId = idRole != null && !isNaN(Number(idRole)) ? Number(idRole) : null;
      if (userRole === "piscicultor") {
        setPiscicultorId(numericId);
      } else if (userRole === "evaluador") {
        setEvaluadorId(numericId);
      } else if (userRole === "comercializador") {
        setComercializadorId(numericId);
      }
    }, [userRole, idRole]);


    const handleSubmit = async () => {
      if (fishLotId == null) {
        Alert.alert('Faltan datos', 'No se encontró el identificador del lote.');
        return;
      }
      const isFormValid = () => {
        // Consideramos válidos solo números definidos (>= 0)
        return [smell, fur, meat, eyes, texture, color, gills].every((value) => typeof value === 'number' && !Number.isNaN(value));
      };

      if (!isFormValid()) {
        Alert.alert('Error', 'Por favor, complete todos los campos.');
        return;
      }
        
      // validación del rol para enviar los que no son nulos
      const DataEvaluation = {
        fishLotId,
        piscicultorId: piscicultorId ?? null,
        evaluadorId: evaluadorId ?? null,
        comercializadorId: comercializadorId ?? null,
        ubication: ubication ?? 0,
        date: dateISO || new Date().toISOString().slice(0,10), // YYYY-MM-DD
        hour: hourISO || '00:00:00', // HH:MM:SS
        temperature: Number(temperature),
        species,
        averageWeight,
        quantity,
        smell,
        fur,
        meat,
        eyes,
        texture,
        color,
        gills,
        observations: observations.trim() || null,
     };
     

  console.log('Información de la evaluación:', DataEvaluation);

      try {
        const response = await fetch(`${BASE_URL}/real_data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DataEvaluation),
       });
       
      
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Error desconocido en la evaluación.');
        }
      
        Alert.alert('Éxito', 'Evaluación completada con éxito.');
        navigation.navigate('Drawer', { screen: 'Lotes' });
      } catch (error: any) {
        console.error('Error en el registro de la evaluación:', error);
        Alert.alert('Error', `Error en el registro: ${error?.message || 'desconocido'}`);
      }
    }
    
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
        <Text style={[styles.title, { fontSize: 20 * fontScale }]}>Evaluación organolepta</Text>
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
        <Text style={[styles.inputLabel, { fontSize: 13 * fontScale }]}>Observaciones (opcional)</Text>
        <TextInput
          style={styles.observations}
          value={observations}
          onChangeText={setObservations}
          placeholder="Escribe observaciones adicionales"
          placeholderTextColor={commonColors.textTertiary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[commonStyles.buttonSecondary, styles.buttonHalf]} onPress={()=>navigation.popToTop()}>
            <Text style={commonStyles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[commonStyles.buttonSuccess, styles.buttonHalf]} onPress={handleSubmit}>
            <Text style={commonStyles.buttonSuccessText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>
      )
};

const styles = StyleSheet.create({ 
    safeArea: {
      flex: 1,
      backgroundColor: commonColors.background,
    },
    container:{
        flex: 1,
        backgroundColor: commonColors.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: commonColors.textPrimary,
      marginBottom: 12,
    },
    inputLabel: {
      fontSize: 13,
      marginTop: 8,
      marginBottom: 6,
      color: commonColors.textSecondary,
    },
    picker: {
        height: 40,
        marginBottom: 10,
    },
    observations: {
      borderWidth: 1.5,
      borderColor: commonColors.border,
      borderRadius: 12,
      backgroundColor: commonColors.cardBackground,
      padding: 12,
      marginBottom: 16,
      minHeight: 96,
      color: commonColors.textPrimary,
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

export default EvaluationDataView;