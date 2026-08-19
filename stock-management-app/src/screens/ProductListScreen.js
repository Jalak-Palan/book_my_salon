import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, Image } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { SearchBar } from '../components/SearchBar';
import { FilterModal } from '../components/FilterModal';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { CustomCard } from '../components/CustomCard';
import { normalize, MIN_TOUCH_SIZE, SCREEN_PADDING } from '../utils/dimensions';

export default function ProductListScreen({ navigation }) {
  const theme = useTheme();
  const { products, deleteProduct, categories, currency } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSort, setSelectedSort] = useState('name-asc');

  // Delete State
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatCurrency = (val) => {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.sellingPrice - b.sellingPrice;
        case 'price-desc':
          return b.sellingPrice - a.sellingPrice;
        case 'qty-asc':
          return a.quantity - b.quantity;
        case 'qty-desc':
          return b.quantity - a.quantity;
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Pagination slicing
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeletePress = (product) => {
    setProductToDelete(product);
    setDeleteDialogVisible(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setDeleteDialogVisible(false);
      setProductToDelete(null);
      // Adjust current page if empty
      if (paginatedProducts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name-asc' },
    { label: 'Name (Z-A)', value: 'name-desc' },
    { label: 'Price (Low to High)', value: 'price-asc' },
    { label: 'Price (High to Low)', value: 'price-desc' },
    { label: 'Quantity (Low to High)', value: 'qty-asc' },
    { label: 'Quantity (High to Low)', value: 'qty-desc' },
  ];

  const renderProductItem = ({ item }) => {
    const isLowStock = item.quantity <= item.minStock && item.quantity > 0;
    const isOutOfStock = item.quantity === 0;

    return (
      <CustomCard
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        style={styles.card}
      >
        <View style={styles.itemRow}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.productImage} />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
              <MaterialCommunityIcons name="cube-outline" size={30} color={theme.colors.primary + '80'} />
            </View>
          )}

          <View style={styles.itemDetails}>
            <Text style={[styles.name, { color: theme.colors.onSurface, fontSize: normalize(15) }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.sku, { color: theme.colors.onSurfaceVariant, fontSize: normalize(12) }]} numberOfLines={1}>
              SKU: {item.sku} • {item.brand}
            </Text>
            <Text style={[styles.category, { color: theme.colors.primary, fontSize: normalize(11) }]}>{item.category}</Text>

            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: theme.colors.onSurface, fontSize: normalize(15) }]}>
                {formatCurrency(item.sellingPrice)}
              </Text>
              <View style={styles.badgeRow}>
                {isOutOfStock ? (
                  <View style={[styles.badge, { backgroundColor: theme.colors.error + '18' }]}>
                    <Text style={[styles.badgeText, { color: theme.colors.error, fontSize: normalize(10) }]}>Out of Stock</Text>
                  </View>
                ) : isLowStock ? (
                  <View style={[styles.badge, { backgroundColor: theme.colors.warning + '18' }]}>
                    <Text style={[styles.badgeText, { color: theme.colors.warning, fontSize: normalize(10) }]}>Low ({item.quantity})</Text>
                  </View>
                ) : (
                  <View style={[styles.badge, { backgroundColor: theme.colors.success + '18' }]}>
                    <Text style={[styles.badgeText, { color: theme.colors.success, fontSize: normalize(10) }]}>{item.quantity} {item.unit}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.actionColumn}>
            <Pressable
              onPress={() => navigation.navigate('AddEditProduct', { productId: item.id })}
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
      </CustomCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SearchBar
        placeholder="Search products by name, SKU..."
        value={searchQuery}
        onChangeText={(txt) => {
          setSearchQuery(txt);
          setCurrentPage(1);
        }}
        onFilterPress={() => setFilterVisible(true)}
        style={styles.searchBar}
      />

      <FlatList
        data={paginatedProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <EmptyState
            icon="cube-off-outline"
            title="No Products Found"
            description="There are no products matching your search or filters. Create a new product to begin."
            actionTitle="Add Product"
            onActionPress={() => navigation.navigate('AddEditProduct')}
          />
        }
        ListFooterComponent={
          totalPages > 1 ? (
            <View style={styles.paginationRow}>
              <Pressable
                disabled={currentPage === 1}
                onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                style={[styles.pageBtn, currentPage === 1 && styles.disabledPageBtn, { borderColor: theme.colors.outline }]}
              >
                <MaterialCommunityIcons name="chevron-left" size={20} color={currentPage === 1 ? theme.colors.outline : theme.colors.primary} />
              </Pressable>
              <Text style={[styles.pageText, { color: theme.colors.onSurface }]}>
                Page {currentPage} of {totalPages}
              </Text>
              <Pressable
                disabled={currentPage === totalPages}
                onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                style={[styles.pageBtn, currentPage === totalPages && styles.disabledPageBtn, { borderColor: theme.colors.outline }]}
              >
                <MaterialCommunityIcons name="chevron-right" size={20} color={currentPage === totalPages ? theme.colors.outline : theme.colors.primary} />
              </Pressable>
            </View>
          ) : null
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#ffffff"
        onPress={() => navigation.navigate('AddEditProduct')}
        size="medium"
      />

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={() => setCurrentPage(1)}
        onReset={() => {
          setSelectedCategory(null);
          setSelectedSort('name-asc');
          setCurrentPage(1);
        }}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        sortOptions={sortOptions}
      />

      <ConfirmationDialog
        visible={deleteDialogVisible}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogVisible(false);
          setProductToDelete(null);
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
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    marginVertical: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sku: {
    fontSize: 12,
    marginBottom: 2,
  },
  category: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionColumn: {
    justifyContent: 'space-between',
    height: 76,
    marginLeft: 8,
  },
  actionBtn: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnInner: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  disabledPageBtn: {
    opacity: 0.4,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
