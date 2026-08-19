import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useTheme, FAB, Platform } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { CustomCard } from '../components/CustomCard';
import { SearchBar } from '../components/SearchBar';
import { normalize, SCREEN_PADDING } from '../utils/dimensions';

export default function SalesListScreen({ navigation }) {
  const theme = useTheme();
  const { sales, currency } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredSales = sales.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.product?.toLowerCase().includes(q) ||
      s.invoiceNo?.toLowerCase().includes(q) ||
      s.customer?.toLowerCase().includes(q)
    );
  });

  const renderSaleItem = ({ item }) => {
    return (
      <CustomCard
        onPress={() => navigation.navigate('InvoicePreview', { saleId: item.id })}
        style={styles.card}
      >
        {/* Green left accent border */}
        <View style={[styles.accentBorder, { backgroundColor: theme.colors.success }]} />

        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.success + '18' }]}>
                <MaterialCommunityIcons name="arrow-up-bold-box" size={22} color={theme.colors.success} />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.productName, { color: theme.colors.onSurface, fontSize: normalize(15) }]} numberOfLines={1}>
                  {item.product} (x{item.quantity})
                </Text>
                <Text style={[styles.invoiceNo, { color: theme.colors.primary, fontSize: normalize(12) }]}>
                  {item.invoiceNo}
                </Text>
              </View>
            </View>
            <Text style={[styles.total, { color: theme.colors.success, fontSize: normalize(16) }]}>
              +{formatCurrency(item.total)}
            </Text>
          </View>

          <View style={[styles.details, { borderTopColor: theme.colors.outline + '40' }]}>
            <View style={styles.row}>
              <View style={styles.detailLabelRow}>
                <MaterialCommunityIcons name="account-outline" size={13} color={theme.colors.onSurfaceVariant} style={{ marginRight: 4 }} />
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant, fontSize: normalize(12) }]}>Customer</Text>
              </View>
              <Text style={[styles.detailValue, { color: theme.colors.onSurface, fontSize: normalize(12) }]}>{item.customer}</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.detailLabelRow}>
                <MaterialCommunityIcons name="credit-card-outline" size={13} color={theme.colors.onSurfaceVariant} style={{ marginRight: 4 }} />
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant, fontSize: normalize(12) }]}>Payment</Text>
              </View>
              <View style={[styles.payBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text style={[styles.payBadgeText, { color: theme.colors.primary, fontSize: normalize(11) }]}>{item.paymentMethod}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.detailLabelRow}>
                <MaterialCommunityIcons name="calendar-outline" size={13} color={theme.colors.onSurfaceVariant} style={{ marginRight: 4 }} />
                <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant, fontSize: normalize(12) }]}>Date</Text>
              </View>
              <Text style={[styles.detailValue, { color: theme.colors.onSurfaceVariant, fontSize: normalize(12) }]}>{formatDate(item.date)}</Text>
            </View>
          </View>
        </View>
      </CustomCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SearchBar
        placeholder="Search by product, invoice, customer..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredSales}
        renderItem={renderSaleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="cash-register"
            title={searchQuery ? 'No Results Found' : 'No Sales Logged'}
            description={
              searchQuery
                ? `No sales match "${searchQuery}".`
                : 'Sell products and record invoices for customers to start generating revenue.'
            }
            actionTitle={searchQuery ? undefined : 'Record Sale'}
            onActionPress={searchQuery ? undefined : () => navigation.navigate('AddSale')}
          />
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={() => navigation.navigate('AddSale')}
        size="medium"
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
    paddingLeft: 0,
  },
  accentBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  cardContent: {
    paddingLeft: 16,
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
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  productName: {
    fontWeight: '700',
  },
  invoiceNo: {
    fontWeight: '600',
    marginTop: 2,
  },
  total: {
    fontWeight: '800',
    marginLeft: 8,
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
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontWeight: '500',
  },
  detailValue: {
    fontWeight: '600',
  },
  payBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  payBadgeText: {
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
