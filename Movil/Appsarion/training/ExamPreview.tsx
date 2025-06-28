import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { NavbarQuiz } from '../components/NavbarQuiz';

const examInfo = {
  totalQuestions: 15,
  categories: ['ASPECTOS GENERALES DE LA PISCICULTURA','SUELOS Y ESTANQUES','COSECHA Y POST PRODUCCIÓN','BUENAS PRACTICAS DE MANEJO', 'NTC 1443'],
  timeLimit: 30, // en minutos
};


export function ExamPreview({navigation}:any) {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Examen de buenas prácticas piscicolas y conocimiento de la norma NTC 1443</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Información del Examen:</Text>
          <Text style={styles.infoText}>• Total de preguntas: {examInfo.totalQuestions}</Text>
          <Text style={styles.infoText}>• Categorías: {examInfo.categories.join(', ')}</Text>
          <Text style={styles.infoText}>• Tiempo límite: {examInfo.timeLimit} minutos</Text>
        </View>

        <Text style={styles.readyText}>¿Estás listo para comenzar?</Text>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('Quiz')}
        >
          <Text style={styles.startButtonText}>COMENZAR EXAMEN</Text>
        </TouchableOpacity>
      </View>
      <NavbarQuiz navigation={navigation} />
    </SafeAreaView>
  );
}

export default ExamPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4199b5',
    marginBottom: 20,
    textAlign: 'center'
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  readyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#90EE90',
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  startButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});