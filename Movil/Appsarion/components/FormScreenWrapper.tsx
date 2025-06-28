import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyleSheet, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

const FormScreenWrapper = ({ children }: Props) => {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={20}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.inner}>
        {children}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
  },
});

export default FormScreenWrapper;
