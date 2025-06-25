import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/stories.styles";
import { Loader } from "./Loader";
import { StoryType } from "./Story";

type Props = {
  visible: boolean;
  onClose: () => void;
  stories: StoryType[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  triggerRefresh: () => void;
};

export default function StoriesModal({ visible, onClose, stories, currentIndex, setCurrentIndex,triggerRefresh  }: Props) {
    const [progress, setProgress] = useState(0);
    const [isClosePressed, setIsClosePressed] = useState(false);
    const [isTrashPressed, setIsTrashPressed] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const deleteStory = useMutation(api.stories.deleteStory);
    const { user } = useUser();
    const currentUser = useQuery(api.users.getUserByClerkId,user ? {clerkId:user?.id} : "skip"); //user in db
    const currentStory = stories[currentIndex];


    if (!currentUser || !currentStory) return <Loader/>

      const handleDeleteStory = async () => {
        try {
          await deleteStory({ storyId: currentStory.id });
          currentIndex = currentIndex + 1
          triggerRefresh();
          onClose();
        } catch (error) {
          console.error("Error deleting story:", error);
        }
      };


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
        if (currentIndex === 0 || currentIndex > stories.length - 1) return;
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

  console.log("currentUser._id:", currentUser?._id);
  console.log("currentStory.userId:", currentStory?.userId);
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

      
      <View style={styles.insideStoryHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image
            source={{ uri: currentStory.avatar }}
            style={styles.insideStoryAvatar}
          />
          <Text style={styles.storyModalUsername}>
            {currentStory.username}
          </Text>
        </View>
        <Pressable onPress={onClose}>
          {({ pressed }) => (
            <Ionicons
              name="close"
              size={28}
              color={pressed ? COLORS.primary : COLORS.white}
            />
          )}
        </Pressable>
      </View>
      <Image source={{ uri: stories[currentIndex].mediaUrl }} style={styles.storyModalImage} />
      
      {currentUser._id === currentStory.userId && (
        <TouchableOpacity onPress={handleDeleteStory} style={styles.trashButton}>
          <Ionicons name="trash-outline" size={28} color={COLORS.primary}/>
        </TouchableOpacity>
      )}
      
      

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
