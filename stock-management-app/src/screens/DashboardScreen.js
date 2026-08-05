import React, { useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { DashboardCard } from '../components/DashboardCard';
import { SectionHeader } from '../components/SectionHeader';
import { CustomCard } from '../components/CustomCard';



export default function DashboardScreen({ navigation }) {
  const theme = useTheme();
  const {
    products,
    categories,
    sales,
    purchases,
    currency,
  } = useContext(AppContext);

  // Format currency helper
  const formatCurrency = (val) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  // Calculations
  const totalProducts = products.length;
  const totalCategories = categories.length;

  const revenue = sales.reduce((acc, curr) => acc + curr.total, 0);
  
  // Profit calculation = sellingPrice * quantity - purchasePrice * quantity (approximated based on matched product)
  const totalProfit = sales.reduce((acc, curr) => {
    // Find the original product to get purchase price
    const prod = products.find((p) => p.id === curr.productId);
    const cost = prod ? prod.purchasePrice : (curr.sellingPrice * 0.6); // fallback to 40% margin
    const itemProfit = (curr.sellingPrice * curr.quantity) - curr.discount - (cost * curr.quantity);
    return acc + itemProfit;
  }, 0);

  const lowStockProducts = products.filter(p => p.quantity <= p.minStock && p.quantity > 0).length;
  const outOfStockProducts = products.filter(p => p.quantity === 0).length;

  // Let's calculate today's totals
  const todayStr = new Date().toISOString().split('T')[0];
  
  const isTodayDate = (value) => typeof value === 'string' && value.startsWith(todayStr);

  const todaySalesCount = sales.filter((s) => isTodayDate(s.date)).length;
  const todayPurchasesCount = purchases.filter((p) => isTodayDate(p.date)).length;

  const recentSales = sales.slice(0, 3);
  const recentPurchases = purchases.slice(0, 3);

  // Top selling products based on quantities sold in sales
  const productSalesMap = {};
  sales.forEach((s) => {
    productSalesMap[s.product] = (productSalesMap[s.product] || 0) + s.quantity;
  });
  const topSelling = Object.keys(productSalesMap)
    .map(name => ({ name, qty: productSalesMap[name] }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 3);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header Info */}
      <View style={styles.topBanner}>
        <View>
          <Text style={[styles.welcomeText, { color: theme.colors.onSurfaceVariant }]}>Welcome to your dashboard</Text>
          <Text style={[styles.businessText, { color: theme.colors.onSurface }]}>Apex Control Panel</Text>
        </View>
        <IconButton
          icon="bell-outline"
          size={24}
          onPress={() => navigation.navigate('Notifications')}
          containerColor={theme.colors.surface}
          iconColor={theme.colors.primary}
        />
      </View>

      {/* Quick Action Grid */}
      <SectionHeader title="Quick Actions" />
      <View style={styles.quickActionsContainer}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: theme.colors.primaryContainer }]}
          onPress={() => navigation.navigate('AddEditProduct')}
        >
          <MaterialCommunityIcons name="cube-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.actionBtnText, { color: theme.colors.primary }]}>+ Product</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: theme.colors.secondaryContainer }]}
          onPress={() => navigation.navigate('AddSale')}
        >
          <MaterialCommunityIcons name="currency-usd" size={24} color={theme.colors.secondary} />
          <Text style={[styles.actionBtnText, { color: theme.colors.secondary }]}>+ Record Sale</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: theme.colors.tertiaryContainer }]}
          onPress={() => navigation.navigate('AddPurchase')}
        >
          <MaterialCommunityIcons name="cart-arrow-down" size={24} color={theme.colors.warning} />
          <Text style={[styles.actionBtnText, { color: theme.colors.warning }]}>+ Purchase</Text>
        </Pressable>
      </View>

      {/* Stats Summary Grid */}
      <SectionHeader title="Inventory Performance" />
      <View style={styles.statsGrid}>
        <DashboardCard
          title="Total Products"
          value={totalProducts}
          icon="cube"
          color={theme.colors.primary}
          trend="+4 new"
          trendType="up"
        />
        <DashboardCard
          title="Total Categories"
          value={totalCategories}
          icon="tag-multiple"
          color={theme.colors.secondary}
        />
        <DashboardCard
          title="Today's Sales"
          value={todaySalesCount}
          icon="shopping"
          color="#8B5CF6"
          trend={todaySalesCount > 0 ? "Active" : "None"}
          trendType={todaySalesCount > 0 ? "up" : "flat"}
        />
        <DashboardCard
          title="Today's Purchases"
          value={todayPurchasesCount}
          icon="truck-delivery"
          color="#06B6D4"
        />
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(revenue)}
          icon="cash-multiple"
          color="#10B981"
          trend="+12%"
          trendType="up"
        />
        <DashboardCard
          title="Est. Gross Profit"
          value={formatCurrency(totalProfit)}
          icon="chart-line"
          color="#F59E0B"
          trend="+8%"
          trendType="up"
        />
        <DashboardCard
          title="Low Stock Items"
          value={lowStockProducts}
          icon="alert-circle-outline"
          color={theme.colors.warning}
          trend={lowStockProducts > 0 ? "Review Needed" : "Healthy"}
          trendType={lowStockProducts > 0 ? "warning" : "flat"}
        />
        <DashboardCard
          title="Out of Stock Items"
          value={outOfStockProducts}
          icon="close-circle-outline"
          color={theme.colors.error}
          trend={outOfStockProducts > 0 ? "Critical" : "Perfect"}
          trendType={outOfStockProducts > 0 ? "down" : "flat"}
        />
      </View>

      {/* Charts Section */}
      <SectionHeader title="Revenue Overview (Past 6 Months)" />
      <CustomCard style={styles.chartCard}>
        <View style={styles.chartContainer}>
          <View style={styles.yAxis}>
            <Text style={styles.axisLabel}>$4k</Text>
            <Text style={styles.axisLabel}>$3k</Text>
            <Text style={styles.axisLabel}>$2k</Text>
            <Text style={styles.axisLabel}>$1k</Text>
            <Text style={styles.axisLabel}>$0</Text>
          </View>
          <View style={styles.chartBody}>
            {/* Horizontal Grid lines */}
            <View style={styles.gridLinesContainer}>
              <View style={[styles.gridLine, { borderColor: theme.colors.outline + '30' }]} />
              <View style={[styles.gridLine, { borderColor: theme.colors.outline + '30' }]} />
              <View style={[styles.gridLine, { borderColor: theme.colors.outline + '30' }]} />
              <View style={[styles.gridLine, { borderColor: theme.colors.outline + '30' }]} />
            </View>
            {/* Columns */}
            <View style={styles.barsContainer}>
              {[
                { label: 'Feb', val: 0.3 },
                { label: 'Mar', val: 0.55 },
                { label: 'Apr', val: 0.45 },
                { label: 'May', val: 0.75 },
                { label: 'Jun', val: 0.9 },
                { label: 'Jul', val: 0.65 },
              ].map((bar, idx) => (
                <View key={idx} style={styles.barWrapper}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${bar.val * 100}%`,
                          backgroundColor: theme.colors.primary,
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, { color: theme.colors.onSurfaceVariant }]}>{bar.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </CustomCard>

      {/* Top Sellers */}
      {topSelling.length > 0 && (
        <>
          <SectionHeader title="Top Selling Products" />
          <CustomCard>
            {topSelling.map((prod, idx) => (
              <View key={idx} style={[styles.topSellerRow, idx < topSelling.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.outline + '40' }]}>
                <View style={styles.topSellerLeft}>
                  <View style={[styles.topSellerRank, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>#{idx + 1}</Text>
                  </View>
                  <Text style={[styles.topSellerName, { color: theme.colors.onSurface }]}>{prod.name}</Text>
                </View>
                <Text style={[styles.topSellerQty, { color: theme.colors.secondary }]}>{prod.qty} sold</Text>
              </View>
            ))}
          </CustomCard>
        </>
      )}

      {/* Recent Activity lists */}
      <SectionHeader title="Recent Transactions" actionTitle="View All" onActionPress={() => navigation.navigate('Sales')} />
      <CustomCard style={styles.activityCard}>
        <Text style={[styles.activitySubheading, { color: theme.colors.onSurfaceVariant }]}>Recent Sales</Text>
        {recentSales.length === 0 ? (
          <Text style={[styles.emptyActText, { color: theme.colors.onSurfaceVariant }]}>No sales recorded yet.</Text>
        ) : (
          recentSales.map((s, i) => (
            <View key={i} style={styles.activityItem}>
              <View style={styles.activityLeft}>
                <MaterialCommunityIcons name="arrow-up-bold-box-outline" size={20} color={theme.colors.success} />
                <View style={styles.activityText}>
                  <Text style={[styles.activityTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
                    {s.product} (x{s.quantity})
                  </Text>
                  <Text style={[styles.activityTime, { color: theme.colors.onSurfaceVariant }]}>
                    Invoice {s.invoiceNo} • {s.customer}
                  </Text>
                </View>
              </View>
              <Text style={[styles.activityAmt, { color: theme.colors.success }]}>+{formatCurrency(s.total)}</Text>
            </View>
          ))
        )}

        <Text style={[styles.activitySubheading, styles.subheadingMargin, { color: theme.colors.onSurfaceVariant }]}>Recent Purchases</Text>
        {recentPurchases.length === 0 ? (
          <Text style={[styles.emptyActText, { color: theme.colors.onSurfaceVariant }]}>No purchases recorded yet.</Text>
        ) : (
          recentPurchases.map((p, i) => (
            <View key={i} style={styles.activityItem}>
              <View style={styles.activityLeft}>
                <MaterialCommunityIcons name="arrow-down-bold-box-outline" size={20} color={theme.colors.error} />
                <View style={styles.activityText}>
                  <Text style={[styles.activityTitle, { color: theme.colors.onSurface }]} numberOfLines={1}>
                    {p.product} (x{p.quantity})
                  </Text>
                  <Text style={[styles.activityTime, { color: theme.colors.onSurfaceVariant }]}>
                    Supplier: {p.supplier}
                  </Text>
                </View>
              </View>
              <Text style={[styles.activityAmt, { color: theme.colors.error }]}>-{formatCurrency(p.total)}</Text>
            </View>
          ))
        )}
      </CustomCard>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  businessText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  actionBtn: {
    flex: 1,
    height: 70,
    marginHorizontal: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -6,
  },
  chartCard: {
    padding: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 160,
  },
  yAxis: {
    width: 32,
    justifyContent: 'space-between',
    paddingVertical: 10,
    height: 135,
  },
  axisLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'right',
  },
  chartBody: {
    flex: 1,
    marginLeft: 8,
    position: 'relative',
  },
  gridLinesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 10,
    height: 125,
    justifyContent: 'space-between',
  },
  gridLine: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    width: '100%',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 155,
  },
  barWrapper: {
    alignItems: 'center',
    width: '14%',
  },
  barTrack: {
    height: 125,
    width: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
  },
  barLabel: {
    fontSize: 10,
    marginTop: 6,
    fontWeight: '600',
  },
  topSellerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  topSellerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topSellerRank: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topSellerName: {
    fontWeight: '600',
    fontSize: 14,
  },
  topSellerQty: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  activityCard: {
    paddingVertical: 12,
  },
  activitySubheading: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  subheadingMargin: {
    marginTop: 20,
  },
  emptyActText: {
    fontSize: 13,
    fontStyle: 'italic',
    paddingHorizontal: 4,
    marginVertical: 4,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityText: {
    marginLeft: 10,
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityTime: {
    fontSize: 11,
    marginTop: 2,
  },
  activityAmt: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

