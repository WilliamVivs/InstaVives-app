import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/stories.styles";
import Story from "./Story";

type Story = {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  stories: Story[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  triggerRefresh: () => void;
};

export default function StoriesModal({ visible, onClose, stories, currentIndex, setCurrentIndex,triggerRefresh  }: Props) {
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const markAsSeen = async (id: string) => {
        try {
        const seenStories = await AsyncStorage.getItem("seenStories");
        const seenArray = seenStories ? JSON.parse(seenStories) : [];

        if (!seenArray.includes(id)) {
            const updated = [...seenArray, id];
            await AsyncStorage.setItem("seenStories", JSON.stringify(updated));
        }
        } catch (error) {
        console.error("Error marking story as seen:", error);
        }
    };

    useEffect(() => {
        if (currentIndex === 0) return;
        markAsSeen(stories[currentIndex].id);
    }, [currentIndex]);

    useEffect(() => {
        setProgress(0);
        if (!visible) return;

        markAsSeen(stories[currentIndex].id);

        // Incrementa progreso cada 50ms
        intervalRef.current = setInterval(() => {
        setProgress((old) => {
            if (old >= 100) {
            // Avanza a la siguiente historia o cierra modal si es la última
            if (currentIndex < stories.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                onClose();
            }
            return 0; // resetea
            }
            return old + 2; // subir 2% cada 50ms = 2.5s total por historia (ajusta aquí duración)
        });
        }, 50);

        // Limpia intervalo al desmontar o cambiar historia
        return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [currentIndex, visible]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  return (
  <Modal visible={visible} animationType="slide" transparent={false}>
    <View style={styles.storyModalContainer}>

      {/* Barra de progreso */}
      <View style={styles.progressBarContainer}>
        {stories.map((_, index) => (
          <View key={index} style={styles.progressBar}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width:
                    index < currentIndex
                      ? '100%'
                      : index === currentIndex
                      ? `${progress * 100}%`
                      : '0%',
                },
              ]}
            />
          </View>
        ))}
      </View>

      <Image source={{ uri: stories[currentIndex].avatar }} style={styles.storyModalImage} />

      <Text style={styles.storyModalUsername}>
        {stories[currentIndex].username}
      </Text>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={28} color="white" />
      </TouchableOpacity>

      {/* Navegación por toques a izquierda/derecha */}
      <TouchableOpacity
        onPress={handlePrev}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%' }}
      />
      <TouchableOpacity
        onPress={handleNext}
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%' }}
      />
    </View>
  </Modal>
);
}
