import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Pressable, Modal, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme, Button, Switch, Divider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { CustomInput } from '../components/CustomInput';
import { CustomCard } from '../components/CustomCard';

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const { userProfile, updateProfile, isDarkMode, toggleDarkMode, logout } = useContext(AppContext);

  // Modal triggers
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm({
    defaultValues: {
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      businessName: userProfile?.businessName || '',
      image: userProfile?.image || '',
      address: userProfile?.address || '',
      city: userProfile?.city || '',
      state: userProfile?.state || '',
      country: userProfile?.country || '',
      pincode: userProfile?.pincode || '',
    },
  });

  const {
    control: passControl,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    watch: watchPass,
    formState: { errors: passErrors },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const newPass = watchPass('newPassword');

  const buildEditDefaults = () => ({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    businessName: userProfile?.businessName || '',
    image: userProfile?.image || '',
    address: userProfile?.address || '',
    city: userProfile?.city || '',
    state: userProfile?.state || '',
    country: userProfile?.country || '',
    pincode: userProfile?.pincode || '',
  });

  const onOpenEdit = () => {
    resetEdit(buildEditDefaults());
    setEditModalVisible(true);
  };

  const onEditSave = async (data) => {
    const result = await updateProfile(data);
    if (!result?.success) {
      Alert.alert('Update failed', result?.message || 'Unable to save profile changes.');
      return;
    }

    setEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully.');
  };

  const onPasswordSave = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setPasswordModalVisible(false);
    resetPass();
    Alert.alert('Success', 'Password has been updated successfully.');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const profileAddress = [userProfile?.address, userProfile?.city, userProfile?.state, userProfile?.country]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        {/* Profile Card Header */}
        <CustomCard style={styles.headerCard}>
          <View style={styles.avatarRow}>
            {userProfile?.image ? (
              <Image source={{ uri: userProfile.image }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
                  {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
            )}
            <View style={styles.nameBlock}>
              <Text style={[styles.name, { color: theme.colors.onSurface }]}>{userProfile?.name || 'User'}</Text>
              <Text style={[styles.business, { color: theme.colors.primary }]}>{userProfile?.businessName || 'Business'}</Text>
              <Text style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>{userProfile?.email || ''}</Text>
            </View>
          </View>
        </CustomCard>

        {/* Info detail Card */}
        <CustomCard style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Account Details</Text>
          <Divider />

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="phone-outline" size={20} color={theme.colors.onSurfaceVariant} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Phone</Text>
              <Text style={[styles.infoVal, { color: theme.colors.onSurface }]}>{userProfile?.phone || ''}</Text>
            </View>
          </View>
          <Divider />

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="domain" size={20} color={theme.colors.onSurfaceVariant} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Business Name</Text>
              <Text style={[styles.infoVal, { color: theme.colors.onSurface }]}>{userProfile?.businessName || ''}</Text>
            </View>
          </View>
          <Divider />

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="image-account" size={20} color={theme.colors.onSurfaceVariant} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Profile Photo</Text>
              <View style={styles.photoRow}>
                {userProfile?.image ? (
                  <Image source={{ uri: userProfile.image }} style={styles.photoThumb} />
                ) : (
                  <View style={[styles.photoThumb, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <MaterialCommunityIcons name="camera-account" size={18} color={theme.colors.onSurfaceVariant} />
                  </View>
                )}
                <Text style={[styles.photoText, { color: theme.colors.onSurface }]} numberOfLines={1}>
                  {userProfile?.image || 'No profile photo set'}
                </Text>
              </View>
            </View>
          </View>
        </CustomCard>

        <CustomCard style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Address Details</Text>
          <Divider />

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color={theme.colors.onSurfaceVariant} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Address</Text>
              <Text style={[styles.infoVal, { color: theme.colors.onSurface }]}>{profileAddress || ''}</Text>
            </View>
          </View>
          <Divider />

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="city-variant-outline" size={20} color={theme.colors.onSurfaceVariant} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>City</Text>
              <Text style={[styles.infoVal, { color: theme.colors.onSurface }]}>{userProfile?.city || ''}</Text>
            </View>
          </View>
          <Divider />

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="map-outline" size={20} color={theme.colors.onSurfaceVariant} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>State</Text>
              <Text style={[styles.infoVal, { color: theme.colors.onSurface }]}>{userProfile?.state || ''}</Text>
            </View>
          </View>
          <Divider />

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="earth" size={20} color={theme.colors.onSurfaceVariant} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Country</Text>
              <Text style={[styles.infoVal, { color: theme.colors.onSurface }]}>{userProfile?.country || ''}</Text>
            </View>
          </View>
          <Divider />

          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="post-outline" size={20} color={theme.colors.onSurfaceVariant} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Pincode</Text>
              <Text style={[styles.infoVal, { color: theme.colors.onSurface }]}>{userProfile?.pincode || ''}</Text>
            </View>
          </View>
        </CustomCard>

        {/* Options list */}
        <CustomCard style={styles.optionsCard}>
          <Pressable onPress={onOpenEdit} style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="account-edit-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.optionText, { color: theme.colors.onSurface }]}>Edit Profile</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>
          <Divider />

          <Pressable onPress={() => setPasswordModalVisible(true)} style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="lock-open-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.optionText, { color: theme.colors.onSurface }]}>Change Password</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.onSurfaceVariant} />
          </Pressable>
          <Divider />

          <View style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="theme-light-dark" size={22} color={theme.colors.primary} />
              <Text style={[styles.optionText, { color: theme.colors.onSurface }]}>Dark Mode</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} color={theme.colors.primary} />
          </View>
          <Divider />

          <Pressable onPress={handleLogout} style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="logout" size={22} color={theme.colors.error} />
              <Text style={[styles.optionText, { color: theme.colors.error }]}>Log Out</Text>
            </View>
          </Pressable>
        </CustomCard>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setEditModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Edit Profile Info</Text>
            <Divider style={{ marginBottom: 16 }} />

            <ScrollView showsVerticalScrollIndicator={false}>
              <Controller
                control={editControl}
                rules={{ required: 'Name is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Full Name *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={editErrors.name?.message}
                  />
                )}
                name="name"
              />

              <Controller
                control={editControl}
                rules={{ required: 'Business Name is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Business Name *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={editErrors.businessName?.message}
                  />
                )}
                name="businessName"
              />

              <Controller
                control={editControl}
                rules={{ required: 'Phone is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Phone Number *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                    error={editErrors.phone?.message}
                  />
                )}
                name="phone"
              />

              <Controller
                control={editControl}
                rules={{
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Email Address *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={editErrors.email?.message}
                  />
                )}
                name="email"
              />

              <Controller
                control={editControl}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Profile Photo URL"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    keyboardType="url"
                    placeholder="https://example.com/photo.jpg"
                    error={editErrors.image?.message}
                  />
                )}
                name="image"
              />

              <Controller
                control={editControl}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Street Address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    placeholder="House no, street, area"
                    error={editErrors.address?.message}
                  />
                )}
                name="address"
              />

              <Controller
                control={editControl}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="City"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={editErrors.city?.message}
                  />
                )}
                name="city"
              />

              <Controller
                control={editControl}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="State"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={editErrors.state?.message}
                  />
                )}
                name="state"
              />

              <Controller
                control={editControl}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Country"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={editErrors.country?.message}
                  />
                )}
                name="country"
              />

              <Controller
                control={editControl}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Pincode"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="number-pad"
                    error={editErrors.pincode?.message}
                  />
                )}
                name="pincode"
              />

              <View style={styles.modalBtns}>
                <Button mode="outlined" onPress={() => setEditModalVisible(false)} style={styles.modalBtn}>
                  Cancel
                </Button>
                <Button mode="contained" onPress={handleEditSubmit(onEditSave)} style={styles.modalBtn}>
                  Save
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={passwordModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setPasswordModalVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>Change Password</Text>
            <Divider style={{ marginBottom: 16 }} />

            <ScrollView showsVerticalScrollIndicator={false}>
              <Controller
                control={passControl}
                rules={{ required: 'Current password is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Current Password *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={passErrors.currentPassword?.message}
                  />
                )}
                name="currentPassword"
              />

              <Controller
                control={passControl}
                rules={{
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Min 6 characters required' },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="New Password *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={passErrors.newPassword?.message}
                  />
                )}
                name="newPassword"
              />

              <Controller
                control={passControl}
                rules={{
                  required: 'Please confirm new password',
                  validate: (value) => value === newPass || 'New passwords do not match',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Confirm New Password *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={passErrors.confirmNewPassword?.message}
                  />
                )}
                name="confirmNewPassword"
              />

              <View style={styles.modalBtns}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setPasswordModalVisible(false);
                    resetPass();
                  }}
                  style={styles.modalBtn}
                >
                  Cancel
                </Button>
                <Button mode="contained" onPress={handlePassSubmit(onPasswordSave)} style={styles.modalBtn}>
                  Update Password
                </Button>
              </View>
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
  headerCard: {
    marginBottom: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  nameBlock: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  business: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  email: {
    fontSize: 12,
    marginTop: 2,
  },
  infoCard: {
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  photoThumb: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 10,
  },
  photoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  optionsCard: {
    marginVertical: 6,
    paddingVertical: 4,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 10,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 6,
  },
});

