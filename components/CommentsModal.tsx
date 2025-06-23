import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Comment from "./Comment";
import { Loader } from "./Loader";
import DeleteElementModal from "./DeleteElementModal";

type CommentsModal = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
};

export default function CommentsModal({ onClose, postId, visible,onCommentAdded }: CommentsModal) {
  const [newComment, setNewComment] = useState("");
  const comments = useQuery(api.comments.getComments, { postId });
  const addComment = useMutation(api.comments.addComment);

  //delete comment
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [selectedCommentId, setSelectedCommentId] = useState<Id<"comments"> | null>(null);
  const deleteComment = useMutation(api.comments.deleteComments);

  const handleLongPress = (commentId: Id<"comments">) => {
  setSelectedCommentId(commentId);
  setShowDeleteModal(true);
  setError(undefined);
};

  const handleDelete = async () => {
    if (!selectedCommentId) return;
    setError(undefined);
    setLoading(true);

    try {
      await deleteComment({ commentId: selectedCommentId });
      setShowDeleteModal(false);
      setSelectedCommentId(null);
    } catch (err: any) {
      if (err?.message?.includes("Not authorized")) {
        setError("You are not allowed to delete this comment");
      } else {
        console.error("Error inesperado:", err);
        setError("Something went wrong deleting the comment");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment({
        content: newComment,
        postId,
      });

      setNewComment("");
      onCommentAdded?.();
    } catch (error) {
      console.log("Error adding comment:", error);
    }
  };

  return (
    <>
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }} />
        </View>
        
        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onLongPress={() => handleLongPress(item._id)}>
                <Comment comment={item} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.commentsList}
          />
          )}

        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.grey}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            />

          <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
            <Text style={[styles.postButton, !newComment.trim() && styles.postButtonDisabled]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
    <DeleteElementModal
            visible={showDeleteModal}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            loading={loading}
            error={error}
            title="Delete comment?"
            message="Are you sure you want to delete this comment?"
          />
    </>
  );
}
