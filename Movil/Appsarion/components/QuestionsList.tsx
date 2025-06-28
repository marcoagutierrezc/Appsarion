import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Question, Category } from '../training/types/quiz';

interface QuestionsListProps {
  questions: Question[];
  categories: Category[];
  onAddQuestion: () => void;
  onEditQuestion: (question: Question) => void;
}

export function QuestionsList({ questions, categories, onAddQuestion, onEditQuestion }: QuestionsListProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.categoryPicker}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={setSelectedCategory}
            style={styles.picker}
          >
            <Picker.Item label="Categorías" value="" />
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.id} />
            ))}
          </Picker>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={onAddQuestion}>
          <Text style={styles.addButtonText}>Agregar +</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.questionsList}>
        {questions
          .filter(q => !selectedCategory || q.category === selectedCategory)
          .map((question) => (
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
                  style={styles.editButton}
                  onPress={() => onEditQuestion(question)}
                >
                  <Text>✏️</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              {expandedQuestion === question.id && (
                <View style={styles.answersGrid}>
                  {question.answers.map((answer, index) => (
                    <View key={answer.id} style={styles.answerBox}>
                      <Text style={styles.answerText}>
                        {`${String.fromCharCode(65 + index)}. ${answer.text}`}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.activeTabText}>Gestión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Prueba</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Resultados</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryPicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 16,
  },
  picker: {
    height: 40,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
  },
  questionsList: {
    flex: 1,
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
  editButton: {
    padding: 4,
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
  answerText: {
    fontSize: 14,
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