// DeleteNotificationsModal.tsx
import { styles } from "@/styles/delete.styles";
import React from "react";
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from "react-native";

type DeleteElementProp = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  error?: string;
  title?: string;
  message?: string;
};

export default function DeleteElementModal({
  visible,
  onCancel,
  onConfirm,
  loading,
  error,
  title = "Delete item?",
  message = "Are you sure you want to delete this item?",
}: DeleteElementProp) {
  
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel} disabled={loading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button,styles.confirm,
                (loading || !!error) && { opacity: 0.5 }, // unabled button more opacity
              ]}
              onPress={onConfirm}
              disabled={loading || !!error} // if error block the delete button
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
