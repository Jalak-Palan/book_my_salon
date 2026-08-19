import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable, Platform } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { normalize, MIN_TOUCH_SIZE } from '../utils/dimensions';

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
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.roundness + 4,
            },
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: isDanger
                  ? theme.colors.error + '15'
                  : theme.colors.primary + '15',
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isDanger ? 'alert-circle-outline' : 'help-circle-outline'}
              size={32}
              color={isDanger ? theme.colors.error : theme.colors.primary}
            />
          </View>

          <Text style={[styles.title, { color: theme.colors.onSurface, fontSize: normalize(18) }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: theme.colors.onSurfaceVariant, fontSize: normalize(14) }]}>
            {message}
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={onCancel}
              style={styles.btn}
              contentStyle={styles.btnContent}
              labelStyle={{ fontSize: normalize(14), fontWeight: '600' }}
            >
              {cancelLabel}
            </Button>
            <Button
              mode="contained"
              onPress={onConfirm}
              buttonColor={isDanger ? theme.colors.error : theme.colors.primary}
              textColor="#ffffff"
              style={styles.btn}
              contentStyle={styles.btnContent}
              labelStyle={{ fontSize: normalize(14), fontWeight: '700' }}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dialog: {
    width: '88%',
    maxWidth: 360,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  btn: {
    flex: 1,
  },
  btnContent: {
    height: 46,
  },
});
