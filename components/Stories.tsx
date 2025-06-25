import { STORIES } from '@/constants/mock-data';
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
import Story from './Story';


const StoriesSection = () => {
  // Filtramos solo historias que tienen contenido para el modal
  
  const [seenStories, setSeenStories] = useState<string[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [storiesOrdered, setStoriesOrdered] = useState(() => STORIES.filter(s => s.hasStory));
  const { userId } = useAuth();
  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

  const [withStory, setWithStory] = useState(false); 
  // que automaticamente si hay una historia de este usuario se ponga a true o false
  // que al presionar se abra esta historia como las demás
  // cambiar el estilo del modal para añadir historia
  // que podamos eliminar la historia desde nuestra propia historia
  // AÑADIDOS: poder dar like a las historias / dejar comentarios
  const [modalVisible, setModalVisible] = useState(false);
  const [viewingOwnStory, setViewingOwnStory] = useState(false);

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

  const reorderStories = () => {
    const filtered = STORIES.filter(s => s.hasStory);
    const sorted = [...filtered].sort((a, b) => {
      const aSeen = seenStories.includes(a.id);
      const bSeen = seenStories.includes(b.id);

      if (aSeen === bSeen) return 0;
      if (aSeen) return 1;
      return -1;
    });
    setStoriesOrdered(sorted);
  };

  const handleCloseModal = () => {
    // recargamos vistas porque seguramente alguna cambió
    setRefresh(prev => !prev);
    // reordenamos con el nuevo estado visto
    reorderStories();
  };

  const handleAddStoryPress = () => {
    // Aquí lanzas modal o navegas a pantalla de subir historia
    console.log("Añadir historia pulsado");
  };


  
  const AddStoryButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={styles.storyWrapper}>
      {withStory ? (
        <View style={styles.withStoryRing}>
          <Image source={currentUser?.image} style={styles.storyAvatar} />
        </View>
      ) : (
        <View style={styles.withoutStoryRing}>
          <Image source={currentUser?.image} style={styles.storyAvatar} />
        </View>
      )}

      {!withStory && (
        <View style={styles.iconBadge}>
          <Ionicons name="add" size={15} style={styles.iconBadgeAdd} />
        </View>
      )}
      <Text style={styles.storyUsername}>{currentUser?.username}</Text>
    </TouchableOpacity>
  );

  return (
  <>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
          <AddStoryButton onPress={() => {
            if (withStory) {
              setViewingOwnStory(true); // Abre visor
            } else {
              setModalVisible(true);    // Abre modal para subir historia
            }
          }} />

          {storiesOrdered.map(story => (
            <Story
              key={story.id}
              story={story}
              stories={storiesOrdered}
              refresh={refresh}
              triggerRefresh={() => setRefresh(prev => !prev)}
              onCloseModal={handleCloseModal}
            />
          ))}
        </ScrollView>

        <CreateStoryModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSuccess={() => {
            setWithStory(true);
            setRefresh(prev => !prev);
          }}
        />
      </>
    );
};

export default StoriesSection;


