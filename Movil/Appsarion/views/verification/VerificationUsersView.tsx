import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_URL } from '../../services/connection/connection';
import { FishLoadingScreen } from '../../utils/FishLoadingScreen';
import { showAlert } from '../../utils/alerts';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { FullscreenImageViewer } from '../../components/FullscreenImageViewer';
import {
  getCachedDocument,
  cacheDocument,
  initializeCacheDirectory,
} from '../../services/documentCacheService';

export interface PendingUser {
  id: number;
  name: string;
  documentType: string;
  documentNumber: number;
  phoneNumber: number;
  email: string;
  role: string;
  justification: string;
  supportingDocument: string | null;
  hasDocument: boolean;
  documentLocation: string;
  estado: string;
}

export function VerificationUsersView() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
  const [documentLoading, setDocumentLoading] = useState<boolean>(false);
  const [documentBase64, setDocumentBase64] = useState<string>('');
  const [documentRawBase64, setDocumentRawBase64] = useState<string>('');
  const [documentContentType, setDocumentContentType] = useState<string>('');
  const [documentFilename, setDocumentFilename] = useState<string>('');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [fullscreenViewerVisible, setFullscreenViewerVisible] = useState<boolean>(false);
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({}); // Thumbnails por userId
  const [currentThumbnail, setCurrentThumbnail] = useState<string>(''); // Thumbnail del usuario actual
  const [rejectionModalVisible, setRejectionModalVisible] = useState<boolean>(false); // Modal para razón de rechazo
  const [rejectionReasonInput, setRejectionReasonInput] = useState<string>(''); // Input temporal para rechazo

  // Función para obtener usuarios pendientes
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users-to-verify/pending`);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios pendientes');
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      showAlert('Error', 'No se pudieron obtener los usuarios pendientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Inicializar caché y obtener usuarios
    const init = async () => {
      await initializeCacheDirectory();
      await fetchPendingUsers();
    };
    init();
  }, []);

  const openModal = (user: PendingUser, index: number) => {
    setSelectedUser(user);
    setSelectedUserIndex(index);
    setRejectionReason('Documentación incompleta o no válida.');
    setModalVisible(true);
    // Reset document preview/download state whenever we open a new modal
    setDocumentBase64('');
    setDocumentRawBase64('');
    setDocumentContentType('');
    setDocumentFilename('');
    setDownloading(false);
    // Cargar thumbnail si existe
    if (thumbnails[user.id]) {
      setCurrentThumbnail(thumbnails[user.id]);
      console.log('✅ Thumbnail cargado del caché para usuario:', user.id);
    } else {
      setCurrentThumbnail('');
    }
  };

  const handleApproveUser = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users-to-verify/${selectedUser.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showAlert('Éxito', 'El usuario ha sido aprobado exitosamente.');
        // Remover el usuario de la lista
        const updatedUsers = users.filter(u => u.id !== selectedUser.id);
        setUsers(updatedUsers);
        setModalVisible(false);
        setSelectedUser(null);
        setCurrentThumbnail('');
      } else {
        showAlert('Error', data.message || 'No se pudo aprobar el usuario.');
      }
    } catch (error: any) {
      console.error('Error approving user:', error);
      showAlert('Error', 'Error al conectar con el servidor.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectUser = async () => {
    if (!selectedUser) return;

    if (!rejectionReasonInput.trim()) {
      showAlert('Error', 'Por favor ingresa una razón de rechazo.');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users-to-verify/${selectedUser.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason: rejectionReasonInput.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showAlert('Éxito', 'El usuario ha sido rechazado exitosamente.');
        // Remover el usuario de la lista
        const updatedUsers = users.filter(u => u.id !== selectedUser.id);
        setUsers(updatedUsers);
        setModalVisible(false);
        setSelectedUser(null);
        setCurrentThumbnail('');
        setRejectionReasonInput('');
        setRejectionModalVisible(false);
      } else {
        showAlert('Error', data.message || 'No se pudo rechazar el usuario.');
      }
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      showAlert('Error', 'Error al conectar con el servidor.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDocument = async () => {
    if (!selectedUser) {
      showAlert('Error', 'No se seleccionó usuario.');
      return;
    }

    if (!selectedUser.supportingDocument) {
      showAlert('Error', 'El usuario no tiene documento de soporte.');
      return;
    }

    setDocumentLoading(true);
    try {
      // Intentar obtener del caché primero
      const cached = await getCachedDocument(selectedUser.id);
      if (cached) {
        console.log('Documento cargado del caché');
        setDocumentBase64(cached.base64Data);
        setDocumentRawBase64(cached.base64Data.split(',')[1] || cached.base64Data);
        setDocumentContentType(cached.contentType);
        setDocumentFilename(cached.filename);
        setDocumentLoading(false);
        setFullscreenViewerVisible(true);
        return;
      }

      console.log('Descargando documento del servidor para usuario:', selectedUser.id);
      
      // Descargar bytes del documento desde el nuevo endpoint, especificando type=pending en esta vista
      const response = await fetch(`${BASE_URL}/api/support-documents/download/${selectedUser.id}?type=pending`, {
        method: 'GET',
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || 'Error al descargar el documento');
      }
      
      // Extraer metadatos de headers
      const contentType = response.headers.get('Content-Type') || '';
      const contentDisp = response.headers.get('Content-Disposition') || '';
      setDocumentContentType(contentType);

      // Intentar extraer nombre de archivo del header
      let filename = '';
      const match = contentDisp.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
      if (match) {
        filename = decodeURIComponent(match[1] || match[2] || '').trim();
      }
      // Fallback por tipo
      if (!filename) {
        const extFromType = contentType.includes('pdf')
          ? 'pdf'
          : contentType.includes('png')
          ? 'png'
          : contentType.includes('jpeg')
          ? 'jpg'
          : contentType.includes('jpg')
          ? 'jpg'
          : contentType.includes('webp')
          ? 'webp'
          : 'bin';
        filename = `documento_${selectedUser.id}.${extFromType}`;
      }
      setDocumentFilename(filename);

      // Convertir a blob y luego a base64 (data URL para previsualización)
      const blob = await response.blob();
      console.log('Blob size:', blob.size, 'bytes');

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string; // p.ej. data:image/png;base64,AAAA
        console.log('📸 DataURL generado, longitud:', dataUrl.length, 'para userId:', selectedUser.id);
        setDocumentBase64(dataUrl);
        // Extraer la parte base64 pura para guardar en archivo
        const commaIdx = dataUrl.indexOf(',');
        const pureBase64 = commaIdx !== -1 ? dataUrl.substring(commaIdx + 1) : '';
        setDocumentRawBase64(pureBase64);
        
        // Guardar thumbnail en la lista de usuarios PRIMERO
        console.log('🖼️ Guardando thumbnail para userId:', selectedUser.id, 'dataUrl length:', dataUrl.length);
        setCurrentThumbnail(dataUrl); // Mostrar inmediatamente
        console.log('✅ setCurrentThumbnail llamado');
        
        setThumbnails(prev => {
          const updated = {
            ...prev,
            [selectedUser.id]: dataUrl,
          };
          console.log('✅ Thumbnail guardado en lista. Claves en estado:', Object.keys(updated));
          return updated;
        });
        
        // Guardar en caché para la próxima vez
        cacheDocument(selectedUser.id, dataUrl, contentType, filename).catch((err) => {
          console.error('Error al guardar en caché:', err);
        });
        
        setDocumentLoading(false);
        // Abrir el fullscreen viewer automáticamente
        setFullscreenViewerVisible(true);
      };

      reader.onerror = () => {
        console.error('Error al leer el archivo');
        setDocumentLoading(false);
        showAlert('Error', 'No se pudo procesar el documento.');
      };

      reader.readAsDataURL(blob);
    } catch (error: any) {
      console.error('Error obteniendo documento:', error);
      setDocumentLoading(false);
      showAlert('Error', error.message || 'No se pudo obtener el documento.');
    }
  };

  const handleDownloadDocument = async () => {
    if (!selectedUser) return;
    if (!documentBase64) {
      showAlert('Aviso', 'Primero visualiza el documento para habilitar la descarga.');
      return;
    }

    setDownloading(true);
    try {
      const filename = documentFilename || `documento_${selectedUser.id}.jpg`;
      const mime = documentContentType || 'image/jpeg';

      // Crear timestamp único para el archivo
      const timestamp = Date.now();
      const uniqueFilename = `doc_${timestamp}_${filename}`;

      // Usar el write method de FileSystem con ruta relativa simple
      const baseDir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '';
      let fileUri = '';

      if (baseDir) {
        fileUri = `${baseDir}${uniqueFilename}`;
      } else {
        // Si no hay directorio predeterminado, usar una ruta simple
        fileUri = `file:///tmp/${uniqueFilename}`;
      }

      try {
        // Escribir el archivo en base64
        await FileSystem.writeAsStringAsync(fileUri, documentRawBase64, {
          encoding: 'base64',
        } as any);

        console.log('Documento guardado:', fileUri);

        // Compartir con el sistema - permite al usuario elegir donde guardar
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: mime,
            dialogTitle: `Guardar o compartir: ${filename}`,
            UTI: mime,
          });
        } else {
          showAlert('Éxito', `Documento guardado:\n${filename}`);
        }
      } catch (fsError: any) {
        console.warn('Error con FileSystem, usando alternativa:', fsError.message);
        // Fallback sin guardar en archivo
        showAlert('Éxito', `Documento listo para descargar: ${filename}\nAbriendo opciones de compartir...`);
      }
    } catch (e: any) {
      console.error('Error descargando:', e);
      showAlert('Error', 'No se pudo procesar el documento. Intenta de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <FishLoadingScreen />;
  }

  if (users.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay usuarios pendientes de verificación</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Usuarios Pendientes de Verificación</Text>
        <Text style={styles.headerSubtitle}>{users.length} usuario(s) pendiente(s)</Text>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Nombre</Text>
          <Text style={styles.tableHeaderText}>Email</Text>
          <Text style={styles.tableHeaderText}>Rol</Text>
          <Text style={styles.tableHeaderText}>Acción</Text>
        </View>

        {users.map((user, index) => (
          <View key={user.id} style={styles.tableRow}>
            <Text style={styles.tableCell} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.tableCell} numberOfLines={1}>
              {user.email}
            </Text>
            <Text style={styles.tableCell}>{user.role}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openModal(user, index)}
            >
              <Text style={styles.actionButtonText}>Ver</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedUser.name}</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Información Personal</Text>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>ID:</Text>
                    <Text style={styles.infoValue}>{selectedUser.id}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nombre:</Text>
                    <Text style={styles.infoValue}>{selectedUser.name}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tipo de Documento:</Text>
                    <Text style={styles.infoValue}>{selectedUser.documentType}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Número de Documento:</Text>
                    <Text style={styles.infoValue}>{selectedUser.documentNumber}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{selectedUser.email}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Teléfono:</Text>
                    <Text style={styles.infoValue}>{selectedUser.phoneNumber}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Información de Rol</Text>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Rol:</Text>
                    <Text style={styles.infoValue}>{selectedUser.role}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Justificación:</Text>
                    <Text style={styles.infoValue}>{selectedUser.justification}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Estado:</Text>
                    <Text style={styles.infoValue}>{selectedUser.estado}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Documentación</Text>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Documento Adjunto:</Text>
                    <Text
                      style={[
                        styles.infoValue,
                        {
                          color: selectedUser.hasDocument ? '#28a745' : '#dc3545',
                        },
                      ]}
                    >
                      {selectedUser.hasDocument ? '✓ Sí' : '✗ No'}
                    </Text>
                  </View>

                  {selectedUser.hasDocument && selectedUser.documentLocation && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Ubicación:</Text>
                      <Text style={styles.infoValue}>{selectedUser.documentLocation}</Text>
                    </View>
                  )}

                  {selectedUser.hasDocument && selectedUser.supportingDocument && (
                    <>
                      <View style={styles.documentButtonContainer}>
                        <TouchableOpacity
                          style={[
                            styles.documentButton,
                            documentLoading && styles.documentButtonDisabled,
                          ]}
                          onPress={handleViewDocument}
                          disabled={documentLoading}
                        >
                          {documentLoading ? (
                            <>
                              <ActivityIndicator color="#fff" size="small" />
                              <Text style={styles.documentButtonText}>Cargando...</Text>
                            </>
                          ) : (
                            <>
                              <MaterialCommunityIcons name="eye" size={20} color="#fff" style={{ marginRight: 8 }} />
                              <Text style={styles.documentButtonText}>Ver Documento</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>

                      {/* Thumbnail preview */}
                      {currentThumbnail && (
                        <View style={styles.thumbnailContainer}>
                          <Text style={styles.thumbnailLabel}>Vista Previa:</Text>
                          <TouchableOpacity
                            onPress={handleViewDocument}
                            disabled={documentLoading}
                          >
                            <Image
                              source={{ uri: currentThumbnail }}
                              style={styles.thumbnail}
                              resizeMode="cover"
                              onLoad={() => console.log('✅ Thumbnail imagen cargada')}
                              onError={(e) => console.error('❌ Error cargando thumbnail:', e)}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}

                  {!selectedUser.hasDocument && (
                    <View style={styles.noDocumentContainer}>
                      <Text style={styles.noDocumentText}>
                        Este usuario no ha adjuntado un documento de soporte.
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.divider} />

                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.approveBtn]}
                    onPress={handleApproveUser}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.actionBtnText}>✓ Aprobar</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => setRejectionModalVisible(true)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.actionBtnText}>✕ Rechazar</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.cancelBtn]}
                    onPress={() => setModalVisible(false)}
                    disabled={actionLoading}
                  >
                    <Text style={styles.actionBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Fullscreen image viewer modal */}
      <FullscreenImageViewer
        visible={fullscreenViewerVisible}
        imageUri={documentBase64}
        filename={documentFilename}
        isDownloading={downloading}
        onClose={() => setFullscreenViewerVisible(false)}
        onDownload={handleDownloadDocument}
      />

      {/* Rejection reason modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={rejectionModalVisible}
        onRequestClose={() => {
          setRejectionModalVisible(false);
          setRejectionReasonInput('');
        }}
      >
        <View style={styles.rejectionModalOverlay}>
          <View style={styles.rejectionModalContainer}>
            <Text style={styles.rejectionModalTitle}>Razón de Rechazo</Text>
            <TextInput
              style={styles.rejectionModalInput}
              placeholder="Ingresa la razón del rechazo..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={rejectionReasonInput}
              onChangeText={setRejectionReasonInput}
              editable={!actionLoading}
            />
            <View style={styles.rejectionModalButtonsContainer}>
              <TouchableOpacity
                style={[styles.rejectionModalBtn, styles.rejectionModalBtnCancel]}
                onPress={() => {
                  setRejectionModalVisible(false);
                  setRejectionReasonInput('');
                }}
                disabled={actionLoading}
              >
                <Text style={styles.rejectionModalBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rejectionModalBtn, styles.rejectionModalBtnConfirm]}
                onPress={handleRejectUser}
                disabled={actionLoading || !rejectionReasonInput.trim()}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.rejectionModalBtnText}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  actionButton: {
    flex: 0.8,
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  infoSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  documentPreview: {
    marginTop: 12,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  documentImage: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    backgroundColor: '#e9e9e9',
  },
  documentLink: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  documentLinkText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  rejectionSection: {
    marginBottom: 16,
  },
  rejectionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 13,
    color: '#333',
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 30,
    paddingBottom: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  approveBtn: {
    backgroundColor: '#28a745',
  },
  rejectBtn: {
    backgroundColor: '#dc3545',
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
  },
  documentButtonContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  documentButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  documentButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  documentButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  thumbnailContainer: {
    marginTop: 16,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  thumbnailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  thumbnail: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  noDocumentContainer: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    marginTop: 12,
  },
  noDocumentText: {
    color: '#856404',
    fontSize: 13,
    fontStyle: 'italic',
  },
  rejectionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectionModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 350,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  rejectionModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  rejectionModalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  rejectionModalButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectionModalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectionModalBtnCancel: {
    backgroundColor: '#e0e0e0',
  },
  rejectionModalBtnConfirm: {
    backgroundColor: '#dc3545',
  },
  rejectionModalBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default VerificationUsersView;