import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { NavbarQuiz } from '../components/NavbarQuiz';

const CategoryBox = ({ title, icon, onPress }:any) => (
  <TouchableOpacity style={styles.categoryBox} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <Text style={styles.categoryTitle}>{title}</Text>
  </TouchableOpacity>
);

export function TrainingView({ navigation }: any) {
  const userName = useSelector((state: RootState) => state.auth.user.name);

  const categories = [
    { title: 'ASPECTOS GENERALES DE LA PISCICULTURA', icon: '❗', route: 'Aspectos Generales' },
    { title: 'SUELOS Y ESTANQUES"', icon: '🏞️', route: 'Suelos y Estanques' },
    { title: 'COSECHA Y POST PRODUCCIÓN', icon: '🐟', route: 'Cosecha y Post producción' },
    { title: 'BUENAS PRACTICAS DE MANEJO', icon: '📜', route: 'Buenas Practicas' },
    { title: 'NTC 1443', icon: '📝', route: 'NTC 1443' }
  ]
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.greeting}>Hola! 👋</Text>
          <Text style={styles.welcomeText}>{`Bienvenido ${userName}`}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        
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
    backgroundColor: '#34495e',
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 14,
    color: '#4199b5',
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4199b5',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 8,
  },
  categoryBox: {
    backgroundColor: '#a6b5c4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 8,
  },
  icon: {
    fontSize: 32,
  },
  categoryTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center'
  }
});