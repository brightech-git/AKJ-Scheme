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
  StyleSheet
} from "react-native";
import appTheme from "../../utils/Theme";
import { BackHeader } from "../../components";
import CustomPicker from "./CustomPicker";
import CommonHeader from "../../components/CommonHeader/CommonHeader";

const { COLORS, SIZES, FONTS } = appTheme;

const SchemeDetailsPage = ({
  schemeData,
  onSubmit,
  onBack,
  validationErrors,
  setValidationErrors,
  isSubmitting,
  API_BASE_URL,
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

  const [schemes, setSchemes] = useState([]);
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
    const fetchSchemes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/api/member/scheme`);
        const data = await response.json();
        const formattedSchemes = data.map((s) => ({
          id: s.SchemeId,
          name: s.schemeName,
          description: s.SchemeSName,
        }));
        setSchemes(formattedSchemes);
      } catch (error) {
        console.error("Error fetching schemes:", error);
      }
    };

    fetchSchemes();
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchTransactionTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/api/account/getTranType`);
        if (!response.ok) throw new Error("Network response was not ok.");
        const data = await response.json();
        setTransactionTypes(data);
      } catch (error) {
        console.error("Error fetching transaction types:", error);
      }
    };
    fetchTransactionTypes();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (schemes.length > 0 && formData.selectedSchemeId === null) {
      setFormData(prev => ({ ...prev, selectedSchemeId: schemes[0].id }));
    }
  }, [schemes, formData.selectedSchemeId]);

  // Fetch amounts when scheme changes
  useEffect(() => {
    const fetchAmounts = async () => {
      if (formData.selectedSchemeId && formData.selectedSchemeId !== 7) {
        setLoading(true);
        try {
          const response = await fetch(
            `${API_BASE_URL}/v1/api/member/schemeid?schemeId=${formData.selectedSchemeId}`
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
  }, [formData.selectedSchemeId, API_BASE_URL]);

  const fetchGoldRate = async () => {
    setLoadingGoldRate(true);
    setGoldRateError(false);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}/v1/api/account/todayrate`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch gold rate`);
      }

      const data = await response.json();

      if (!data.Rate || isNaN(data.Rate)) {
        throw new Error("Invalid gold rate received from server");
      }

      setGoldRate(data.Rate);
    } catch (error) {
      console.error("Error fetching gold rate:", error);
      setGoldRateError(true);
      setGoldRate(null);

      if (error.name !== "AbortError") {
        Alert.alert(
          "Error",
          "Failed to fetch current gold rate. Please check your internet connection and try again.",
          [
            { text: "Retry", onPress: fetchGoldRate },
            { text: "Cancel", style: "cancel" },
          ]
        );
      }
    } finally {
      setLoadingGoldRate(false);
    }
  };

  useEffect(() => {
    if (
      formData.selectedSchemeId === 7 &&
      goldRate === null &&
      !loadingGoldRate &&
      !goldRateError
    ) {
      fetchGoldRate();
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

  const handleDigiGoldAmountChange = (text) => {
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
    if (!formData.selectedSchemeId) errors.scheme = "Please select a scheme";

    if (formData.selectedSchemeId === 7) {
      if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        errors.amount = "Please enter a valid amount greater than 0";
      } else if (parseFloat(formData.amount) < 1) {
        errors.amount = "Minimum payment amount is ₹1";
      }
      if (!goldRate) {
        errors.goldRate = "Current gold rate is not available. Please retry fetching.";
      }
      if (!formData.calculatedWeight || parseFloat(formData.calculatedWeight) <= 0) {
        errors.calculatedWeight = "Calculated gold weight is invalid.";
      }
    } else {
      if (!formData.amount) errors.amount = "Please select an amount";
    }

    if (!formData.accCode) errors.accCode = "Please select a payment mode";
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

  const isDigiGold = formData.selectedSchemeId === 7;
  const selectedScheme = schemes.find((s) => s.id === formData.selectedSchemeId);
  const schemeName = selectedScheme ? selectedScheme.name : 'No Scheme Selected';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 80 })}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: keyboardHeight - 250 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, { backgroundColor: COLORS.card }]}>

          <CommonHeader title="Scheme Details" />

          <View style={styles.inputContainer}>
            <Text style={[styles.label, FONTS.h6]}>
              Scheme Selection <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
            </Text>
            <View style={[styles.schemeDisplay, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}>
              <Text style={[styles.schemeText, FONTS.font]}>{schemeName}</Text>
            </View>
            {validationErrors.scheme && (
              <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.scheme}</Text>
            )}
          </View>

          {isDigiGold ? (
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
                  onChangeText={handleDigiGoldAmountChange}
                  placeholder="Enter amount for DigiGold"
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
                <Text style={[styles.label, FONTS.h6]}>Current Gold Rate</Text>
                {loadingGoldRate ? (
                  <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SIZES.margin }} />
                ) : goldRateError ? (
                  <TouchableOpacity
                    style={[
                      styles.retryButton,
                      { backgroundColor: COLORS.primaryLight, borderColor: COLORS.danger }
                    ]}
                    onPress={fetchGoldRate}
                    disabled={isSubmitting}
                  >
                    <Text style={[styles.retryText, FONTS.fontSm, { color: COLORS.danger }]}>
                      Failed to load rate. Tap to retry
                    </Text>
                  </TouchableOpacity>
                ) : goldRate ? (
                  <Text
                    style={[
                      styles.staticValueText,
                      FONTS.font,
                      { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }
                    ]}
                  >
                    {`₹${goldRate} / gm (22K)`}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.staticValueText,
                      FONTS.font,
                      { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }
                    ]}
                  >
                    N/A
                  </Text>
                )}
                {validationErrors.goldRate && (
                  <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.goldRate}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, FONTS.h6]}>Calculated Gold Weight (grams)</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.disabledInput,
                    validationErrors.calculatedWeight && styles.inputError,
                    { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }
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
                    You will purchase {formData.calculatedWeight}g of 22K gold.
                  </Text>
                )}
              </View>
            </>
          ) : (
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

          <View style={[styles.buttonRow, { gap: SIZES.margin }]}>
            <TouchableOpacity
              style={[
                styles.button,
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
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
    color: COLORS.white,
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
  schemeDisplay: {
    height: 56,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  schemeText: {
    ...FONTS.font,
    color: COLORS.text,
  },
  disabledInput: {
    backgroundColor: COLORS.darkInput,
    color: COLORS.white,
    opacity: 0.8,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
  },
  staticValueText: {
    height: 56,
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    ...FONTS.font,
    color: COLORS.text,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 18,
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
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
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