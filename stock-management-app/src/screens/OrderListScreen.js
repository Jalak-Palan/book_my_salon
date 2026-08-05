import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Modal } from 'react-native';
import { useTheme, Divider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { CustomCard } from '../components/CustomCard';

export default function OrderListScreen() {
  const theme = useTheme();
  const { orders, updateOrderStatus, currency } = useContext(AppContext);

  // Status Selector modal state
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatCurrency = (val) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return theme.colors.success;
      case 'Confirmed':
        return theme.colors.primary;
      case 'Packed':
        return theme.colors.warning;
      case 'Cancelled':
        return theme.colors.error;
      case 'Pending':
      default:
        return '#8B5CF6'; // purple accent
    }
  };

  const handleStatusPress = (order) => {
    setSelectedOrder(order);
    setStatusModalVisible(true);
  };

  const handleSelectStatus = (status) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, status);
      setStatusModalVisible(false);
      setSelectedOrder(null);
    }
  };

  const statusOptions = ['Pending', 'Confirmed', 'Packed', 'Delivered', 'Cancelled'];

  const renderOrderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <CustomCard style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.orderId, { color: theme.colors.onSurface }]}>Order #{item.id}</Text>
            <Text style={[styles.customerName, { color: theme.colors.onSurfaceVariant }]}>{item.customer}</Text>
          </View>
          <Pressable onPress={() => handleStatusPress(item)} style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
            <MaterialCommunityIcons name="chevron-down" size={12} color={statusColor} style={{ marginLeft: 2 }} />
          </Pressable>
        </View>

        <Divider style={{ marginVertical: 8 }} />

        <View style={styles.detailsRow}>
          <Text style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}>Date: {item.date}</Text>
          <Text style={[styles.amountText, { color: theme.colors.primary }]}>{formatCurrency(item.amount)}</Text>
        </View>
      </CustomCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="truck-fast-outline"
            title="No Orders Found"
            description="Manage client transactions and stock deliveries here."
          />
        }
      />

      {/* Status Picker Modal */}
      <Modal
        visible={statusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setStatusModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Update Order Status</Text>
            <Divider style={{ marginBottom: 12 }} />
            <FlatList
              data={statusOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelectStatus(item)}
                  style={styles.selectRow}
                >
                  <Text style={[styles.selectText, { color: getStatusColor(item) }]}>{item}</Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <Divider />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  customerName: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
  },
  amountText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectRow: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  selectText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
