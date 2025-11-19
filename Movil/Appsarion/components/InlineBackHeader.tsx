import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { commonColors } from '../styles/commonStyles';
import { useFontScale } from '../context/FontScaleContext';

interface Props {
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
}

export const InlineBackHeader: React.FC<Props> = ({ onPress, style }) => {
  const { fontScale } = useFontScale();
  const navigation = useNavigation<any>();
  const handlePress = onPress ?? (() => navigation.goBack());
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handlePress} accessibilityRole="button" accessibilityLabel="Volver">
        <MaterialCommunityIcons name="arrow-left" size={24} color={commonColors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

export default InlineBackHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 8,
  },
});
