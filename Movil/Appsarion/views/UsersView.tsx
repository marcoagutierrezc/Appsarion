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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_URL } from '../services/connection/connection';
import { FishLoadingScreen } from '../utils/FishLoadingScreen';
import { showAlert } from '../utils/alerts';
import { FullscreenImageViewer } from '../components/FullscreenImageViewer';
import * as Sharing from 'expo-sharing';

export interface User {
  id: number;
  name: string;
  documentType: string;
  documentNumber: number;
  phoneNumber: number;
  email: string;
  role: string;
  supporting_document: string | null;
  estado: string;
}

export function UsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
  const [documentLoading, setDocumentLoading] = useState<boolean>(false);
  const [documentBase64, setDocumentBase64] = useState<string>('');
  const [documentFilename, setDocumentFilename] = useState<string>('');
  const [downloading, setDownloading] = useState<boolean>(false);
  const [fullscreenViewerVisible, setFullscreenViewerVisible] = useState<boolean>(false);
  const [hasDocument, setHasDocument] = useState<boolean>(false);
  const [checkingDocument, setCheckingDocument] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  // Función para obtener usuarios aprobados (no admins)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/non-admins`);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      showAlert('Error', 'No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user: User, index: number) => {
    setSelectedUser(user);
    setSelectedUserIndex(index);
    setModalVisible(true);
    // Cargar detalles completos del usuario (incluye documento y datos del rol)
    loadUserDetails(user.id);
  };

  const loadUserDetails = async (userId: number) => {
    setLoadingDetails(true);
    setCheckingDocument(true);
    try {
      console.log('Cargando detalles del usuario:', userId);
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      if (response.ok) {
        const details = await response.json();
        console.log('Detalles del usuario:', details);
        setUserDetails(details);
        // Verificar si tiene documento basado en supportingDocument del endpoint
        setHasDocument(details.supportingDocument ? true : false);
      } else {
        console.error('Error al obtener detalles del usuario');
        setUserDetails(null);
        setHasDocument(false);
      }
    } catch (error: any) {
      console.error('Error cargando detalles:', error);
      setUserDetails(null);
      setHasDocument(false);
    } finally {
      setLoadingDetails(false);
      setCheckingDocument(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setDocumentBase64('');
    setFullscreenViewerVisible(false);
    setHasDocument(false);
    setUserDetails(null);
    setTimeout(() => {
      setSelectedUser(null);
      setSelectedUserIndex(null);
    }, 300);
  };

  // Traducción de claves en inglés a español
  const translateKey = (key: string): string => {
    const translations: { [key: string]: string } = {
      // Piscicultor
      department: 'Departamento',
      municipality: 'Municipio',
      neighborhood: 'Barrio',
      nameProperty: 'Nombre de la Propiedad',
      name_property: 'Nombre de la Propiedad',
      
      // Evaluador
      specialty: 'Especialidad',
      specialization: 'Especialización',
      
      // Comercializador
      businessName: 'Nombre del Negocio',
      businessType: 'Tipo de Negocio',
      address: 'Dirección',
      
      // Académico
      institution: 'Institución',
      position: 'Cargo',
      faculty: 'Facultad',
    };
    return translations[key] || key;
  };

  // Renderizar datos del rol dinámicamente
  const renderRoleData = (roleData: any) => {
    const views = [];
    
    if (roleData.piscicultor) {
      const data = roleData.piscicultor;
      views.push(
        <View key="piscicultor">
          <Text style={[styles.sectionTitle, { marginTop: 12, fontSize: 12 }]}>Datos del Piscicultor</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Departamento:</Text>
            <Text style={styles.infoValue}>{data.department || '(sin especificar)'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Municipio:</Text>
            <Text style={styles.infoValue}>{data.municipality || '(sin especificar)'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Barrio:</Text>
            <Text style={styles.infoValue}>{data.neighborhood || '(sin especificar)'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre de la Propiedad:</Text>
            <Text style={styles.infoValue}>{data.nameProperty || '(sin especificar)'}</Text>
          </View>
        </View>
      );
    }

    if (roleData.evaluador) {
      const data = roleData.evaluador;
      views.push(
        <View key="evaluador">
          <Text style={[styles.sectionTitle, { marginTop: 12, fontSize: 12 }]}>Datos del Evaluador</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Especialidad:</Text>
            <Text style={styles.infoValue}>{data.specialty || '(sin especificar)'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Especialización:</Text>
            <Text style={styles.infoValue}>{data.specialization || '(sin especificar)'}</Text>
          </View>
        </View>
      );
    }

    if (roleData.comercializador) {
      const data = roleData.comercializador;
      views.push(
        <View key="comercializador">
          <Text style={[styles.sectionTitle, { marginTop: 12, fontSize: 12 }]}>Datos del Comercializador</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre del Negocio:</Text>
            <Text style={styles.infoValue}>{data.businessName || '(sin especificar)'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo de Negocio:</Text>
            <Text style={styles.infoValue}>{data.businessType || '(sin especificar)'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dirección:</Text>
            <Text style={styles.infoValue}>{data.address || '(sin especificar)'}</Text>
          </View>
        </View>
      );
    }

    if (roleData.academico) {
      const data = roleData.academico;
      views.push(
        <View key="academico">
          <Text style={[styles.sectionTitle, { marginTop: 12, fontSize: 12 }]}>Datos del Académico</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Institución:</Text>
            <Text style={styles.infoValue}>{data.institution || '(sin especificar)'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cargo:</Text>
            <Text style={styles.infoValue}>{data.position || '(sin especificar)'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Facultad:</Text>
            <Text style={styles.infoValue}>{data.faculty || '(sin especificar)'}</Text>
          </View>
        </View>
      );
    }

    if (roleData.admin) {
      views.push(
        <View key="admin" style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo:</Text>
          <Text style={styles.infoValue}>{roleData.admin}</Text>
        </View>
      );
    }

    return views;
  };

  const handleViewDocument = async () => {
    if (!selectedUser) {
      showAlert('Error', 'No se seleccionó usuario.');
      return;
    }

    setDocumentLoading(true);
    try {
      console.log('Descargando documento para usuario:', selectedUser.id);
      
      // Descargar directamente - ya sabemos que tiene documento porque lo verificamos en loadUserDetails
      const response = await fetch(`${BASE_URL}/api/support-documents/download/${selectedUser.id}?type=verified`, {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Este usuario no tiene documento de soporte registrado');
        }
        throw new Error(`Error ${response.status} al descargar el documento`);
      }

      // Convertir a base64 para mostrar
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        console.log('DataURL generado, longitud:', dataUrl.length);
        setDocumentBase64(dataUrl);
        setDocumentFilename(userDetails?.supportingDocument?.split('/').pop() || 'documento');
        setDocumentLoading(false);
        setFullscreenViewerVisible(true);
      };

      reader.onerror = () => {
        console.error('Error al leer el archivo');
        setDocumentLoading(false);
        showAlert('Error', 'No se pudo procesar el documento.');
      };

      reader.readAsDataURL(blob);
    } catch (error: any) {
      console.error('Error descargando documento:', error);
      setDocumentLoading(false);
      showAlert('Error', error.message || 'No se pudo descargar el documento.');
    }
  };

  const handleDownloadDocument = async () => {
    if (!selectedUser) {
      showAlert('Error', 'No se seleccionó usuario.');
      return;
    }

    if (!documentBase64) {
      showAlert('Error', 'Primero carga el documento.');
      return;
    }

    setDownloading(true);
    try {
      await Sharing.shareAsync(documentBase64, {
        mimeType: 'image/*',
        dialogTitle: 'Descargar documento',
      });
    } catch (error: any) {
      console.error('Error descargando:', error);
      showAlert('Error', 'No se pudo descargar el documento.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) {
      showAlert('Error', 'No se seleccionó usuario.');
      return;
    }

    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar a ${selectedUser.name}? Esta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Eliminación cancelada'),
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            setDocumentLoading(true);
            try {
              console.log('Eliminando usuario:', selectedUser.id);
              const response = await fetch(`${BASE_URL}/users/${selectedUser.id}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
              }

              // Recargar lista de usuarios
              await fetchUsers();
              closeModal();
              showAlert('Éxito', 'Usuario eliminado correctamente.');
            } catch (error: any) {
              console.error('Error eliminando usuario:', error);
              showAlert('Error', error.message || 'No se pudo eliminar el usuario.');
            } finally {
              setDocumentLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'Piscicultor':
        return '#e3f2fd';
      case 'Evaluador':
        return '#f3e5f5';
      case 'Comercializador':
        return '#e8f5e9';
      case 'Academico':
        return '#fff3e0';
      case 'Admin':
        return '#fce4ec';
      default:
        return '#f5f5f5';
    }
  };

  const getRoleTextColor = (role: string): string => {
    switch (role) {
      case 'Piscicultor':
        return '#1976d2';
      case 'Evaluador':
        return '#7b1fa2';
      case 'Comercializador':
        return '#388e3c';
      case 'Academico':
        return '#f57c00';
      case 'Admin':
        return '#c2185b';
      default:
        return '#616161';
    }
  };

  if (loading) {
    return <FishLoadingScreen />;
  }

  if (users.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay usuarios registrados</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
          <Text style={styles.headerSubtitle}>Administra los usuarios del sistema</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Usuarios</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#999" />
        <TextInput
          placeholder="Buscar usuario..."
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      {users.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="account-multiple" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No hay usuarios</Text>
          <Text style={styles.emptyStateText}>No se encontraron usuarios registrados en el sistema</Text>
        </View>
      ) : (
        <View style={styles.cardsContainer}>
          {users.map((user, index) => (
            <TouchableOpacity
              key={user.id}
              style={styles.userCard}
              onPress={() => openModal(user, index)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.userInitials}>
                  <Text style={styles.initialsText}>
                    {user.name
                      .split(' ')
                      .slice(0, 2)
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
                  <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.cardFooter}>
                <View style={styles.roleContainer}>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                    <Text style={styles.roleBadgeText}>{user.role}</Text>
                  </View>
                </View>
                <View style={styles.estadoContainer}>
                  <View
                    style={[
                      styles.estadoBadge,
                      { backgroundColor: user.estado === 'activo' ? '#d4edda' : '#f8d7da' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.estadoText,
                        { color: user.estado === 'activo' ? '#155724' : '#856404' },
                      ]}
                    >
                      {user.estado}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardAction}>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#0066cc" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedUser.name}</Text>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Información Personal</Text>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nombre:</Text>
                    <Text style={styles.infoValue}>{selectedUser.name}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{selectedUser.email}</Text>
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
                    <Text style={styles.infoLabel}>Estado:</Text>
                    <Text style={styles.infoValue}>{selectedUser.estado}</Text>
                  </View>

                  {loadingDetails ? (
                    <View style={{ marginTop: 16, alignItems: 'center' }}>
                      <ActivityIndicator size="small" color="#0066cc" />
                    </View>
                  ) : userDetails?.roleData ? (
                    <View>
                      {renderRoleData(userDetails.roleData)}
                    </View>
                  ) : null}
                </View>

                <View style={styles.divider} />

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Documentación</Text>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Documento Adjunto:</Text>
                    {checkingDocument ? (
                      <ActivityIndicator size="small" color="#0066cc" />
                    ) : (
                      <Text
                        style={[
                          styles.infoValue,
                          {
                            color: hasDocument ? '#28a745' : '#dc3545',
                          },
                        ]}
                      >
                        {hasDocument ? '✓ Sí' : '✗ No'}
                      </Text>
                    )}
                  </View>

                  {hasDocument && (
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
                  )}

                  {!hasDocument && !checkingDocument && (
                    <View style={styles.noDocumentContainer}>
                      <Text style={styles.noDocumentText}>
                        Este usuario no ha adjuntado un documento de soporte.
                      </Text>
                    </View>
                  )}

                </View>

                <View style={styles.divider} />
                <View style={{ height: 20 }} />
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.deleteButton, documentLoading && styles.buttonDisabled]}
              onPress={handleDeleteUser}
              disabled={documentLoading}
            >
              <MaterialCommunityIcons name="trash-can" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalButton} onPress={closeModal}>
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FullscreenImageViewer
        visible={fullscreenViewerVisible}
        imageUri={documentBase64}
        filename={documentFilename}
        isDownloading={downloading}
        onClose={() => setFullscreenViewerVisible(false)}
        onDownload={handleDownloadDocument}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ccc',
  },
  tableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 13,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
    paddingHorizontal: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#999',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  infoSection: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    flex: 0.4,
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    flex: 0.6,
    textAlign: 'right',
  },
  documentButtonContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  documentButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  documentButtonDisabled: {
    opacity: 0.6,
  },
  documentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  documentButtonSubtext: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  noDocumentContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  noDocumentText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  documentPreviewContainer: {
    marginTop: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  documentPreview: {
    width: '100%',
    height: 300,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    gap: 10,
  },
  closeModalButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexDirection: 'row',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  // Nuevos estilos para diseño mejorado
  headerContent: {
    flex: 1,
  },
  statsContainer: {
    marginLeft: 16,
  },
  statBox: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInitials: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  userEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleContainer: {
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  estadoContainer: {
    marginLeft: 8,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  estadoText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardAction: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -12,
  },
});
