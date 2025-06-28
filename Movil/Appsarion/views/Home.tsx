import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
const LogoApp = require('../assets/LogoName.png');

export function Home({ navigation }: { navigation: any }){
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio</Text>
      <Image source={LogoApp} style={styles.logo} />
      <View style={styles.userInfo}>
        <Text style={styles.label}>Nombre de usuario:</Text>
        <Text style={styles.value}>{user.name}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.label}>Rol:</Text>
        <Text style={styles.value}>{user.role}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#34495e',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    color: '#fff',
  },
  value: {
    fontSize: 16,
    color: '#d3d2e0',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default Home;