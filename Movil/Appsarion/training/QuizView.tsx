import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { showAlert } from '../utils/alerts';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BASE_URL } from '../services/connection/connection';
import { commonColors, commonStyles } from '../styles/commonStyles';

export function QuizScreen({ navigation }: any) {
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const numberQuestions = 15;
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<{ questionId: number; answerId: number } | null>(null);
  const [answersData, setAnswersData] = useState<{ questionId: number; answerId: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let isActive = true;
    const run = async () => {
      try {
        await fetchEvaluation(isActive);
      } catch {}
    };
    run();
    return () => { isActive = false; };
  }, []);

  const fetchEvaluation = async (isActive?: boolean) => {
    try {
      const response = await fetch(`${BASE_URL}/questions/random/${numberQuestions}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Error al obtener las preguntas.');

      const data = await response.json();
      if (isActive !== false) setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      showAlert('Error', 'No se pudieron obtener las preguntas.');
    } finally {
      if (isActive !== false) setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: any) => {
    if (isSubmitting) return;
    const currentQuestionId = questions[currentQuestionIndex]?.id;

    if (currentQuestionId) {
      setSelectedAnswer({ questionId: currentQuestionId, answerId: answer.id });
    } else {
      console.error('No se encontró el ID de la pregunta.');
    }
  };

  const handleNext = async () => {
    if (!selectedAnswer || isSubmitting) return;

    const isLast = currentQuestionIndex >= questions.length - 1;
    const updatedAnswers = [...answersData, selectedAnswer];
    setAnswersData(updatedAnswers);

    if (!isLast) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      return;
    }

    try {
      setIsSubmitting(true);
      await handleSubmitAnswers(updatedAnswers);
    } catch (e) {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnswers = async (answers: { questionId: number; answerId: number }[]) => {
    const payload = {
      userId,
      userAnswers: answers,
    };

    console.log('Payload enviado:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`${BASE_URL}/evaluations/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log('Respuesta cruda del servidor:', responseText);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseText}`);
      }

      const responseData = JSON.parse(responseText);
      const { id, status, score, results } = responseData;

      navigation.navigate('Resumen', {
        score,
        status,
        evaluationId: id,
        results,
        questions,
      });
      setIsSubmitting(false);
    } catch (error: any) {
      console.error('Error enviando respuestas:', error);
      showAlert('Error', `No se pudo enviar: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={commonColors.primary} />
          <Text style={styles.loadingText}>Cargando preguntas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContent}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={commonColors.warning} />
          <Text style={styles.emptyText}>No hay preguntas disponibles.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Pregunta {currentQuestionIndex + 1} de {questions.length}</Text>
            <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
          </View>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <View style={styles.questionIcon}>
            <MaterialCommunityIcons name="help-circle" size={24} color={commonColors.primary} />
          </View>
          <Text style={styles.questionText}>{currentQuestion?.questionText}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsLabel}>Selecciona una respuesta:</Text>
          {currentQuestion?.answers?.map((answer: any, index: number) => {
            const isSelected = selectedAnswer?.answerId === answer.id;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected
                ]}
                onPress={() => handleAnswerSelect(answer)}
                disabled={isSubmitting}
              >
                <View style={[
                  styles.optionCheckbox,
                  isSelected && styles.optionCheckboxSelected
                ]}>
                  {isSelected && (
                    <MaterialCommunityIcons name="check" size={16} color="#fff" />
                  )}
                </View>
                <Text style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected
                ]}>
                  {answer.answerText}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color={currentQuestionIndex === 0 ? commonColors.border : commonColors.primary} />
          <Text style={styles.secondaryButtonText}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!selectedAnswer || isSubmitting) && styles.primaryButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!selectedAnswer || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.primaryButtonText}>Calificando...</Text>
            </>
          ) : (
            <>
              <Text style={styles.primaryButtonText}>
                {currentQuestionIndex < questions.length - 1 ? 'Siguiente' : 'Finalizar'}
              </Text>
              <MaterialCommunityIcons name={currentQuestionIndex < questions.length - 1 ? 'arrow-right' : 'check-circle'} size={20} color="#fff" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 120,
  },

  /* Loading State */
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: commonColors.textSecondary,
    marginTop: 0,
  },

  /* Empty State */
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: commonColors.textPrimary,
    marginTop: 0,
  },

  /* Progress Section */
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: commonColors.textPrimary,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: commonColors.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: commonColors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: commonColors.primary,
    borderRadius: 4,
  },

  /* Question Card */
  questionCard: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 16,
    marginBottom: 24,
  },
  questionIcon: {
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: commonColors.textPrimary,
    lineHeight: 26,
  },

  /* Options */
  optionsContainer: {
    marginBottom: 24,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: commonColors.textSecondary,
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: commonColors.border,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#f0f5ff',
    borderColor: commonColors.primary,
  },
  optionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: commonColors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCheckboxSelected: {
    backgroundColor: commonColors.primary,
    borderColor: commonColors.primary,
  },
  optionText: {
    fontSize: 14,
    color: commonColors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: commonColors.primary,
  },

  /* Button Container */
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: commonColors.background,
    borderTopWidth: 1,
    borderTopColor: commonColors.border,
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: commonColors.primary,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: commonColors.primary,
  },
  primaryButton: {
    flex: 1.2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: commonColors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: commonColors.border,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default QuizScreen;
