import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {NavbarQuiz} from '../components/NavbarQuiz';
import { BASE_URL } from '../services/connection/connection';

interface Category{
  id: string;
  categoryName: string;
  createdAt: string;
  updateAt: string;
}

interface Question {
  id: string;
  categoryName: string;
  questionText: string;
  answers: Answer[];
}

interface Answer {
  id: string;
  answerText: string;
  isCorrect: boolean;
}

export default function QuizManagement({navigation}: any) {
  //Categorias
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('');
  //Preguntas
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [newQuestionModalVisible, setNewQuestionModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  //Respuestas
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [newAnswerModalVisible, setNewAnswerModalVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  

  // Función para obtener categorias
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
        );
        if (!response.ok) {
          throw new Error('Error al obtener las categorías.');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'No se pudieron obtener las categorías.');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchCategories();
    }, []);

  // Función para obtener las preguntas
   const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/questions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
        );
        if (!response.ok) {
          throw new Error('Error al obtener las preguntas.');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
        Alert.alert('Error', 'No se pudieron obtener las preguntas.');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchQuestions();
    }, []);
  

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setEditModalVisible(true);
  };

  const handleAddQuestion = () => {
    setNewQuestionModalVisible(true);
  };

  // Componente principal de lista de preguntas
  const QuestionsList = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddQuestion()}>
          <Text style={styles.addButtonText}>Agregar Pregunta +</Text>
        </TouchableOpacity>
      </View>
      {questions.map((question) => (
        <View key={question.id} style={styles.questionCard}>
          <TouchableOpacity
            style={styles.questionHeader}
            onPress={() => setExpandedQuestion(
              expandedQuestion === question.id ? null : question.id
            )}
          >
            <Text style={styles.questionTitle}>
              {`Pregunta ${question.id}`}
            </Text>
            <TouchableOpacity
              onPress={() => handleEditQuestion(question)}
              style={styles.editButton}
            >
              <Text>✏️</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {expandedQuestion === question.id && (
            <View style={styles.answersGrid}>
              <Text style={styles.questionText}>Categoría: {question.categoryName}</Text>
              <Text style={styles.questionText}>{question.questionText}</Text>
              {question.answers?.length > 0 ? (
                question.answers.map((answer, index) => (
                  <View
                    key={answer.id}
                    style={[
                      styles.answerBox,
                      answer.isCorrect && styles.correctAnswer
                    ]}
                  >
                    <Text style={styles.answerText}>
                      {`${String.fromCharCode(65 + index)}. ${answer.answerText}`}
                    </Text>
                  </View>
                ))
              ) : (
                <Text>No hay respuestas disponibles</Text>
              )}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );

  // Modal para editar pregunta
  const EditQuestionModal = ( ) => (
    <Modal
      visible={editModalVisible}
      animationType="slide"
      transparent
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Pregunta</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {selectedQuestion && (
            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Categoría:</Text>
              <Picker
                selectedValue={selectedQuestion}
                onValueChange={(itemValue) => setSelectedQuestion(itemValue)}
                style={styles.modalPicker}
              >
                <Picker.Item label={selectedQuestion.categoryName} value={selectedQuestion.categoryName} />
                {categories.map((category:any) => (
                  <Picker.Item
                    key={category.id}
                    label={category.categoryName}
                    value={category.id}
                  />
                ))}
              </Picker>

              <Text style={styles.label}>Pregunta:</Text>
              <Text style={styles.questionText}>{selectedQuestion.questionText}</Text>

              <View style={styles.answersContainer}>
                {selectedQuestion.answers.map((answer, index) => (
                  <View key={answer.id} style={styles.answerItem}>
                    <Text style={styles.answerLabel}>
                      {`${String.fromCharCode(65 + index)}. ${answer.answerText}`}
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
                <TouchableOpacity style={[styles.button, styles.editButton]}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  const NewQuestionModal = () => {
    const [questionText, setQuestionText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [answers, setAnswers] = useState([
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false },
    ]);
  
    const handleSaveQuestion = async () => {
      if (!questionText.trim() || !selectedCategory) {
        alert('Por favor completa la pregunta y selecciona una categoría.');
        return;
      }
  
      try {
        //Crear la pregunta
        const questionResponse = await fetch(`${BASE_URL}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionText,
            category: { id: selectedCategory },
          }),
        });
  
        if (!questionResponse.ok) throw new Error('Error al crear la pregunta');
  
        const questionData = await questionResponse.json();
        const questionId = questionData.id;
  
        // Filtrar respuestas vacías y enviarlas
        const validAnswers = answers.filter(ans => ans.answerText.trim());
  
        if (validAnswers.length > 0) {
          const answersResponse = await fetch(
            `${BASE_URL}/questions/${questionId}/answers`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(validAnswers),
            }
          );
  
          if (!answersResponse.ok) throw new Error('Error al agregar respuestas');
        }
  
        alert('Pregunta creada con éxito');
        fetchQuestions();
        setNewQuestionModalVisible(false);
        setQuestionText('');
        setSelectedCategory('');
        setAnswers([
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
        ]);
      } catch (error) {
        alert(error.message);
      }
    };
  
    return (
      <Modal visible={newQuestionModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Pregunta</Text>
              <TouchableOpacity onPress={() => setNewQuestionModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
  
            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Categoría:</Text>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona una categoría..." value="" />
                {categories.map((category: any) => (
                  <Picker.Item
                    key={category.id}
                    label={category.categoryName}
                    value={category.id}
                  />
                ))}
              </Picker>
  
              <Text style={styles.label}>Pregunta:</Text>
              <TextInput
                style={styles.questionInput}
                multiline
                placeholder="Escriba la pregunta aquí"
                value={questionText}
                onChangeText={setQuestionText}
              />
  
              {answers.map((answer, index) => (
                <View key={index} style={styles.answerContainer}>
                  <TextInput
                    style={styles.answerInput}
                    placeholder={`Respuesta ${String.fromCharCode(65 + index)}`}
                    value={answer.answerText}
                    onChangeText={(text) => {
                      const updatedAnswers = [...answers];
                      updatedAnswers[index].answerText = text;
                      setAnswers(updatedAnswers);
                    }}
                  />
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                      // Marca solo la respuesta seleccionada como correcta y desmarca las demás
                      const updatedAnswers = answers.map((ans, i) => ({
                        ...ans,
                        isCorrect: i === index, // Solo la respuesta seleccionada será verdadera
                      }));
                      setAnswers(updatedAnswers);
                    }}
                  >
                    <Text>{answer.isCorrect ? '✔ Correcta' : 'Respuesta correcta'}</Text>
                  </TouchableOpacity>
                </View>
              ))}
  
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveQuestion}
                >
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setNewQuestionModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <QuestionsList />
      <EditQuestionModal />
      <NewQuestionModal />
      <NavbarQuiz navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 16,
  },
  picker: {
    height: 60,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
  },
  questionCard: {
    margin: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
  },
  questionHeader: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionTitle: {
    fontWeight: 'bold',
  },
  answersGrid: {
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  answerBox: {
    width: '48%',
    margin: '1%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
  },
  correctAnswer: {
    backgroundColor: "green", // ✅ Resalta en verde si es correcta
  },
  answerText: {
    color: "black",
    fontWeight: 'bold',
  },
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
  modalPicker: {
    height: 60,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  questionText: {
    color: '#000000',
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
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    padding: 4,
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#e3f2fd',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#1976d2',
  },
});