import React, { useRef } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import { PinchGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFontScale } from '../context/FontScaleContext';

interface FullscreenImageViewerProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
  filename?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const IMAGE_HEIGHT = screenHeight - 100;

export function FullscreenImageViewer({
  visible,
  imageUri,
  onClose,
  onDownload,
  isDownloading = false,
  filename = 'documento',
}: FullscreenImageViewerProps) {
  const scaleRef = useRef(1);
  const scaledZoom = useRef(new Animated.Value(1)).current;

  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: scaledZoom } }],
    { useNativeDriver: false }
  );

  const onPinchHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === 4) { // ENDED
      let newScale = event.nativeEvent.scale;
      
      // Limitar entre 1x y 4x
      newScale = Math.max(1, Math.min(newScale, 4));
      
      scaleRef.current = newScale;
      scaledZoom.setValue(newScale);
      
      // Si vuelve a 1x, resetear
      if (newScale <= 1.05) {
        Animated.spring(scaledZoom, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
        scaleRef.current = 1;
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.container}>
        {/* Header with close button and download */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            disabled={isDownloading}
          >
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {filename}
          </Text>
          {onDownload && (
            <TouchableOpacity
              style={[styles.downloadBtn, isDownloading && styles.downloadBtnDisabled]}
              onPress={onDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <MaterialCommunityIcons name="download" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Image viewer with pinch zoom */}
        <PinchGestureHandler
          onGestureEvent={onPinchEvent}
          onHandlerStateChange={onPinchHandlerStateChange}
        >
          <Animated.View style={[styles.imageContainer, { transform: [{ scale: scaledZoom }] }]}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          </Animated.View>
        </PinchGestureHandler>

        {/* Instructions */}
        <View style={styles.footer}>
          <Text style={styles.instructionText}>
            Pellizca para hacer zoom
          </Text>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingTop: 12,
  },
  closeBtn: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
    textAlign: 'center',
  },
  downloadBtn: {
    padding: 8,
  },
  downloadBtnDisabled: {
    opacity: 0.5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: screenWidth,
    height: screenHeight - 100,
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
});

export default FullscreenImageViewer;
