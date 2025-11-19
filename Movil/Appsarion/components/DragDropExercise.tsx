import React, { useState, useRef } from "react";
import { View, Text, Animated, PanResponder, GestureResponderEvent, LayoutChangeEvent, StyleSheet } from "react-native";
import { useFontScale } from '../context/FontScaleContext';

interface Word {
  id: string;
  text: string;
  isPlaced: boolean;
}

interface DropZone {
  id: string;
  word: string | null;
  correctWord: string;
  layout: { x: number; y: number; width: number; height: number } | null;
}

const DragDropExercise = () => {
  const { fontScale } = useFontScale();
  const words: Word[] = [
    { id: "1", text: "Hello", isPlaced: false },
    { id: "2", text: "World", isPlaced: false },
  ];

  const sentenceParts = ["___", "World", "___"];

  const positions = useRef<{ [key: string]: Animated.ValueXY }>(
    words.reduce((acc, word) => {
      acc[word.id] = new Animated.ValueXY({ x: 0, y: 0 });
      return acc;
    }, {} as { [key: string]: Animated.ValueXY })
  ).current;

  const [dropZones, setDropZones] = useState<DropZone[]>(
    sentenceParts
      .map((part, index) =>
        part === "___"
          ? { id: `zone-${index}`, word: null, correctWord: words[index]?.text || "", layout: null }
          : null
      )
      .filter((zone): zone is DropZone => zone !== null)
  );

  const handleDropZoneLayout = (event: LayoutChangeEvent, index: number) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setDropZones((prevZones) =>
      prevZones.map((zone, i) =>
        i === index ? { ...zone, layout: { x, y, width, height } } : zone
      )
    );
  };

  const checkDrop = (wordId: string, gesture: GestureResponderEvent["nativeEvent"]) => {
    const wordText = words.find((word) => word.id === wordId)?.text;

    for (const zone of dropZones) {
      if (!zone.layout) continue;
      const { x, y, width, height } = zone.layout;

      if (
        gesture.moveX >= x &&
        gesture.moveX <= x + width &&
        gesture.moveY >= y &&
        gesture.moveY <= y + height
      ) {
        if (zone.correctWord === wordText) {
          setDropZones((prevZones) =>
            prevZones.map((dz) => (dz.id === zone.id ? { ...dz, word: wordText } : dz))
          );
          return;
        }
      }
    }

    Animated.spring(positions[wordId], {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef<{ [key: string]: PanResponder.Instance }>(
    words.reduce((acc, word) => {
      acc[word.id] = PanResponder.create({
        onStartShouldSetPanResponder: () => !word.isPlaced,
        onPanResponderGrant: () => {
          positions[word.id].setOffset({
            x: positions[word.id].x._value,
            y: positions[word.id].y._value,
          });
          positions[word.id].setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([
          null,
          { dx: positions[word.id].x, dy: positions[word.id].y },
        ], { useNativeDriver: false }),
        onPanResponderRelease: (_, gesture) => {
          positions[word.id].flattenOffset();
          checkDrop(word.id, gesture);
        },
      });
      return acc;
    }, {} as { [key: string]: PanResponder.Instance })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.sentenceContainer}>
        {sentenceParts.map((part, index) => {
          if (part === "___") {
            const dropZone = dropZones.find((dz) => dz.id === `zone-${index}`);
            return (
              <View
                key={index}
                style={styles.dropZone}
                onLayout={(event) => handleDropZoneLayout(event, index)}
              >
                <Text>{dropZone?.word || "___"}</Text>
              </View>
            );
          }
          return <Text key={index} style={styles.text}>{part}</Text>;
        })}
      </View>

      <View style={styles.wordsContainer}>
        {words.map((word) => (
          <Animated.View
            key={word.id}
            style={[styles.word, { transform: positions[word.id].getTranslateTransform() }]}
            {...panResponder[word.id].panHandlers}
          >
            <Text>{word.text}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  sentenceContainer: { flexDirection: "row", marginBottom: 20 },
  dropZone: { borderBottomWidth: 1, minWidth: 50, textAlign: "center" },
  wordsContainer: { flexDirection: "row", marginTop: 20 },
  word: { margin: 5, padding: 10, backgroundColor: "lightgray", borderRadius: 5 },
  text: { marginHorizontal: 5 },
});

export default DragDropExercise;