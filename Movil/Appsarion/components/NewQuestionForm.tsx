import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Category } from '../training/types/quiz';

interface NewQuestionFormProps {
  categories: Category[];
  onSave: (question: {
    category: string;
    text: string;
    answers: { text: string; isCorrect: boolean }[];
  }) => void;
  onCancel: () => void;
}

export function NewQuestionForm({ categories, onSave, onCancel }: NewQuestionFormProps) {
  const [category, setCategory] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  const handleSave = () => {
    onSave({
      category,
      text: questionText,
      answers,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Categoría:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una categoría" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Pregunta:</Text>
        <TextInput
          style={styles.questionInput}
          value={questionText}
          onChangeText={setQuestionText}
          multiline
          placeholder="Escriba la pregunta aquí"
        />

        <View style={styles.imageUpload}>
          <TouchableOpacity style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Subir imagen</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Respuestas:</Text>
        {answers.map((answer, index) => (
          <View key={index} style={styles.answerContainer}>
            <TextInput
              style={styles.answerInput}
              value={answer.text}
              onChangeText={(text) => {
                const newAnswers = [...answers];
                newAnswers[index].text = text;
                setAnswers(newAnswers);
              }}
              placeholder={`Respuesta ${String.fromCharCode(65 + index)}`}
            />
            <TouchableOpacity
              style={[styles.checkbox, answer.isCorrect && styles.checkboxChecked]}
              onPress={() => {
                const newAnswers = [...answers];
                newAnswers[index].isCorrect = !answer.isCorrect;
                setAnswers(newAnswers);
              }}
            >
              {answer.isCorrect && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 40,
  },
  questionInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imageUpload: {
    height: 150,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  uploadButtonText: {
    color: '#666',
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  answerInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 12,
    marginRight: 12,
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
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});