import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from "../styles/feed.styles";
import CommentsModal from "./CommentsModal";

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
    // const [likesCount,setLikesCount] = useState(post.likes);
    const [commentsCount,setCommentsCount] = useState(post.comments);
    const [showComments,setShowComments] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
    
    // CAPTION 
    const [showFullCaption, setShowFullCaption] = useState(false);
    const [isCaptionTruncated, setIsCaptionTruncated] = useState(false);

    const {user} = useUser(); // user in clerk
    const currentUser = useQuery(api.users.getUserByClerkId,user ? {clerkId:user?.id} : "skip"); //user in db

    const toggleLike = useMutation(api.posts.toggleLike)
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
    const deletePost = useMutation(api.posts.deletePost);

    const handleNewComment = () => {
      // setCommentsCount(prev => prev + 1);
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
            // setLikesCount((prev) => (newIsLike ? prev + 1 : prev - 1));
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
            <Link href={`/user/${post.author._id}`} asChild>
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
            <TouchableOpacity onPress={handleLike} style={styles.postDisplay}>
                <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? COLORS.primary : COLORS.white}/>
                <Text style={styles.countPostNumber}>
                  {/* {likesCount > 0 && `${likesCount.toLocaleString()}`} */}
                  {post.likes > 0 && `${post.likes.toLocaleString()}`}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => setShowComments(true)} style={styles.postDisplay}>
                <Ionicons name="chatbubble-outline" size={22} color={COLORS.white}/>
                <Text style={styles.countPostNumber}>
                  {/* {commentsCount > 0 && `${commentsCount.toLocaleString()}`} */}
                  {post.comments > 0 && `${post.comments .toLocaleString()}`}
                </Text>
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
        {post.caption && (
          <View style={styles.captionContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (isCaptionTruncated) {
                  setShowFullCaption(!showFullCaption);
                }
              }}
            >
              <Text
                style={styles.captionCombined}
                numberOfLines={showFullCaption ? undefined : 1}
                ellipsizeMode="tail"
                onTextLayout={(e) => {
                  const lines = e.nativeEvent.lines;
                  if (lines.length > 1 && !isCaptionTruncated) {
                    setIsCaptionTruncated(true);
                  }
                }}
              >
                <Link href={`/user/${post.author._id}`} asChild>
                    <Text style={styles.captionUsername}>{post.author.username} </Text>
                </Link>
                {post.caption}
              </Text>
              {isCaptionTruncated && !showFullCaption && (
                <Text style={styles.moreButton}>...more</Text>
              )}
              {isCaptionTruncated && showFullCaption && (
                <Text style={styles.moreButton}>less</Text>
              )}
            </TouchableOpacity>
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
        // onCommentAdded={handleNewComment}
      />
    </View>
    )
}