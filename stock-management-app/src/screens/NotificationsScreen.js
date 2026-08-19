import React, { useContext } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { CustomCard } from '../components/CustomCard';

export default function NotificationsScreen() {
  const theme = useTheme();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
  } = useContext(AppContext);

  const getIconDetails = (type) => {
    switch (type) {
      case 'success':
        return { icon: 'check-circle-outline', color: theme.colors.success };
      case 'warning':
        return { icon: 'alert-outline', color: theme.colors.warning };
      case 'danger':
        return { icon: 'alert-circle-outline', color: theme.colors.error };
      case 'info':
      default:
        return { icon: 'information-outline', color: theme.colors.primary };
    }
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const renderNotificationItem = ({ item }) => {
    const { icon, color } = getIconDetails(item.type);
    return (
      <Pressable onPress={() => markNotificationAsRead(item.id)}>
        <CustomCard style={[styles.card, !item.read && { borderLeftWidth: 4, borderLeftColor: color }]} outline>
          <View style={styles.itemRow}>
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
              <MaterialCommunityIcons name={icon} size={22} color={color} />
            </View>

            <View style={styles.textBox}>
              <View style={styles.headerRow}>
                <Text style={[styles.title, { color: theme.colors.onSurface }, !item.read && styles.boldText]}>
                  {item.title}
                </Text>
                {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />}
              </View>
              <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>{item.message}</Text>
              <Text style={[styles.time, { color: theme.colors.onSurfaceVariant + '80' }]}>{formatDate(item.date)}</Text>
            </View>
          </View>
        </CustomCard>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {notifications.length > 0 ? (
        <View style={styles.topActions}>
          <Button mode="text" onPress={markAllNotificationsAsRead} style={styles.actionBtn}>
            Mark all read
          </Button>
          <Button mode="text" onPress={clearAllNotifications} textColor={theme.colors.error} style={styles.actionBtn}>
            Clear all
          </Button>
        </View>
      ) : null}

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="bell-off-outline"
            title="All Caught Up!"
            description="You don't have any notifications right now."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  actionBtn: {
    paddingHorizontal: 0,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    marginVertical: 6,
    paddingVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  boldText: {
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  message: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  time: {
    fontSize: 11,
    marginTop: 6,
  },
});
