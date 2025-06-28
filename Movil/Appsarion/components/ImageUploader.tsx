import React, { useState } from 'react';
import { View, Image, StyleSheet, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = ({ onImageSelected }: { onImageSelected: (uri: string) => void }) => {
  const [image, setImage] = React.useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      onImageSelected(selectedImageUri);  // Aquí pasamos la URI al componente padre
    }
  };

  return (
    <View>
      <Button title="Seleccionar Imagen" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
};

export default ImageUploader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
});