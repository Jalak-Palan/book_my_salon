import React, { useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Platform } from 'react-native';
import { useTheme, Button, Divider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { AppContext } from '../context/AppContext';
import { CustomCard } from '../components/CustomCard';

export default function InvoicePreviewScreen({ route, navigation }) {
  const theme = useTheme();
  const { saleId } = route.params || {};
  const { sales, userProfile, currency } = useContext(AppContext);

  const sale = sales.find((s) => s.id === saleId);
  const invoiceDate = sale?.date || sale?.createdAt || new Date().toISOString();

  if (!sale) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <MaterialCommunityIcons name="receipt" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.onSurface }]}>Invoice not found.</Text>
        <Button mode="contained" onPress={() => navigation.navigate('Sales')} style={{ marginTop: 12 }}>
          Back to Sales
        </Button>
      </View>
    );
  }

  const formatCurrency = (val) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString();
    } catch {
      return isoString;
    }
  };

  // Intermediate computations
  const subtotal = sale.sellingPrice * sale.quantity - sale.discount;
  const gstAmount = subtotal * (sale.gst / 100);

  const generateInvoiceHtml = () => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${sale.invoiceNo}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #0F172A;
      margin: 0;
      padding: 30px;
      background-color: #ffffff;
    }
    .invoice-box {
      max-width: 800px;
      margin: auto;
      padding: 0;
      font-size: 14px;
      line-height: 20px;
    }
    .header-table, .meta-table, .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .header-table td {
      vertical-align: top;
    }
    .business-name {
      font-size: 24px;
      font-weight: 800;
      color: #1E3A8A;
      margin: 0 0 4px 0;
    }
    .business-sub {
      font-size: 12px;
      color: #475569;
      margin: 0 0 2px 0;
    }
    .invoice-title {
      font-size: 28px;
      font-weight: 800;
      color: #1E3A8A;
      text-align: right;
      margin: 0;
    }
    .divider {
      border-top: 1px solid #CBD5E1;
      margin: 16px 0;
    }
    .meta-table td {
      width: 50%;
      vertical-align: top;
    }
    .label {
      font-size: 10px;
      font-weight: bold;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .value {
      font-size: 14px;
      font-weight: bold;
      color: #0F172A;
    }
    .items-table th {
      background-color: #F1F5F9;
      color: #475569;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 10px 12px;
      text-align: left;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #CBD5E1;
      font-size: 13px;
    }
    .text-right {
      text-align: right !important;
    }
    .summary-container {
      float: right;
      width: 40%;
      margin-top: 12px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 13px;
    }
    .summary-label {
      color: #475569;
    }
    .summary-value {
      font-weight: 600;
      color: #0F172A;
    }
    .grand-total {
      font-size: 16px;
      font-weight: 800;
      color: #1E3A8A;
      border-top: 1px solid #CBD5E1;
      padding-top: 8px;
      margin-top: 8px;
    }
    .footer {
      margin-top: 60px;
      text-align: center;
      clear: both;
    }
    .footer-text {
      font-size: 14px;
      font-weight: bold;
      color: #475569;
      margin: 0;
    }
    .footer-subtext {
      font-size: 10px;
      color: #94A3B8;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <!-- Header -->
    <table class="header-table">
      <tr>
        <td>
          <h1 class="business-name">${userProfile.businessName}</h1>
          <p class="business-sub">Retail & Stock Distribution</p>
          <p class="business-sub">Phone: ${userProfile.phone} | Email: ${userProfile.email}</p>
        </td>
        <td>
          <h2 class="invoice-title">INVOICE</h2>
        </td>
      </tr>
    </table>

    <div class="divider"></div>

    <!-- Metadata Info -->
    <table class="meta-table">
      <tr>
        <td>
          <div class="label">Invoice No</div>
          <div class="value">${sale.invoiceNo}</div>
          <br>
          <div class="label">Bill To</div>
          <div class="value">${sale.customer}</div>
        </td>
        <td>
          <div class="label">Date</div>
          <div class="value">${formatDate(invoiceDate)}</div>
          <br>
          <div class="label">Payment Method</div>
          <div class="value">${sale.paymentMethod}</div>
        </td>
      </tr>
    </table>

    <div class="divider"></div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th>Item Description</th>
          <th class="text-right" style="width: 10%;">Qty</th>
          <th class="text-right" style="width: 20%;">Rate</th>
          <th class="text-right" style="width: 20%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${sale.product}</td>
          <td class="text-right">${sale.quantity}</td>
          <td class="text-right">${symbol}${sale.sellingPrice.toFixed(2)}</td>
          <td class="text-right">${symbol}${(sale.sellingPrice * sale.quantity).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Summary -->
    <div class="summary-container">
      <div class="summary-row">
        <span class="summary-label">Subtotal</span>
        <span class="summary-value">${symbol}${(sale.sellingPrice * sale.quantity).toFixed(2)}</span>
      </div>
      ${
        sale.discount > 0
          ? `
      <div class="summary-row">
        <span class="summary-label">Discount</span>
        <span class="summary-value" style="color: #10B981;">-${symbol}${sale.discount.toFixed(2)}</span>
      </div>
      `
          : ''
      }
      <div class="summary-row">
        <span class="summary-label">GST (${sale.gst}%)</span>
        <span class="summary-value">${symbol}${gstAmount.toFixed(2)}</span>
      </div>
      <div class="summary-row grand-total">
        <span>Grand Total</span>
        <span>${symbol}${sale.total.toFixed(2)}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">Thank you for your business!</p>
      <p class="footer-subtext">This is a computer generated invoice receipt.</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const handlePrint = async () => {
    try {
      const html = generateInvoiceHtml();
      await Print.printAsync({ html });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to open printing overlay.');
    }
  };

  const handleShare = async () => {
    try {
      const html = generateInvoiceHtml();
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === 'web') {
        Alert.alert('Success', 'PDF Invoice generated successfully!');
      } else {
        const isSharingAvailable = await Sharing.isAvailableAsync();
        if (isSharingAvailable) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Error', 'Sharing is not available on this device.');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate and share PDF.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <CustomCard style={styles.invoiceCard}>
          {/* Business Header */}
          <View style={styles.invoiceHeader}>
            <View>
              <Text style={[styles.businessName, { color: theme.colors.primary }]}>{userProfile.businessName}</Text>
              <Text style={[styles.businessSub, { color: theme.colors.onSurfaceVariant }]}>Retail & Stock Distribution</Text>
              <Text style={[styles.businessSub, { color: theme.colors.onSurfaceVariant }]}>{userProfile.phone} • {userProfile.email}</Text>
            </View>
            <View style={[styles.logoCircle, { backgroundColor: theme.colors.primaryContainer }]}>
              <MaterialCommunityIcons name="cube-send" size={32} color={theme.colors.primary} />
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Invoice Metadata */}
          <View style={styles.metaGrid}>
            <View style={styles.metaCol}>
              <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant }]}>INVOICE NO</Text>
              <Text style={[styles.metaVal, { color: theme.colors.onSurface }]}>{sale.invoiceNo}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant }]}>DATE</Text>
              <Text style={[styles.metaVal, { color: theme.colors.onSurface }]}>{formatDate(invoiceDate)}</Text>
            </View>
          </View>

          <View style={[styles.metaGrid, { marginTop: 12 }]}>
            <View style={styles.metaCol}>
              <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant }]}>BILL TO</Text>
              <Text style={[styles.metaVal, { color: theme.colors.onSurface }]}>{sale.customer}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={[styles.metaLabel, { color: theme.colors.onSurfaceVariant }]}>PAYMENT METHOD</Text>
              <Text style={[styles.metaVal, { color: theme.colors.onSurface }]}>{sale.paymentMethod}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Itemized Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.colProduct, styles.headerText, { color: theme.colors.onSurfaceVariant }]}>ITEM</Text>
              <Text style={[styles.colQty, styles.headerText, styles.textRight, { color: theme.colors.onSurfaceVariant }]}>QTY</Text>
              <Text style={[styles.colPrice, styles.headerText, styles.textRight, { color: theme.colors.onSurfaceVariant }]}>RATE</Text>
              <Text style={[styles.colTotal, styles.headerText, styles.textRight, { color: theme.colors.onSurfaceVariant }]}>AMOUNT</Text>
            </View>
            <Divider style={{ marginVertical: 6 }} />

            <View style={styles.tableRow}>
              <Text style={[styles.colProduct, styles.rowText, { color: theme.colors.onSurface }]} numberOfLines={2}>
                {sale.product}
              </Text>
              <Text style={[styles.colQty, styles.rowText, styles.textRight, { color: theme.colors.onSurface }]}>
                {sale.quantity}
              </Text>
              <Text style={[styles.colPrice, styles.rowText, styles.textRight, { color: theme.colors.onSurface }]}>
                {formatCurrency(sale.sellingPrice)}
              </Text>
              <Text style={[styles.colTotal, styles.rowText, styles.textRight, { color: theme.colors.onSurface }]}>
                {formatCurrency(sale.sellingPrice * sale.quantity)}
              </Text>
            </View>

            <Divider style={styles.tableDivider} />

            {/* Calculations summaries */}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.onSurfaceVariant }]}>Subtotal</Text>
                <Text style={[styles.summaryVal, { color: theme.colors.onSurface }]}>{formatCurrency(sale.sellingPrice * sale.quantity)}</Text>
              </View>
              {sale.discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.onSurfaceVariant }]}>Discount</Text>
                  <Text style={[styles.summaryVal, { color: theme.colors.success }]}>-{formatCurrency(sale.discount)}</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.onSurfaceVariant }]}>GST ({sale.gst}%)</Text>
                <Text style={[styles.summaryVal, { color: theme.colors.onSurface }]}>{formatCurrency(gstAmount)}</Text>
              </View>

              <Divider style={{ marginVertical: 8 }} />

              <View style={styles.summaryRow}>
                <Text style={[styles.grandLabel, { color: theme.colors.onSurface }]}>Grand Total</Text>
                <Text style={[styles.grandVal, { color: theme.colors.primary }]}>{formatCurrency(sale.total)}</Text>
              </View>
            </View>
          </View>

          {/* Footer note */}
          <View style={styles.invoiceFooter}>
            <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>Thank you for your business!</Text>
            <Text style={[styles.footerSubText, { color: theme.colors.onSurfaceVariant + '70' }]}>This is a computer generated invoice receipt.</Text>
          </View>
        </CustomCard>
      </ScrollView>

      {/* Invoice Actions */}
      <View style={[styles.actionsContainer, { borderTopColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}>
        <Button
          mode="outlined"
          icon="printer-outline"
          style={styles.actionBtn}
          onPress={handlePrint}
        >
          Print
        </Button>
        <Button
          mode="outlined"
          icon="share-variant-outline"
          style={styles.actionBtn}
          onPress={handleShare}
        >
          Share
        </Button>
        <Button
          mode="contained"
          style={[styles.actionBtn, { flex: 1.5 }]}
          onPress={() => navigation.navigate('Sales')}
        >
          Sales History
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 100,
  },
  invoiceCard: {
    padding: 20,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  businessSub: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  logoCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  rowText: {
    fontSize: 12,
    lineHeight: 16,
  },
  textRight: {
    textAlign: 'right',
  },
  colProduct: {
    flex: 2,
  },
  colQty: {
    flex: 0.5,
  },
  colPrice: {
    flex: 1.2,
  },
  colTotal: {
    flex: 1.2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  tableDivider: {
    marginVertical: 12,
  },
  summarySection: {
    alignSelf: 'flex-end',
    width: '60%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '600',
  },
  grandLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  grandVal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  invoiceFooter: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  footerSubText: {
    fontSize: 10,
    marginTop: 4,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
  },
});

