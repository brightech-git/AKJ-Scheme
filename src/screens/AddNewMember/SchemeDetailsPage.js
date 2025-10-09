import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
  ImageBackground
} from "react-native";
import appTheme from "../../utils/Theme";
import { BackHeader } from "../../components";
import CustomPicker from "./CustomPicker";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import { API_BASE_URL_OLD } from "../../Config/API";

const { COLORS, SIZES, FONTS } = appTheme;

const SchemeDetailsPage = ({
  schemeData,
  onSubmit,
  onBack,
  validationErrors,
  setValidationErrors,
  isSubmitting,
  API_BASE_URL,
  schemes, // Receive schemes from parent
}) => {
  const scrollViewRef = useRef(null);
  const inputRefs = useRef({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [activeInput, setActiveInput] = useState(null);

  const [formData, setFormData] = useState({
    selectedSchemeId: null,
    selectedGroupCodeObj: null,
    selectedCurrentRegNoObj: null,
    amount: "",
    accCode: "",
    modePay: "C",
    calculatedWeight: "",
    ...schemeData,
  });

  const [amounts, setAmounts] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [goldRate, setGoldRate] = useState(null);
  const [loadingGoldRate, setLoadingGoldRate] = useState(false);
  const [goldRateError, setGoldRateError] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      if (activeInput && inputRefs.current[activeInput]) {
        inputRefs.current[activeInput].measureLayout(
          scrollViewRef.current.getScrollableNode(),
          (x, y) => {
            scrollViewRef.current.scrollTo({
              y: y + 20,
              animated: true,
            });
          },
          () => console.log('Error measuring input layout')
        );
      }
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      setActiveInput(null);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [activeInput]);

  useEffect(() => {
    const fetchTransactionTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL_OLD}/account/getTranType`);
        if (!response.ok) throw new Error("Network response was not ok.");
        const data = await response.json();
        setTransactionTypes(data);
      } catch (error) {
        console.error("Error fetching transaction types:", error);
      }
    };
    fetchTransactionTypes();
  }, [API_BASE_URL_OLD]);

  // Set default scheme if none selected
  useEffect(() => {
    if (schemes && schemes.length > 0 && formData.selectedSchemeId === null) {
      setFormData(prev => ({ ...prev, selectedSchemeId: schemes[0].SchemeId }));
    }
  }, [schemes, formData.selectedSchemeId]);

  // Fetch amounts when scheme changes (for BMG AMOUNT SCHEME)
  useEffect(() => {
    const fetchAmounts = async () => {
      // Only fetch amounts for BMG AMOUNT SCHEME (SchemeId: 1)
      if (formData.selectedSchemeId === 1) {
        setLoading(true);
        try {
          const response = await fetch(
            `${API_BASE_URL_OLD}/member/schemeid?schemeId=${formData.selectedSchemeId}`
          );
          
          if (!response.ok) {
            throw new Error("Failed to fetch amounts");
          }

          const data = await response.json();
          
          // Format the amounts data according to the API response structure
          const formattedAmounts = data.map((item) => ({
            value: item.AMOUNT,
            groupCode: item.GROUPCODE,
            currentRegNo: item.CURRENTREGNO,
          }));

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
      } else {
        setAmounts([]);
      }
    };

    fetchAmounts();
  }, [formData.selectedSchemeId, API_BASE_URL_OLD]);

  // Fetch silver rate for BMG DIGI SILVER
  const fetchSilverRate = async () => {
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
  };

  useEffect(() => {
    // Fetch silver rate for BMG DIGI SILVER (SchemeId: 2)
    if (formData.selectedSchemeId === 2 && goldRate === null && !loadingGoldRate && !goldRateError) {
      fetchSilverRate();
    }
  }, [formData.selectedSchemeId, goldRate, loadingGoldRate, goldRateError]);

  const convertAmountToWeight = useCallback(
    (amountValue) => {
      if (
        goldRate &&
        amountValue &&
        !isNaN(amountValue) &&
        parseFloat(amountValue) > 0
      ) {
        const weightInGrams = (parseFloat(amountValue) / goldRate).toFixed(3);
        setFormData(prev => ({ ...prev, calculatedWeight: weightInGrams }));
      } else {
        setFormData(prev => ({ ...prev, calculatedWeight: "" }));
      }
    },
    [goldRate]
  );

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleDigiSilverAmountChange = (text) => {
    const sanitizedText = text.replace(/[^0-9.]/g, "");

    const parts = sanitizedText.split(".");
    if (parts.length > 2 || (parts[1] && parts[1].length > 2)) {
      return;
    }

    updateFormData('amount', sanitizedText);
    convertAmountToWeight(sanitizedText);
  };

  const validateStep = () => {
    const errors = {};
    
    if (!formData.selectedSchemeId) {
      errors.scheme = "Please select a scheme";
    }

    // BMG DIGI SILVER validation
    if (formData.selectedSchemeId === 2) {
      if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        errors.amount = "Please enter a valid amount greater than 0";
      } else if (parseFloat(formData.amount) < 1) {
        errors.amount = "Minimum payment amount is ₹1";
      }
      if (!goldRate) {
        errors.goldRate = "Current silver rate is not available. Please retry fetching.";
      }
      if (!formData.calculatedWeight || parseFloat(formData.calculatedWeight) <= 0) {
        errors.calculatedWeight = "Calculated silver weight is invalid.";
      }
    } 
    // BMG AMOUNT SCHEME validation
    else if (formData.selectedSchemeId === 1) {
      if (!formData.amount) {
        errors.amount = "Please select an amount";
      }
    }

    if (!formData.accCode) {
      errors.accCode = "Please select a payment mode";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onSubmit(formData);
    } else {
      Alert.alert(
        "Validation Error",
        "Please fill all required fields correctly in Scheme Details."
      );
    }
  };

  const isDigiSilver = formData.selectedSchemeId === 2;
  const isAmountScheme = formData.selectedSchemeId === 1;
  
  const selectedScheme = schemes?.find((s) => s.SchemeId === formData.selectedSchemeId);
  const schemeName = selectedScheme ? selectedScheme.schemeName : 'No Scheme Selected';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 80 })}
      style={styles.container}
    >
      <ImageBackground 
        source={require("../../assets/bg6.jpg")} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: keyboardHeight + 50 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <CommonHeader title={"Scheme Details"} />
          <View style={[styles.card]}>

            {/* Scheme Selection */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Scheme Selection <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <CustomPicker
                selectedValue={formData.selectedSchemeId}
                onValueChange={(itemValue) => {
                  updateFormData('selectedSchemeId', itemValue);
                  // Reset amount when scheme changes
                  updateFormData('amount', '');
                  updateFormData('calculatedWeight', '');
                }}
                items={[
                  { label: 'Select a Scheme', value: null },
                  ...(schemes?.map((scheme) => ({
                    label: scheme.schemeName,
                    value: scheme.SchemeId
                  })) || [])
                ]}
                placeholder="Select Scheme"
                enabled={!isSubmitting}
              />
              {validationErrors.scheme && (
                <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.scheme}</Text>
              )}
            </View>

            {/* BMG DIGI SILVER - Manual Amount Input */}
            {isDigiSilver && (
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
                    onChangeText={handleDigiSilverAmountChange}
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
            )}

            {/* BMG AMOUNT SCHEME - Predefined Amounts */}
            {isAmountScheme && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, FONTS.h6]}>
                    Amount <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
                  </Text>
                  {loading ? (
                    <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SIZES.margin }} />
                  ) : amounts.length > 0 ? (
                    <CustomPicker
                      selectedValue={formData.amount}
                      onValueChange={(itemValue) => {
                        const selectedAmount = amounts.find((amt) => amt.value === itemValue);
                        updateFormData('amount', itemValue);
                        if (selectedAmount) {
                          updateFormData('selectedGroupCodeObj', selectedAmount.groupCode);
                          updateFormData('selectedCurrentRegNoObj', selectedAmount.currentRegNo);
                        }
                      }}
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
                    <Text style={[styles.noDataText, FONTS.fontXs]}>
                      No amounts available for this scheme.
                    </Text>
                  )}
                  {validationErrors.amount && (
                    <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.amount}</Text>
                  )}
                </View>
              </>
            )}

            {/* Payment Mode (Common for both schemes) */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Payment Mode <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <CustomPicker
                selectedValue={formData.accCode}
                onValueChange={(itemValue) => {
                  updateFormData('accCode', itemValue);
                  const selectedType = transactionTypes.find((type) => type.ACCOUNT === itemValue);
                  if (selectedType?.CARDTYPE) {
                    updateFormData('modePay', selectedType.CARDTYPE);
                  }
                }}
                items={[
                  { label: 'Select Payment Mode', value: '' },
                  ...transactionTypes.map((type) => ({ label: type.NAME, value: type.ACCOUNT }))
                ]}
                placeholder="Select Payment Mode"
                enabled={!isSubmitting}
              />
              {validationErrors.accCode && (
                <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.accCode}</Text>
              )}
            </View>

            {/* Buttons */}
            <View style={[styles.buttonRow, { gap: SIZES.margin }]}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  isSubmitting && styles.buttonDisabled,
                  { backgroundColor: COLORS.primary }
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                {isSubmitting ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color={COLORS.white} />
                    <Text style={[styles.buttonText, styles.loadingText, FONTS.h6, { color: COLORS.white }]}>
                      Submitting...
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.buttonText, FONTS.h6, { color: COLORS.white }]}>Submit</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.backButton,
                  isSubmitting && styles.buttonDisabled,
                  { backgroundColor: COLORS.secondary, borderColor: COLORS.outline }
                ]}
                onPress={onBack}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, FONTS.h6, { color: COLORS.white }]}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.card1,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

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
  hintText: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    marginTop: 8,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.margin,
    gap: SIZES.margin,
    marginBottom: SIZES.margin * 2,
  },
  button: {
    flex: 1,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    height: 46,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  backButton: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1.5,
    borderColor: COLORS.outline,
  },
  buttonText: {
    ...FONTS.h6,
    color: COLORS.white,
  },
  buttonDisabled: {
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: SIZES.margin,
  },
});

export default SchemeDetailsPage;