import React, { useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, Alert, Modal, Text, TouchableOpacity, Image } from 'react-native';
import { BASE_URL } from '../../services/connection/connection';
import {FishLoadingScreen} from '../../utils/FishLoadingScreen'

export interface User {
  id: number;
  name: string;
  documentType: string;
  documentNumber: number;
  phoneNumber: number;
  email: string;
  password: string;
  role: string;
  justification: string;
  supportingDocument: string;
}

const normalizeUserData = (rawData: any[]): User[] => {
  return rawData.map(user => ({
    id: user.id,
    name: user.name,
    documentType: user.documentType,
    documentNumber: user.documentNumber,
    phoneNumber: user.phoneNumber,
    email: user.email,
    password: user.password,
    role: user.role,
    justification: user.justification,
    supportingDocument: user.supportingDocument,
  }));
};

export function VerificationUsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const openModal = (user: User, index:number) => {
    setSelectedUser(user);
    setSelectedUserIndex(index);
    setModalVisible(true);
  };

  // Función para obtener usuarios
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users-to-verify/pending`);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios pendientes');
      }
      const data = await response.json();
      const normalizedUsers = normalizeUserData(data);
      setUsers(normalizedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'No se pudieron obtener los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: number, index: number) => {
    try {
      const response = await fetch(`${BASE_URL}/users-to-verify/delete/${userId}`); 
      if (!response.ok) {
        throw new Error('Error al intentar eliminar el usuario');
      }

      Alert.alert('Éxito', 'El usuario ha sido eliminado.');
      const updatedUsers = [...users];
      updatedUsers.splice(index, 1);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'No se pudo eliminar el usuario.');
    }
  };

  const handleVerifyUser = async (userId: number, index: number) => {
    try {
      const response = await fetch(`${BASE_URL}/users/validate/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Error al intentar verificar el usuario');
      }

      Alert.alert('Éxito', 'El usuario ha sido verificado.');
      const updatedUsers = [...users];
      updatedUsers.splice(index, 1);
      setUsers(updatedUsers);
      setModalVisible(false);
    } catch (error) {
      console.error('Error to verify user:', error);
      Alert.alert('Error', 'No se pudo verificar el usuario.');
    }
  };

  if (loading) {
    return <FishLoadingScreen />; 
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Nombre</Text>
        <Text style={styles.tableHeaderText}>Documento</Text>
        <Text style={styles.tableHeaderTextSmall}>Acciones</Text>
      </View>
      {users.map((user, index) => (
        <View key={user.id} style={styles.tableRow}>
          <Text style={styles.tableCell}>{user.name}</Text>
          <Text style={styles.tableCell}>{`${user.documentType}: ${user.documentNumber}`}</Text>
          <View style={styles.tableCellSmall}>
            <TouchableOpacity style={[styles.button]} onPress={() => openModal(user, index)}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <Text style={styles.modalTitle}>{selectedUser.name}</Text>
                <Text>{`Id: ${selectedUser.id}`}</Text>
                <Text>{`Rol: ${selectedUser.role}`}</Text>
                <Text>{`${selectedUser.documentType}: ${selectedUser.documentNumber}`}</Text>
                <Text>{`Teléfono: ${selectedUser.phoneNumber}`}</Text>
                <Text>{`Email: ${selectedUser.email}`}</Text>
                <Text>{`Justificación: ${selectedUser.justification}`}</Text>
                <Text>{`Documento de Soporte: ${selectedUser.supportingDocument}`}</Text>
                {/* {selectedUser && selectedUser.supportingDocument ? (
                  <Image
                    source={{ uri: selectedUser.supportingDocument }}
                    // source={require('../../../../../../../../../../uploads/supporting-document.jpg')}
                    style={{ width: 200, height: 200 }}
                    resizeMode="contain"
                  />
                ) : (
                  <Text>No hay documento de soporte.</Text>
                )} */}

                <View style={[styles.containerButton, styles.row]}>
                    <TouchableOpacity
                      style={[styles.buttonModal, styles.verifyButton]}
                      onPress={() => handleVerifyUser(selectedUser!.id, selectedUserIndex!)}
                    >
                      <Text style={styles.buttonText}>Verificar</Text>
                    </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.buttonModal, styles.deleteButton]}
                    onPress={() => handleDeleteUser(selectedUser!.id, selectedUserIndex!)}
                  >
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.buttonModal, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 10,
  },
  tableContainer: {
    padding: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableHeaderTextSmall: {
    flex: 0.5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center', 
  },
  tableCellSmall: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerButton:{
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    padding: 2,
    backgroundColor: '#007BFF',
    width: 25,
    borderRadius: 5,
    marginVertical: 2,
  },
  buttonModal: {
    padding: 4,
    backgroundColor: '#007BFF',
    height: 25,
    borderRadius: 5,
    marginVertical: 2,
  },
  buttonText: {
    color: '#fff',
    height: 20,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  verifyButton: {
    backgroundColor: '#28a745',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
});

export default VerificationUsersView;