import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { NavbarQuiz } from '../components/NavbarQuiz';
import { commonColors, commonStyles } from '../styles/commonStyles';

const CategoryBox = ({ title, icon, onPress }:any) => (
  <TouchableOpacity style={styles.categoryBox} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.categoryContent}>
      <View style={styles.categoryIconContainer}>
        <MaterialCommunityIcons name={icon} size={28} color={commonColors.primary} />
      </View>
      <Text style={styles.categoryTitle}>{title}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={24} color={commonColors.primary} />
  </TouchableOpacity>
);

export function TrainingView({ navigation }: any) {
  const userName = useSelector((state: RootState) => state.auth.user?.name) ?? '';

  const categories = [
    { title: 'Aspectos Generales de Piscicultura', icon: 'information-outline', route: 'Aspectos Generales' },
    { title: 'Suelos y Estanques', icon: 'earth', route: 'Suelos y Estanques' },
    { title: 'Cosecha y Post Producción', icon: 'fish', route: 'Cosecha y Post producción' },
    { title: 'Buenas Prácticas de Manejo', icon: 'check-circle-outline', route: 'Buenas Practicas' },
    { title: 'NTC 1443', icon: 'file-document-outline', route: 'NTC 1443' }
  ]
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.greetingBox}>
          <MaterialCommunityIcons name="hand-wave" size={24} color={commonColors.primary} style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>¡Hola {userName}!</Text>
            <Text style={styles.welcomeText}>Continúa aprendiendo sobre piscicultura</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Categorías de Aprendizaje</Text>
        
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <CategoryBox
              key={index}
              title={category.title}
              icon={category.icon}
              onPress={() => navigation.navigate(category.route)}
            />
          ))}
        </View>
      </ScrollView>

      <NavbarQuiz navigation={navigation} />
    </SafeAreaView>
  );
}

export default TrainingView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  greetingBox: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '700',
    color: commonColors.textPrimary,
    marginBottom: 2,
  },
  welcomeText: {
    fontSize: 13,
    color: commonColors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: commonColors.textPrimary,
    marginBottom: 12,
  },
  categoriesContainer: {
    gap: 12,
  },
  categoryBox: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0f5ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 14,
    color: commonColors.textPrimary,
    fontWeight: '600',
    flex: 1,
  }
});