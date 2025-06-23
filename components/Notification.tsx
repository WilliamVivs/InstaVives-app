import React, { useState } from "react";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notifications.styles";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import DeleteElementModal from "./DeleteElementModal";

export default function Notification({ notification }: any) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const deleteNotification = useMutation(api.notifications.deleteNotification);


  const handleLongPress = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setError(undefined);
    setLoading(true);
    try {
      await deleteNotification({ notificationId: notification._id });
      setShowDeleteModal(false);
    } catch (err: any) {
      setError(err.message || "Error deleting notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity onLongPress={handleLongPress}>
        <View style={styles.notificationItem}>
          <View style={styles.notificationContent}>
            <Link href={"/notifications"} asChild>
              <TouchableOpacity style={styles.avatarContainer}>
                <Image
                  source={notification.sender.image}
                  style={styles.avatar}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.iconBadge}>
                  {notification.type === "like" ? (
                    <Ionicons name="heart" size={14} color={COLORS.primary} />
                  ) : notification.type === "follow" ? (
                    <Ionicons name="person-add" size={14} color="#8B5CF6" />
                  ) : (
                    <Ionicons name="chatbubble" size={14} color="#3B82F6" />
                  )}
                </View>
              </TouchableOpacity>
            </Link>
            <View style={styles.notificationInfo}>
              <Link href={`/notifications`} asChild>
                <TouchableOpacity>
                  <Text style={styles.username}>{notification.sender.username}</Text>
                </TouchableOpacity>
              </Link>
              <Text style={styles.action}>
                {notification.type === "follow"
                  ? "started following you"
                  : notification.type === "like"
                  ? "liked your post"
                  : notification.comment
                  ? `commented: "${notification.comment}"`
                  : "The comment has been deleted..."}
              </Text>
              <Text style={styles.timeAgo}>
                {formatDistanceToNow(notification._creationTime, { addSuffix: true })}
              </Text>
            </View>
          </View>
          
          {notification.post && (
          <Link href={`/notifications`}>
            <TouchableOpacity>
                <Image
                source={notification.post.imageUrl}
                style={styles.postImage}
                contentFit="cover"
                transition={200}
                />
            </TouchableOpacity>
          </Link>
          )}
        </View>
      </TouchableOpacity>

      <DeleteElementModal
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={loading}
        error={error}
        title="Delete notification?"
        message="Are you sure you want to delete this notification?"
      />
    </>
  );
}
