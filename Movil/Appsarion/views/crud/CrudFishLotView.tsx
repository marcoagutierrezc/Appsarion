import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, FlatList, ListRenderItemInfo, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { RootState } from '../../store';
import FishLotCard from '../../components/FishLotCard';
type FishLot = { id: number; lotName: string; neighborhood: string };
import { BASE_URL } from '../../services/connection/connection';
import { commonColors } from '../../styles/commonStyles';
import { useFontScale } from '../../context/FontScaleContext';

export function CrudFishLotView({ navigation }: any) {
  const userRole = useSelector((state: RootState) => state.auth.user?.role ?? '');
  const rol = normalizeRole(userRole);
  const userId = useSelector((state: RootState) => state.auth.user?.idRole);
  const [fishLots, setFishLots] = useState<FishLot[]>([]);
  const { fontScale } = useFontScale();

  function normalizeRole(role: string): string {
    if (!role) return '';
    const base = role
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // remove accents
    // explicit mapping to be safe with backend slugs
    if (base.includes('admin')) return 'admin';
    if (base.includes('piscicultor')) return 'piscicultor';
    if (base.includes('comercializador')) return 'comercializador';
    if (base.includes('evaluador') || base.includes('agente')) return 'evaluador';
    if (base.includes('academico')) return 'academico';
    return base;
  }

  // Función para cargar los lotes según el rol
  const loadFishLots = async (isActiveRef?: { current: boolean }) => {
    try {
      if (!rol) {
        Alert.alert('Sesión requerida', 'No encontramos tu rol de usuario. Vuelve a iniciar sesión.');
        return;
      }

      let endpoint = '';

      // Para admin: obtener todos los lotes
      if (rol === 'admin') {
        endpoint = `${BASE_URL}/fish_lot`;
      } else {
        // Para otros roles: obtener lotes del usuario específico
        if (!userId) {
          Alert.alert('Error', 'El ID del usuario es necesario para cargar los lotes.');
          return;
        }
        endpoint = `${BASE_URL}/fish_lot/${rol}/${userId}`;
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('No se pudo obtener la lista de lotes de pescado.');
      }
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : [];
      if (!Array.isArray(data)) {
        console.warn('Respuesta inesperada para lotes:', data);
      }
      // Sanitize list to avoid runtime crashes due to missing fields
      const list: FishLot[] = rawList
        .map((it: any) => ({
          id: Number(it?.id),
          lotName: String(it?.lotName ?? it?.name ?? 'Lote'),
          neighborhood: String(it?.neighborhood ?? it?.barrio ?? ''),
        }))
        .filter((it: any) => Number.isFinite(it.id));
      if (!isActiveRef || isActiveRef.current) setFishLots(list);
    } catch (error) {
      console.error('Error al cargar lotes:', error);
      Alert.alert('Error', 'Hubo un problema al cargar los lotes.');
    }
  };

  // Recargar lotes
  useFocusEffect(
    useCallback(() => {
      const isActiveRef = { current: true };
      if (rol !== 'admin' && !userId) {
        Alert.alert('Error', 'El ID del usuario es necesario para cargar los lotes.');
        return () => { isActiveRef.current = false; };
      }
      loadFishLots(isActiveRef);
      return () => { isActiveRef.current = false; };
    }, [rol, userId])
  );

  const renderItem = ({ item }: ListRenderItemInfo<FishLot>) => (
    <FishLotCard fishLot={item} navigation={navigation} />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={Array.isArray(fishLots) ? fishLots : []}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          removeClippedSubviews
          initialNumToRender={8}
          windowSize={5}
        />

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('Registrar Lote')}
          accessibilityLabel="Registrar nuevo lote"
        >
          <Text style={[styles.textButton, { fontSize: 24 * fontScale }]}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 80,
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
    backgroundColor: commonColors.primary,
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