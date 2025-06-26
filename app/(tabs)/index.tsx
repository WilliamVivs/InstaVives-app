import { Loader } from '@/components/Loader';
import Post from '@/components/Post';
import StoriesSection from '@/components/Stories';
import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { Button, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { styles } from "../../styles/feed.styles";

export default function Index() {
  const {signOut} = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const posts = useQuery(api.posts.getFeedPosts)

  if (posts === undefined) return <Loader />
  if (posts.length === 0) return <NoPostsFound />

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    },2000)

  }

  const AddDemoStoriesButton = () => {
    const addDemoUsersAndStories = useMutation(api.addDemoUser.addDemoUsersAndStories);

    const handleAddDemo = async () => { //just a simple story demo for example pruposes, all logic is implemented for creating and deleting stories
      await addDemoUsersAndStories({
        users: [
          {
            username: "Ana",
            fullname: "Ana Torres",
            email: "ana@demo.com",
            image: "https://randomuser.me/api/portraits/women/1.jpg",
            clerkId: "demo_ana",
            mediaUrl: "https://picsum.photos/id/1018/800/1200",
          },
          {
            username: "Luis",
            fullname: "Luis Pérez",
            email: "luis@demo.com",
            image: "https://randomuser.me/api/portraits/men/2.jpg",
            clerkId: "demo_luis",
            mediaUrl: "https://picsum.photos/id/1027/800/1200",
          },
          {
            username: "Marta",
            fullname: "Marta Ruiz",
            email: "marta@demo.com",
            image: "https://randomuser.me/api/portraits/women/3.jpg",
            clerkId: "demo_marta",
            mediaUrl: "https://picsum.photos/id/1035/800/1200",
          },
        ],
      });

      console.log("Historias demo agregadas");
    };

    return <Button title="Cargar historias demo" onPress={handleAddDemo} />;
  };

  return (    
    <View style={styles.container}>
      {/* HEADER  */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Instavives</Text>
        {/* <AddDemoStoriesButton /> */}
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white}/>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={posts}
        renderItem={({item}) => <Post post={item}/>}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 60}}
        ListHeaderComponent={<StoriesSection/>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
}

const NoPostsFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
  </View>
);
