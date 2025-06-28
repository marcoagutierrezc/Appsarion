import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { NavbarQuiz } from '../components/NavbarQuiz';
import { BASE_URL } from '../services/connection/connection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Buffer } from "buffer";

import * as IntentLauncher from 'expo-intent-launcher';
global.Buffer = Buffer;


export function ResultsScreen({ navigation }: any) {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const id_user = useSelector((state: RootState) => state.auth.user?.id);


  useEffect(() => {
    if (id_user) fetchCertificates();
  }, [id_user]);

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`${BASE_URL}/certificates/user/${id_user}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Error al obtener los certificados.');

      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      Alert.alert('Error', 'No se pudieron obtener los certificados.');
    } finally {
      setLoading(false);
    }
  };

const handleDownload = async (evaluationId: number) => {
  try {
    const fileUri = `${FileSystem.documentDirectory}certificado_${evaluationId}.pdf`;

    const response = await fetch(`${BASE_URL}/certificates/download/${evaluationId}`);
    if (!response.ok) throw new Error('Error al descargar el certificado.');

    // Convertimos la respuesta a un arrayBuffer y luego a Base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // Guardamos el archivo localmente
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    Alert.alert('Descarga completada', 'El certificado se ha guardado.');

    // 📂 Intentar abrir el archivo automáticamente
    if (Platform.OS === 'android') {
      const cUri = await FileSystem.getContentUriAsync(fileUri);
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: cUri,
        flags: 1,
        type: 'application/pdf',
      });
    } else if (Platform.OS === 'ios') {
      await Sharing.shareAsync(fileUri);
    }

  } catch (error) {
    console.error('Error downloading certificate:', error);
    Alert.alert('Error', 'No se pudo descargar el certificado.');
  }
};

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Cargando certificados...</Text>
      </SafeAreaView>
    );
  }

  if (certificates.length === 0) {
    return (
      <>
      <SafeAreaView style={styles.container}>
        <Text>No tienes certificados aprobados.</Text>
      </SafeAreaView>
      <NavbarQuiz navigation={navigation} />
      </>
    );
  }

  return (
  <>
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Certificados Aprobados</Text>
        <FlatList
          data={certificates}
          keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
          renderItem={({ item }) => (
            <View style={styles.certificateCard}>
              <Text style={styles.certTitle}>{item.id}</Text>
              <Text style={styles.certDate}>Fecha: {item.issuedAt}</Text>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => item.id ? handleDownload(item.id) : console.error("ID de evaluación no válido")}
              >
                <Text style={styles.buttonText}>Descargar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
    <NavbarQuiz navigation={navigation} />
  </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  certificateCard: { 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#a6b5c4', 
    borderRadius: 10, 
    marginBottom: 10 
  },
  certTitle: { fontSize: 16, fontWeight: 'bold' },
  certDate: { fontSize: 14, color: 'gray', marginBottom: 10 },
  downloadButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
