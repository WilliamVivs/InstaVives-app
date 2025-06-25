import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/stories.styles';
import { useMutation } from 'convex/react';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Button, Modal, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function CreateStoryModal({ visible, onClose, onSuccess }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createStory = useMutation(api.stories.addStory);
  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      setIsUploading(true);
      const uploadUrl = await generateUploadUrl();

      const uploadResult = await FileSystem.uploadAsync(uploadUrl, selectedImage, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        mimeType: 'image/jpeg',
      });

      if (uploadResult.status !== 200) throw new Error('Upload failed');

      const { storageId } = JSON.parse(uploadResult.body);
      await createStory({ storageId });

      setSelectedImage(null);
      onClose();
      onSuccess?.(); // Para refrescar si hace falta

    } catch (error) {
      console.error('Error uploading story:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Nueva historia</Text>

          {!selectedImage ? (
            <Button title="Select Image" onPress={pickImage} />
          ) : (
            <>
              <Image
                source={{ uri: selectedImage }}
                style={styles.image}
                contentFit="cover"
              />
              <Button title="Change Image" onPress={pickImage} />
            </>
          )}

          <View style={styles.actions}>
            {isUploading ? (
              <ActivityIndicator size="small" />
            ) : (
              <>
                <Button title="Subir historia" onPress={handleUpload} disabled={!selectedImage} />
                <TouchableOpacity onPress={() => {
                  setSelectedImage(null);
                  onClose();
                }}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}


