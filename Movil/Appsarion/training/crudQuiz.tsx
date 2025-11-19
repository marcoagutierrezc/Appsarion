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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import {NavbarQuiz} from '../components/NavbarQuiz';
import { BASE_URL } from '../services/connection/connection';
import { commonColors, commonStyles } from '../styles/commonStyles';
import { useFontScale } from '../context/FontScaleContext';

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
  const { fontScale } = useFontScale();
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
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerSection}>
        <Text style={styles.sectionTitle}>Gestión de Preguntas</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddQuestion()}>
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={commonColors.primary} />
        </View>
      )}

      {questions.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="file-document-outline" size={48} color={commonColors.textSecondary} />
          <Text style={[styles.emptyText, { fontSize: 14 * fontScale }]}>No hay preguntas registradas</Text>
        </View>
      )}

      {questions.map((question) => (
        <View key={question.id} style={styles.questionCard}>
          <TouchableOpacity
            style={styles.questionHeader}
            onPress={() => setExpandedQuestion(
              expandedQuestion === question.id ? null : question.id
            )}
          >
            <View style={styles.questionTitleContainer}>
              <MaterialCommunityIcons name={expandedQuestion === question.id ? 'chevron-down' : 'chevron-right'} size={24} color={commonColors.primary} />
              <View>
                <Text style={[styles.questionTitle, { fontSize: 14 * fontScale }]}>{`Pregunta ${question.id}`}</Text>
                <Text style={[styles.categoryBadge, { fontSize: 12 * fontScale }]}>{question.categoryName}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleEditQuestion(question)}
              style={styles.editIconButton}
            >
              <MaterialCommunityIcons name="pencil" size={20} color={commonColors.primary} />
            </TouchableOpacity>
          </TouchableOpacity>

          {expandedQuestion === question.id && (
            <View style={styles.answersGrid}>
              <Text style={[styles.questionContent, { fontSize: 13 * fontScale }]}>{question.questionText}</Text>
              {question.answers?.length > 0 ? (
                <View style={styles.answersContainer}>
                  {question.answers.map((answer, index) => (
                    <View
                      key={answer.id}
                      style={[
                        styles.answerBox,
                        answer.isCorrect && styles.correctAnswer
                      ]}
                    >
                      <View style={styles.answerRow}>
                        <Text style={[styles.answerIndex, { fontSize: 12 * fontScale }]}>{String.fromCharCode(65 + index)}</Text>
                        <Text style={[styles.answerText, answer.isCorrect && styles.correctAnswerText]}>
                          {answer.answerText}
                        </Text>
                        {answer.isCorrect && <MaterialCommunityIcons name="check-circle" size={20} color={commonColors.success} style={{ marginLeft: 8 }} />}
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[styles.noAnswersText, { fontSize: 13 * fontScale }]}>No hay respuestas disponibles</Text>
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
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { fontSize: 18 * fontScale }]}>Editar Pregunta</Text>
            <TouchableOpacity 
              onPress={() => setEditModalVisible(false)}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons name="close" size={24} color={commonColors.textPrimary} />
            </TouchableOpacity>
          </View>

          {selectedQuestion && (
            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalLabel, { fontSize: 13 * fontScale }]}>Categoría:</Text>
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

                <Text style={[styles.modalLabel, { fontSize: 13 * fontScale }]}>Pregunta:</Text>
              <Text style={[styles.selectedQuestionText, { fontSize: 13 * fontScale }]}>{selectedQuestion.questionText}</Text>

              <Text style={[styles.modalLabel, { fontSize: 13 * fontScale }]}>Respuestas:</Text>
              <View style={styles.answersContainer}>
                {selectedQuestion.answers.map((answer, index) => (
                  <View key={answer.id} style={styles.answerItemRow}>
                    <Text style={[styles.answerItemLabel, { fontSize: 12 * fontScale }]}>
                      {`${String.fromCharCode(65 + index)}. ${answer.answerText}`}
                    </Text>
                    <View style={[
                      styles.checkbox,
                      answer.isCorrect && styles.checkboxChecked,
                    ]}>
                      {answer.isCorrect && <MaterialCommunityIcons name="check" size={16} color="#fff" />}
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.editActionButton]}>
                  <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
                  <Text style={[styles.modalButtonText, { fontSize: 13 * fontScale }]}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.deleteActionButton]}>
                  <MaterialCommunityIcons name="trash-can" size={18} color="#fff" />
                  <Text style={[styles.modalButtonText, { fontSize: 13 * fontScale }]}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
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
      } catch (error: any) {
        alert((error as Error).message);
      }
    };
  
    return (
      <Modal visible={newQuestionModalVisible} animationType="slide" transparent>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: 18 * fontScale }]}>Nueva Pregunta</Text>
              <TouchableOpacity 
                onPress={() => setNewQuestionModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color={commonColors.textPrimary} />
              </TouchableOpacity>
            </View>
  
            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalLabel, { fontSize: 13 * fontScale }]}>Categoría:</Text>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={styles.modalPicker}
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
  
              <Text style={[styles.modalLabel, { fontSize: 13 * fontScale }]}>Pregunta:</Text>
              <TextInput
                style={[styles.textInput, { minHeight: 100, textAlignVertical: 'top' }]}
                multiline
                placeholder="Escriba la pregunta aquí"
                placeholderTextColor={commonColors.textSecondary}
                value={questionText}
                onChangeText={setQuestionText}
              />
  
              {answers.map((answer, index) => (
                <View key={index} style={styles.newAnswerContainer}>
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    placeholder={`Respuesta ${String.fromCharCode(65 + index)}`}
                    placeholderTextColor={commonColors.textSecondary}
                    value={answer.answerText}
                    onChangeText={(text) => {
                      const updatedAnswers = [...answers];
                      updatedAnswers[index].answerText = text;
                      setAnswers(updatedAnswers);
                    }}
                  />
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      answer.isCorrect && styles.checkboxChecked,
                    ]}
                    onPress={() => {
                      const updatedAnswers = answers.map((ans, i) => ({
                        ...ans,
                        isCorrect: i === index,
                      }));
                      setAnswers(updatedAnswers);
                    }}
                  >
                    {answer.isCorrect && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
                  </TouchableOpacity>
                </View>
              ))}
  
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.editActionButton]}
                  onPress={handleSaveQuestion}
                >
                  <MaterialCommunityIcons name="check" size={18} color="#fff" />
                  <Text style={[styles.modalButtonText, { fontSize: 13 * fontScale }]}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteActionButton]}
                  onPress={() => setNewQuestionModalVisible(false)}
                >
                  <MaterialCommunityIcons name="close" size={18} color="#fff" />
                  <Text style={[styles.modalButtonText, { fontSize: 13 * fontScale }]}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
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
    backgroundColor: commonColors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 100,
  },

  /* Header Section */
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: commonColors.textPrimary,
  },
  addButton: {
    backgroundColor: commonColors.success,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  /* Loading & Empty States */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: commonColors.textSecondary,
  },

  /* Question Card */
  questionCard: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: commonColors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  questionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  questionTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: commonColors.textPrimary,
  },
  categoryBadge: {
    fontSize: 12,
    color: commonColors.textSecondary,
    fontWeight: '500',
  },
  editIconButton: {
    padding: 4,
  },

  /* Answers Grid */
  answersGrid: {
    padding: 12,
    backgroundColor: commonColors.background,
  },
  questionContent: {
    fontSize: 15,
    fontWeight: '600',
    color: commonColors.textPrimary,
    marginBottom: 12,
    lineHeight: 22,
  },
  answersContainer: {
    gap: 8,
  },
  answerBox: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 10,
  },
  correctAnswer: {
    backgroundColor: '#f0f8f0',
    borderColor: commonColors.success,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  answerIndex: {
    fontSize: 13,
    fontWeight: '700',
    color: commonColors.primary,
    backgroundColor: '#f0f5ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 30,
    textAlign: 'center',
  },
  answerText: {
    fontSize: 14,
    color: commonColors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  correctAnswerText: {
    color: commonColors.success,
    fontWeight: '600',
  },
  noAnswersText: {
    fontSize: 14,
    color: commonColors.textSecondary,
    fontStyle: 'italic',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: commonColors.cardBackground,
    marginTop: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: commonColors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: commonColors.textPrimary,
    marginBottom: 8,
  },
  modalPicker: {
    height: 60,
    marginBottom: 12,
  },
  selectedQuestionText: {
    fontSize: 14,
    color: commonColors.textPrimary,
    marginBottom: 12,
    lineHeight: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
  },
  answerItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginBottom: 8,
  },
  answerItemLabel: {
    fontSize: 13,
    color: commonColors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: commonColors.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: commonColors.primary,
    borderColor: commonColors.primary,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 0,
    marginBottom: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  editActionButton: {
    backgroundColor: commonColors.primary,
  },
  deleteActionButton: {
    backgroundColor: commonColors.danger,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  /* Additional Styles for New Question Modal */
  textInput: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: commonColors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: commonColors.textPrimary,
  },
  newAnswerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
});