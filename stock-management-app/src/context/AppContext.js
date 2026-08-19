import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import axios from 'axios';
import {
  initialCategories,
  initialSuppliers,
  initialCustomers,
  initialProducts,
  initialSales,
  initialPurchases,
  initialOrders,
  initialNotifications,
} from '../data/dummyData';

const resolveApiBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.developer?.hostUri;
  const host = hostUri ? hostUri.split(':')[0] : null;

  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    return `http://${host}:5000/api`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  return 'http://localhost:5000/api';
};

const API_BASE_URL = resolveApiBaseUrl();
const API_URLS = {
  auth: `${API_BASE_URL}/auth`,
  profile: `${API_BASE_URL}/auth/profile`,
  products: `${API_BASE_URL}/products`,
  customers: `${API_BASE_URL}/customers`,
  categories: `${API_BASE_URL}/categories`,
  suppliers: `${API_BASE_URL}/suppliers`,
  sales: `${API_BASE_URL}/sales`,
  purchases: `${API_BASE_URL}/purchases`,
  orders: `${API_BASE_URL}/orders`,
};

const cloneInitialData = () => ({
  products: [...initialProducts],
  categories: [...initialCategories],
  suppliers: [...initialSuppliers],
  customers: [...initialCustomers],
  sales: [...initialSales],
  purchases: [...initialPurchases],
  orders: [...initialOrders],
  notifications: [...initialNotifications],
});

const normalizeDoc = (doc) => {
  if (!doc) return null;
  const { _id, __v, ...rest } = doc;
  return { id: _id || rest.id, ...rest };
};

const normalizeList = (items) => items.map(normalizeDoc).filter(Boolean);

