import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { commonColors } from '../styles/commonStyles';

interface AestheticTextProps {
  title?: string;
  content: string;
  titleColor?: string;
  contentColor?: string;
}

const AestheticText: React.FC<AestheticTextProps> = ({
  title,
  content,
  titleColor = commonColors.textPrimary,
  contentColor = commonColors.textPrimary,
}) => {
  return (
    <View style={styles.container}>
      {title && <Text style={[styles.title, { color: titleColor }]}>{title}</Text>}
      {title && <View style={styles.underline} />}
      <Text style={[styles.content, { color: contentColor }]}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: commonColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  underline: {
    height: 3,
    backgroundColor: commonColors.primary,
    width: 40,
    marginBottom: 12,
    borderRadius: 2,
  },
  content: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
});

export default AestheticText;