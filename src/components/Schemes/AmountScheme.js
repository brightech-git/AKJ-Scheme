import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import appTheme from "../../utils/Theme";
import CustomPicker from "../../screens/AddNewMember/CustomPicker";


const { COLORS, SIZES, FONTS } = appTheme;

const AmountScheme = ({
  formData,
  updateFormData,
  validationErrors,
  setValidationErrors,
  isSubmitting,
  API_BASE_URL_OLD,
  numericSchemeId,
}) => {
  const [amounts, setAmounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch amounts when scheme changes (for BMG AMOUNT SCHEME - SchemeId: 1)
  useEffect(() => {
    const fetchAmounts = async () => {
      console.log("Fetching amounts for BMG AMOUNT SCHEME (ID: 1)");
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL_OLD}/member/schemeid?schemeId=${numericSchemeId}`
        );
        
        console.log("Amounts API Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch amounts. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched amounts data:", data);
        
        // Format the amounts data according to the API response structure
        const formattedAmounts = data.map((item) => ({
          value: item.AMOUNT.toString(), // Convert to string for consistent comparison
          groupCode: item.GROUPCODE,
          currentRegNo: item.CURRENTREGNO,
        }));

        console.log("Formatted amounts:", formattedAmounts);
        setAmounts(formattedAmounts);
      } catch (error) {
        console.error("Error fetching amounts:", error);
        setAmounts([]);
        Alert.alert(
          "Error",
          "Failed to fetch scheme amounts. Please try again.",
          [{ text: "OK" }]
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAmounts();
  }, [numericSchemeId, API_BASE_URL_OLD]);

  const handleAmountSelection = (itemValue) => {
    console.log("Selected amount value:", itemValue);
    const selectedAmount = amounts.find((amt) => amt.value === itemValue);
    console.log("Selected amount object:", selectedAmount);
    
    updateFormData('amount', itemValue);
    if (selectedAmount) {
      updateFormData('selectedGroupCodeObj', selectedAmount.groupCode);
      updateFormData('selectedCurrentRegNoObj', selectedAmount.currentRegNo);
    }
  };

  // Validate Amount Scheme specific fields
  useEffect(() => {
    const errors = { ...validationErrors };
    
    if (!formData.amount) {
      errors.amount = "Please select an amount";
    } else {
      delete errors.amount;
    }

    setValidationErrors(errors);
  }, [formData.amount]);

  const handleRetry = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL_OLD}/member/schemeid?schemeId=${numericSchemeId}`
      );
      if (response.ok) {
        const data = await response.json();
        const formattedAmounts = data.map((item) => ({
          value: item.AMOUNT.toString(),
          groupCode: item.GROUPCODE,
          currentRegNo: item.CURRENTREGNO,
        }));
        setAmounts(formattedAmounts);
      } else {
        throw new Error("Failed to fetch amounts");
      }
    } catch (error) {
      console.error("Error re-fetching amounts:", error);
      Alert.alert("Error", "Failed to fetch amounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, FONTS.h6]}>
        Amount <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
      </Text>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SIZES.margin }} />
      ) : amounts.length > 0 ? (
        <CustomPicker
          selectedValue={formData.amount}
          onValueChange={handleAmountSelection}
          items={[
            { label: 'Select an Amount', value: '' },
            ...amounts.map((amt) => ({
              label: `₹${amt.value} (${amt.groupCode})`,
              value: amt.value
            }))
          ]}
          placeholder="Select Amount"
          enabled={!isSubmitting}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, FONTS.fontXs]}>
            No amounts available for this scheme.
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { marginTop: SIZES.margin }]}
            onPress={handleRetry}
            disabled={loading}
          >
            <Text style={[styles.retryText, FONTS.fontSm]}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      {validationErrors.amount && (
        <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.amount}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius_sm,
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'flex-start',
  },
  retryText: {
    ...FONTS.fontSm,
    color: COLORS.primary,
  },
  noDataContainer: {
    alignItems: 'flex-start',
  },
  noDataText: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    marginTop: SIZES.margin,
    fontStyle: 'italic',
  },
  errorText: {
    ...FONTS.fontSm,
    color: COLORS.danger,
    marginTop: 6,
    marginLeft: 6,
  },
});

export default AmountScheme;