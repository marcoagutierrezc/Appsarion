import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import AestheticText from '../../components/AestheticText';

export function GoodPracticesScreen(){
    return (
    <ScrollView style={styles.container}>
        <View style={styles.content}>
        <AestheticText
            title="BUENAS PRÁCTICAS DE MANEJO"
            content="Las Buenas Prácticas de Manejo (BPM) son fundamentales para garantizar el bienestar de los peces y la sostenibilidad de la producción. Este capítulo aborda el control de enfermedades, la alimentación adecuada, la bioseguridad y la gestión ambiental. La prevención de enfermedades en los sistemas acuícolas es clave. Esto implica el monitoreo regular de los peces para detectar signos de enfermedades, la implementación de medidas de bioseguridad estrictas y el uso responsable de medicamentos y antibióticos."
        />
        
        <View style={styles.spacer} />
        
        <AestheticText
            content="En cuanto a la alimentación, se recomienda el uso de dietas balanceadas que cubran las necesidades nutricionales de los peces y optimicen su crecimiento. Las estrategias de manejo de los residuos también son fundamentales. El tratamiento adecuado de las aguas residuales y la reutilización de los nutrientes son prácticas esenciales para reducir el impacto ambiental de la piscicultura."
        />
        
        <View style={styles.spacer} />
        
        <AestheticText
            content="La implementación de BPM no solo mejora la eficiencia de la producción, sino que también promueve una piscicultura responsable, respetuosa con el medio ambiente y la salud pública."
        />
        </View>
    </ScrollView>
    );
};
    
export default GoodPracticesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#34495e',
    },
    content: {
        padding: 20,
    },
    spacer: {
        height: 20, 
    },
});