import React, { useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, findNodeHandle } from "react-native";
import appTheme from "../../utils/Theme";
import CustomPicker from "../../screens/AddNewMember/CustomPicker";

const { COLORS, SIZES, FONTS } = appTheme;

const FixedDepositScheme = ({
  formData,
  updateFormData,
  validationErrors,
  setValidationErrors,
  isSubmitting,
  inputRefs,
  setActiveInput,
}) => {
  const amountRef = useRef(null);

  const handleAmountChange = (text) => {
    const sanitizedText = text.replace(/[^0-9.]/g, "");

    const parts = sanitizedText.split(".");
    if (parts.length > 2 || (parts[1] && parts[1].length > 2)) {
      return;
    }

    updateFormData("amount", sanitizedText);
  };

  // Validate Fixed Deposit specific fields
  useEffect(() => {
    const errors = { ...validationErrors };

    if (!formData.amount || formData.amount.trim() === "") {
      errors.amount = "Fixed deposit amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      errors.amount = "Please enter a valid fixed deposit amount greater than 0";
    } else if (parseFloat(formData.amount) < 5000) {
      errors.amount = "Minimum fixed deposit amount is ₹5000";
    } else {
      delete errors.amount;
    }

    setValidationErrors(errors);
  }, [formData.amount]);

  // Assign the ref safely to parent if needed
  useEffect(() => {
    if (inputRefs?.current) {
      inputRefs.current.amount = amountRef.current;
    }
  }, [inputRefs]);

  // Helper to safely measure layout if needed
  const measureLayoutSafe = () => {
    const nodeHandle = findNodeHandle(amountRef.current);
    if (nodeHandle && amountRef.current?.measureLayout) {
      amountRef.current.measureLayout(
        nodeHandle,
        (x, y, width, height) => {
          console.log("Measured Layout:", x, y, width, height);
        },
        (error) => console.warn("Measure error:", error)
      );
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, FONTS.h6]}>
        Fixed Deposit Amount (₹){" "}
        <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
      </Text>
      <TextInput
        ref={amountRef}
        style={[
          styles.input,
          validationErrors.amount && styles.inputError,
          { backgroundColor: COLORS.input, borderColor: COLORS.borderColor },
        ]}
        keyboardType="decimal-pad"
        value={formData.amount}
        editable={!isSubmitting}
        onChangeText={handleAmountChange}
        placeholder="Enter fixed deposit amount (min. ₹5000)"
        placeholderTextColor={COLORS.placeholder}
        maxLength={10}
        onFocus={() => {
          if (setActiveInput) setActiveInput("amount");
        }}
        onLayout={measureLayoutSafe} // optional: verify layout is safe
      />
      {validationErrors.amount && (
        <Text style={[styles.errorText, FONTS.fontSm]}>
          {validationErrors.amount}
        </Text>
      )}
      <Text style={[styles.hintText, FONTS.fontXs]}>
        Minimum fixed deposit amount is ₹5000
      </Text>
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
    fontWeight: "700",
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
    fontStyle: "italic",
  },
});

export default FixedDepositScheme;
