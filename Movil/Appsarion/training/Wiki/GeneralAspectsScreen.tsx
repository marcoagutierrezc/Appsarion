import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AestheticText from '../../components/AestheticText';
import InlineBackHeader from '../../components/InlineBackHeader';
import { commonColors } from '../../styles/commonStyles';
import { useFontScale } from '../../context/FontScaleContext';

export function GeneralAspectsScreen(){
      const { fontScale } = useFontScale();
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            <InlineBackHeader />
            <AestheticText
              title="ASPECTOS GENERALES DE LA PISCICULTURA"
              content="La piscicultura es una actividad agrícola de gran relevancia en la producción de proteínas animales, especialmente en áreas donde el acceso a la pesca tradicional es limitado o insostenible. En este capítulo, se destacan diversos factores que influyen en la elección de las especies de peces para cultivo. La temperatura y la calidad del agua son esenciales para determinar qué especies pueden prosperar en un entorno dado. Por ejemplo, especies como la tilapia son adecuadas para climas cálidos, mientras que la trucha necesita aguas más frías y oxigenadas."
            />
            
            <View style={styles.spacer} />
            
            <AestheticText
              content="Otro punto crucial es el manejo de los sistemas acuáticos. Existen diferentes tipos de instalaciones para la piscicultura, como estanques, jaulas flotantes, y sistemas cerrados de recirculación (RAS, por sus siglas en inglés). Cada uno de estos sistemas tiene ventajas y desventajas, dependiendo de la ubicación geográfica, los recursos disponibles y el objetivo de la producción. En los estanques, por ejemplo, se debe garantizar un equilibrio adecuado entre la densidad de los peces y la capacidad de los recursos hídricos, para evitar la sobrepoblación, que puede generar problemas de calidad del agua y estrés en los peces."
            />
            
            <View style={styles.spacer} />
            
            <AestheticText
              content="Se debe destacar la importancia de la sostenibilidad en la piscicultura. La contaminación por nutrientes, como el nitrógeno y el fósforo, es uno de los mayores desafíos en la industria acuícola. Para mitigar estos efectos, se promueven prácticas como el uso de sistemas de filtración avanzados y la integración de sistemas de cultivo de plantas acuáticas que absorban estos nutrientes."
            />
          </ScrollView>
        </SafeAreaView>
      );
    };
    
export default GeneralAspectsScreen;

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: commonColors.background,
      },
      scrollView: {
        flex: 1,
      },
      content: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 24,
      },
      spacer: {
        height: 20,
      },
    });