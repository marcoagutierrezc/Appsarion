import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export function RegisterDataView({ navigation }: any) {
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [repeatDocumentNumber, setRepeatDocumentNumber] = useState('');
  const [inputColorDoc, setInputColorDoc] = useState('#ff0000');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [inputColorPass, setInputColorPass] = useState('#ff0000');

  const [isSaved, setIsSaved] = useState(false);

  const isValidPhoneNumber = phoneNumber && phoneNumber.length >= 10;
  const isValidEmail = email && email.includes('@') && email.includes('.');

  const hasUnsavedChanges = Boolean(
    (name || documentType || documentNumber || phoneNumber || email || password) && !isSaved
  );

  const handleSubmit = () => {
    if (
      !name ||
      !documentType ||
      !documentNumber ||
      documentNumber !== repeatDocumentNumber ||
      !password ||
      password !== repeatPassword ||
      !isValidPhoneNumber ||
      !isValidEmail
    ) {
      Alert.alert('Error', 'Por favor, complete todos los campos correctamente.');
      return;
    }

    setIsSaved(true);

    navigation.navigate('Registro - Datos del Rol', {
      name,
      documentType,
      documentNumber,
      phoneNumber,
      email,
      password,
    });
  };

  useEffect(() => {
    setInputColorDoc(documentNumber === repeatDocumentNumber ? '#00ff00' : '#ff0000');
  }, [documentNumber, repeatDocumentNumber]);

  useEffect(() => {
    setInputColorPass(password === repeatPassword ? '#00ff00' : '#ff0000');
  }, [password, repeatPassword]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!hasUnsavedChanges) {
        return;
      }
      e.preventDefault();

      Alert.alert(
        '¿Descartar Cambios?',
        'Tiene cambios sin guardar. ¿Estás seguro de descartarlos y salir de la pantalla?',
        [
          { text: 'Conservar', style: 'cancel', onPress: () => {} },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, hasUnsavedChanges]);

  return (
    <ScrollView style={styles.container}>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombres" />
      <Text>Documento de identidad</Text>
      <Picker
        style={styles.picker}
        selectedValue={documentType}
        onValueChange={(itemValue) => setDocumentType(itemValue)}
      >
        <Picker.Item label="Seleccione el tipo de documento" value="" />
        <Picker.Item label="Cédula de Ciudadania" value="CC" />
        <Picker.Item label="Cédula de extranjería" value="CE" />
      </Picker>
      <TextInput
        value={documentNumber}
        onChangeText={(value) => setDocumentNumber(value.replace(/\D/g, ''))}
        keyboardType="numeric"
        placeholder="Número de documento"
        style={styles.input}
      />
      <TextInput
        value={repeatDocumentNumber}
        onChangeText={(value) => setRepeatDocumentNumber(value.replace(/\D/g, ''))}
        keyboardType="numeric"
        placeholder="Repetir número de documento"
        style={[styles.input, { borderColor: inputColorDoc }]}
      />
      <TextInput
        value={phoneNumber}
        onChangeText={(value) => setPhoneNumber(value.replace(/\D/g, ''))}
        keyboardType="numeric"
        placeholder="Ingrese su número de teléfono"
        style={styles.input}
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Correo electrónico"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        returnKeyType="done"
        autoCapitalize="none"
        secureTextEntry={true}
      />
      <TextInput
        style={[styles.input, { borderColor: inputColorPass }]}
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        placeholder="Repetir contraseña"
        returnKeyType="done"
        autoCapitalize="none"
        secureTextEntry={true}
      />
      <View style={styles.row}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  picker: {
    height: 60,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
});

export default RegisterDataView;
