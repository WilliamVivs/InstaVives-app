import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from "../styles/feed.styles";
import CommentsModal from "./CommentsModal";
import { useUser } from "@clerk/clerk-expo";

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
    const [commentsCount,setCommentsCount] = useState(post.comments);
    const [showComments,setShowComments] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)

    const {user} = useUser(); // user in clerk
    const currentUser = useQuery(api.users.getUserByClerkId,user ? {clerkId:user?.id} : "skip"); //user in db

    const toggleLike = useMutation(api.posts.toggleLike)
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
    const deletePost = useMutation(api.posts.deletePost);

    const handleNewComment = () => {
      setCommentsCount(prev => prev + 1);
    };

    const handleDelete = async () => {
      try {
        await deletePost({postId: post._id});
      } catch (error) {
        console.error("Error deleting post: ",error);
        
        
      }
    }

    const handleLike = async () => {
        try {
            const newIsLike = await toggleLike({postId:post._id})
            setIsLiked(newIsLike)
            setLikesCount((prev) => (newIsLike ? prev + 1 : prev - 1));
        } catch (error) {
            console.error("Error toggling like",error);
            
        }
    }

    const handleBookmark = async () => {
        try {
            const newIsBookmark = await toggleBookmark({postId:post._id})
            setIsBookmarked(newIsBookmark)
        } catch (error) {
            console.error("Error toggling bookmark",error);
            
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


            {post.author._id === currentUser?._id ? (
              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color={COLORS.primary}/>
            </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white}/>
            </TouchableOpacity>
            )}
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
            <TouchableOpacity  onPress={() => setShowComments(true)}>
                <Ionicons name="chatbubble-outline" size={22} color={COLORS.white}/>
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleBookmark}>
            {isBookmarked ? (
              <Ionicons name="bookmark" size={22} color={COLORS.primary} />
            ) : (
              <Ionicons name="bookmark-outline" size={22} color={COLORS.white} />
            )}
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

        {commentsCount > 0 && (
           <TouchableOpacity onPress={() => setShowComments(true)} >
            <Text style={styles.commentsText}
            >View all {commentsCount} comments</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.timeAgo}>
          {formatDistanceToNow(post._creationTime,{addSuffix:true})}
        </Text>
      </View>
      <CommentsModal 
        postId = {post._id}
        visible = {showComments}
        onClose = {() => setShowComments(false)}
        onCommentAdded={handleNewComment}
      />
    </View>
    )
}