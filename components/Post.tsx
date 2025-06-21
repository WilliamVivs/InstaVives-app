import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from "../styles/feed.styles";

type PostProps = {
  post: {
    _id: Id<"posts">;
    imageUrl: string;
    caption?: string;
    likes: number;
    comments: number;
    _creationTime: number;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      _id: string;
      username: string;
      image: string;
    };
  };
};

export default function Post({post}:PostProps) {
    // const currentUser = useQuery(api.users.getUserByClerkId, user ? { clerkId: user.id } : "skip");
    const [isLiked,setIsLiked] = useState(post.isLiked);
    const [likesCount,setLikesCount] = useState(post.likes);

    const toggleLike = useMutation(api.posts.toggleLike)

    const handleLike = async () => {
        try {
            const newIsLike = await toggleLike({postId:post._id})
            setIsLiked(newIsLike)
            setLikesCount((prev) => (newIsLike ? prev + 1 : prev - 1));
        } catch (error) {
            console.error("Error toggling like",error);
            
        }
    }
    return (
    <View style={styles.post}>
        <View style={styles.postHeader}>
            <Link href={"/notifications"}>
                <TouchableOpacity style={styles.postHeaderLeft}>
                    <Image
                    source={post.author.image}
                    style={styles.postAvatar}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                    />
                    <Text style={styles.postUsername}>{post.author.username}</Text>
                </TouchableOpacity>
            </Link>
            {/* if i'm the owner of the post, show the delete button  */}
            {/* <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white}/>
            </TouchableOpacity> */}

            <TouchableOpacity>
                <Ionicons name="trash-outline" size={20} color={COLORS.primary}/>
            </TouchableOpacity>
        </View>
        <Image
            source={post.imageUrl}
            style={styles.postImage}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
        />

        {/* POST ACTIONS  */}
        <View style={styles.postActions}>
            <View style={styles.postActionsLeft}>
            <TouchableOpacity onPress={handleLike}>
                <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? COLORS.primary : COLORS.white}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons name="chatbubble-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>
            </View>
            <TouchableOpacity>
            <Ionicons
                name={"bookmark-outline"}
                size={22}
                color={COLORS.white}
            />
            </TouchableOpacity>
      </View>

      {/* POST INFO */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {likesCount > 0 ? `${likesCount.toLocaleString()} likes` : "Be the first to like"}
        </Text>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}

        <TouchableOpacity>
            <Text style={styles.commentsText}>View all 2 comments</Text>
        </TouchableOpacity>
        
        <Text style={styles.timeAgo}>
          2 hours ago
        </Text>
      </View>
    </View>
    )
}