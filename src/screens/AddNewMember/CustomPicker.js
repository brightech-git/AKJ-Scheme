import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet
} from "react-native";
import appTheme from "../../utils/Theme";

const { COLORS, SIZES, FONTS } = appTheme;

const CustomPicker = ({
  selectedValue,
  onValueChange,
  items,
  placeholder = "Select an option",
  enabled = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const selected = items.find((item) => item.value === selectedValue);
    setSelectedLabel(selected ? selected.label : placeholder);
  }, [selectedValue, items, placeholder]);

  const handleSelect = (item) => {
    onValueChange(item.value);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          !enabled && styles.pickerDisabled,
          { backgroundColor: COLORS.input, borderColor: COLORS.borderColor },
        ]}
        onPress={() => enabled && setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.pickerText,
            selectedValue ? FONTS.font : [styles.placeholderText, FONTS.font],
          ]}
        >
          {selectedLabel}
        </Text>
        <View style={styles.pickerIcon}>
          <Text style={[styles.pickerIconText, { color: COLORS.iconPrimary }]}>
            ▼
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: COLORS.overlay }]}
        >
          <View style={[styles.modalContent, { backgroundColor: COLORS.card }]}>
            <View
              style={[
                styles.modalHeader,
                {
                  backgroundColor: COLORS.surface,
                  borderBottomColor: COLORS.borderColor,
                },
              ]}
            >
              <Text style={[styles.modalTitle, FONTS.h5]}>Select Option</Text>
              <TouchableOpacity
                style={[
                  styles.closeButtonContainer,
                  { backgroundColor: COLORS.primaryLight },
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.closeButton, { color: COLORS.primary }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    { borderBottomColor: COLORS.borderColor },
                    item.value === selectedValue && {
                      backgroundColor: COLORS.primaryLight,
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      FONTS.font,
                      item.value === selectedValue && { color: COLORS.primary },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  pickerText: {
    ...FONTS.font,
    color: COLORS.text,
    flex: 1,
  },
  placeholderText: {
    ...FONTS.font,
    color: COLORS.placeholder,
  },
  pickerIcon: {
    marginLeft: SIZES.margin,
  },
  pickerIconText: {
    fontSize: SIZES.fontLg,
    color: COLORS.iconPrimary,
  },
  pickerDisabled: {
    opacity: 0.6,
    backgroundColor: COLORS.darkInput,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    width: '92%',
    maxHeight: '85%',
    elevation: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    backgroundColor: COLORS.surface,
  },
  modalTitle: {
    ...FONTS.h5,
    color: COLORS.title,
    letterSpacing: 0.3,
  },
  closeButtonContainer: {
    padding: 10,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
  },
  closeButton: {
    fontSize: SIZES.h5,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  modalItem: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  modalItemText: {
    ...FONTS.font,
    color: COLORS.text,
  },
};

export default CustomPicker;