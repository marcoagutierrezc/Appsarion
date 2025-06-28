import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TrainingView, ExamPreview, GeneralAspectsScreen, FloorAndSpondsScreen, GoodPracticesScreen, HarvestAndPostproductionScreen, NTC1443Screen } from "../training";
import QuizView from "../training/QuizView";
import crudQuiz from "../training/crudQuiz";
import { ResultsScreen } from "../training/Results";

const Stack = createNativeStackNavigator();

const TrainingStack = () => {
  return (
    <Stack.Navigator initialRouteName="TrainingHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrainingHome" component={TrainingView} />
      <Stack.Screen name="Prueba" component={ExamPreview} />
      <Stack.Screen name="Quiz" component={QuizView} />
      <Stack.Screen name="Resultados" component={ResultsScreen} />
      <Stack.Screen name="Gestión" component={crudQuiz} />
      <Stack.Screen name="Aspectos Generales" component={GeneralAspectsScreen} options={{headerShown: true, title:''}} />
      <Stack.Screen name="Suelos y Estanques" component={FloorAndSpondsScreen}  options={{headerShown: true, title:''}}/>
      <Stack.Screen name="Cosecha y Post producción" component={HarvestAndPostproductionScreen}  options={{headerShown: true, title:''}}/>
      <Stack.Screen name="Buenas Practicas" component={GoodPracticesScreen}  options={{headerShown: true, title:''}}/>
      <Stack.Screen name="NTC 1443" component={NTC1443Screen}  options={{headerShown: true, title:''}}/>
    </Stack.Navigator>
  );
};

export default TrainingStack;