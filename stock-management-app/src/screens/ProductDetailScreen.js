import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { useTheme, Button, Divider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

export default function ProductDetailScreen({ route, navigation }) {
  const theme = useTheme();
  const { productId } = route.params || {};
  const { products, deleteProduct, currency } = useContext(AppContext);

  const product = products.find((p) => p.id === productId);

  const [deleteVisible, setDeleteVisible] = useState(false);

  if (!product) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <MaterialCommunityIcons name="cube-off-outline" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.onSurface }]}>Product not found.</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
          Go Back
        </Button>
      </View>
    );
  }

  const formatCurrency = (val) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  const handleDelete = () => {
    deleteProduct(product.id);
    setDeleteVisible(false);
    navigation.goBack();
  };

  const isLowStock = product.quantity <= product.minStock && product.quantity > 0;
  const isOutOfStock = product.quantity === 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Product Image Cover */}
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.coverImage} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
            <MaterialCommunityIcons name="cube-outline" size={72} color={theme.colors.onSurfaceVariant} />
          </View>
        )}

        <View style={styles.infoContainer}>
          {/* Header and status alerts */}
          <Text style={[styles.brand, { color: theme.colors.primary }]}>{product.brand}</Text>
          <Text style={[styles.name, { color: theme.colors.onSurface }]}>{product.name}</Text>
          <Text style={[styles.sku, { color: theme.colors.onSurfaceVariant }]}>SKU: {product.sku}</Text>

          {isOutOfStock ? (
            <View style={[styles.alertBanner, { backgroundColor: theme.colors.error + '15', borderColor: theme.colors.error }]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.error} />
              <Text style={[styles.alertText, { color: theme.colors.error }]}>OUT OF STOCK: Reorder immediately!</Text>
            </View>
          ) : isLowStock ? (
            <View style={[styles.alertBanner, { backgroundColor: theme.colors.warning + '15', borderColor: theme.colors.warning }]}>
              <MaterialCommunityIcons name="alert-outline" size={20} color={theme.colors.warning} />
              <Text style={[styles.alertText, { color: theme.colors.warning }]}>LOW STOCK: Under warning level ({product.minStock} {product.unit})</Text>
            </View>
          ) : null}

          {/* Core metrics row */}
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}>Current Stock</Text>
              <Text style={[styles.metricValue, { color: product.quantity === 0 ? theme.colors.error : theme.colors.onSurface }]}>
                {product.quantity} <Text style={styles.unitText}>{product.unit}</Text>
              </Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}>Min Stock Alert</Text>
              <Text style={[styles.metricValue, { color: theme.colors.onSurface }]}>
                {product.minStock} <Text style={styles.unitText}>{product.unit}</Text>
              </Text>
            </View>
          </View>

          {/* Details list */}
          <View style={[styles.detailsCard, { backgroundColor: theme.colors.surface, borderRadius: theme.roundness }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Product Details</Text>
            <Divider />

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Category</Text>
              <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>{product.category}</Text>
            </View>
            <Divider />

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Supplier</Text>
              <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>{product.supplier}</Text>
            </View>
            <Divider />

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Storage Location</Text>
              <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>{product.location || 'Not Specified'}</Text>
            </View>
            <Divider />

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Cost Price (Purchase)</Text>
              <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>{formatCurrency(product.purchasePrice)}</Text>
            </View>
            <Divider />

            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>Selling Price</Text>
              <Text style={[styles.detailValue, { color: theme.colors.primary, fontWeight: 'bold' }]}>{formatCurrency(product.sellingPrice)}</Text>
            </View>
          </View>

          {/* Description */}
          {product.description ? (
            <View style={[styles.detailsCard, { backgroundColor: theme.colors.surface, borderRadius: theme.roundness, marginTop: 12 }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Description</Text>
              <Divider style={{ marginBottom: 10 }} />
              <Text style={[styles.descText, { color: theme.colors.onSurfaceVariant }]}>{product.description}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.actionsContainer, { borderTopColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}>
        <Button
          mode="outlined"
          icon="trash-can-outline"
          textColor={theme.colors.error}
          style={[styles.actionBtn, { borderColor: theme.colors.error }]}
          onPress={() => setDeleteVisible(true)}
        >
          Delete
        </Button>
        <Button
          mode="contained"
          icon="pencil-outline"
          style={styles.actionBtn}
          onPress={() => navigation.navigate('AddEditProduct', { productId: product.id })}
        >
          Edit Product
        </Button>
      </View>

      <ConfirmationDialog
        visible={deleteVisible}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${product.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteVisible(false)}
      />
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
    paddingBottom: 100,
  },
  coverImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  brand: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  sku: {
    fontSize: 13,
    marginBottom: 12,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  alertText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  unitText: {
    fontSize: 12,
    fontWeight: '400',
  },
  detailsCard: {
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
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
    marginHorizontal: 6,
  },
});
