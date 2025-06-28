import React, { useState, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Select from '../../components/SelectComponent';
import {colorOptions, eyeOptions, furOptions, gillOptions, meatOptions, smellOptions, textureOptions} from '../../data/optionsNTC1443';
import {BASE_URL} from '../../services/connection/connection';
import FormScreenWrapper from '../../components/FormScreenWrapper'; 

export function EvaluationDataView({route, navigation}:any){
    const userRole = useSelector((state: RootState) => state.auth.user.role);
    const idRole = useSelector((state: RootState) => state.auth.user.idRole);
    const {fishLotId, date, hour, condAmbientals, condStorage, temperature, species, averageWeight, quantity} = route.params;
    const [smell, setSmell] = useState<number | null>(null);
    const [fur, setFur] = useState<number | null>(null);
    const [meat, setMeat] = useState<number | null>(null);
    const [eyes, setEyes] = useState<number | null>(null);
    const [texture, setTexture] = useState<number | null>(null);
    const [color, setColor] = useState<number | null>(null);
    const [gills, setGills] = useState<number | null>(null);


    const [piscicultorId, setPiscicultorId] = useState<number | null>(null);
    const [evaluadorId, setEvaluadorId] = useState<number | null>(null);
    const [comercializadorId, setComercializadorId] = useState<number | null>(null);

    useEffect(() => {
      if (userRole === "piscicultor") {
        setPiscicultorId(idRole);
      } else if (userRole === "evaluador") {
        setEvaluadorId(idRole);
      } else if (userRole === "comercializador") {
        setComercializadorId(idRole);
      }
    }, [userRole, idRole]);


    const handleSubmit = async () => {
      const isFormValid = () => {
        return [smell, fur, meat, eyes, texture, color, gills].every(value => value !== null && value !== undefined);
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
        ubication: 0,
        date: new Date(date).toISOString().split("T")[0], // Formato YYYY-MM-DD
        hour: `${hour}:00`, // Asegurar formato HH:MM:SS
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
        gills
     };
     

      console.log('Información de la evaluación:',DataEvaluation);

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
        navigation.navigate('Lotes');
      } catch (error) {
        console.error('Error en el registro de la evaluación:', error);
        Alert.alert('Error', `Error en el registro: ${error.message}`);
      }
    }
    
    return (
      // <FormScreenWrapper>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={()=>navigation.popToTop()}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={()=>handleSubmit}>
            <Text style={styles.buttonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      // </FormScreenWrapper>
      )
};

const styles = StyleSheet.create({ 
    container:{
        flex: 1,
        padding: 30,
        paddingBottom:0,
        backgroundColor: '#fff',
        height: '100%',
    },
    picker: {
        height: 40,
        marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
    },
    button: {
      flex: 1,
      padding: 12,
      borderRadius: 4,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#f44336',
      marginRight: 8,
    },
    nextButton: {
      backgroundColor: '#4caf50',
      marginLeft: 8,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
});

export default EvaluationDataView;