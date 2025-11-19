import React, { useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, Alert, Modal, Text, TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {FishLoadingScreen} from '../../utils/FishLoadingScreen';
import { BASE_URL } from '../../services/connection/connection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useFontScale } from '../../context/FontScaleContext';

export interface User {
  id: number;
  name: string;
  documentType: string;
  documentNumber: number;
  phoneNumber: number;
  email: string;
  password: string;
  role: string;
  DataRole?: DataRolePiscicultor | DataRoleComercializador | DataRoleAcademico | DataRoleAgente;
  justification: string;
  supportingDocument: string;
}

export type DataRolePiscicultor = {
  nameProperty: string;
  department: string;
  municipality: string;
  neighborhood: string;
};

export type DataRoleComercializador = {
  nameProperty: string;
  department: string;
  municipality: string;
  neighborhood: string;
};

export type DataRoleAgente = {
  company: string;
  employment: string;
};

export type DataRoleAcademico = {
  institution: string;
  career: string;
  course: string;
};

const normalizeUserData = (rawData: any[]): User[] => {
  return rawData.map(data => ({
    id: data.id,
    name: data.user.name,
    documentType: data.user.documentType,
    documentNumber: data.user.documentNumber,
    phoneNumber: data.user.phoneNumber,
    email: data.user.email,
    password: data.user.password,
    justification: data.user.justification,
    supportingDocument: data.user.supportingDocument,
    role: data.user.role,
    DataRole: data.user.dataRole,
  }));
};

const roleEndpoints: Record<string, string> = {
  Piscicultor: `${BASE_URL}/piscicultores`,
  Comercializador: `${BASE_URL}/comercializadores`,
  Evaluador: `${BASE_URL}/evaluadores`,
  Académico: `${BASE_URL}/academicos`,
};

export function CrudUsersView() {
  const { fontScale } = useFontScale();
  const userRole = useSelector((state: RootState) => state.auth.user?.role ?? '');
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>(''); 
  const [roleOptions, setRoleOptions] = useState<string[]>([]); 

  const openModal = (user: User, index:number) => {
    setSelectedUser(user);
    setSelectedUserIndex(index);
    setModalVisible(true);
  };

  // Actualizar las opciones del menú según el rol del usuario
  useEffect(() => {
    if (userRole === 'Evaluador') {
      setRoleOptions(['Piscicultor', 'Comercializador']);
    } else if (userRole === 'Admin') {
      setRoleOptions(['Piscicultor', 'Comercializador', 'Evaluador', 'Académico']);
    }
  }, [userRole]);

  const fetchUsers = async (role: string) => {
    setLoading(true);
    try {
      const endpoint = roleEndpoints[role];
      if (!endpoint) {
        throw new Error('Rol no válido');
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Error al obtener los usuarios para el rol ${role}`);
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
    if (selectedRole) {
      fetchUsers(selectedRole);
    }
  }, [selectedRole]);

  const handleDeleteUser = async (userId: number, index: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            console.log('Eliminando usuario:', userId);
            try {
              const response = await fetch(`${BASE_URL}/users/${userId}/estado`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 'inactivo' }),
              });
  
              if (!response.ok) throw new Error('Error al intentar eliminar el usuario');
  
              Alert.alert('Éxito', 'El usuario ha sido eliminado.');
              const updatedUsers = [...users];
              updatedUsers.splice(index, 1);
              setUsers(updatedUsers);
            } catch (error) {
              console.error('Error eliminando usuario:', error);
              Alert.alert('Error', 'No se pudo eliminar el usuario.');
            }
          },
        },
      ]
    );
  };
  

  // const handleModifyUser = (index: number, updatedUser: User) => {
  //   const updatedUsers = [...users];
  //   updatedUsers[index] = updatedUser;
  //   setUsers(updatedUsers);
  // };

  if (loading) {
    return <FishLoadingScreen />; 
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedRole}
          onValueChange={(value) => setSelectedRole(value)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un rol" value="" />
          {roleOptions.map((role) => (
            <Picker.Item key={role} label={role} value={role} />
          ))}
        </Picker>
      </View>
      {/* // Aquí va el código para mostrar la tabla de usuarios */}
      <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { fontSize: 14 * fontScale }]}>Nombre</Text>
        <Text style={[styles.tableHeaderText, { fontSize: 14 * fontScale }]}>Documento</Text>
        <Text style={[styles.tableHeaderTextSmall, { fontSize: 13 * fontScale }]}>Acciones</Text>
      </View>
      {users.map((user, index) => (
        <View key={user.id} style={styles.tableRow}>
          <Text style={[styles.tableCell, { fontSize: 13 * fontScale }]}>{user.name}</Text>
          <Text style={[styles.tableCell, { fontSize: 13 * fontScale }]}>{`${user.documentType}: ${user.documentNumber}`}</Text>
          <View style={styles.tableCellSmall}>
            <TouchableOpacity style={[styles.button]} onPress={() => openModal(user, index)}>
              <Text style={[styles.buttonText, { fontSize: 20 * fontScale }]}>+</Text>
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
                <Text style={[styles.modalTitle, { fontSize: 18 * fontScale }]}>{selectedUser.name}</Text>
                <Text style={[{fontSize: 13 * fontScale }]}>{`Id: ${selectedUser.id}`}</Text>
                <Text>{`Rol: ${selectedUser.role}`}</Text>
                <Text>{`${selectedUser.documentType}: ${selectedUser.documentNumber}`}</Text>
                <Text>{`Teléfono: ${selectedUser.phoneNumber}`}</Text>
                <Text>{`Email: ${selectedUser.email}`}</Text>
                <Text>{`Justificación: ${selectedUser.justification}`}</Text>
                <Text>{`Documento de Soporte: ${selectedUser.supportingDocument}`}</Text>

                <View style={[styles.containerButton, styles.row]}>
                    {/* <TouchableOpacity
                      style={[styles.buttonModal, styles.modifyButton]}
                      // onPress={() => handleModifyUser(selectedUser!.id, selectedUserIndex!)}
                    >
                      <Text style={styles.buttonText}>Modificar</Text>
                    </TouchableOpacity> */}
                  <TouchableOpacity
                    style={[styles.buttonModal, styles.deleteButton]}
                    onPress={() => handleDeleteUser(selectedUser!.id, selectedUserIndex!)}
                  >
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.buttonModal, styles.cancelButton]}
                    // style={styles.cancelButton}
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
  container: {
    padding: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    height: 50,
    backgroundColor: '#f0f0f0',
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
  modifyButton: {
    backgroundColor: '#ffff00',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  }
});

export default CrudUsersView;