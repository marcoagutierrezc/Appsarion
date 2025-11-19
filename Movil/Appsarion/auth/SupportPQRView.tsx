import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {BASE_URL} from "../services/connection/connection"
import { useFontScale } from '../context/FontScaleContext';

const LogoApp = require('../assets/LogoName.png');

interface FormData {
  asunto: string;
  nombre: string;
  email: string;
  numero: string;
  mensaje: string;
}

export default function SupportPQRView({ navigation }: any) {
  const { fontScale } = useFontScale();
  const [formData, setFormData] = useState<FormData>({
    asunto: '',
    nombre: '',
    email: '',
    numero: '',
    mensaje: '',
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSend = async () => {
    if (
      formData.asunto.trim() === '' ||
      formData.nombre.trim() === '' ||
      formData.email.trim() === '' ||
      formData.numero.trim() === '' ||
      formData.mensaje.trim() === ''
      ) {
        Alert.alert('Error', 'Por favor, complete todos los campos');
        return;
        }
        try {
          const response = await fetch(`${BASE_URL}/api/soporte`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
              });
              const data = await response.json();
              if (data.success) {
                setEnviado(true);
                Alert.alert('Exito', 'Su mensaje ha sido enviado con exito');
                setFormData({
                  asunto: '',
                  nombre: '',
                  email: '',
                  numero: '',
                  mensaje: '',
                  });
                  return (
                    <View style={styles.container}>
                      <Text style={[styles.successMessage, { fontSize: 16 * fontScale }]}>
                        Solicitud enviada con éxito. Sus opiniones son importantes para nosotros.
                      </Text>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Home')}
                      >
                        <Text style={[styles.buttonText, { fontSize: 15 * fontScale }]}>Volver al inicio</Text>
                      </TouchableOpacity>
                    </View>
                  );
                  }
                  } catch (error) {
                    console.error(error);
                    Alert.alert('Error', 'Ha ocurrido un error al enviar el mensaje');
                    }
                    };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={LogoApp} style={styles.logo}/>
      <Text style={[styles.title, { fontSize: 20 * fontScale }]}>Solicitud de Soporte / PQR</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Asunto"
        value={formData.asunto}
        onChangeText={(text) => handleChange('asunto', text)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={formData.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
      />

      <TextInput
          style={styles.input}
          value={formData.numero}
          onChangeText={(number) => handleChange('numero', number)}
          keyboardType="number-pad"
          placeholder="Número de teléfono"
        />
      
      <TextInput
        style={styles.textArea}
        placeholder="Escriba su mensaje aquí"
        value={formData.mensaje}
        onChangeText={(text) => handleChange('mensaje', text)}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleSend}
      >
        <Text style={[styles.buttonText, { fontSize: 16 * fontScale }]}>Enviar Solicitud</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo:{
    width: 200,
		height: 200,
    alignSelf: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});