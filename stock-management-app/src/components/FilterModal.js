import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable, ScrollView, Platform } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MIN_TOUCH_SIZE, normalize, SCREEN_PADDING } from '../utils/dimensions';

export const FilterModal = ({
  visible,
  onClose,
  onApply,
  onReset,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  selectedSort,
  setSelectedSort,
  sortOptions = [],
}) => {
  const theme = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View
          style={[
            styles.content,
            {
              backgroundColor: theme.colors.surface,
              paddingBottom: Platform.OS === 'ios' ? 30 : 20,
            },
          ]}
        >
          {/* Drag handle indicator */}
          <View style={styles.dragHandleWrapper}>
            <View style={[styles.dragHandle, { backgroundColor: theme.colors.outline + '80' }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.outline + '50' }]}>
            <Text style={[styles.headerTitle, { color: theme.colors.onSurface, fontSize: normalize(18) }]}>
              Filter & Sort
            </Text>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={[styles.closeBtnInner, { backgroundColor: theme.colors.surfaceVariant }]}>
                <MaterialCommunityIcons name="close" size={18} color={theme.colors.onSurface} />
              </View>
            </Pressable>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Sort Section */}
            {sortOptions.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant, fontSize: normalize(12) }]}>
                  Sort By
                </Text>
                <View style={styles.chipContainer}>
                  {sortOptions.map((option) => {
                    const isSelected = selectedSort === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => setSelectedSort(option.value)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: isSelected
                              ? theme.colors.primary
                              : theme.colors.surfaceVariant,
                            borderColor: isSelected ? theme.colors.primary : 'transparent',
                            borderWidth: 1.5,
                          },
                        ]}
                      >
                        {isSelected && (
                          <MaterialCommunityIcons
                            name="check"
                            size={13}
                            color="#ffffff"
                            style={{ marginRight: 4 }}
                          />
                        )}
                        <Text
                          style={[
                            styles.chipText,
                            {
                              color: isSelected ? '#ffffff' : theme.colors.onSurfaceVariant,
                              fontWeight: isSelected ? '700' : '400',
                              fontSize: normalize(13),
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Category Filter Section */}
            {categories.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant, fontSize: normalize(12) }]}>
                  Category
                </Text>
                <View style={styles.chipContainer}>
                  <Pressable
                    onPress={() => setSelectedCategory(null)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selectedCategory === null
                          ? theme.colors.secondary
                          : theme.colors.surfaceVariant,
                        borderColor: selectedCategory === null ? theme.colors.secondary : 'transparent',
                        borderWidth: 1.5,
                      },
                    ]}
                  >
                    {selectedCategory === null && (
                      <MaterialCommunityIcons
                        name="check"
                        size={13}
                        color="#ffffff"
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: selectedCategory === null ? '#ffffff' : theme.colors.onSurfaceVariant,
                          fontWeight: selectedCategory === null ? '700' : '400',
                          fontSize: normalize(13),
                        },
                      ]}
                    >
                      All Categories
                    </Text>
                  </Pressable>
                  {categories.map((cat) => {
                    const name = typeof cat === 'string' ? cat : cat.name;
                    const isSelected = selectedCategory === name;
                    return (
                      <Pressable
                        key={name}
                        onPress={() => setSelectedCategory(name)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: isSelected
                              ? theme.colors.secondary
                              : theme.colors.surfaceVariant,
                            borderColor: isSelected ? theme.colors.secondary : 'transparent',
                            borderWidth: 1.5,
                          },
                        ]}
                      >
                        {isSelected && (
                          <MaterialCommunityIcons
                            name="check"
                            size={13}
                            color="#ffffff"
                            style={{ marginRight: 4 }}
                          />
                        )}
                        <Text
                          style={[
                            styles.chipText,
                            {
                              color: isSelected ? '#ffffff' : theme.colors.onSurfaceVariant,
                              fontWeight: isSelected ? '700' : '400',
                              fontSize: normalize(13),
                            },
                          ]}
                        >
                          {name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={[styles.footer, { borderTopColor: theme.colors.outline + '50' }]}>
            <Button
              mode="outlined"
              onPress={() => {
                if (onReset) onReset();
              }}
              style={styles.footerBtn}
              contentStyle={styles.footerBtnContent}
              labelStyle={{ fontSize: normalize(14), fontWeight: '600' }}
              icon="refresh"
            >
              Reset
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                if (onApply) onApply();
                onClose();
              }}
              style={styles.footerBtn}
              contentStyle={styles.footerBtnContent}
              labelStyle={{ fontSize: normalize(14), fontWeight: '700' }}
              icon="check"
            >
              Apply Filters
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '82%',
  },
  dragHandleWrapper: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: '700',
  },
  closeBtn: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    minHeight: 36,
  },
  chipText: {},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  footerBtn: {
    flex: 1,
  },
  footerBtnContent: {
    height: 48,
  },
});
