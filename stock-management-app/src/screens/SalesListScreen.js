import React, { useContext } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { CustomCard } from '../components/CustomCard';

export default function SalesListScreen({ navigation }) {
  const theme = useTheme();
  const { sales, currency } = useContext(AppContext);

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

  const renderSaleItem = ({ item }) => {
    return (
      <CustomCard
        onPress={() => navigation.navigate('InvoicePreview', { saleId: item.id })}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="arrow-up-bold-box" size={24} color={theme.colors.success} />
            <View style={styles.headerText}>
              <Text style={[styles.productName, { color: theme.colors.onSurface }]} numberOfLines={1}>
                {item.product} (x{item.quantity})
              </Text>
              <Text style={[styles.invoiceNo, { color: theme.colors.primary }]}>
                {item.invoiceNo}
              </Text>
            </View>
          </View>
          <Text style={[styles.total, { color: theme.colors.success }]}>
            +{formatCurrency(item.total)}
          </Text>
        </View>

        <View style={[styles.details, { borderTopColor: theme.colors.outline + '40' }]}>
          <View style={styles.row}>
            <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Customer</Text>
            <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>{item.customer}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Payment Method</Text>
            <View style={[styles.payBadge, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text style={[styles.payBadgeText, { color: theme.colors.primary }]}>{item.paymentMethod}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Date</Text>
            <Text style={[styles.detailValue, { color: theme.colors.onSurfaceVariant }]}>{formatDate(item.date)}</Text>
          </View>
        </View>
      </CustomCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={sales}
        renderItem={renderSaleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="cash-register"
            title="No Sales Logged"
            description="Sell products and record invoices for customers to start generating revenue."
            actionTitle="Record Sale"
            onActionPress={() => navigation.navigate('AddSale')}
          />
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={() => navigation.navigate('AddSale')}
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
  invoiceNo: {
    fontSize: 12,
    fontWeight: '600',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  payBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  payBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
