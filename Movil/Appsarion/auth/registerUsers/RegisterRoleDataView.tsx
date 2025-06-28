import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {BASE_URL} from "../../services/connection/connection";
import ImageUploader from '../../components/ImageUploader';

  export function RegisterRoleDataView({ route, navigation }: any) {
    const { name, documentType, documentNumber, phoneNumber, email, password } = route.params;
    const [checkedRol, setCheckedRoll] = useState<string>('');
    const [justification, setJustification] = useState('');
    // const [supportingDocument, setSupportingDocument] = useState<string>();
    const [supportingDocument, setSupportingDocument] = useState('');

    const handleImageSelected = (uri: string) => {
      setSupportingDocument(uri); 
      console.log("image: ", uri);
    };
  
    const handleSubmit = async () => {
      if (!justification && !supportingDocument) {
        Alert.alert('Error', 'Por favor, complete todos los campos.');
        return;
      }
  
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
        // formData.append('supportingDocument', supportingDocument ?? '');
        formData.append('supportingDocument', {
          uri: supportingDocument,
          type: 'image/jpeg',
          name: `${documentNumber}.jpg`,
        });

        const response = await fetch(`${BASE_URL}/users-to-verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
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
      }
    };
  
    return (
      <ScrollView style={styles.container}>
        <Text>¿Cuál es su rol?</Text>
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
  
        <Text>Justificación:</Text>
        <TextInput
          multiline={true}
          value={justification}
          onChangeText={setJustification}
          placeholder="Agregue su justificación..."
          style={styles.input}
        />
        <View style={styles.imageUploader}>
          <Text>Cargar documento de soporte</Text>
          <ImageUploader onImageSelected={handleImageSelected} />
          {supportingDocument && <Text style={styles.imageSelected}>Imagen seleccionada con éxito</Text>}
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Regresar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.toTop()}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.finishButton]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 30,
        paddingBottom:0,
        backgroundColor: '#fff',
        height: '100%',
    },
    picker: {
      height: 60,
      marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    inputsRole: {
        height: 100
    },
    imageUploader:{
      padding: 20
    },
    imageSelected: {
        marginTop: 10,
        color: 'green',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 15,
        marginBottom: 10,
      },
    halfInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#6c757d',
        paddingVertical: 5,
        paddingHorizontal: 8,
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
    cancelButton: {
      backgroundColor: '#dc3545',
    },
})

export default RegisterRoleDataView;