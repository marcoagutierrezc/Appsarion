import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Question, Category } from '../training/types/quiz';
import { useFontScale } from '../context/FontScaleContext';

interface QuestionEditModalProps {
  visible: boolean;
  question: Question | null;
  categories: Category[];
  onClose: () => void;
  onSave: (question: Question) => void;
  onDelete: (questionId: string) => void;
}

export function QuestionEditModal({
  visible,
  question,
  categories,
  onClose,
  onSave,
  onDelete,
}: QuestionEditModalProps) {
  const { fontScale } = useFontScale();
  if (!question) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Pregunta</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.label}>Categoría:</Text>
            <Picker
              selectedValue={question.category}
              style={styles.categoryPicker}
              onValueChange={(value) => {
                // Handle category change
              }}
            >
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
            </Picker>

            <Text style={styles.label}>Pregunta:</Text>
            <Text style={styles.questionText}>{question.text}</Text>

            <View style={styles.answersContainer}>
              {question.answers.map((answer, index) => (
                <View key={answer.id} style={styles.answerItem}>
                  <Text style={styles.answerLabel}>
                    {`${String.fromCharCode(65 + index)}. ${answer.text}`}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      answer.isCorrect && styles.checkboxChecked,
                    ]}
                  >
                    {answer.isCorrect && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => {
                  // Handle edit
                }}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => onDelete(question.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  modalBody: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryPicker: {
    height: 40,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  questionText: {
    fontSize: 16,
    marginBottom: 16,
  },
  answersContainer: {
    marginBottom: 16,
  },
  answerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  answerLabel: {
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});