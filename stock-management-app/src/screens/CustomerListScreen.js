import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Linking } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { CustomCard } from '../components/CustomCard';
import { SearchBar } from '../components/SearchBar';
import { normalize, MIN_TOUCH_SIZE, SCREEN_PADDING } from '../utils/dimensions';

export default function CustomerListScreen({ navigation }) {
  const theme = useTheme();
  const { customers, deleteCustomer } = useContext(AppContext);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  // Generate a deterministic color based on name
  const getAvatarColor = (name) => {
    const colors = ['#6366F1', '#0D9488', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#10B981'];
    const idx = (name.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  };

  const renderCustomerItem = ({ item }) => {
    const avatarColor = getAvatarColor(item.name);
    return (
      <CustomCard style={styles.card}>
        {/* Left color accent */}
        <View style={[styles.accentBar, { backgroundColor: avatarColor }]} />

        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
                <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
              </View>
              <View style={styles.nameSection}>
                <Text style={[styles.name, { color: theme.colors.onSurface, fontSize: normalize(15) }]}>
                  {item.name}
                </Text>
                <Pressable onPress={() => handleCall(item.phone)} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}>
                  <Text style={[styles.phoneText, { color: theme.colors.primary, fontSize: normalize(13) }]}>
                    {item.phone}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable
                onPress={() => navigation.navigate('AddEditCustomer', { customerId: item.id })}
                style={styles.actionBtn}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <View style={[styles.actionBtnInner, { backgroundColor: theme.colors.primary + '15' }]}>
                  <MaterialCommunityIcons name="pencil-outline" size={18} color={theme.colors.primary} />
                </View>
              </Pressable>
              <Pressable
                onPress={() => handleDeletePress(item)}
                style={styles.actionBtn}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <View style={[styles.actionBtnInner, { backgroundColor: theme.colors.error + '15' }]}>
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.colors.error} />
                </View>
              </Pressable>
            </View>
          </View>

          <View style={[styles.detailSection, { borderTopColor: theme.colors.outline + '40' }]}>
            <Pressable style={styles.detailRow} onPress={() => handleEmail(item.email)}>
              <View style={[styles.detailIconWrap, { backgroundColor: theme.colors.primaryContainer }]}>
                <MaterialCommunityIcons name="email-outline" size={15} color={theme.colors.primary} />
              </View>
              <Text style={[styles.detailText, { color: theme.colors.primary, fontSize: normalize(13) }]}>
                {item.email}
              </Text>
            </Pressable>
            {item.address ? (
              <View style={[styles.detailRow, { marginTop: 8 }]}>
                <View style={[styles.detailIconWrap, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <MaterialCommunityIcons name="map-marker-outline" size={15} color={theme.colors.onSurfaceVariant} />
                </View>
                <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant, fontSize: normalize(13) }]}>
                  {item.address}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </CustomCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SearchBar
        placeholder="Search by name, phone, email..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="account-off-outline"
            title={searchQuery ? 'No Customers Found' : 'No Customers Yet'}
            description={
              searchQuery
                ? `No customers match "${searchQuery}".`
                : 'Manage client relationships by adding customer contact cards.'
            }
            actionTitle={searchQuery ? undefined : 'Add Customer'}
            onActionPress={searchQuery ? undefined : () => navigation.navigate('AddEditCustomer')}
          />
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={() => navigation.navigate('AddEditCustomer')}
        size="medium"
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
  searchBar: {
    marginHorizontal: SCREEN_PADDING,
    marginTop: 12,
    marginBottom: 2,
  },
  listContainer: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 96,
    paddingTop: 4,
  },
  card: {
    marginVertical: 6,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  cardContent: {
    paddingLeft: 14,
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
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    marginBottom: 2,
  },
  phoneText: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  actions: {
    flexDirection: 'row',
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
  detailSection: {
    paddingTop: 10,
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailText: {
    flex: 1,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
