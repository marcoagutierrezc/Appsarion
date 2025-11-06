import { Alert, Platform } from 'react-native';

export const showAlert = (title: string, message: string, onConfirm?: () => void) => {
  if (Platform.OS === 'web') {
    if (onConfirm) {
      const ok = window.confirm(`${title}\n\n${message}`);
      if (ok) onConfirm();
    } else {
      window.alert(`${title}\n\n${message}`);
    }
    return;
  }

  if (onConfirm) {
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Aceptar', onPress: onConfirm },
    ]);
  } else {
    Alert.alert(title, message);
  }
};
