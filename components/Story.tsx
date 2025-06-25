import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/stories.styles";
import StoriesModal from "./StoriesModal";

type StoryType = {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
};

type Props = {
  story: StoryType;
  stories: StoryType[];
  refresh: boolean;
  triggerRefresh: () => void;
  onCloseModal: () => void;
};

export default function Story({ story, stories,refresh,triggerRefresh,onCloseModal  }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    checkIfSeen();
  }, [refresh]);

  // useEffect(() => {
  // const resetSeenStories = async () => {
  //   try {
  //     await AsyncStorage.removeItem("seenStories");
  //     console.log("✅ seenStories reseteado");
  //   } catch (error) {
  //     console.error("Error reseteando stories:", error);
  //   }
  // };

  // resetSeenStories();
  // }, []);

  const checkIfSeen = async () => {
    try {
      const seenStories = await AsyncStorage.getItem("seenStories");
      const seenArray = seenStories ? JSON.parse(seenStories) : [];
      if (seenArray.includes(story.id)) {
        setSeen(true);
      }
    } catch (error) {
      console.error("Error checking seen story:", error);
    }
  };

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setModalVisible(true);
  };
  // we find the current Index on the list
  const filteredIndex = stories.findIndex(s => s.id === story.id);

  return (
    <>
      <TouchableOpacity
        style={styles.storyWrapper }
        onPress={() => {
          if (filteredIndex !== -1) {
            setCurrentIndex(filteredIndex);
            setModalVisible(true);
            handleOpen(filteredIndex);
          }
        }}
      >
        <View style={[styles.storyRing,!story.hasStory && styles.noStory,seen && styles.seenStoryRing]}>
          <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
        </View>
        <Text style={styles.storyUsername}>{story.username}</Text>
      </TouchableOpacity>

      <StoriesModal
        visible={modalVisible}
         onClose={() => {
          setModalVisible(false);
          checkIfSeen();
          onCloseModal();
        }}
        stories={stories}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        triggerRefresh={triggerRefresh} 
      />
    </>
  );
}
