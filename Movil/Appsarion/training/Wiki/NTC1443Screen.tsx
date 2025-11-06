"use client"

import { useRef } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import AestheticText from "../../components/AestheticText"
import InlineBackHeader from "../../components/InlineBackHeader"
import DragDropExercise from "../../components/DragDropExercise"
import { commonColors } from '../../styles/commonStyles'

export function NTC1443Screen() {
  const scrollViewRef = useRef<ScrollView>(null)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <InlineBackHeader />
          <AestheticText
            title="NORMA NTC 1443"
            content="La Norma Técnica Colombiana NTC 1443 establece los requisitos de calidad e inocuidad para el pescado entero, medallones, filetes y trozos, ya sean frescos (refrigerados) o congelados, destinados al consumo humano. Su objetivo principal es garantizar la seguridad y calidad del producto a lo largo de toda la cadena de producción, manipulación y comercialización."
          />
          <View style={styles.spacer} />
          <AestheticText
            title="Aspectos regulados por la NTC 1443"
            content="La norma cubre aspectos fundamentales en la piscicultura, incluyendo la selección de especies, el diseño de las instalaciones y la calidad del agua en los estanques. Estos factores son esenciales para asegurar que los peces crezcan en condiciones óptimas y que el producto final cumpla con los estándares exigidos. Para garantizar la calidad del agua, la norma enfatiza en parámetros físicos y químicos, como el nivel de oxígeno disuelto, el cual es clave para la salud de los peces. Un nivel inadecuado puede afectar su desarrollo y aumentar la susceptibilidad a enfermedades."
          />
          <View style={styles.spacer} />
          <AestheticText
            title="Manejo de residuos en piscicultura"
            content="Uno de los principios de la norma es la sostenibilidad en la producción acuícola. Por ello, establece que los residuos generados en la piscicultura deben ser reaprovechados de manera responsable, como su uso en fertilización agrícola. Esto contribuye a una gestión ambientalmente amigable, evitando la contaminación y promoviendo un ciclo productivo más eficiente."
          />
          <View style={styles.spacer} />
          <AestheticText
            title="Higiene y manipulación del pescado"
            content="La NTC 1443 define normas estrictas sobre higiene en la manipulación y almacenamiento del pescado. Los productos deben conservarse a temperaturas adecuadas, protegerse de la contaminación y cumplir con requisitos microbiológicos que garantizan su inocuidad."
          />
          <View style={styles.spacer} />
          <AestheticText
            title="Empaque y rotulado"
            content="Para su comercialización, el pescado debe estar correctamente envasado en materiales seguros que protejan su calidad. Además, el rotulado debe incluir información clara sobre la especie, método de conservación, fecha de producción y vencimiento, entre otros datos relevantes."
          />
          <View style={styles.spacer} />
          <AestheticText
            title="Métodos de ensayo y control de calidad"
            content="La norma también establece métodos de prueba para verificar la frescura, composición química y presencia de microorganismos. Estos controles aseguran que el pescado sea apto para el consumo y cumpla con los estándares establecidos.
En conclusión, la NTC 1443 regula aspectos clave de la piscicultura y comercialización de productos pesqueros, garantizando la calidad, inocuidad y sostenibilidad del sector en Colombia."
          />
        </View>
        {/* <>
        <View style={styles.exerciseContainer}>
          <DragDropExercise scrollViewRef={scrollViewRef} />
        </View>
        </> */}
      </ScrollView>
    </SafeAreaView>
  )
}

export default NTC1443Screen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 24,
  },
  spacer: {
    height: 20,
  },
  exerciseContainer: {
    zIndex: 100,
    elevation: 5,
  },
})