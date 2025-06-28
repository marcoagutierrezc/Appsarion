import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { RootState } from '../../store';
import FishLotCard, { FishLot } from '../../components/FishLotCard';
import { BASE_URL } from '../../services/connection/connection';

export function CrudFishLotView({ navigation }: any) {
  const rol = useSelector((state: RootState) => state.auth.user.role.toLowerCase());
  const userId = useSelector((state: RootState) => state.auth.user?.idRole);
  const [fishLots, setFishLots] = useState<FishLot[]>([]);

  // Función para cargar los lotes según el rol
  const loadFishLots = async () => {
    try {
      let endpoint = `${BASE_URL}/fish_lot/${rol}/${userId}`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('No se pudo obtener la lista de lotes de pescado.');
      }
      const data = await response.json();
      setFishLots(data);
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cargar los lotes.');
    }
  };

  // Recargar lotes
  useFocusEffect(
    useCallback(() => {
      if (rol !== 'admin' && !userId) {
        Alert.alert('Error', 'El ID del usuario es necesario para cargar los lotes.');
        return;
      }
      loadFishLots();
    }, [rol, userId])
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {fishLots.map((fishLot) => (
          <FishLotCard
            key={fishLot.id}
            fishLot={fishLot}
            navigation={navigation}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Registrar Lote')}
      >
        <Text style={styles.textButton}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#34495e',
  },
  textButton: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'gray',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
  },
});

export default CrudFishLotView;