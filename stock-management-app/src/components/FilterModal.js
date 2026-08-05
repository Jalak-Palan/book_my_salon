import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
        <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
            <Text style={[styles.headerTitle, { color: theme.colors.onSurface }]}>Filter & Sort</Text>
            <Pressable onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.onSurface} />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollBody}>
            {/* Sort Section */}
            {sortOptions.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>Sort By</Text>
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
                            backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                            borderColor: isSelected ? theme.colors.primary : 'transparent',
                            borderWidth: 1,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            {
                              color: isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant,
                              fontWeight: isSelected ? '600' : '400',
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
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>Category</Text>
                <View style={styles.chipContainer}>
                  <Pressable
                    onPress={() => setSelectedCategory(null)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selectedCategory === null ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                        borderColor: selectedCategory === null ? theme.colors.primary : 'transparent',
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: selectedCategory === null ? theme.colors.primary : theme.colors.onSurfaceVariant,
                          fontWeight: selectedCategory === null ? '600' : '400',
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
                            backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                            borderColor: isSelected ? theme.colors.primary : 'transparent',
                            borderWidth: 1,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            {
                              color: isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant,
                              fontWeight: isSelected ? '600' : '400',
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
          <View style={[styles.footer, { borderTopColor: theme.colors.outline }]}>
            <Button
              mode="outlined"
              onPress={() => {
                if (onReset) onReset();
              }}
              style={styles.footerBtn}
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
            >
              Apply
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollBody: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  footerBtn: {
    flex: 1,
    marginHorizontal: 6,
  },
});
