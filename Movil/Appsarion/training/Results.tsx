import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavbarQuiz } from '../components/NavbarQuiz';
import { BASE_URL } from '../services/connection/connection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { commonColors, commonStyles } from '../styles/commonStyles';


export function ResultsScreen({ navigation }: any) {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<number | null>(null);
  const id_user = useSelector((state: RootState) => state.auth.user?.id);


  useEffect(() => {
    let isActive = true;
    const run = async () => {
      if (id_user) await fetchCertificates(isActive);
    };
    run();
    return () => { isActive = false; };
  }, [id_user]);

  const fetchCertificates = async (isActive?: boolean) => {
    try {
      const response = await fetch(`${BASE_URL}/certificates/user/${id_user}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Error al obtener los certificados.');

      const data = await response.json();
      if (isActive !== false) setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      Alert.alert('Error', 'No se pudieron obtener los certificados.');
    } finally {
      if (isActive !== false) setLoading(false);
    }
  };

  const handleDownload = async (evaluationId: number) => {
    try {
      setDownloading(evaluationId);
      const destDir = new Directory(Paths.document, 'certificados');
      destDir.create({ idempotent: true, intermediates: true });
      const destFile = new File(destDir, `certificado_${evaluationId}.pdf`);

      await File.downloadFileAsync(`${BASE_URL}/certificates/download/${evaluationId}`, destFile, { idempotent: true });

      Alert.alert('✓ Descarga completada', 'El certificado se ha guardado correctamente.');

      await Sharing.shareAsync(destFile.uri, { mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error downloading certificate:', error);
      Alert.alert('Error', 'No se pudo descargar el certificado.');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={commonColors.primary} />
          <Text style={styles.loadingText}>Cargando certificados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (certificates.length === 0) {
    return (
      <>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons name="medal" size={64} color={commonColors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No tienes certificados aún</Text>
            <Text style={styles.emptySubtitle}>Completa los exámenes para obtener tus certificados</Text>
          </ScrollView>
        </SafeAreaView>
        <NavbarQuiz navigation={navigation} />
      </>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.headerIconContainer}>
              <MaterialCommunityIcons name="certificate" size={32} color={commonColors.success} />
            </View>
            <Text style={styles.title}>Mis Certificados</Text>
            <Text style={styles.subtitle}>{certificates.length} certificado{certificates.length !== 1 ? 's' : ''} aprobado{certificates.length !== 1 ? 's' : ''}</Text>
          </View>

          {/* Certificates List */}
          <View style={styles.certificatesContainer}>
            {certificates.map((item, index) => (
              <View key={item?.id ? item.id.toString() : index.toString()} style={styles.certificateCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.badgeContainer}>
                    <MaterialCommunityIcons name="check-circle" size={24} color={commonColors.success} />
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.certTitle}>Certificado #{item.id}</Text>
                    <Text style={styles.certDate}>
                      <MaterialCommunityIcons name="calendar" size={14} color={commonColors.textSecondary} /> {item.issuedAt}
                    </Text>
                  </View>
                </View>

                <View style={commonStyles.divider} />

                <TouchableOpacity
                  style={[
                    styles.downloadButton,
                    downloading === item.id && styles.downloadButtonLoading
                  ]}
                  onPress={() => item.id ? handleDownload(item.id) : console.error("ID de evaluación no válido")}
                  disabled={downloading === item.id}
                >
                  {downloading === item.id ? (
                    <>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.downloadButtonText}>Descargando...</Text>
                    </>
                  ) : (
                    <>
                      <MaterialCommunityIcons name="download" size={18} color="#fff" />
                      <Text style={styles.downloadButtonText}>Descargar PDF</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <NavbarQuiz navigation={navigation} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },

  /* Loading State */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: commonColors.textSecondary,
    marginTop: 0,
  },

  /* Empty State */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: commonColors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: commonColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  /* Header Section */
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.border,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0fef0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: commonColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: commonColors.textSecondary,
    fontWeight: '500',
  },

  /* Certificates Container */
  certificatesContainer: {
    gap: 14,
  },

  /* Certificate Card */
  certificateCard: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  badgeContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#f0fef0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flex: 1,
  },
  certTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: commonColors.textPrimary,
    marginBottom: 4,
  },
  certDate: {
    fontSize: 13,
    color: commonColors.textSecondary,
    fontWeight: '500',
  },

  /* Download Button */
  downloadButton: {
    backgroundColor: commonColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 0,
    shadowColor: commonColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadButtonLoading: {
    opacity: 0.7,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ResultsScreen;
