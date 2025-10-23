import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import appTheme from "../../utils/Theme";
import CustomPicker from "../../screens/AddNewMember/CustomPicker";

const { COLORS, SIZES, FONTS } = appTheme;

const DigiSilverScheme = ({
  formData,
  updateFormData,
  validationErrors,
  setValidationErrors,
  isSubmitting,
  API_BASE_URL_OLD,
  numericSchemeId,
  inputRefs,
  setActiveInput,
}) => {
  const [goldRate, setGoldRate] = useState(null);
  const [loadingGoldRate, setLoadingGoldRate] = useState(false);
  const [goldRateError, setGoldRateError] = useState(false);

  // Fetch silver rate for BMG DIGI SILVER
  const fetchSilverRate = useCallback(async () => {
    setLoadingGoldRate(true);
    setGoldRateError(false);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL_OLD}/account/todayrate`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch silver rate`);
      }

      const data = await response.json();

      // Use silver rate if available, otherwise fallback to gold rate
      const rate = data.SILVERRATE || data.GOLDRATE;
      
      if (!rate || isNaN(rate)) {
        throw new Error("Invalid silver rate received from server");
      }

      setGoldRate(rate);
    } catch (error) {
      console.error("Error fetching silver rate:", error);
      setGoldRateError(true);
      setGoldRate(null);

      if (error.name !== "AbortError") {
        Alert.alert(
          "Error",
          "Failed to fetch current silver rate. Please check your internet connection and try again.",
          [
            { text: "Retry", onPress: fetchSilverRate },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    } finally {
      setLoadingGoldRate(false);
    }
  }, [API_BASE_URL_OLD]);

  useEffect(() => {
    // Fetch silver rate for BMG DIGI SILVER (SchemeId: 2)
    if (numericSchemeId === 2 && goldRate === null && !loadingGoldRate && !goldRateError) {
      fetchSilverRate();
    }
  }, [numericSchemeId, goldRate, loadingGoldRate, goldRateError, fetchSilverRate]);

  const convertAmountToWeight = useCallback(
    (amountValue) => {
      if (
        goldRate &&
        amountValue &&
        !isNaN(amountValue) &&
        parseFloat(amountValue) > 0
      ) {
        const weightInGrams = (parseFloat(amountValue) / goldRate).toFixed(3);
        updateFormData('calculatedWeight', weightInGrams);
      } else {
        updateFormData('calculatedWeight', "");
      }
    },
    [goldRate, updateFormData]
  );

  const handleAmountChange = (text) => {
    const sanitizedText = text.replace(/[^0-9.]/g, "");

    const parts = sanitizedText.split(".");
    if (parts.length > 2 || (parts[1] && parts[1].length > 2)) {
      return;
    }

    updateFormData('amount', sanitizedText);
    convertAmountToWeight(sanitizedText);
  };

  // Validate Digi Silver specific fields
  useEffect(() => {
    const errors = { ...validationErrors };
    
    if (formData.amount) {
      if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        errors.amount = "Please enter a valid amount greater than 0";
      } else if (parseFloat(formData.amount) < 1) {
        errors.amount = "Minimum payment amount is ₹1";
      } else {
        delete errors.amount;
      }
    }

    if (!goldRate && !loadingGoldRate) {
      errors.goldRate = "Current silver rate is not available. Please retry fetching.";
    } else {
      delete errors.goldRate;
    }

    if (formData.calculatedWeight && parseFloat(formData.calculatedWeight) <= 0) {
      errors.calculatedWeight = "Calculated silver weight is invalid.";
    } else {
      delete errors.calculatedWeight;
    }

    setValidationErrors(errors);
  }, [formData.amount, formData.calculatedWeight, goldRate, loadingGoldRate]);

  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, FONTS.h6]}>
          Amount (₹) <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            validationErrors.amount && styles.inputError,
            { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }
          ]}
          keyboardType="decimal-pad"
          value={formData.amount}
          editable={!isSubmitting}
          onChangeText={handleAmountChange}
          placeholder="Enter amount for Digi Silver"
          placeholderTextColor={COLORS.placeholder}
          maxLength={10}
          onFocus={() => setActiveInput('amount')}
          ref={(ref) => (inputRefs.current['amount'] = ref)}
        />
        {validationErrors.amount && (
          <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.amount}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, FONTS.h6]}>Current Silver Rate</Text>
        {loadingGoldRate ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SIZES.margin }} />
        ) : goldRateError ? (
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: COLORS.primaryLight, borderColor: COLORS.danger }
            ]}
            onPress={fetchSilverRate}
            disabled={isSubmitting}
          >
            <Text style={[styles.retryText, FONTS.fontSm, { color: COLORS.danger }]}>
              Failed to load rate. Tap to retry
            </Text>
          </TouchableOpacity>
        ) : goldRate ? (
          <View
            style={[
              styles.staticValueContainer,
              { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }
            ]}
          >
            <Text style={[styles.staticValueText, FONTS.font]}>
              {`₹${goldRate} / gm`}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.staticValueContainer,
              { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }
            ]}
          >
            <Text style={[styles.staticValueText, FONTS.font]}>N/A</Text>
          </View>
        )}
        {validationErrors.goldRate && (
          <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.goldRate}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, FONTS.h6]}>Calculated Silver Weight (grams)</Text>
        <TextInput
          style={[
            styles.input,
            styles.disabledInput,
            validationErrors.calculatedWeight && styles.inputError,
            { backgroundColor: COLORS.darkInput, borderColor: COLORS.borderColor }
          ]}
          value={formData.calculatedWeight ? `${formData.calculatedWeight} g` : ''}
          editable={false}
          placeholder="Weight will be calculated"
          placeholderTextColor={COLORS.placeholder}
        />
        {validationErrors.calculatedWeight && (
          <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.calculatedWeight}</Text>
        )}
        {formData.amount && formData.calculatedWeight && parseFloat(formData.calculatedWeight) > 0 && (
          <Text style={[styles.hintText, FONTS.fontXs]}>
            You will purchase {formData.calculatedWeight}g of silver.
          </Text>
        )}
      </View>
    </>
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
  input: {
    height: 56,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    ...FONTS.h6,
    color: COLORS.title,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  inputError: {
    borderColor: COLORS.danger,
    borderWidth: 2,
  },
  asterisk: {
    color: COLORS.danger,
    fontSize: SIZES.fontLg,
    fontWeight: '700',
  },
  disabledInput: {
    backgroundColor: COLORS.darkInput,
    color: COLORS.textLight,
    opacity: 0.7,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  staticValueContainer: {
    height: 56,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  staticValueText: {
    ...FONTS.font,
    color: COLORS.text,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius_sm,
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'flex-start',
    marginTop: SIZES.margin,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
  },
  retryText: {
    ...FONTS.fontSm,
    color: COLORS.danger,
  },
  errorText: {
    ...FONTS.fontSm,
    color: COLORS.danger,
    marginTop: 6,
    marginLeft: 6,
  },
  hintText: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default DigiSilverScheme;