import React, { useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { DashboardCard } from '../components/DashboardCard';
import { SectionHeader } from '../components/SectionHeader';
import { CustomCard } from '../components/CustomCard';
import { normalize, SCREEN_PADDING, screenWidth } from '../utils/dimensions';



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
  
  // Profit calculation
  const totalProfit = sales.reduce((acc, curr) => {
    const prod = products.find((p) => p.id === curr.productId);
    const cost = prod ? prod.purchasePrice : (curr.sellingPrice * 0.6);
    const itemProfit = (curr.sellingPrice * curr.quantity) - curr.discount - (cost * curr.quantity);
    return acc + itemProfit;
  }, 0);

  const lowStockProducts = products.filter(p => p.quantity <= p.minStock && p.quantity > 0).length;
  const outOfStockProducts = products.filter(p => p.quantity === 0).length;

  // Today's totals
  const todayStr = new Date().toISOString().split('T')[0];
  const isTodayDate = (value) => typeof value === 'string' && value.startsWith(todayStr);
  const todaySalesCount = sales.filter((s) => isTodayDate(s.date)).length;
  const todayPurchasesCount = purchases.filter((p) => isTodayDate(p.date)).length;

  const recentSales = sales.slice(0, 3);
  const recentPurchases = purchases.slice(0, 3);

  // Top selling products
  const productSalesMap = {};
  sales.forEach((s) => {
    productSalesMap[s.product] = (productSalesMap[s.product] || 0) + s.quantity;
  });
  const topSelling = Object.keys(productSalesMap)
    .map(name => ({ name, qty: productSalesMap[name] }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 3);

  const quickActions = [
    {
      label: '+ Product',
      icon: 'cube-outline',
      bg: theme.colors.primaryContainer,
      color: theme.colors.primary,
      route: 'AddEditProduct',
    },
    {
      label: '+ Sale',
      icon: 'currency-usd',
      bg: theme.colors.secondaryContainer,
      color: theme.colors.secondary,
      route: 'AddSale',
    },
    {
      label: '+ Purchase',
      icon: 'cart-arrow-down',
      bg: theme.colors.tertiaryContainer,
      color: theme.colors.warning,
      route: 'AddPurchase',
    },
    {
      label: 'Reports',
      icon: 'chart-bar',
      bg: theme.colors.surfaceVariant,
      color: theme.colors.info,
      route: 'Reports',
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Gradient Header Banner */}
      <View style={[styles.headerBanner, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.welcomeText, { color: 'rgba(255,255,255,0.75)', fontSize: normalize(13) }]}>
              Welcome back 👋
            </Text>
            <Text style={[styles.businessText, { color: '#ffffff', fontSize: normalize(22) }]}>
              Apex Control Panel
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            style={[styles.notifBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="bell-outline" size={22} color="#ffffff" />
          </Pressable>
        </View>

        {/* Summary strip */}
        <View style={styles.summaryStrip}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalProducts}</Text>
            <Text style={styles.summaryLabel}>Products</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{sales.length}</Text>
            <Text style={styles.summaryLabel}>Sales</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{formatCurrency(revenue)}</Text>
            <Text style={styles.summaryLabel}>Revenue</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {/* Quick Action Grid */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, idx) => (
            <Pressable
              key={idx}
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: action.bg, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
              ]}
              onPress={() => navigation.navigate(action.route)}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: action.color + '20' }]}>
                <MaterialCommunityIcons name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={[styles.actionBtnText, { color: action.color, fontSize: normalize(11) }]}>
                {action.label}
              </Text>
            </Pressable>
          ))}
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
            trend={lowStockProducts > 0 ? "Review" : "Healthy"}
            trendType={lowStockProducts > 0 ? "warning" : "flat"}
          />
          <DashboardCard
            title="Out of Stock"
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
              <Text style={[styles.axisLabel, { color: theme.colors.onSurfaceVariant }]}>$4k</Text>
              <Text style={[styles.axisLabel, { color: theme.colors.onSurfaceVariant }]}>$3k</Text>
              <Text style={[styles.axisLabel, { color: theme.colors.onSurfaceVariant }]}>$2k</Text>
              <Text style={[styles.axisLabel, { color: theme.colors.onSurfaceVariant }]}>$1k</Text>
              <Text style={[styles.axisLabel, { color: theme.colors.onSurfaceVariant }]}>$0</Text>
            </View>
            <View style={styles.chartBody}>
              {/* Horizontal Grid lines */}
              <View style={styles.gridLinesContainer}>
                {[0, 1, 2, 3].map(i => (
                  <View key={i} style={[styles.gridLine, { borderColor: theme.colors.outline + '30' }]} />
                ))}
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
                            backgroundColor: bar.val >= 0.8
                              ? theme.colors.success
                              : bar.val >= 0.5
                                ? theme.colors.primary
                                : theme.colors.primary + '80',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barLabel, { color: theme.colors.onSurfaceVariant, fontSize: normalize(10) }]}>
                      {bar.label}
                    </Text>
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
                <View
                  key={idx}
                  style={[
                    styles.topSellerRow,
                    idx < topSelling.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.outline + '40',
                    },
                  ]}
                >
                  <View style={styles.topSellerLeft}>
                    <View
                      style={[
                        styles.topSellerRank,
                        {
                          backgroundColor: idx === 0
                            ? '#F59E0B20'
                            : idx === 1
                              ? theme.colors.outline + '40'
                              : theme.colors.surfaceVariant,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: idx === 0 ? '#F59E0B' : theme.colors.onSurfaceVariant,
                          fontWeight: 'bold',
                          fontSize: normalize(13),
                        }}
                      >
                        #{idx + 1}
                      </Text>
                    </View>
                    <Text style={[styles.topSellerName, { color: theme.colors.onSurface, fontSize: normalize(14) }]}>
                      {prod.name}
                    </Text>
                  </View>
                  <View style={[styles.topSellerBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
                    <Text style={[styles.topSellerQty, { color: theme.colors.secondary, fontSize: normalize(13) }]}>
                      {prod.qty} sold
                    </Text>
                  </View>
                </View>
              ))}
            </CustomCard>
          </>
        )}

        {/* Recent Activity lists */}
        <SectionHeader
          title="Recent Transactions"
          actionTitle="View All"
          onActionPress={() => navigation.navigate('Sales')}
        />
        <CustomCard style={styles.activityCard}>
          <Text style={[styles.activitySubheading, { color: theme.colors.onSurfaceVariant, fontSize: normalize(12) }]}>
            Recent Sales
          </Text>
          {recentSales.length === 0 ? (
            <Text style={[styles.emptyActText, { color: theme.colors.onSurfaceVariant }]}>
              No sales recorded yet.
            </Text>
          ) : (
            recentSales.map((s, i) => (
              <View key={i} style={[styles.activityItem, { borderBottomColor: theme.colors.outline + '30' }]}>
                <View style={[styles.activityIconWrap, { backgroundColor: theme.colors.success + '15' }]}>
                  <MaterialCommunityIcons name="arrow-up-bold-box-outline" size={20} color={theme.colors.success} />
                </View>
                <View style={styles.activityText}>
                  <Text style={[styles.activityTitle, { color: theme.colors.onSurface, fontSize: normalize(14) }]} numberOfLines={1}>
                    {s.product} (x{s.quantity})
                  </Text>
                  <Text style={[styles.activityTime, { color: theme.colors.onSurfaceVariant, fontSize: normalize(11) }]}>
                    {s.invoiceNo} • {s.customer}
                  </Text>
                </View>
                <Text style={[styles.activityAmt, { color: theme.colors.success, fontSize: normalize(14) }]}>
                  +{formatCurrency(s.total)}
                </Text>
              </View>
            ))
          )}

          <Text style={[styles.activitySubheading, styles.subheadingMargin, { color: theme.colors.onSurfaceVariant, fontSize: normalize(12) }]}>
            Recent Purchases
          </Text>
          {recentPurchases.length === 0 ? (
            <Text style={[styles.emptyActText, { color: theme.colors.onSurfaceVariant }]}>
              No purchases recorded yet.
            </Text>
          ) : (
            recentPurchases.map((p, i) => (
              <View key={i} style={[styles.activityItem, { borderBottomColor: theme.colors.outline + '30' }]}>
                <View style={[styles.activityIconWrap, { backgroundColor: theme.colors.error + '15' }]}>
                  <MaterialCommunityIcons name="arrow-down-bold-box-outline" size={20} color={theme.colors.error} />
                </View>
                <View style={styles.activityText}>
                  <Text style={[styles.activityTitle, { color: theme.colors.onSurface, fontSize: normalize(14) }]} numberOfLines={1}>
                    {p.product} (x{p.quantity})
                  </Text>
                  <Text style={[styles.activityTime, { color: theme.colors.onSurfaceVariant, fontSize: normalize(11) }]}>
                    Supplier: {p.supplier}
                  </Text>
                </View>
                <Text style={[styles.activityAmt, { color: theme.colors.error, fontSize: normalize(14) }]}>
                  -{formatCurrency(p.total)}
                </Text>
              </View>
            ))
          )}
        </CustomCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBanner: {
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  welcomeText: {
    fontWeight: '500',
    marginBottom: 2,
  },
  businessText: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 2,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '500',
  },
  summaryDivider: {
    width: 1,
    height: 30,
  },
  body: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 8,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 72,
  },
  actionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionBtnText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginVertical: 4,
  },
  chartCard: {
    padding: 4,
    marginBottom: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 170,
    padding: 8,
  },
  yAxis: {
    width: 34,
    justifyContent: 'space-between',
    paddingVertical: 10,
    height: 140,
  },
  axisLabel: {
    fontSize: 9,
    textAlign: 'right',
    fontWeight: '600',
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
    height: 160,
  },
  barWrapper: {
    alignItems: 'center',
    width: '14%',
  },
  barTrack: {
    height: 125,
    width: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
  },
  barLabel: {
    marginTop: 6,
    fontWeight: '600',
  },
  topSellerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  topSellerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topSellerRank: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topSellerName: {
    fontWeight: '600',
    flex: 1,
  },
  topSellerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  topSellerQty: {
    fontWeight: '700',
  },
  activityCard: {
    paddingVertical: 4,
  },
  activitySubheading: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  subheadingMargin: {
    marginTop: 18,
  },
  emptyActText: {
    fontSize: 13,
    fontStyle: 'italic',
    paddingHorizontal: 4,
    marginVertical: 6,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  activityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: '600',
  },
  activityTime: {
    marginTop: 2,
  },
  activityAmt: {
    fontWeight: '800',
  },
});
