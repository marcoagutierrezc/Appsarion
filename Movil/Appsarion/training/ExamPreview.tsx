import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavbarQuiz } from '../components/NavbarQuiz';
import { commonColors, commonStyles } from '../styles/commonStyles';
import { useFontScale } from '../context/FontScaleContext';

const examInfo = {
  totalQuestions: 15,
  categories: ['Aspectos Generales', 'Suelos y Estanques', 'Cosecha y Post Producción', 'Buenas Prácticas', 'NTC 1443'],
  timeLimit: 30,
};

export function ExamPreview({navigation}:any) {
  const { fontScale } = useFontScale();
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Icon Section */}
        <View style={styles.iconSection}>
          <View style={styles.iconBadge}>
            <MaterialCommunityIcons name="clipboard-text" size={48} color={commonColors.primary} />
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { fontSize: 22 * fontScale }]}>Examen de Piscicultura</Text>
        <Text style={[styles.subtitle, { fontSize: 14 * fontScale }]}>Prueba tus conocimientos sobre NTC 1443</Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItemWrapper}>
              <MaterialCommunityIcons name="help-circle" size={24} color={commonColors.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.infoNumber, { fontSize: 20 * fontScale }]}>{examInfo.totalQuestions}</Text>
              <Text style={[styles.infoLabel, { fontSize: 12 * fontScale }]}>Preguntas</Text>
            </View>
            <View style={styles.infoItemWrapper}>
              <MaterialCommunityIcons name="clock" size={24} color={commonColors.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.infoNumber, { fontSize: 20 * fontScale }]}>{examInfo.timeLimit}</Text>
              <Text style={[styles.infoLabel, { fontSize: 12 * fontScale }]}>Minutos</Text>
            </View>
            <View style={styles.infoItemWrapper}>
              <MaterialCommunityIcons name="folder-multiple" size={24} color={commonColors.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.infoNumber, { fontSize: 20 * fontScale }]}>5</Text>
              <Text style={[styles.infoLabel, { fontSize: 12 * fontScale }]}>Temas</Text>
            </View>
          </View>

          <View style={commonStyles.divider} />

          <Text style={[styles.categoriesTitle, { fontSize: 16 * fontScale }]}>Temas a Evaluar:</Text>
          {examInfo.categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={commonColors.success} />
              <Text style={[styles.categoryText, { fontSize: 13 * fontScale }]}>{category}</Text>
            </View>
          ))}
        </View>

        {/* Requirements */}
        <View style={styles.requirementsCard}>
          <Text style={[styles.requirementsTitle, { fontSize: 16 * fontScale }]}>✓ Requisitos</Text>
          <View style={styles.requirementItem}>
            <MaterialCommunityIcons name="alert-circle" size={16} color={commonColors.warning} />
            <Text style={[styles.requirementText, { fontSize: 13 * fontScale }]}>Necesitas calificar al menos el 70% para aprobar</Text>
          </View>
        </View>

        {/* Ready Text */}
        <Text style={[styles.readyText, { fontSize: 16 * fontScale }]}>¿Estás listo para comenzar?</Text>

        {/* Start Button */}
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('Quiz')}
        >
          <MaterialCommunityIcons name="play-circle" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={[styles.startButtonText, { fontSize: 14 * fontScale }]}>Comenzar Examen</Text>
        </TouchableOpacity>
      </ScrollView>
      <NavbarQuiz navigation={navigation} />
    </SafeAreaView>
  );
}

export default ExamPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },

  /* Icon Section */
  iconSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f5ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Title */
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: commonColors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: commonColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
    marginTop: 0,
  },
  /* Info Card */
  infoCard: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  infoItemWrapper: {
    alignItems: 'center',
  },
  infoNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: commonColors.primary,
  },
  infoLabel: {
    fontSize: 12,
    color: commonColors.textSecondary,
    marginTop: 0,
  },
  categoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: commonColors.textPrimary,
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  categoryText: {
    fontSize: 13,
    color: commonColors.textPrimary,
    fontWeight: '500',
  },

  /* Requirements Card */
  requirementsCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc107',
    padding: 14,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  requirementText: {
    fontSize: 13,
    color: '#856404',
    flex: 1,
    lineHeight: 18,
  },

  /* Ready Text */
  readyText: {
    fontSize: 16,
    fontWeight: '600',
    color: commonColors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },

  /* Start Button */
  startButton: {
    backgroundColor: commonColors.success,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: commonColors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  startButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});