import React, { useState, useEffect, memo } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert 
} from 'react-native';
import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BASE_URL } from '../services/connection/connection';
import { commonColors, commonStyles } from '../styles/commonStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFontScale } from '../context/FontScaleContext';

 

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
  const { fontScale } = useFontScale();
  const userRole = useSelector((state: RootState) => state.auth.user?.role ?? '');
  const userId = useSelector((state: RootState) => state.auth.user?.idRole);
  const [modalVisible, setModalVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function normalizeRole(role: string): string {
    if (!role) return '';
    const base = role
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (base.includes('admin')) return 'admin';
    if (base.includes('piscicultor')) return 'piscicultor';
    if (base.includes('comercializador')) return 'comercializador';
    if (base.includes('evaluador') || base.includes('agente')) return 'evaluador';
    if (base.includes('academico')) return 'academico';
    return base;
  }

  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  }

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

  const handleDeleteEvaluation = async (evaluationId: number) => {
    try {
      setDeleting(true);
      const response = await fetch(`${BASE_URL}/evaluations/${evaluationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar la evaluación.');

      Alert.alert('Éxito', 'Evaluación eliminada correctamente.');
      // Recargar evaluaciones
      setEvaluations(evaluations.filter((e) => e.id !== evaluationId));
    } catch (error) {
      console.error('Error al eliminar evaluación:', error);
      Alert.alert('Error', 'No se pudo eliminar la evaluación.');
    } finally {
      setDeleting(false);
    }
  };

  const canDeleteEvaluation = () => {
    const rol = normalizeRole(userRole);
    // Admin siempre puede borrar; piscicultor solo si es dueño del lote
    if (rol === 'admin') return true;
    if (rol === 'piscicultor' && userId) return true;
    return false;
  };

  const handleDeleteFishLot = () => {
    const rol = normalizeRole(userRole);
    // Validar permisos: piscicultor solo sus lotes, admin todos
    if (rol !== 'admin' && rol !== 'piscicultor') {
      Alert.alert('Permiso denegado', 'No tienes permisos para eliminar lotes.');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este lote? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              const response = await fetch(`${BASE_URL}/fish_lot/${fishLot.id}`, {
                method: 'DELETE',
              });

              if (!response.ok) throw new Error('Error al eliminar el lote.');

              Alert.alert('Éxito', 'Lote eliminado correctamente.');
              // Cerrar opciones modal
              setOptionsModalVisible(false);
              // Esperar un poco y luego recargar la lista
              await new Promise((r) => setTimeout(r, 500));
              // Navegar a la pantalla de lotes para forzar recarga con useFocusEffect
              navigation.navigate('Drawer', { screen: 'Lotes' });
            } catch (error) {
              console.error('Error al eliminar lote:', error);
              Alert.alert('Error', 'No se pudo eliminar el lote.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const canEditOrDeleteLot = () => {
    const rol = normalizeRole(userRole);
    // Admin siempre puede; piscicultor solo sus lotes
    return rol === 'admin' || rol === 'piscicultor';
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

      <View style={styles.actionsContainer}>
        <View style={styles.mainActionsRow}>
          <TouchableOpacity style={[commonStyles.buttonPrimary, styles.mainButton]} onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={commonStyles.buttonPrimaryText}>Evaluaciones</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[commonStyles.buttonSecondary, styles.mainButton]}
            onPress={() => navigation.navigate('Evaluacion - Datos Basicos', { fishLotId: fishLot.id, ubication: fishLot?.neighborhood ?? '' })}
          >
            <MaterialCommunityIcons name="plus" size={18} color={commonColors.primary} style={{ marginRight: 6 }} />
            <Text style={commonStyles.buttonSecondaryText}>Nueva</Text>
          </TouchableOpacity>
        </View>
        {canEditOrDeleteLot() && (
          <TouchableOpacity
            style={styles.optionsIconButton}
            onPress={() => setOptionsModalVisible(true)}
          >
            <MaterialCommunityIcons name="dots-vertical" size={24} color={commonColors.primary} />
          </TouchableOpacity>
        )}
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <Text style={commonStyles.textMedium}>#{evaluation.id} • {formatDate(evaluation.date)}</Text>
                      <Text style={commonStyles.textSmall}>{evaluation.temperature}°C</Text>
                    </View>
                    <Text style={commonStyles.textSmall} numberOfLines={1}>Especie: {evaluation.species} • Cant: {evaluation.quantity} • Peso: {evaluation.averageWeight}g</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'center' }}>
                      <TouchableOpacity style={[commonStyles.buttonPrimary, { flex: 1 }]} onPress={() => handleDownload(evaluation.id)}>
                        <MaterialCommunityIcons name="download" size={14} color="#fff" style={{ marginRight: 4 }} />
                        <Text style={[commonStyles.buttonPrimaryText, { fontSize: 12 * fontScale }]}>Descargar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[commonStyles.buttonSecondary, { flex: 1 }]} 
                        onPress={() => {
                          setModalVisible(false);
                          navigation.navigate('Editar Evaluacion', { evaluationId: evaluation.id });
                        }}
                      >
                        <MaterialCommunityIcons name="pencil" size={14} color={commonColors.primary} style={{ marginRight: 4 }} />
                        <Text style={[commonStyles.buttonSecondaryText, { fontSize: 12 * fontScale }]}>Editar</Text>
                      </TouchableOpacity>
                      {canDeleteEvaluation() && (
                        <TouchableOpacity 
                          style={styles.evalDeleteButton}
                          onPress={() => handleDeleteEvaluation(evaluation.id)} 
                          disabled={deleting}
                        >
                          <MaterialCommunityIcons name="trash-can" size={14} color={commonColors.primary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={commonStyles.textSmall}>No hay evaluaciones disponibles.</Text>
              )}
            </ScrollView>
            <TouchableOpacity style={[commonStyles.buttonPrimary, { marginTop: 8 }]} onPress={() => setModalVisible(false)}>
              <Text style={commonStyles.buttonPrimaryText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Opciones */}
      <Modal animationType="slide" transparent visible={optionsModalVisible} onRequestClose={() => setOptionsModalVisible(false)}>
        <View style={styles.optionsModalOverlay}>
          <View style={styles.optionsModalContent}>
            <Text style={[{ fontSize: 18 * fontScale, fontWeight: '700', marginBottom: 16, color: commonColors.textPrimary }]}>Opciones del Lote</Text>

            {/* Opción: Editar */}
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: '#f0f5ff' }]}
              onPress={() => {
                setOptionsModalVisible(false);
                navigation.navigate('Editar Lote', { fishLotId: fishLot.id });
              }}
            >
              <MaterialCommunityIcons name="pencil" size={20} color={commonColors.primary} />
              <Text style={[styles.optionButtonText, { color: commonColors.primary }]}>Editar Lote</Text>
            </TouchableOpacity>

            {/* Opción: Borrar */}
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: '#fff3f0' }]}
              onPress={() => {
                setOptionsModalVisible(false);
                handleDeleteFishLot();
              }}
              disabled={deleting}
            >
              <MaterialCommunityIcons name="trash-can" size={20} color="#d32f2f" />
              <Text style={[styles.optionButtonText, { color: '#d32f2f' }]}>Borrar Lote</Text>
            </TouchableOpacity>

            {/* Botón Cancelar */}
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: commonColors.background, marginTop: 8 }]}
              onPress={() => setOptionsModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={20} color={commonColors.textSecondary} />
              <Text style={[styles.optionButtonText, { color: commonColors.textSecondary }]}>Cancelar</Text>
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
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    alignItems: 'center',
  },
  mainActionsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  mainButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionsIconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#f0f5ff',
    borderWidth: 1.5,
    borderColor: commonColors.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
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
  evalDeleteButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  optionsModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default memo(FishLotCard);
