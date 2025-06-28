import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import AestheticText from '../../components/AestheticText';

export function FloorAndSpondsScreen(){
      return (
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <AestheticText
              title="SUELOS Y ESTANQUES"
              content="El suelo juega un papel crítico en la piscicultura porque determina la capacidad de los estanques para retener agua y minimizar la filtración hacia el suelo circundante, lo que puede ser costoso y difícil de controlar. En la construcción de estanques, es esencial considerar la geología del sitio. Los suelos arcillosos son ideales, ya que tienen una alta capacidad de impermeabilización. Sin embargo, en zonas donde estos suelos no están disponibles, se pueden utilizar capas de material sintético o geomembranas para mejorar la retención de agua."
            />
            
            <View style={styles.spacer} />
            
            <AestheticText
              content="La profundidad del estanque también es importante. Un estanque más profundo permite una mayor estabilización de la temperatura del agua y un mejor manejo del oxígeno disuelto, lo cual es fundamental para la salud de los peces. Además, un diseño adecuado debe incluir un sistema de drenaje eficiente para evitar la acumulación de sedimentos y residuos orgánicos, que pueden alterar la calidad del agua y favorecer el crecimiento de patógenos."
            />
            
            <View style={styles.spacer} />
            
            <AestheticText
              content="El control de la calidad del agua es una tarea continua. Los parámetros a monitorear incluyen el pH, la temperatura, el nivel de oxígeno disuelto, la salinidad, y la concentración de amoníaco. Las técnicas de filtración de agua como la biofiltración, la aeración y el uso de plantas acuáticas son fundamentales para mantener estos parámetros dentro de los niveles ideales."
            />
          </View>
        </ScrollView>
      );
    };
    
export default FloorAndSpondsScreen;

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