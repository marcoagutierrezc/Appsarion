import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login, RegisterDataView, RegisterRoleDataView, RegisterConfirmationView, PasswordRecoveryView } from '../auth';
import SoportePQRView from "../auth/SupportPQRView";

const AuthStack = createNativeStackNavigator();

function Auth() {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <AuthStack.Screen name="Recuperar Contraseña" component={PasswordRecoveryView} />
            <AuthStack.Screen name="Registro" component={RegisterDataView} />
            <AuthStack.Screen name="Registro - Datos del Rol" component={RegisterRoleDataView} />
            <AuthStack.Screen name="Confirmacion de Registro" component={RegisterConfirmationView} />
            <AuthStack.Screen name="SoportePQR" component={SoportePQRView} />
        </AuthStack.Navigator>
    );
}

export default Auth;