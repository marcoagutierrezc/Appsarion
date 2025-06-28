import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AestheticTextProps {
  title?: string;
  content: string;
  titleColor?: string;
  contentColor?: string;
}

const AestheticText: React.FC<AestheticTextProps> = ({
  title,
  content,
  titleColor = '#fff',
  contentColor = '#fff',
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      <View style={styles.underline} />
      <Text style={[styles.content, { color: contentColor }]}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  underline: {
    height: 2,
    backgroundColor: '#4A90E2',
    width: 50,
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default AestheticText;