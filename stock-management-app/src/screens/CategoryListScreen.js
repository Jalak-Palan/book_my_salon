import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Modal, ScrollView } from 'react-native';
import { useTheme, FAB, Button, Switch, Divider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useForm, Controller } from 'react-hook-form';
import { AppContext } from '../context/AppContext';
import { CustomInput } from '../components/CustomInput';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { EmptyState } from '../components/EmptyState';
import { CustomCard } from '../components/CustomCard';

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
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.colors.onSurface }]}>{item.name}</Text>
            {item.description ? (
              <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>{item.description}</Text>
            ) : null}
            <View style={[styles.badge, { backgroundColor: isActive ? theme.colors.success + '15' : theme.colors.outline }]}>
              <Text style={[styles.badgeText, { color: isActive ? theme.colors.success : theme.colors.onSurfaceVariant }]}>
                {item.status}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable onPress={() => openEditModal(item)} style={styles.actionBtn}>
              <MaterialCommunityIcons name="pencil-outline" size={22} color={theme.colors.primary} />
            </Pressable>
            <Pressable onPress={() => openDeleteDialog(item)} style={styles.actionBtn}>
              <MaterialCommunityIcons name="trash-can-outline" size={22} color={theme.colors.error} />
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
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
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
                <Text style={[styles.switchLabel, { color: theme.colors.onSurface }]}>
                  Status: {categoryStatus}
                </Text>
                <Switch
                  value={categoryStatus === 'Active'}
                  onValueChange={(val) => setValue('status', val ? 'Active' : 'Inactive')}
                  color={theme.colors.primary}
                />
              </View>

              <View style={styles.modalActions}>
                <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.modalBtn}>
                  Cancel
                </Button>
                <Button mode="contained" onPress={handleSubmit(onSubmit)} style={styles.modalBtn}>
                  Save
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
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
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  actionBtn: {
    padding: 8,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '75%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 16,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 6,
  },
});
