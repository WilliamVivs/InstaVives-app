import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Link } from 'expo-router';
import { useEffect, useRef } from "react";
import { Animated, Image, Modal, Text, TouchableOpacity, View } from "react-native";
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


    const stopAnimation = () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
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
          setCurrentIndex(currentIndex + 1);
        } else {
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
    stopAnimation();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    stopAnimation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  console.log("currentUser._id:", currentUser?._id);
  console.log("currentStory.userId:", currentStory?.userId);
  return (
  <Modal visible={visible} animationType="slide" transparent={false}>
  <View style={styles.storyModalContainer}>
    {/* Progress Bar */}
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

    {/* Header */}
    <View style={styles.insideStoryHeader}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Link href={currentStory.userId === currentUser?._id ? "/profile" : `/user/${currentStory.userId}`} asChild>
          <TouchableOpacity onPress={onClose} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Image
              source={{ uri: currentStory.avatar }}
              style={styles.insideStoryAvatar}
              />
            <Text style={styles.storyModalUsername}>
              {currentStory.username}
            </Text>
          </TouchableOpacity>
        </Link>

      </View>
      <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={28} color={COLORS.primary}/>
        </TouchableOpacity>
    </View>
      <View style={styles.storyImageContainer}>
    <Image
      source={{ uri: stories[currentIndex].mediaUrl }}
      style={styles.storyModalImage}
      />
      {currentUser._id === currentStory.userId || currentUser._id === "j570xc7vsmxmpkr60xxsb2dzdx7j4zy5" ? (
        <TouchableOpacity onPress={handleDeleteStory} style={styles.trashButton}>
          <Ionicons name="trash-outline" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      ): null}
      {/* Navigate throw the image */}
      <TouchableOpacity
        onPress={handlePrev}
        style={styles.imageNavLeft}
      />
      <TouchableOpacity
        onPress={handleNext}
        style={styles.imageNavRight}
      />
    </View>
    </View>
  </Modal>
);
}
