import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Modal, FlatList } from 'react-native';
import { useTheme, Switch, Divider, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { CustomCard } from '../components/CustomCard';

export default function SettingsScreen() {
  const theme = useTheme();
  const {
    isDarkMode,
    toggleDarkMode,
    currency,
    updateCurrency,
    language,
    updateLanguage,
    notificationEnabled,
    toggleNotifications,
  } = useContext(AppContext);

  // Picker States
  const [currencyModal, setCurrencyModal] = useState(false);
  const [langModal, setLangModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [infoType, setInfoType] = useState('about'); // about, privacy, terms

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'EUR', name: 'Euro (€)' },
  ];

  const languages = ['English', 'Spanish', 'French', 'Hindi', 'German'];

  const showInfo = (type) => {
    setInfoType(type);
    setInfoModal(true);
  };

  const getInfoContent = () => {
    switch (infoType) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          body: 'We value your business privacy. Stockify works entirely locally on your device for dummy frontend purposes. No inventory statistics, purchase pricing details, or customer CRM contacts are uploaded to external clouds. Your stock databases remain 100% private and sandboxed inside your local device cache storage.',
        };
      case 'terms':
        return {
          title: 'Terms & Conditions',
          body: 'By using Stockify (Frontend Demo), you agree to simulate store logistics and warehousing metrics under your own discretion. This software is provided "as-is" without any warranties. It is designed to act as a premium user experience sandbox showcasing high fidelity dashboard layouts.',
        };
      case 'about':
      default:
        return {
          title: 'About Stockify',
          body: 'Stockify is a professional, high-performance Stock Management and Inventory tracking mobile client designed for modern businesses. Built using React Native Paper with fluid UI animations, Stockify offers complete CRM panels, supplier logging, purchase tracking, item records, and automated low-stock warn logs.\n\nVersion: 1.0.0 (Release)\nDeveloper: Antigravity AI team.',
        };
    }
  };

  const infoContent = getInfoContent();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        
        {/* Preference Settings Section */}
        <Text style={[styles.sectionHeading, { color: theme.colors.onSurfaceVariant }]}>Application Settings</Text>
        <CustomCard style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.leftCol}>
              <MaterialCommunityIcons name="theme-light-dark" size={22} color={theme.colors.primary} />
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>Dark Mode Theme</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} color={theme.colors.primary} />
          </View>
          <Divider />

          <View style={styles.settingItem}>
            <View style={styles.leftCol}>
              <MaterialCommunityIcons name="bell-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>System Notifications</Text>
            </View>
            <Switch value={notificationEnabled} onValueChange={toggleNotifications} color={theme.colors.primary} />
          </View>
        </CustomCard>

        {/* Localization & Region Settings */}
        <Text style={[styles.sectionHeading, { color: theme.colors.onSurfaceVariant }]}>Localization & Currency</Text>
        <CustomCard style={styles.card}>
          <Pressable onPress={() => setCurrencyModal(true)} style={styles.settingItem}>
            <View style={styles.leftCol}>
              <MaterialCommunityIcons name="currency-usd" size={22} color={theme.colors.primary} />
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>Base Currency</Text>
            </View>
            <View style={styles.rightCol}>
              <Text style={[styles.valText, { color: theme.colors.primary }]}>{currency}</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.onSurfaceVariant} />
            </View>
          </Pressable>
          <Divider />

          <Pressable onPress={() => setLangModal(true)} style={styles.settingItem}>
            <View style={styles.leftCol}>
              <MaterialCommunityIcons name="translate" size={22} color={theme.colors.primary} />
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>App Language</Text>
            </View>
            <View style={styles.rightCol}>
              <Text style={[styles.valText, { color: theme.colors.primary }]}>{language}</Text>
              <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.onSurfaceVariant} />
            </View>
          </Pressable>
        </CustomCard>

        {/* Legal & Info Settings */}
        <Text style={[styles.sectionHeading, { color: theme.colors.onSurfaceVariant }]}>Info & Security</Text>
        <CustomCard style={styles.card}>
          <Pressable onPress={() => showInfo('about')} style={styles.settingItem}>
            <View style={styles.leftCol}>
              <MaterialCommunityIcons name="information-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>About App</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.onSurfaceVariant} />
          </Pressable>
          <Divider />

          <Pressable onPress={() => showInfo('privacy')} style={styles.settingItem}>
            <View style={styles.leftCol}>
              <MaterialCommunityIcons name="shield-lock-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>Privacy Policy</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.onSurfaceVariant} />
          </Pressable>
          <Divider />

          <Pressable onPress={() => showInfo('terms')} style={styles.settingItem}>
            <View style={styles.leftCol}>
              <MaterialCommunityIcons name="file-document-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.label, { color: theme.colors.onSurface }]}>Terms & Conditions</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.onSurfaceVariant} />
          </Pressable>
        </CustomCard>
      </ScrollView>

      {/* Currency Modal */}
      <Modal visible={currencyModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={() => setCurrencyModal(false)} />
          <View style={[styles.popup, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.popupTitle, { color: theme.colors.onSurface }]}>Select Currency</Text>
            <Divider style={{ marginBottom: 8 }} />
            <FlatList
              data={currencies}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    updateCurrency(item.code);
                    setCurrencyModal(false);
                  }}
                  style={styles.selectRow}
                >
                  <Text style={[styles.selectText, { color: theme.colors.onSurface }]}>{item.name}</Text>
                  {currency === item.code && <MaterialCommunityIcons name="check" size={18} color={theme.colors.primary} />}
                </Pressable>
              )}
              ItemSeparatorComponent={() => <Divider />}
            />
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={langModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={() => setLangModal(false)} />
          <View style={[styles.popup, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.popupTitle, { color: theme.colors.onSurface }]}>Select Language</Text>
            <Divider style={{ marginBottom: 8 }} />
            <FlatList
              data={languages}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    updateLanguage(item);
                    setLangModal(false);
                  }}
                  style={styles.selectRow}
                >
                  <Text style={[styles.selectText, { color: theme.colors.onSurface }]}>{item}</Text>
                  {language === item && <MaterialCommunityIcons name="check" size={18} color={theme.colors.primary} />}
                </Pressable>
              )}
              ItemSeparatorComponent={() => <Divider />}
            />
          </View>
        </View>
      </Modal>

      {/* Info View Modal */}
      <Modal visible={infoModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={() => setInfoModal(false)} />
          <View style={[styles.popup, styles.infoPopup, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.popupTitle, { color: theme.colors.onSurface }]}>{infoContent.title}</Text>
            <Divider style={{ marginBottom: 12 }} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.infoBodyText, { color: theme.colors.onSurfaceVariant }]}>{infoContent.body}</Text>
              <Button mode="contained" onPress={() => setInfoModal(false)} style={styles.closeBtn}>
                Close
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollBody: {
    padding: 16,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    marginVertical: 4,
    paddingVertical: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  valText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    width: '100%',
    maxWidth: 280,
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  infoPopup: {
    maxWidth: 340,
    maxHeight: '60%',
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  selectText: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoBodyText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  closeBtn: {
    marginTop: 8,
    alignSelf: 'center',
    width: 120,
  },
});
