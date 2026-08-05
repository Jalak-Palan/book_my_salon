import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Linking } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { CustomCard } from '../components/CustomCard';

export default function CustomerListScreen({ navigation }) {
  const theme = useTheme();
  const { customers, deleteCustomer } = useContext(AppContext);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const handleDeletePress = (cust) => {
    setCustomerToDelete(cust);
    setDeleteVisible(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      setDeleteVisible(false);
      setCustomerToDelete(null);
    }
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`).catch(() => {});
  };

  const renderCustomerItem = ({ item }) => {
    return (
      <CustomCard style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Text style={[styles.avatarText, { color: theme.colors.secondary }]}>
                {item.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            </View>
            <View style={styles.nameSection}>
              <Text style={[styles.name, { color: theme.colors.onSurface }]}>{item.name}</Text>
              <Text style={[styles.phoneText, { color: theme.colors.onSurfaceVariant }]} onPress={() => handleCall(item.phone)}>
                {item.phone}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={() => navigation.navigate('AddEditCustomer', { customerId: item.id })}
              style={styles.actionBtn}
            >
              <MaterialCommunityIcons name="pencil-outline" size={20} color={theme.colors.primary} />
            </Pressable>
            <Pressable onPress={() => handleDeletePress(item)} style={styles.actionBtn}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.colors.error} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.detailSection, { borderTopColor: theme.colors.outline + '40' }]}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="email-outline" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.detailText, { color: theme.colors.onSurface }]} onPress={() => handleEmail(item.email)}>
              {item.email}
            </Text>
          </View>
          <View style={[styles.detailRow, { marginTop: 6 }]}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>{item.address}</Text>
          </View>
        </View>
      </CustomCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={customers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="account-off-outline"
            title="No Customers Found"
            description="Manage client relationships by adding customer contact cards."
            actionTitle="Add Customer"
            onActionPress={() => navigation.navigate('AddEditCustomer')}
          />
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={() => navigation.navigate('AddEditCustomer')}
      />

      <ConfirmationDialog
        visible={deleteVisible}
        title="Delete Customer"
        message={`Are you sure you want to delete customer "${customerToDelete?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteVisible(false);
          setCustomerToDelete(null);
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
  phoneText: {
    fontSize: 13,
    marginTop: 2,
    textDecorationLine: 'underline',
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: 6,
    marginLeft: 6,
  },
  detailSection: {
    paddingTop: 8,
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
