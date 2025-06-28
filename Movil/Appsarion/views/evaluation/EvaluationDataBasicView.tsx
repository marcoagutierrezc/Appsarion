import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import FormScreenWrapper from '../../components/FormScreenWrapper'; 

export function EvaluationDataBasicView({route, navigation }:any) {
  const {fishLotId, ubication} = route.params;
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [condAmbientals, setCondAmbientals] = useState('');
  const [condStorage, setCondStorage] = useState('');
  const [temperature, setTemperature] = useState('');
  const [species, setSpecies] = useState('');
  const [averageWeight, setAverageWeight] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    setDate(now.toLocaleDateString());
    setHour(now.toLocaleTimeString());
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Información basica</Text>
        <View style={styles.dateTimeContainer}>
          <View style={styles.iconTextContainer}>
            <Icon name="clock" size={24} color="black" />
            <Text style={styles.dateTimeText}>{hour}</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <Icon name="calendar" size={24} color="black" />
            <Text style={styles.dateTimeText}>{date}</Text>
          </View>
      {/* <FormScreenWrapper> */}
        </View>
        <Text style={styles.inputLabel}>Condiciones ambientales</Text>
        <TextInput style={styles.textInput} 
        value={condAmbientals}
        onChangeText={setCondAmbientals}
        multiline
        numberOfLines={3} />
        <Text style={styles.inputLabel}>Condiciones de almacenamiento</Text>
        <TextInput style={styles.textInput} 
        value={condStorage}
        onChangeText={setCondStorage}
        multiline 
        numberOfLines={3}/>
        <Text style={styles.inputLabel}>Temperatura (°C)</Text>
        <TextInput
          style={styles.textInput}
          value={temperature}
          onChangeText={(value) => {
            const numericValue = value.replace(/[^0-9.]/g, ''); // Permite solo números y punto decimal
            setTemperature(numericValue);
          }}
          keyboardType="numeric"
        />
        <Text style={styles.inputLabel}>Especie</Text>
        <TextInput style={styles.textInput}
        value={species}
        onChangeText={setSpecies}
        />
        <Text style={styles.inputLabel}>Peso promedio</Text>
        <TextInput
        value={averageWeight !== null ? averageWeight.toString() : ''}
        onChangeText={(value) => {
          const numericValue = value.replace(/\D/g, '');
          setAverageWeight(Number(numericValue));
        }}
        keyboardType="numeric"
        placeholder="Ingrese el peso promedio de los peces del lote"
        style={styles.textInput}
        />

        <Text style={styles.inputLabel}>Cantidad</Text>

        <TextInput
        value={quantity !== null ? quantity.toString() : ''}
        onChangeText={(value) => {
          const numericValue = value.replace(/\D/g, '');
          setQuantity(Number(numericValue));
        }}
        keyboardType="numeric"
        placeholder="Ingrese la cantidad de peces del lote"
        style={styles.textInput}
        />
        
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={()=>handleSubmit()}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    minHeight: 40,
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

export default EvaluationDataBasicView;