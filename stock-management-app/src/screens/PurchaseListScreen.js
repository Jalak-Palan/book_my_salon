import React, { useContext } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { CustomCard } from '../components/CustomCard';

export default function PurchaseListScreen({ navigation }) {
  const theme = useTheme();
  const { purchases, currency } = useContext(AppContext);

  const formatCurrency = (val) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const renderPurchaseItem = ({ item }) => {
    return (
      <CustomCard style={styles.card} outline>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="arrow-down-bold-box" size={24} color={theme.colors.error} />
            <View style={styles.headerText}>
              <Text style={[styles.productName, { color: theme.colors.onSurface }]} numberOfLines={1}>
                {item.product}
              </Text>
              <Text style={[styles.supplierName, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                Vendor: {item.supplier}
              </Text>
            </View>
          </View>
          <Text style={[styles.total, { color: theme.colors.error }]}>
            -{formatCurrency(item.total)}
          </Text>
        </View>

        <View style={[styles.details, { borderTopColor: theme.colors.outline + '40' }]}>
          <View style={styles.detailsRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Quantity</Text>
            <Text style={[styles.detailVal, { color: theme.colors.onSurface }]}>{item.quantity} units</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Unit Price</Text>
            <Text style={[styles.detailVal, { color: theme.colors.onSurface }]}>{formatCurrency(item.purchasePrice)}</Text>
          </View>
          {item.discount > 0 && (
            <View style={styles.detailsRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Discount</Text>
              <Text style={[styles.detailVal, { color: theme.colors.success }]}>-{formatCurrency(item.discount)}</Text>
            </View>
          )}
          <View style={styles.detailsRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Recorded Date</Text>
            <Text style={[styles.detailVal, { color: theme.colors.onSurfaceVariant }]}>{formatDate(item.date)}</Text>
          </View>
        </View>
      </CustomCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={purchases}
        renderItem={renderPurchaseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="cart-off"
            title="No Purchases Logged"
            description="Replenish your inventories by recording your stock purchase transactions."
            actionTitle="Record Purchase"
            onActionPress={() => navigation.navigate('AddPurchase')}
          />
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={() => navigation.navigate('AddPurchase')}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  supplierName: {
    fontSize: 12,
    marginTop: 2,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    borderTopWidth: 1,
    paddingTop: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
