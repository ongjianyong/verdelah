import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface CameraScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanComplete: (imageUri: string) => void;
}

const { width, height } = Dimensions.get('window');

export default function CameraScanner({ visible, onClose, onScanComplete }: CameraScannerProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible, permission, requestPermission]);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    setIsScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (photo?.uri) {
        onScanComplete(photo.uri);
        onClose();
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your photo library to select images.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onScanComplete(result.assets[0].uri);
        onClose();
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image from gallery. Please try again.');
    }
  };

  if (!visible) return null;

  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.message}>Requesting camera permission...</Text>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={onClose}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan Item</Text>
            <TouchableOpacity style={styles.headerButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={30} color="white" />
            </TouchableOpacity>
          </View>

          {/* Scanning overlay */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.instructionText}>
              Position the item within the frame
            </Text>
          </View>

          {/* Bottom controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={pickImageFromGallery}
            >
              <Ionicons name="images" size={30} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.captureButton, isScanning && styles.captureButtonDisabled]}
              onPress={takePicture}
              disabled={isScanning}
            >
              {isScanning ? (
                <ActivityIndicator color="white" size="large" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
            
            <View style={styles.placeholder} />
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  headerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#2E7D32',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    marginTop: 40,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 40,
    lineHeight: 22,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  galleryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 60,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  message: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});