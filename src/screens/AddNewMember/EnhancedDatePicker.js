import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
  StyleSheet
} from "react-native";
import appTheme from "../../utils/Theme";
import CustomPicker from "./CustomPicker";

const { COLORS, SIZES, FONTS } = appTheme;

const EnhancedDatePicker = ({
  selectedDate,
  onDateChange,
  placeholder = "Select Date",
  minimumDate,
  maximumDate,
  error,
  label = "Date of Birth",
  required = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(
    selectedDate ? selectedDate.getDate() : ""
  );
  const [selectedMonth, setSelectedMonth] = useState(
    selectedDate ? selectedDate.getMonth() + 1 : ""
  );
  const [selectedYear, setSelectedYear] = useState(
    selectedDate ? selectedDate.getFullYear() : ""
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const formatDate = (date) => {
    if (!date) return placeholder;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    return new Date(year, month, 0).getDate();
  };

  const generateDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ label: day.toString().padStart(2, "0"), value: day });
    }
    return days;
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const minYear = minimumDate ? minimumDate.getFullYear() : 1900;
    const years = [];
    for (let year = minYear; year <= currentYear; year++) {
      years.push({ label: year.toString(), value: year });
    }
    return years.reverse();
  };

  const handleConfirm = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
      if (
        date.getDate() === selectedDay &&
        date >= (minimumDate || new Date(1900, 0, 1)) &&
        date <= (maximumDate || new Date())
      ) {
        onDateChange(date);
        setShowPicker(false);
      } else {
        Alert.alert("Invalid Date", "Please select a valid date.");
      }
    } else {
      Alert.alert("Incomplete Date", "Please select day, month, and year.");
    }
  };

  const openDatePicker = () => {
    if (selectedDate) {
      setSelectedDay(selectedDate.getDate());
      setSelectedMonth(selectedDate.getMonth() + 1);
      setSelectedYear(selectedDate.getFullYear());
    } else {
      setSelectedDay("");
      setSelectedMonth("");
      setSelectedYear("");
    }
    setShowPicker(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDatePicker = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowPicker(false));
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
      if (selectedDay && selectedDay > daysInMonth) {
        setSelectedDay("");
      }
    }
  }, [selectedMonth, selectedYear]);

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, FONTS.h6]}>
        {label}{" "}
        {required && (
          <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
        )}
      </Text>

      <TouchableOpacity
        onPress={openDatePicker}
        style={[styles.datePickerButton, error && styles.inputError]}
        activeOpacity={0.7}
      >
        <View style={styles.datePickerContent}>
          <Text
            style={[
              styles.datePickerText,
              !selectedDate
                ? [styles.placeholderText, FONTS.font]
                : [styles.dateText, FONTS.font],
            ]}
          >
            {formatDate(selectedDate) || placeholder}
          </Text>
          <View style={styles.calendarIcon}>
            <Text
              style={[styles.calendarIconText, { color: COLORS.iconPrimary }]}
            >
              📅
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {error && <Text style={[styles.errorText, FONTS.fontSm]}>{error}</Text>}

      <Modal
        transparent={true}
        animationType="none"
        visible={showPicker}
        onRequestClose={closeDatePicker}
      >
        <Animated.View
          style={[
            styles.dateModalOverlay,
            { backgroundColor: COLORS.overlay, opacity: fadeAnim },
          ]}
        >
          <View
            style={[styles.dateModalContent, { backgroundColor: COLORS.card }]}
          >
            <View
              style={[
                styles.dateModalHeader,
                {
                  backgroundColor: COLORS.surface,
                  borderBottomColor: COLORS.borderColor,
                },
              ]}
            >
              <Text style={[styles.dateModalTitle, FONTS.h5]}>
                Select Date of Birth
              </Text>
              <TouchableOpacity
                onPress={closeDatePicker}
                style={[
                  styles.dateModalClose,
                  { backgroundColor: COLORS.primaryLight },
                ]}
              >
                <Text
                  style={[styles.closeButtonText, { color: COLORS.primary }]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.dropdownContainer,
                { backgroundColor: COLORS.surface },
              ]}
            >
              <View style={styles.dropdownSection}>
                <Text style={[styles.dropdownLabel, FONTS.h6]}>Day</Text>
                <CustomPicker
                  selectedValue={selectedDay}
                  onValueChange={(value) => setSelectedDay(value)}
                  items={[
                    { label: "Select Day", value: "" },
                    ...generateDays(),
                  ]}
                  placeholder="Select Day"
                />
              </View>

              <View style={styles.dropdownSection}>
                <Text style={[styles.dropdownLabel, FONTS.h6]}>Month</Text>
                <CustomPicker
                  selectedValue={selectedMonth}
                  onValueChange={(value) => setSelectedMonth(value)}
                  items={[{ label: "Select Month", value: "" }, ...months]}
                  placeholder="Select Month"
                />
              </View>

              <View style={styles.dropdownSection}>
                <Text style={[styles.dropdownLabel, FONTS.h6]}>Year</Text>
                <CustomPicker
                  selectedValue={selectedYear}
                  onValueChange={(value) => setSelectedYear(value)}
                  items={[
                    { label: "Select Year", value: "" },
                    ...generateYears(),
                  ]}
                  placeholder="Select Year"
                />
              </View>
            </View>

            <View
              style={[
                styles.dateModalButtons,
                { backgroundColor: COLORS.surface },
              ]}
            >
              <TouchableOpacity
                onPress={handleConfirm}
                style={[
                  styles.dateModalButton,
                  styles.dateModalConfirmButton,
                  { backgroundColor: COLORS.primary },
                ]}
              >
                <Text
                  style={[
                    styles.dateModalConfirmText,
                    FONTS.h6,
                    { color: COLORS.white },
                  ]}
                >
                  Confirm
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={closeDatePicker}
                style={[
                  styles.dateModalButton,
                  styles.dateModalCancelButton,
                  {
                    backgroundColor: COLORS.secondary,
                    borderColor: COLORS.outline,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dateModalCancelText,
                    FONTS.h6,
                    { color: COLORS.white },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = {
  inputContainer: {
    marginBottom: SIZES.margin * 1,
  },
  label: {
    ...FONTS.h6,
    color: COLORS.label,
    marginBottom: SIZES.margin / 2,
    letterSpacing: 0.3,
  },
  asterisk: {
    color: COLORS.danger,
    fontSize: SIZES.fontLg,
    fontWeight: '700',
  },
  datePickerButton: {
    height: 56,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  inputError: {
    borderColor: COLORS.danger,
    borderWidth: 2,
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    ...FONTS.font,
    flex: 1,
    alignSelf: 'center',
    color: COLORS.text,
  },
  placeholderText: {
    ...FONTS.font,
    color: COLORS.placeholder,
  },
  dateText: {
    ...FONTS.font,
    color: COLORS.text,
  },
  calendarIcon: {
    marginLeft: SIZES.margin,
  },
  calendarIconText: {
    fontSize: SIZES.h5,
    color: COLORS.iconPrimary,
  },
  errorText: {
    ...FONTS.fontSm,
    color: COLORS.danger,
    marginTop: 6,
    marginLeft: 6,
  },
  dateModalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateModalContent: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    width: '95%',
    maxWidth: SIZES.container,
    elevation: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  dateModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    backgroundColor: COLORS.surface,
  },
  dateModalTitle: {
    ...FONTS.h5,
    color: COLORS.title,
    letterSpacing: 0.3,
  },
  dateModalClose: {
    padding: 10,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
  },
  closeButtonText: {
    fontSize: SIZES.h5,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    padding: SIZES.padding,
    paddingTop: SIZES.padding,
    backgroundColor: COLORS.surface,
  },
  dropdownSection: {
    marginBottom: SIZES.margin,
  },
  dropdownLabel: {
    ...FONTS.h6,
    color: COLORS.label,
    marginBottom: SIZES.margin / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    paddingTop: SIZES.padding,
    gap: SIZES.margin,
    backgroundColor: COLORS.surface,
  },
  dateModalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  dateModalCancelButton: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1.5,
    borderColor: COLORS.outline,
  },
  dateModalConfirmButton: {
    backgroundColor: COLORS.primary,
  },
  dateModalCancelText: {
    ...FONTS.h6,
    color: COLORS.white,
  },
  dateModalConfirmText: {
    ...FONTS.h6,
    color: COLORS.white,
  },
};

export default EnhancedDatePicker;