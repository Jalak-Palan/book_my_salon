import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Linking } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { CustomCard } from '../components/CustomCard';

export default function SupplierListScreen({ navigation }) {
  const theme = useTheme();
  const { suppliers, deleteSupplier } = useContext(AppContext);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const handleDeletePress = (sup) => {
    setSupplierToDelete(sup);
    setDeleteVisible(true);
  };

  const handleConfirmDelete = () => {
    if (supplierToDelete) {
      deleteSupplier(supplierToDelete.id);
      setDeleteVisible(false);
      setSupplierToDelete(null);
    }
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`).catch(() => {});
  };

  const renderSupplierItem = ({ item }) => {
    return (
      <CustomCard style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
                {item.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </View>
            <View style={styles.nameSection}>
              <Text style={[styles.name, { color: theme.colors.onSurface }]}>{item.name}</Text>
              <Text style={[styles.company, { color: theme.colors.onSurfaceVariant }]}>{item.company}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={() => navigation.navigate('AddEditSupplier', { supplierId: item.id })}
              style={styles.actionBtn}
            >
              <MaterialCommunityIcons name="pencil-outline" size={20} color={theme.colors.primary} />
            </Pressable>
            <Pressable onPress={() => handleDeletePress(item)} style={styles.actionBtn}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.colors.error} />
            </Pressable>
          </View>
        </View>

        <View style={styles.contactSection}>
          <Pressable onPress={() => handleCall(item.phone)} style={styles.contactItem}>
            <MaterialCommunityIcons name="phone" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.contactText, { color: theme.colors.onSurface }]}>{item.phone}</Text>
          </Pressable>
          <Pressable onPress={() => handleEmail(item.email)} style={styles.contactItem}>
            <MaterialCommunityIcons name="email-outline" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.contactText, { color: theme.colors.onSurface }]} numberOfLines={1}>{item.email}</Text>
          </Pressable>
        </View>

        <View style={[styles.addressSection, { borderTopColor: theme.colors.outline + '40' }]}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color={theme.colors.onSurfaceVariant} style={{ marginTop: 2 }} />
          <Text style={[styles.addressText, { color: theme.colors.onSurfaceVariant }]}>
            {item.address}, {item.city}, {item.state}, {item.country}
          </Text>
        </View>
      </CustomCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={suppliers}
        renderItem={renderSupplierItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="truck-remove-outline"
            title="No Suppliers Registered"
            description="Keep track of your supply chains by adding vendor details."
            actionTitle="Add Supplier"
            onActionPress={() => navigation.navigate('AddEditSupplier')}
          />
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={() => navigation.navigate('AddEditSupplier')}
      />

      <ConfirmationDialog
        visible={deleteVisible}
        title="Delete Supplier"
        message={`Are you sure you want to delete supplier "${supplierToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteVisible(false);
          setSupplierToDelete(null);
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: 6,
    marginLeft: 6,
  },
  contactSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 6,
  },
  contactText: {
    fontSize: 13,
    marginLeft: 6,
  },
  addressSection: {
    flexDirection: 'row',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  addressText: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
