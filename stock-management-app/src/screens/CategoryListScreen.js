import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme, FAB, Button, Switch, Divider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useForm, Controller } from 'react-hook-form';
import { AppContext } from '../context/AppContext';
import { CustomInput } from '../components/CustomInput';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { EmptyState } from '../components/EmptyState';
import { CustomCard } from '../components/CustomCard';
import { normalize, MIN_TOUCH_SIZE, SCREEN_PADDING } from '../utils/dimensions';

export default function CategoryListScreen() {
  const theme = useTheme();
  const { categories, addCategory, editCategory, deleteCategory } = useContext(AppContext);

  // Modal trigger state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Delete trigger state
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', description: '', status: 'Active' },
  });

  const categoryStatus = watch('status');

  const openAddModal = () => {
    setEditingCategory(null);
    reset({ name: '', description: '', status: 'Active' });
    setModalVisible(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    reset({
      name: cat.name,
      description: cat.description,
      status: cat.status,
    });
    setModalVisible(true);
  };

  const openDeleteDialog = (cat) => {
    setCategoryToDelete(cat);
    setDeleteVisible(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setDeleteVisible(false);
      setCategoryToDelete(null);
    }
  };

  const onSubmit = (data) => {
    if (editingCategory) {
      editCategory(editingCategory.id, data);
    } else {
      addCategory(data);
    }
    setModalVisible(false);
    setEditingCategory(null);
  };

  const renderCategoryItem = ({ item }) => {
    const isActive = item.status === 'Active';
    return (
      <CustomCard style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.catIconWrap, { backgroundColor: isActive ? theme.colors.primaryContainer : theme.colors.surfaceVariant }]}>
            <MaterialCommunityIcons
              name="tag-outline"
              size={20}
              color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.colors.onSurface, fontSize: normalize(15) }]}>{item.name}</Text>
            {item.description ? (
              <Text style={[styles.description, { color: theme.colors.onSurfaceVariant, fontSize: normalize(13) }]}>{item.description}</Text>
            ) : null}
            <View style={[styles.badge, { backgroundColor: isActive ? theme.colors.success + '18' : theme.colors.outline + '50' }]}>
              <MaterialCommunityIcons
                name={isActive ? 'check-circle-outline' : 'pause-circle-outline'}
                size={11}
                color={isActive ? theme.colors.success : theme.colors.onSurfaceVariant}
                style={{ marginRight: 3 }}
              />
              <Text style={[styles.badgeText, { color: isActive ? theme.colors.success : theme.colors.onSurfaceVariant, fontSize: normalize(10) }]}>
                {item.status}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={() => openEditModal(item)}
              style={styles.actionBtn}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <View style={[styles.actionBtnInner, { backgroundColor: theme.colors.primary + '15' }]}>
                <MaterialCommunityIcons name="pencil-outline" size={18} color={theme.colors.primary} />
              </View>
            </Pressable>
            <Pressable
              onPress={() => openDeleteDialog(item)}
              style={styles.actionBtn}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <View style={[styles.actionBtnInner, { backgroundColor: theme.colors.error + '15' }]}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.colors.error} />
              </View>
            </Pressable>
          </View>
        </View>
      </CustomCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="tag-off-outline"
            title="No Categories Yet"
            description="Organize your products by adding categories. Create your first category below."
            actionTitle="Add Category"
            onActionPress={openAddModal}
          />
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={openAddModal}
      />

      {/* Inline Modal for Add/Edit Category */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            {/* Drag Handle */}
            <View style={styles.dragHandleWrapper}>
              <View style={[styles.dragHandle, { backgroundColor: theme.colors.outline + '80' }]} />
            </View>

            <Text style={[styles.modalTitle, { color: theme.colors.onSurface, fontSize: normalize(18) }]}>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </Text>
            <Divider style={{ marginBottom: 16 }} />

            <ScrollView showsVerticalScrollIndicator={false}>
              <Controller
                control={control}
                rules={{ required: 'Category Name is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Category Name *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    leftIcon="tag-outline"
                    error={errors.name?.message}
                  />
                )}
                name="name"
              />

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Description"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    leftIcon="text-justify"
                    multiline
                    numberOfLines={2}
                  />
                )}
                name="description"
              />

              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: theme.colors.onSurface, fontSize: normalize(14) }]}>
                  Status: <Text style={{ color: categoryStatus === 'Active' ? theme.colors.success : theme.colors.error, fontWeight: '700' }}>{categoryStatus}</Text>
                </Text>
                <Switch
                  value={categoryStatus === 'Active'}
                  onValueChange={(val) => setValue('status', val ? 'Active' : 'Inactive')}
                  color={theme.colors.primary}
                />
              </View>

              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalBtn}
                  contentStyle={styles.modalBtnContent}
                  labelStyle={{ fontSize: normalize(14), fontWeight: '600' }}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  style={styles.modalBtn}
                  contentStyle={styles.modalBtnContent}
                  labelStyle={{ fontSize: normalize(14), fontWeight: '700' }}
                >
                  Save
                </Button>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ConfirmationDialog
        visible={deleteVisible}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteVisible(false);
          setCategoryToDelete(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: SCREEN_PADDING,
    paddingBottom: 96,
  },
  card: {
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    lineHeight: 18,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
    gap: 8,
  },
  actionBtn: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  dragHandleWrapper: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 16,
    gap: 12,
  },
  modalBtn: {
    flex: 1,
  },
  modalBtnContent: {
    height: 48,
  },
});
