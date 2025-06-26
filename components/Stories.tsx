import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/feed.styles';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CreateStoryModal from './CreateStoryModal';
import { Loader } from './Loader';
import Story from './Story';

const StoriesSection = () => {
  const [seenStories, setSeenStories] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewingOwnStory, setViewingOwnStory] = useState(false);

  const { userId } = useAuth();
  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : 'skip');
  const ownStories = useQuery(api.stories.getOwnStories);
  const allStoriesFromConvex = useQuery(api.stories.getAllStories);

  // Cargar historias vistas
  useEffect(() => {
    const loadSeenStories = async () => {
      try {
        const stored = await AsyncStorage.getItem('seenStories');
        const seen = stored ? JSON.parse(stored) : [];
        setSeenStories(seen);
      } catch (error) {
        console.error('Error loading seen stories:', error);
      }
    };
    loadSeenStories();
  }, [refresh]);

  // Determinar si el usuario actual tiene historia
  useEffect(() => {
    if (ownStories && ownStories.length > 0) {
      setViewingOwnStory(true);
    } else {
      setViewingOwnStory(false);
    }
  }, [ownStories]);

  const handleCloseModal = () => {
    setRefresh(prev => !prev);
  };

  const AddStoryButton = () => {
    if (!viewingOwnStory && currentUser) {
      return (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.storyWrapper}
        >
          <View style={styles.withoutStoryRing}>
            <Image source={currentUser.image} style={styles.storyAvatar} />
          </View>
          <View style={styles.iconBadge}>
            <Ionicons name="add" size={15} style={styles.iconBadgeAdd} />
          </View>
          <Text style={styles.storyUsername} numberOfLines={1} ellipsizeMode="tail">{currentUser.fullname}</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  if (!ownStories || !allStoriesFromConvex || !currentUser) {
    return <Loader />;
  }

  // Historias del usuario actual formateadas
  const ownStoryFormatted =
    ownStories.length > 0
      ? ownStories.map((own) => ({
          id: own._id,
          userId: own.userId,
          username: currentUser.username,
          avatar: currentUser.image,
          hasStory: true,
          mediaUrl: own.mediaUrl,
          createdAt: own.createdAt,
        }))
      : [];

  // Historias de otros usuarios
  const otherStories = allStoriesFromConvex
    .filter((story) => !ownStories.some((own) => own._id === story.id))
    .map((story) => ({
      id: story.id,
      userId: story.userId,
      username: story.username,
      avatar: story.avatar,
      hasStory: true,
      mediaUrl: story.mediaUrl,
      createdAt: story.createdAt,
    }));

  // Unimos y ordenamos (las vistas van al final)
  const allStories = [...ownStoryFormatted, ...otherStories];
  const orderedStories = [...allStories].sort((a, b) => {
    const aSeen = seenStories.includes(a.id);
    const bSeen = seenStories.includes(b.id);
    if (aSeen === bSeen) return 0;
    return aSeen ? 1 : -1;
  });

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
        <AddStoryButton />
        {orderedStories.map((story) => (
          <Story
            key={story.id}
            story={story}
            stories={orderedStories}
            refresh={refresh}
            triggerRefresh={() => setRefresh((prev) => !prev)}
            onCloseModal={handleCloseModal}
          />
        ))}
      </ScrollView>

      <CreateStoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          setViewingOwnStory(true);
          setRefresh((prev) => !prev);
        }}
      />
    </>
  );
};

export default StoriesSection;
