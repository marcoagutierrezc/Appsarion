import React, { useState, useEffect, memo } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert 
} from 'react-native';
import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BASE_URL } from '../services/connection/connection';
import { commonColors, commonStyles } from '../styles/commonStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

 

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
  useEffect(() => {
    let isActive = true;
    const run = async () => {
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

        if (isActive) setEvaluations(formattedEvaluations);
      } catch (error) {
        if (isActive) Alert.alert('Error', 'No se pudieron cargar las evaluaciones.');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    if (modalVisible) run();
    return () => {
      isActive = false;
    };
  }, [modalVisible, fishLot.id]);

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

      // Descargar y guardar el PDF con la nueva API
      const destDir = new Directory(Paths.document, 'evaluaciones');
      destDir.create({ idempotent: true, intermediates: true });
      const destFile = new File(destDir, `evaluacion_${evaluationId}.pdf`);
      await File.downloadFileAsync(`${BASE_URL}/reports/pdf?reportId=${reportId}` , destFile, { idempotent: true });

      Alert.alert('Descarga completada', 'El archivo se ha guardado.');

      // Abrir/compartir el archivo
      await Sharing.shareAsync(destFile.uri, { mimeType: 'application/pdf' });

    } catch (error) {
      console.error('Error al descargar la evaluación:', error);
      Alert.alert('Error', 'No se pudo descargar la evaluación.');
    }
  };

  return (
    <View style={[commonStyles.card, styles.card]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <MaterialCommunityIcons name="fish" size={22} color={commonColors.primary} style={{ marginRight: 8 }} />
        <Text style={commonStyles.textLarge} numberOfLines={1}>{fishLot.lotName}</Text>
      </View>
      {fishLot.neighborhood ? (
        <Text style={commonStyles.textSmall} numberOfLines={1}>Ubicación: {fishLot.neighborhood}</Text>
      ) : null}

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[commonStyles.buttonSecondary, styles.buttonHalf]} onPress={() => setModalVisible(true)}>
          <Text style={commonStyles.buttonSecondaryText}>Ver evaluaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[commonStyles.buttonPrimary, styles.buttonHalf]}
          onPress={() => navigation.navigate('Evaluacion - Datos Basicos', { fishLotId: fishLot.id, ubication: fishLot?.neighborhood ?? '' })}
        >
          <Text style={commonStyles.buttonPrimaryText}>Nueva evaluación</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[commonStyles.card, styles.modalCard]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons name="clipboard-list-outline" size={20} color={commonColors.primary} style={{ marginRight: 8 }} />
              <Text style={commonStyles.textLarge}>Evaluaciones del lote</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingVertical: 4 }}>
              {evaluations.length > 0 ? (
                evaluations.map((evaluation) => (
                  <View key={evaluation.id} style={styles.evalItem}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={commonStyles.textMedium}>{evaluation.date}</Text>
                      <Text style={commonStyles.textSmall}>Temp: {evaluation.temperature}°C</Text>
                    </View>
                    <Text style={commonStyles.textSmall}>Especie: {evaluation.species} • Cant: {evaluation.quantity} • Peso: {evaluation.averageWeight}g</Text>
                    <TouchableOpacity style={[commonStyles.buttonSuccess, styles.downloadBtn]} onPress={() => handleDownload(evaluation.id)}>
                      <MaterialCommunityIcons name="download" size={18} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={commonStyles.buttonSuccessText}>Descargar PDF</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={commonStyles.textSmall}>No hay evaluaciones disponibles.</Text>
              )}
            </ScrollView>
            <TouchableOpacity style={[commonStyles.buttonDanger, { marginTop: 8 }]} onPress={() => setModalVisible(false)}>
              <Text style={commonStyles.buttonDangerText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  buttonHalf: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
  },
  evalItem: {
    backgroundColor: commonColors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 12,
    marginBottom: 10,
  },
  downloadBtn: {
    marginTop: 8,
  },
});

export default memo(FishLotCard);
