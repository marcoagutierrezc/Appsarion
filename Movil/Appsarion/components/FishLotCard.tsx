import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, Platform 
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Buffer } from "buffer";
import * as IntentLauncher from 'expo-intent-launcher';
import { BASE_URL } from '../services/connection/connection';

global.Buffer = Buffer;

interface Evaluation {
  id: number;
  averageWeight: number;
  species: string;
  date: string;
  temperature: string;
  quantity: number;
}

interface FishLotCardProps {
  fishLot: { id: number; lotName: string, neighborhood: string };
  navigation: any;
}

const FishLotCard: React.FC<FishLotCardProps> = ({ fishLot, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);

  // Función para obtener las evaluaciones asociadas al lote
  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/real_data/fish_lot/${fishLot.id}`);
      if (!response.ok) throw new Error('Error al obtener las evaluaciones');

      const data = await response.json();

      const formattedEvaluations = data.map((ev: any) => ({
        id: ev.id,
        averageWeight: ev.averageWeight,
        species: ev.species,
        date: ev.date,
        temperature: ev.temperature,
        quantity: ev.quantity,
      }));

      setEvaluations(formattedEvaluations);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las evaluaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalVisible) fetchEvaluations();
  }, [modalVisible]);

  const handleDownload = async (evaluationId: number) => {
    try {
      // Generar el reporte
      const reportResponse = await fetch(`${BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ realDataId: evaluationId }),
      });

      if (!reportResponse.ok) throw new Error('Error al generar el reporte.');

      const reportData = await reportResponse.json();
      const reportId = reportData.id;

      // Obtener el PDF
      const pdfResponse = await fetch(`${BASE_URL}/reports/pdf?reportId=${reportId}`);
      if (!pdfResponse.ok) throw new Error('Error al descargar la evaluación.');

      const arrayBuffer = await pdfResponse.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');

      // Guardar el archivo localmente
      const fileUri = `${FileSystem.documentDirectory}evaluacion_${evaluationId}.pdf`;
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert('Descarga completada', 'El archivo se ha guardado.');

      // Abrir el archivo
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
      console.error('Error al descargar la evaluación:', error);
      Alert.alert('Error', 'No se pudo descargar la evaluación.');
    }
  };

  return (
    <View style={styles.card}>
      <Text>{`Lote: ${fishLot.lotName}`}</Text>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Ver Evaluaciones</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Evaluacion - Datos Basicos', { fishLotId: fishLot.id, ubication:fishLot.neighborhood })}>
        <Text style={styles.buttonText}>Realizar Evaluación</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Evaluaciones del Lote</Text>
            <ScrollView>
              {evaluations.length > 0 ? (
                evaluations.map((evaluation) => (
                  <View key={evaluation.id} style={styles.evaluationItem}>
                    <Text>{`Fecha: ${evaluation.date}`}</Text>
                    <Text>{`Especie: ${evaluation.species}`}</Text>
                    <Text>{`Peso Promedio: ${evaluation.averageWeight}g`}</Text>
                    <Text>{`Cantidad: ${evaluation.quantity}`}</Text>
                    <Text>{`Temperatura: ${evaluation.temperature}°C`}</Text>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => handleDownload(evaluation.id)}
                    >
                      <Text style={styles.buttonText}>Descargar Evaluación</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>No hay evaluaciones disponibles.</Text>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  evaluationItem: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  downloadButton: {
    marginTop: 5,
    padding: 8,
    backgroundColor: '#28a745',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default FishLotCard;
