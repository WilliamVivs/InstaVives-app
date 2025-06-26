import { Id } from '@/convex/_generated/dataModel';
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/stories.styles";
import StoriesModal from "./StoriesModal";

export type StoryType = {
  id: Id<"stories">;
  userId: Id<"users">;
  username: string;
  avatar?: string;
  hasStory: boolean;
  mediaUrl: string;
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
        <View style={[styles.storyRing,!story.hasStory && styles.noStory]}>
          <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
        </View>
        <Text style={styles.storyUsername} numberOfLines={1} ellipsizeMode="tail">{story.username}</Text>
      </TouchableOpacity>

      <StoriesModal
        visible={modalVisible}
         onClose={() => {
          setModalVisible(false);
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
