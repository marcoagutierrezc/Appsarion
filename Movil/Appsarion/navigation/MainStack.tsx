import 'react-native-gesture-handler';
import React from "react";
import { Alert, TouchableOpacity, Platform, Text } from 'react-native';
import { showAlert } from '../utils/alerts';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logOut } from '../store/slices/auth/authSlice';
import { Home, VerificationUsersView, UsersView, RegisterLotDataView, EditFishLotView, RegisterRoleDataNextLoginView, CrudFishLotView, EvaluationDataBasicView, EvaluationDataView, EditEvaluationView } from '../views';
import TrainingStack from './TrainingStack';
import { useFontScale } from '../context/FontScaleContext';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const infoRole = useSelector((state: RootState) => state.auth.user?.infoRole ?? null);
  const userRole = useSelector((state: RootState) => state.auth.user?.role ?? '');

  return (
    <Stack.Navigator 
  screenOptions={{ headerShown: true }} 
  initialRouteName={userRole === 'Admin' ? "Drawer" : infoRole ? "Drawer" : "Registro Rol"}
    >
      <Stack.Screen name="Drawer" component={DrawerNavigation} options={{headerShown: false}}/>
      <Stack.Screen name="Registro Rol" component={RegisterRoleDataNextLoginView} />
      <Stack.Screen name="Registrar Lote" component={RegisterLotDataView} />
      <Stack.Screen name="Editar Lote" component={EditFishLotView} />
      <Stack.Screen name="Evaluacion - Datos Basicos" component={EvaluationDataBasicView} />
      <Stack.Screen name="Evaluacion" component={EvaluationDataView} />
      <Stack.Screen name="Editar Evaluacion" component={EditEvaluationView} />
    </Stack.Navigator>
  );
};

const Drawer = createDrawerNavigator();
const LogoutScreen = () => null;

const DrawerNavigation = ({ navigation }:any) => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.auth.user?.role ?? '');
  const { fontScale } = useFontScale();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
      if (confirm) {
        dispatch(logOut());
      }
    } else {
      Alert.alert(
        "Cerrar sesión",
        "¿Estás seguro de que deseas cerrar sesión?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Cerrar sesión", onPress: () => dispatch(logOut()) },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      screenOptions={{
        drawerLabelStyle: { fontSize: 14 * fontScale },
        drawerContentStyle: { paddingTop: 10 },
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      {userRole === "Admin" && 
        <Drawer.Screen name="Verificación" component={VerificationUsersView} />}
      {userRole === "Admin" && 
        <Drawer.Screen name="Usuarios" component={UsersView} />}
      {(userRole === "Admin" || userRole === "Piscicultor" || userRole === "Comercializador" || userRole === "Evaluador" || userRole === "Academico" || userRole === "Académico") && (
        <Drawer.Screen name="Lotes" component={CrudFishLotView} />
      )}
      <Drawer.Screen
        name="Módulo de Capacitación"
        component={TrainingStack}
      />
      <Drawer.Screen
        name="Cerrar sesión"
        component={LogoutScreen}
        options={{
          drawerLabel: "Cerrar sesión",
          headerShown: false,
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainStack;