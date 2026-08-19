import React, { useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Pressable, SafeAreaView, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { useTheme, Divider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { normalize, TAB_BAR_HEIGHT } from '../utils/dimensions';

import { AppContext } from '../context/AppContext';

// Import Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddEditProductScreen from '../screens/AddEditProductScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import SupplierListScreen from '../screens/SupplierListScreen';
import AddEditSupplierScreen from '../screens/AddEditSupplierScreen';
import CustomerListScreen from '../screens/CustomerListScreen';
import AddEditCustomerScreen from '../screens/AddEditCustomerScreen';
import PurchaseListScreen from '../screens/PurchaseListScreen';
import AddPurchaseScreen from '../screens/AddPurchaseScreen';
import SalesListScreen from '../screens/SalesListScreen';
import AddSaleScreen from '../screens/AddSaleScreen';
import InvoicePreviewScreen from '../screens/InvoicePreviewScreen';
import OrderListScreen from '../screens/OrderListScreen';
import ReportsScreen from '../screens/ReportsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpScreen from '../screens/HelpScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Layout
function CustomDrawerContent(props) {
  const theme = useTheme();
  const { userProfile, logout } = useContext(AppContext);

  const handleLogout = () => {
    logout();
    props.navigation.replace('Login');
  };

  // Guard against null userProfile
  if (!userProfile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <View style={[styles.drawerHeader, { borderBottomColor: theme.colors.outline + '40' }]}>
          <View style={[styles.drawerAvatarPlaceholder, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>?</Text>
          </View>
          <Text style={[styles.drawerName, { color: theme.colors.onSurface }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      {/* Profile Header */}
      <View style={[styles.drawerHeader, { backgroundColor: theme.colors.primary, borderBottomColor: theme.colors.outline + '40' }]}>
        {userProfile.image ? (
          <Image source={{ uri: userProfile.image }} style={styles.drawerAvatar} />
        ) : (
          <View style={[styles.drawerAvatarPlaceholder, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: normalize(22) }}>
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
        <Text style={[styles.drawerName, { color: '#ffffff', fontSize: normalize(16) }]}>{userProfile.name}</Text>
        <View style={styles.drawerBusinessBadge}>
          <MaterialCommunityIcons name="store-outline" size={12} color={theme.colors.primary} />
          <Text style={[styles.drawerBusiness, { color: theme.colors.primary, fontSize: normalize(12) }]}>{userProfile.businessName}</Text>
        </View>
      </View>

      <ScrollView {...props} contentContainerStyle={{ paddingVertical: 10 }}>
        <DrawerItemList {...props} />
        
        <Divider style={{ marginVertical: 10, marginHorizontal: 16 }} />
        
        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <View style={[styles.logoutIconWrap, { backgroundColor: theme.colors.error + '15' }]}>
            <MaterialCommunityIcons name="logout" size={20} color={theme.colors.error} />
          </View>
          <Text style={[styles.logoutText, { color: theme.colors.error, fontSize: normalize(14) }]}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// Bottom Tab Navigator
function BottomTabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline + '30',
          borderTopWidth: 1,
          height: TAB_BAR_HEIGHT,
          paddingBottom: Platform.OS === 'ios' ? 22 : 10,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: normalize(10),
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;
          if (route.name === 'DashboardTab') iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          else if (route.name === 'ProductsTab') iconName = focused ? 'cube' : 'cube-outline';
          else if (route.name === 'SalesTab') iconName = focused ? 'currency-usd' : 'currency-usd';
          else if (route.name === 'PurchaseTab') iconName = focused ? 'cart-arrow-down' : 'cart-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'account' : 'account-outline';
          return (
            <View style={[focused && { backgroundColor: theme.colors.primaryContainer, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 3 }]}>
              <MaterialCommunityIcons name={iconName} size={24} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="DashboardTab" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="ProductsTab" component={ProductListScreen} options={{ title: 'Products' }} />
      <Tab.Screen name="SalesTab" component={SalesListScreen} options={{ title: 'Sales' }} />
      <Tab.Screen name="PurchaseTab" component={PurchaseListScreen} options={{ title: 'Purchases' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Drawer Navigator
function DrawerNavigator() {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 1,
          shadowOpacity: 0.05,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outline + '40',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 16,
        },
        headerTintColor: theme.colors.onSurface,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
        drawerActiveBackgroundColor: theme.colors.primaryContainer + '30',
        drawerStyle: {
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginLeft: -10,
        },
      }}
    >
      {/* 
        We render BottomTabNavigator inside the Dashboard Drawer item so that we can have tabs.
        For other items, we render screens directly! 
      */}
      <Drawer.Screen
        name="Dashboard"
        component={BottomTabNavigator}
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Products"
        component={ProductListScreen}
        options={{
          title: 'Products Inventory',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="cube-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Categories"
        component={CategoryListScreen}
        options={{
          title: 'Categories',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="tag-multiple-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Suppliers"
        component={SupplierListScreen}
        options={{
          title: 'Suppliers Management',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="truck-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Customers"
        component={CustomerListScreen}
        options={{
          title: 'Customers (CRM)',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Sales"
        component={SalesListScreen}
        options={{
          title: 'Sales Registry',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="cash-register" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Purchase"
        component={PurchaseListScreen}
        options={{
          title: 'Purchase Registry',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="cart-arrow-down" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrderListScreen}
        options={{
          title: 'Order Deliveries',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="clipboard-text-clock-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Business Reports',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-bar" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Alert Notifications',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="bell-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="cog-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{
          title: 'Help & FAQ',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="help-circle-outline" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

// Global Stack Navigator
export default function AppNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 1,
          shadowOpacity: 0.05,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outline + '40',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 16,
        },
        headerTintColor: theme.colors.onSurface,
        headerBackTitleVisible: false,
      }}
    >
      {/* Splash */}
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />

      {/* Authentication */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} options={{ title: 'Verify OTP' }} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Reset Password' }} />

      {/* Main App (Drawer contains Tabs) */}
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} options={{ headerShown: false }} />

      {/* Module Stacks */}
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
      <Stack.Screen name="AddEditProduct" component={AddEditProductScreen} options={{ title: 'Product Form' }} />
      <Stack.Screen name="AddEditSupplier" component={AddEditSupplierScreen} options={{ title: 'Supplier Form' }} />
      <Stack.Screen name="AddEditCustomer" component={AddEditCustomerScreen} options={{ title: 'Customer Form' }} />
      <Stack.Screen name="AddPurchase" component={AddPurchaseScreen} options={{ title: 'Purchase Entry' }} />
      <Stack.Screen name="AddSale" component={AddSaleScreen} options={{ title: 'Sales Entry' }} />
      <Stack.Screen name="InvoicePreview" component={InvoicePreviewScreen} options={{ title: 'Invoice Preview' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 22,
    paddingTop: Platform.OS === 'ios' ? 52 : 30,
    paddingBottom: 22,
    justifyContent: 'center',
    borderBottomWidth: 0,
    marginBottom: 8,
  },
  drawerAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: 12,
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  drawerAvatarPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  drawerName: {
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  drawerBusinessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
    gap: 4,
  },
  drawerBusiness: {
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginTop: 6,
    gap: 12,
  },
  logoutIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontWeight: '700',
  },
});