const stripLegacyRefs = (item, keys = []) => {
  const payload = { ...item };
  keys.forEach((key) => {
    if (key in payload) {
      delete payload[key];
    }
  });
  return payload;
};

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const decoded = typeof atob === 'function' ? atob(padded) : Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const initialData = cloneInitialData();

  const [products, setProducts] = useState(initialData.products);
  const [categories, setCategories] = useState(initialData.categories);
  const [suppliers, setSuppliers] = useState(initialData.suppliers);
  const [customers, setCustomers] = useState(initialData.customers);
  const [sales, setSales] = useState(initialData.sales);
  const [purchases, setPurchases] = useState(initialData.purchases);
  const [orders, setOrders] = useState(initialData.orders);
  const [notifications, setNotifications] = useState(initialData.notifications);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  const resetLocalData = () => {
    const fresh = cloneInitialData();
    setProducts(fresh.products);
    setCategories(fresh.categories);
    setSuppliers(fresh.suppliers);
    setCustomers(fresh.customers);
    setSales(fresh.sales);
    setPurchases(fresh.purchases);
    setOrders(fresh.orders);
    setNotifications(fresh.notifications);
  };

  const hydrateFromServer = async (token) => {
    const headers = authHeaders(token);
    const [productRes, categoryRes, supplierRes, customerRes, saleRes, purchaseRes, orderRes] =
      await Promise.all([
        axios.get(API_URLS.products, headers),
        axios.get(API_URLS.categories, headers),
        axios.get(API_URLS.suppliers, headers),
        axios.get(API_URLS.customers, headers),
        axios.get(API_URLS.sales, headers),
        axios.get(API_URLS.purchases, headers),
        axios.get(API_URLS.orders, headers),
      ]);

    const serverProducts = normalizeList(productRes.data.items || []);
    const serverCategories = normalizeList(categoryRes.data.items || []);
    const serverSuppliers = normalizeList(supplierRes.data.items || []);
    const serverCustomers = normalizeList(customerRes.data.items || []);
    const serverSales = normalizeList(saleRes.data.items || []);
    const serverPurchases = normalizeList(purchaseRes.data.items || []);
    const serverOrders = normalizeList(orderRes.data.items || []);

    const allEmpty =
      serverProducts.length === 0 &&
      serverCategories.length === 0 &&
      serverSuppliers.length === 0 &&
      serverCustomers.length === 0 &&
      serverSales.length === 0 &&
      serverPurchases.length === 0 &&
      serverOrders.length === 0;

    if (allEmpty) {
      const [
        seededProducts,
        seededCategories,
        seededSuppliers,
        seededCustomers,
        seededSales,
        seededPurchases,
        seededOrders,
      ] = await Promise.all([
        Promise.all(initialProducts.map(async (item) => normalizeDoc((await axios.post(API_URLS.products, item, headers)).data.item))),
        Promise.all(initialCategories.map(async (item) => normalizeDoc((await axios.post(API_URLS.categories, item, headers)).data.item))),
        Promise.all(initialSuppliers.map(async (item) => normalizeDoc((await axios.post(API_URLS.suppliers, item, headers)).data.item))),
        Promise.all(initialCustomers.map(async (item) => normalizeDoc((await axios.post(API_URLS.customers, item, headers)).data.item))),
        Promise.all(initialSales.map(async (item) => normalizeDoc((await axios.post(API_URLS.sales, stripLegacyRefs(item, ['productId']), headers)).data.item))),
        Promise.all(initialPurchases.map(async (item) => normalizeDoc((await axios.post(API_URLS.purchases, stripLegacyRefs(item, ['productId']), headers)).data.item))),
        Promise.all(initialOrders.map(async (item) => normalizeDoc((await axios.post(API_URLS.orders, item, headers)).data.item))),
      ]);

      setProducts(seededProducts.filter(Boolean));
      setCategories(seededCategories.filter(Boolean));
      setSuppliers(seededSuppliers.filter(Boolean));
      setCustomers(seededCustomers.filter(Boolean));
      setSales(seededSales.filter(Boolean));
      setPurchases(seededPurchases.filter(Boolean));
      setOrders(seededOrders.filter(Boolean));
      return;
    }

    setProducts(serverProducts);
    setCategories(serverCategories);
    setSuppliers(serverSuppliers);
    setCustomers(serverCustomers);
    setSales(serverSales);
    setPurchases(serverPurchases);
    setOrders(serverOrders);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@dark_mode');
        const storedCurrency = await AsyncStorage.getItem('@currency');
        const storedLanguage = await AsyncStorage.getItem('@language');
        const storedNotif = await AsyncStorage.getItem('@notification_enabled');
        const storedToken = await AsyncStorage.getItem('@auth_token');
        const storedUser = await AsyncStorage.getItem('@user_profile');

        if (storedTheme !== null) setIsDarkMode(JSON.parse(storedTheme));
        if (storedCurrency !== null) setCurrency(storedCurrency);
        if (storedLanguage !== null) setLanguage(storedLanguage);
        if (storedNotif !== null) setNotificationEnabled(JSON.parse(storedNotif));

        const isStoredTokenValid = storedToken && storedUser && !isTokenExpired(storedToken);
        if (isStoredTokenValid) {
          setAuthToken(storedToken);
          setUserProfile(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else if (storedToken || storedUser) {
          await AsyncStorage.removeItem('@auth_token');
          await AsyncStorage.removeItem('@user_profile');
        }
      } catch (e) {
        console.error('Failed to load data from storage', e);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!authToken) return;

    if (isTokenExpired(authToken)) {
      logout();
      return;
    }

    const syncData = async () => {
      try {
        await hydrateFromServer(authToken);
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'Unknown network error';
        console.error('Failed to sync app data from backend:', message);
      }
    };

    syncData();

    const expiryCheck = setInterval(() => {
      if (isTokenExpired(authToken)) {
        logout();
      }
    }, 60000);

    return () => clearInterval(expiryCheck);
  }, [authToken, logout]);

  const toggleDarkMode = async () => {
    try {
      const newVal = !isDarkMode;
      setIsDarkMode(newVal);
      await AsyncStorage.setItem('@dark_mode', JSON.stringify(newVal));
    } catch (e) {
      console.error(e);
    }
  };

  const updateCurrency = async (newCurr) => {
    try {
      setCurrency(newCurr);
      await AsyncStorage.setItem('@currency', newCurr);
    } catch (e) {
      console.error(e);
    }
  };

  const updateLanguage = async (newLang) => {
    try {
      setLanguage(newLang);
      await AsyncStorage.setItem('@language', newLang);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleNotifications = async () => {
    try {
      const newVal = !notificationEnabled;
      setNotificationEnabled(newVal);
      await AsyncStorage.setItem('@notification_enabled', JSON.stringify(newVal));
    } catch (e) {
      console.error(e);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URLS.auth}/login`, { email, password });
      if (response.data.success) {
        setAuthToken(response.data.token);
        setUserProfile(response.data.user);
        setIsAuthenticated(true);
        await AsyncStorage.setItem('@auth_token', response.data.token);
        await AsyncStorage.setItem('@user_profile', JSON.stringify(response.data.user));
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  const register = async (name, businessName, email, password) => {
    try {
      const response = await axios.post(`${API_URLS.auth}/register`, { name, businessName, email, password });
      if (response.data.success) {
        setAuthToken(response.data.token);
        setUserProfile(response.data.user);
        setIsAuthenticated(true);
        await AsyncStorage.setItem('@auth_token', response.data.token);
        await AsyncStorage.setItem('@user_profile', JSON.stringify(response.data.user));
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setAuthToken(null);
    resetLocalData();
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@user_profile');
  };

  const updateProfile = async (updatedData) => {
    try {
      const payload = {
        name: updatedData.name,
        businessName: updatedData.businessName,
        email: updatedData.email,
        phone: updatedData.phone,
        image: updatedData.image,
        address: updatedData.address,
        city: updatedData.city,
        state: updatedData.state,
        country: updatedData.country,
        pincode: updatedData.pincode,
      };

      const nextProfile = { ...(userProfile || {}), ...updatedData };

      if (!authToken) {
        setUserProfile(nextProfile);
        await AsyncStorage.setItem('@user_profile', JSON.stringify(nextProfile));
        return { success: true, user: nextProfile };
      }

      const response = await axios.put(API_URLS.profile, payload, authHeaders(authToken));
      const serverUser = response.data.user || nextProfile;
      setUserProfile(serverUser);
      await AsyncStorage.setItem('@user_profile', JSON.stringify(serverUser));
      return { success: true, user: serverUser };
    } catch (error) {
      console.error('Update profile error:', error);
      const message = error.response?.data?.message || 'Failed to update profile.';
      return { success: false, message };
    }
  };

  const addNotification = (title, message, type) => {
    const newNotif = {
      id: `not-${Date.now()}`,
      title,
      message,
      type,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const buildProductPayload = (productData) => ({
    name: productData.name,
    sku: productData.sku,
    category: productData.category,
    supplier: productData.supplier,
    unit: productData.unit || 'pcs',
    quantity: Number(productData.quantity) || 0,
    purchasePrice: Number(productData.purchasePrice) || 0,
    sellingPrice: Number(productData.sellingPrice) || 0,
    minStock: Number(productData.minStock) || 0,
    brand: productData.brand || '',
    description: productData.description || '',
    image: productData.image || '',
    location: productData.location || '',
  });

  const buildCustomerPayload = (customerData) => ({
    name: customerData.name,
    phone: customerData.phone || '',
    email: customerData.email || '',
    address: customerData.address || '',
  });

  const buildCategoryPayload = (categoryData) => ({
    name: categoryData.name,
    description: categoryData.description || '',
    status: categoryData.status || 'Active',
  });

  const buildSupplierPayload = (supplierData) => ({
    name: supplierData.name,
    company: supplierData.company || '',
    phone: supplierData.phone || '',
    email: supplierData.email || '',
    address: supplierData.address || '',
    city: supplierData.city || '',
    state: supplierData.state || '',
    country: supplierData.country || '',
  });

  const buildSalePayload = (saleData, product, total) => ({
    customer: saleData.customer,
    product: product.name,
    productId: product.id,
    quantity: Number(saleData.quantity) || 0,
    sellingPrice: Number(saleData.sellingPrice) || product.sellingPrice,
    discount: Number(saleData.discount) || 0,
    gst: Number(saleData.gst) || 0,
    paymentMethod: saleData.paymentMethod || 'Cash',
    invoiceNo: saleData.invoiceNo,
    date: new Date().toISOString(),
    total,
  });

  const buildPurchasePayload = (purchaseData, product, total) => ({
    supplier: purchaseData.supplier,
    product: product ? product.name : purchaseData.product,
    productId: product ? product.id : null,
    quantity: Number(purchaseData.quantity) || 0,
    purchasePrice: Number(purchaseData.purchasePrice) || 0,
    discount: Number(purchaseData.discount) || 0,
    total,
    date: new Date().toISOString(),
  });

  const buildOrderPayload = (orderData) => ({
    date: orderData.date,
    customer: orderData.customer,
    amount: Number(orderData.amount) || 0,
    status: orderData.status || 'Confirmed',
    saleId: orderData.saleId || null,
  });

  const addProduct = async (productData) => {
    try {
      const response = await axios.post(API_URLS.products, buildProductPayload(productData), authHeaders(authToken));
      const newProduct = normalizeDoc(response.data.item);
      setProducts((prev) => [newProduct, ...prev]);
      addNotification('Product Added', `${newProduct.name} has been added to inventory.`, 'success');
      return { success: true, item: newProduct };
    } catch (error) {
      console.error('Add product error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add product.' };
    }
  };

  const editProduct = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URLS.products}/${id}`, buildProductPayload(updatedData), authHeaders(authToken));
      const updatedProduct = normalizeDoc(response.data.item);
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)));
      addNotification('Stock Updated', `Product details updated for ${updatedProduct.name}.`, 'info');
      return { success: true, item: updatedProduct };
    } catch (error) {
      console.error('Edit product error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update product.' };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URLS.products}/${id}`, authHeaders(authToken));
      const prod = products.find((p) => p.id === id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (prod) {
        addNotification('Product Removed', `${prod.name} has been deleted from inventory.`, 'warning');
      }
      return { success: true };
    } catch (error) {
      console.error('Delete product error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete product.' };
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const response = await axios.post(API_URLS.categories, buildCategoryPayload(categoryData), authHeaders(authToken));
      const newCat = normalizeDoc(response.data.item);
      setCategories((prev) => [newCat, ...prev]);
      addNotification('Category Added', `Category "${newCat.name}" was successfully created.`, 'info');
      return { success: true, item: newCat };
    } catch (error) {
      console.error('Add category error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add category.' };
    }
  };

  const editCategory = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URLS.categories}/${id}`, buildCategoryPayload(updatedData), authHeaders(authToken));
      const updatedCategory = normalizeDoc(response.data.item);
      setCategories((prev) => prev.map((c) => (c.id === id ? updatedCategory : c)));
      return { success: true, item: updatedCategory };
    } catch (error) {
      console.error('Edit category error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update category.' };
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URLS.categories}/${id}`, authHeaders(authToken));
      const cat = categories.find((c) => c.id === id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (cat) {
        addNotification('Category Removed', `Category "${cat.name}" has been deleted.`, 'warning');
      }
      return { success: true };
    } catch (error) {
      console.error('Delete category error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete category.' };
    }
  };

  const addSupplier = async (supplierData) => {
    try {
      const response = await axios.post(API_URLS.suppliers, buildSupplierPayload(supplierData), authHeaders(authToken));
      const newSup = normalizeDoc(response.data.item);
      setSuppliers((prev) => [newSup, ...prev]);
      addNotification('Supplier Registered', `Supplier ${newSup.name} was successfully registered.`, 'info');
      return { success: true, item: newSup };
    } catch (error) {
      console.error('Add supplier error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add supplier.' };
    }
  };

  const editSupplier = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URLS.suppliers}/${id}`, buildSupplierPayload(updatedData), authHeaders(authToken));
      const updatedSupplier = normalizeDoc(response.data.item);
      setSuppliers((prev) => prev.map((s) => (s.id === id ? updatedSupplier : s)));
      return { success: true, item: updatedSupplier };
    } catch (error) {
      console.error('Edit supplier error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update supplier.' };
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await axios.delete(`${API_URLS.suppliers}/${id}`, authHeaders(authToken));
      const sup = suppliers.find((s) => s.id === id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      if (sup) {
        addNotification('Supplier Removed', `Supplier ${sup.name} has been deleted.`, 'warning');
      }
      return { success: true };
    } catch (error) {
      console.error('Delete supplier error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete supplier.' };
    }
  };

  const addCustomer = async (customerData) => {
    try {
      const response = await axios.post(API_URLS.customers, buildCustomerPayload(customerData), authHeaders(authToken));
      const newCust = normalizeDoc(response.data.item);
      setCustomers((prev) => [newCust, ...prev]);
      addNotification('Customer Added', `Customer ${newCust.name} added.`, 'info');
      return { success: true, item: newCust };
    } catch (error) {
      console.error('Add customer error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add customer.' };
    }
  };

  const editCustomer = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URLS.customers}/${id}`, buildCustomerPayload(updatedData), authHeaders(authToken));
      const updatedCustomer = normalizeDoc(response.data.item);
      setCustomers((prev) => prev.map((c) => (c.id === id ? updatedCustomer : c)));
      return { success: true, item: updatedCustomer };
    } catch (error) {
      console.error('Edit customer error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update customer.' };
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`${API_URLS.customers}/${id}`, authHeaders(authToken));
      const cust = customers.find((c) => c.id === id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (cust) {
        addNotification('Customer Removed', `Customer ${cust.name} has been removed.`, 'warning');
      }
      return { success: true };
    } catch (error) {
      console.error('Delete customer error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete customer.' };
    }
  };

  const addPurchase = async (purchaseData) => {
    const product = products.find((p) => p.name === purchaseData.product || p.id === purchaseData.productId);
    const purchasePrice = Number(purchaseData.purchasePrice) || 0;
    const quantity = Number(purchaseData.quantity) || 0;
    const discount = Number(purchaseData.discount) || 0;
    const total = purchasePrice * quantity - discount;

    try {
      const response = await axios.post(API_URLS.purchases, buildPurchasePayload(purchaseData, product, total), authHeaders(authToken));
      const newPurchase = normalizeDoc(response.data.item);
      setPurchases((prev) => [newPurchase, ...prev]);

      if (product) {
        const updatedQuantity = product.quantity + quantity;
        await axios.put(
          `${API_URLS.products}/${product.id}`,
          buildProductPayload({ ...product, quantity: updatedQuantity }),
          authHeaders(authToken)
        );
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, quantity: updatedQuantity } : p))
        );
        addNotification('Purchase Completed', `Stock replenished for ${product.name} (+${quantity}).`, 'success');
      }

      return { success: true, item: newPurchase };
    } catch (error) {
      console.error('Add purchase error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add purchase.' };
    }
  };

  const addSale = async (saleData) => {
    const product = products.find((p) => p.name === saleData.product || p.id === saleData.productId);
    if (!product) return { success: false, message: 'Product not found.' };

    const quantity = Number(saleData.quantity) || 0;
    if (product.quantity < quantity) {
      return { success: false, message: `Insufficient stock. Only ${product.quantity} units available.` };
    }

    const sellingPrice = Number(saleData.sellingPrice) || product.sellingPrice;
    const discount = Number(saleData.discount) || 0;
    const gstRate = Number(saleData.gst) || 0;
    const itemTotal = sellingPrice * quantity - discount;
    const total = itemTotal + itemTotal * (gstRate / 100);
    const invoiceNo = saleData.invoiceNo || `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const salePayload = buildSalePayload({ ...saleData, invoiceNo, quantity, sellingPrice, discount, gst: gstRate }, product, total);
      const saleResponse = await axios.post(API_URLS.sales, salePayload, authHeaders(authToken));
      const newSale = normalizeDoc(saleResponse.data.item);
      setSales((prev) => [newSale, ...prev]);

      const finalQty = product.quantity - quantity;
      await axios.put(
        `${API_URLS.products}/${product.id}`,
        buildProductPayload({ ...product, quantity: finalQty }),
        authHeaders(authToken)
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, quantity: finalQty } : p))
      );

      const orderPayload = buildOrderPayload({
        date: new Date().toISOString().split('T')[0],
        customer: saleData.customer,
        amount: total,
        status: 'Confirmed',
        saleId: newSale.id,
      });
      const orderResponse = await axios.post(API_URLS.orders, orderPayload, authHeaders(authToken));
      const newOrder = normalizeDoc(orderResponse.data.item);
      setOrders((prev) => [newOrder, ...prev]);

      if (finalQty === 0) {
        setTimeout(() => addNotification('Out of Stock Alert', `${product.name} is completely out of stock.`, 'danger'), 500);
      } else if (finalQty <= product.minStock) {
        setTimeout(() => addNotification('Low Stock Alert', `${product.name} quantity has dropped to ${finalQty}.`, 'warning'), 500);
      }

      addNotification('Sale Completed', `Sold ${quantity} ${product.unit}(s) of ${product.name} to ${saleData.customer}.`, 'success');
      return { success: true, sale: newSale };
    } catch (error) {
      console.error('Add sale error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add sale.' };
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`${API_URLS.orders}/${id}`, { status: newStatus }, authHeaders(authToken));
      const updatedOrder = normalizeDoc(response.data.item);
      setOrders((prev) => prev.map((o) => (o.id === id ? updatedOrder : o)));
      addNotification('Order Updated', `Order ${id} status updated to ${newStatus}.`, 'info');
      return { success: true, item: updatedOrder };
    } catch (error) {
      console.error('Update order error:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update order.' };
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        suppliers,
        customers,
        sales,
        purchases,
        orders,
        notifications,
        isAuthenticated,
        userProfile,
        isDarkMode,
        currency,
        language,
        notificationEnabled,
        toggleDarkMode,
        updateCurrency,
        updateLanguage,
        toggleNotifications,
        login,
        register,
        logout,
        updateProfile,
        addProduct,
        editProduct,
        deleteProduct,
        addCategory,
        editCategory,
        deleteCategory,
        addSupplier,
        editSupplier,
        deleteSupplier,
        addCustomer,
        editCustomer,
        deleteCustomer,
        addPurchase,
        addSale,
        updateOrderStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};





