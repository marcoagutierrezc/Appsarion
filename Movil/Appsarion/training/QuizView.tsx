import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { showAlert } from '../utils/alerts';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { BASE_URL } from '../services/connection/connection';

export function QuizScreen({ navigation }: any) {
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const numberQuestions = 15;
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<{ questionId: number; answerId: number } | null>(null);
  const [answersData, setAnswersData] = useState<{ questionId: number; answerId: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchEvaluation();
  }, []);

  const fetchEvaluation = async () => {
    try {
      const response = await fetch(`${BASE_URL}/questions/random/${numberQuestions}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Error al obtener las preguntas.');

      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      showAlert('Error', 'No se pudieron obtener las preguntas.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: any) => {
    const currentQuestionId = questions[currentQuestionIndex]?.id;

    if (currentQuestionId) {
      setSelectedAnswer({ questionId: currentQuestionId, answerId: answer.id });
    } else {
      console.error('No se encontró el ID de la pregunta.');
    }
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    setAnswersData((prevAnswers) => {
      const updatedAnswers = [...prevAnswers, selectedAnswer];

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        handleSubmitAnswers(updatedAnswers);
      }

      return updatedAnswers;
    });
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
      const { id, status, score } = responseData;

      showAlert(
        'Resultados del Examen',
        `Examen: ${status}\nNota: ${score}`,
        async () => {
          await generateCertificate(userId, id);
          navigation.navigate('Prueba');
        }
      );
    } catch (error: any) {
      console.error('Error enviando respuestas:', error);
      showAlert('Error', `No se pudo enviar: ${error.message}`);
    }
  };

  const generateCertificate = async (userId: number, evaluationId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/certificates/generate/${userId}/${evaluationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const responseText = await response.text();
      console.log('Respuesta de generación de certificado:', responseText);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseText}`);
      }

      showAlert('Certificado', 'Tu certificado ha sido generado con éxito.');
    } catch (error) {
      console.error('Error generando el certificado:', error);
      showAlert('Error', 'No se pudo generar el certificado.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Cargando preguntas...</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No hay preguntas disponibles.</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1}/{questions.length}
        </Text>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQuestion?.questionText}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion?.answers?.map((answer: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer?.answerId === answer.id && { backgroundColor: 'gray' }
            ]}
            onPress={() => handleAnswerSelect(answer)}
          >
            <Text style={styles.optionText}>{answer.answerText}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, !selectedAnswer && styles.saveButtonDisabled]}
        onPress={handleNext}
        disabled={!selectedAnswer}
      >
        <Text style={styles.saveButtonText}>
          {currentQuestionIndex < questions.length - 1 ? 'SIGUIENTE' : 'FINALIZAR'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionCard: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: 'gray',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizScreen;
