import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal,} from 'react-native';
import { useFontScale } from '../context/FontScaleContext';

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

const UserTable = ({ }) => {
  const { fontScale } = useFontScale();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openModal = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Nombre</Text>
        <Text style={styles.tableHeaderText}>Documento</Text>
        <Text style={styles.tableHeaderTextSmall}>Acciones</Text>
      </View>
      {users.map((user:any) => (
        <View key={user.id} style={styles.tableRow}>
          <Text style={styles.tableCell}>{user.name}</Text>
          <Text style={styles.tableCell}>{`${user.documentType}: ${user.documentNumber}`}</Text>
          <View style={styles.tableCellSmall}>
            <TouchableOpacity style={[styles.button]} onPress={() => openModal(user)}>
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

                <View style={[styles.containerButton, styles.row]}>
                    <TouchableOpacity
                      style={[styles.buttonModal, styles.modifyButton]}
                    >
                      <Text style={styles.buttonText}>Modificar</Text>
                    </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.buttonModal, styles.deleteButton]}
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
  );
};

export default UserTable;

const styles = StyleSheet.create({
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
    padding: 2,
    backgroundColor: '#007BFF',
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
    backgroundColor: '#28a745',
  },
  verifyButton: {
    backgroundColor: '#28a745',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
});
