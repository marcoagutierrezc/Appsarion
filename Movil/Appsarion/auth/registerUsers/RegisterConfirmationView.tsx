import React from 'react';
import { View, Image, Text, StyleSheet, Button } from 'react-native';

const LogoApp = require('../../assets/LogoName.png');

export function RegisterConfirmationView({ navigation }: any) {
  return (
    <View style={styles.container}>
        <Image source={LogoApp} style={styles.logo} />
        <Text style={styles.text}>Esté pendiente de su correo, llegará un mensaje confirmando la creación de su usuario.</Text>
        <Button title="Siguiente" onPress={()=>navigation.popToTop()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    tintColor: '#000',
    alignSelf: 'center',
    marginBottom: 30,
  },
  text: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  }
});

export default RegisterConfirmationView;