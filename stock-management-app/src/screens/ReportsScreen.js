import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { SectionHeader } from '../components/SectionHeader';
import { CustomCard } from '../components/CustomCard';

export default function ReportsScreen() {
  const theme = useTheme();
  const { sales, purchases, currency } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('monthly'); // daily, weekly, monthly, yearly

  const formatCurrency = (val) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  // Get statistics based on tab selection
  const getStats = () => {
    switch (activeTab) {
      case 'daily':
        return {
          revenue: 120.50,
          expenses: 75.00,
          margin: 45.50,
          salesCount: 3,
          chartData: [
            { label: '8 AM', val: 0.15 },
            { label: '11 AM', val: 0.4 },
            { label: '2 PM', val: 0.75 },
            { label: '5 PM', val: 0.6 },
            { label: '8 PM', val: 0.3 },
          ],
        };
      case 'weekly':
        return {
          revenue: 950.00,
          expenses: 540.00,
          margin: 410.00,
          salesCount: 15,
          chartData: [
            { label: 'Mon', val: 0.3 },
            { label: 'Tue', val: 0.5 },
            { label: 'Wed', val: 0.75 },
            { label: 'Thu', val: 0.6 },
            { label: 'Fri', val: 0.9 },
            { label: 'Sat', val: 0.45 },
            { label: 'Sun', val: 0.2 },
          ],
        };
      case 'yearly':
        return {
          revenue: 25400.00,
          expenses: 14800.00,
          margin: 10600.00,
          salesCount: 420,
          chartData: [
            { label: '2023', val: 0.5 },
            { label: '2024', val: 0.7 },
            { label: '2025', val: 0.85 },
            { label: '2026', val: 0.95 },
          ],
        };
      case 'monthly':
      default:
        // Calculate dynamic sums from the context dummy data for realism
        const totalSales = sales.reduce((acc, curr) => acc + curr.total, 0);
        const totalPurchases = purchases.reduce((acc, curr) => acc + curr.total, 0);
        return {
          revenue: totalSales,
          expenses: totalPurchases,
          margin: totalSales - totalPurchases,
          salesCount: sales.length,
          chartData: [
            { label: 'Jan', val: 0.4 },
            { label: 'Feb', val: 0.35 },
            { label: 'Mar', val: 0.55 },
            { label: 'Apr', val: 0.65 },
            { label: 'May', val: 0.8 },
            { label: 'Jun', val: 0.95 },
          ],
        };
    }
  };

  const stats = getStats();
  const netMarginPercent = stats.revenue > 0 ? ((stats.margin / stats.revenue) * 100).toFixed(0) : 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Tabs Row */}
      <View style={[styles.tabsRow, { backgroundColor: theme.colors.surfaceVariant, borderRadius: theme.roundness }]}>
        {['daily', 'weekly', 'monthly', 'yearly'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabBtn,
                isActive && { backgroundColor: theme.colors.surface, borderRadius: theme.roundness - 2 },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? theme.colors.primary : theme.colors.onSurfaceVariant },
                  isActive && { fontWeight: 'bold' },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Overview Cards */}
      <SectionHeader title="Financial Report Summary" />
      <View style={styles.grid}>
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="wallet-outline" size={20} color={theme.colors.primary} />
          </View>
          <Text style={[styles.cardLabel, { color: theme.colors.onSurfaceVariant }]}>Gross Revenue</Text>
          <Text style={[styles.cardValue, { color: theme.colors.primary }]}>{formatCurrency(stats.revenue)}</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.error + '15' }]}>
            <MaterialCommunityIcons name="cart-arrow-down" size={20} color={theme.colors.error} />
          </View>
          <Text style={[styles.cardLabel, { color: theme.colors.onSurfaceVariant }]}>Purchases / Expenses</Text>
          <Text style={[styles.cardValue, { color: theme.colors.error }]}>{formatCurrency(stats.expenses)}</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.success + '15' }]}>
            <MaterialCommunityIcons name="hand-coin-outline" size={20} color={theme.colors.success} />
          </View>
          <Text style={[styles.cardLabel, { color: theme.colors.onSurfaceVariant }]}>Net Profit Margin</Text>
          <Text style={[styles.cardValue, { color: theme.colors.success }]}>
            {formatCurrency(stats.margin)} <Text style={styles.percentText}>({netMarginPercent}%)</Text>
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.iconCircle, { backgroundColor: '#8B5CF615' }]}>
            <MaterialCommunityIcons name="tag-outline" size={20} color="#8B5CF6" />
          </View>
          <Text style={[styles.cardLabel, { color: theme.colors.onSurfaceVariant }]}>Invoice Volume</Text>
          <Text style={[styles.cardValue, { color: '#8B5CF6' }]}>{stats.salesCount} sold</Text>
        </View>
      </View>

      {/* Visual Chart */}
      <SectionHeader title="Sales Distribution Analytics" />
      <CustomCard style={styles.chartCard}>
        <View style={styles.chartContainer}>
          <View style={styles.barsContainer}>
            {stats.chartData.map((bar, idx) => (
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
      </CustomCard>

      {/* Extra KPI cards */}
      <SectionHeader title="Inventory Turnover Stats" />
      <CustomCard style={{ marginBottom: 40 }}>
        <View style={styles.kpiRow}>
          <View style={styles.kpiCol}>
            <Text style={[styles.kpiTitle, { color: theme.colors.onSurface }]}>Stock Accuracy</Text>
            <Text style={styles.kpiVal}>99.4%</Text>
          </View>
          <View style={styles.kpiCol}>
            <Text style={[styles.kpiTitle, { color: theme.colors.onSurface }]}>Fulfillment Rate</Text>
            <Text style={styles.kpiVal}>98.2%</Text>
          </View>
          <View style={styles.kpiCol}>
            <Text style={[styles.kpiTitle, { color: theme.colors.onSurface }]}>Turnover Ratio</Text>
            <Text style={styles.kpiVal}>4.2x</Text>
          </View>
        </View>
      </CustomCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    height: 44,
    padding: 3,
    marginTop: 16,
    marginBottom: 8,
  },
  tabBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  summaryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '500',
  },
  chartCard: {
    padding: 16,
  },
  chartContainer: {
    height: 160,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 130,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 100,
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
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  kpiCol: {
    alignItems: 'center',
  },
  kpiTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  kpiVal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
