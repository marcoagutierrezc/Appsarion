import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Draggable from 'react-native-draggable';

interface Word {
  id: string;
  text: string;
}

interface Sentence {
  id: string;
  text: string;
  answer: string;
}

const DragAndDropQuiz: React.FC = () => {
  const [words] = useState<Word[]>([
    { id: '1', text: 'sol' },
    { id: '2', text: 'luna' },
    { id: '3', text: 'estrella' },
  ]);

  const [sentences] = useState<Sentence[]>([
    { id: '1', text: 'El ___ brilla durante el día.', answer: 'sol' },
    { id: '2', text: 'La ___ ilumina la noche.', answer: 'luna' },
    { id: '3', text: 'Una ___ es un cuerpo celeste luminoso.', answer: 'estrella' },
  ]);

  const [completedSentences, setCompletedSentences] = useState<{ [key: string]: string }>({});

  const handleDrop = (wordId: string, sentenceId: string) => {
    const word = words.find(w => w.id === wordId);
    const sentence = sentences.find(s => s.id === sentenceId);

    if (word && sentence) {
      setCompletedSentences(prev => ({
        ...prev,
        [sentenceId]: word.text,
      }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wordsContainer}>
        {words.map(word => (
          <Draggable
            key={word.id}
            x={0}
            y={0}
            renderSize={60}
            renderColor="skyblue"
            renderText={word.text}
            isCircle
            onDragRelease={(event, gestureState, bounds) => {
              sentences.forEach(sentence => {
                if (
                  bounds.left > 50 &&
                  bounds.left < 300 &&
                  bounds.top > sentences.indexOf(sentence) * 60 &&
                  bounds.top < (sentences.indexOf(sentence) + 1) * 60
                ) {
                  handleDrop(word.id, sentence.id);
                }
              });
            }}
          />
        ))}
      </View>
      <View style={styles.sentencesContainer}>
        {sentences.map(sentence => (
          <View key={sentence.id} style={styles.sentenceRow}>
            <Text>
              {sentence.text.replace('___', completedSentences[sentence.id] || '___')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  wordsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  sentencesContainer: {
    flex: 1,
  },
  sentenceRow: {
    height: 60,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default DragAndDropQuiz;