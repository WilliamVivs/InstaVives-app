import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
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
    const progressAnim = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

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
      if (!visible || !stories[currentIndex]) return;

      progressAnim.setValue(0);

      animationRef.current = Animated.timing(progressAnim, {
        toValue: 100,
        duration: 5000,
        useNativeDriver: false,
      });

      animationRef.current.start(() => {
        animationRef.current = null;
        if (currentIndex < stories.length - 1) {
          if (currentUser._id !== currentStory.userId) {
            markAsSeen(stories[currentIndex].id);
          }
          setCurrentIndex(currentIndex + 1);
        } else {
          if (currentUser._id !== currentStory.userId) {
            markAsSeen(stories[currentIndex].id);
          }
          onClose();
        }
      });

      return () => {
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }
      };
    }, [currentIndex, visible]);

  const handleNext = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (currentIndex < stories.length - 1) {
      if (currentUser._id !== currentStory.userId){ // if the history isnt ours, we mark the story as seen
            markAsSeen(stories[currentIndex].id)
          }
      setCurrentIndex(currentIndex + 1);
    } else {
      if (currentUser._id !== currentStory.userId){
            markAsSeen(stories[currentIndex].id)
          }
      onClose();
    }
  };

  const handlePrev = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (currentIndex > 0) {
      if (currentUser._id !== currentStory.userId){
            markAsSeen(stories[currentIndex].id)
          }
      setCurrentIndex(currentIndex - 1);
    }
  };

  console.log("currentUser._id:", currentUser?._id);
  console.log("currentStory.userId:", currentStory?.userId);
  return (
  <Modal visible={visible} animationType="slide" transparent={false}>
    <View style={styles.storyModalContainer}>
      {/* Barra de progreso */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
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
