import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { useTheme, Button } from 'react-native-paper';

export const ConfirmationDialog = ({
  visible,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = true,
}) => {
  const theme = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />
        <View style={[styles.dialog, { backgroundColor: theme.colors.surface, borderRadius: theme.roundness }]}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>{message}</Text>
          <View style={styles.actions}>
            <Button mode="text" onPress={onCancel} style={styles.btn}>
              {cancelLabel}
            </Button>
            <Button
              mode="contained"
              onPress={onConfirm}
              buttonColor={isDanger ? theme.colors.error : theme.colors.primary}
              textColor="#ffffff"
              style={styles.btn}
            >
              {confirmLabel}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  dialog: {
    width: '85%',
    maxWidth: 340,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btn: {
    marginLeft: 8,
  },
});
