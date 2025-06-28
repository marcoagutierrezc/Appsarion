import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Button, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';  
import { useDispatch } from 'react-redux';
import { logIn } from '../store/slices/auth/authSlice';
import { BASE_URL } from '../services/connection/connection';
import { showAlert } from '../utils/alerts'; // ✅ Importa tu alerta multiplataforma

const LogoApp = require('../assets/LogoName.png');

export function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchUserRole = async (userId: number) => {
    try {
      const roleResponse = await fetch(`${BASE_URL}/users/role-id/${userId}`);
      if (!roleResponse.ok) {
        throw new Error('No se pudo obtener la información del rol.');
      }
      const { roleId } = await roleResponse.json();
      return roleId;
    } catch (error) {
      console.error('Error obteniendo el rol del usuario:', error);
      showAlert('Error', 'No se pudo obtener el rol del usuario.');
      return null;
    }
  };

  const login = async () => {
    if (!email || !password) {
      showAlert('Error', 'Por favor, ingrese su correo electrónico y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Credenciales incorrectas.');
      }

      const data = await response.json();
      const roleId = await fetchUserRole(data.id);

      if (roleId !== null) {
        dispatch(logIn({ ...data, idRole: roleId }));
        if (roleId !== 1) {
          showAlert('Éxito', 'Inicio de sesión exitoso.');
        }
        navigation.reset({
          index: 0,
          routes: [{ name: "SoportePQR" }],
        });        
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      showAlert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Image source={LogoApp} style={styles.logo} />
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Usuario@email.com"
          placeholderTextColor="gray"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="done"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Contraseña"
          placeholderTextColor="gray"
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ margin: 10 }} />
        ) : (
          <Button title="Iniciar sesión" onPress={login} />
        )}
        <Text style={styles.text}>¿No tienes una cuenta?</Text>
        <Button title="Regístrate" onPress={() => navigation.navigate('Registro')} />
        <View style={styles.separator} />
        <Text style={styles.text}>¿Has tenido algún problema con la app?</Text>
        <Button title="PQRS" onPress={() => navigation.navigate('SoportePQR')} />
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
    paddingVertical: 100,
    paddingHorizontal: 10,
  },
  subcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
  },
  logo: {
    width: 200,
    height: 200,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    width: '80%',
    height: 50,
    margin: 10,
    borderRadius: 30,
    fontSize: 18,
    color: 'white',
  },
  text: {
    margin: 8,
    color: 'gray',
    fontSize: 15,
  },
  separator: {
    height: 1,
    width: '90%',
    backgroundColor: 'black',
    margin: 15,
  },
});

export default Login;