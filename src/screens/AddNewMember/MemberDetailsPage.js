import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appTheme from "../../utils/Theme";
import { BackHeader } from "../../components";
import EnhancedDatePicker from "./EnhancedDatePicker";
import CustomPicker from "./CustomPicker";
import {
  validateAadhaar,
  validatePAN,
  validateMobile,
  validateEmail,
  validatePincode,
  validateAge,
} from "./Validations";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
const { COLORS, SIZES, FONTS } = appTheme;
import { MaterialIcons } from "@expo/vector-icons";

const MemberDetailsPage = ({
  memberData,
  onNext,
  onBack,
  validationErrors,
  setValidationErrors,
}) => {
  const scrollViewRef = useRef(null);
  const inputRefs = useRef({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [activeInput, setActiveInput] = useState(null);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    namePrefix: "Mr",
    name: "",
    surname: "",
    doorNo: "",
    address1: "",
    address2: "",
    area: "",
    city: "",
    pincode: "",
    selectedState: "",
    country: "India",
    mobile: "",
    email: "",
    panNumber: "",
    aadharNumber: "",
    dob: null,
    ...memberData,
  });

  // Load saved form data from AsyncStorage when component mounts
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("memberDetailsForm");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData((prev) => ({
            ...prev,
            ...parsedData,
            dob: parsedData.dob ? new Date(parsedData.dob) : null,
          }));
        }
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    };
    loadSavedData();
  }, []);

  // Save formData to AsyncStorage whenever it changes
  useEffect(() => {
    const saveFormData = async () => {
      try {
        await AsyncStorage.setItem("memberDetailsForm", JSON.stringify(formData));
      } catch (error) {
        console.error("Error saving form data:", error);
      }
    };
    saveFormData();
  }, [formData]);

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
  ];

  // Fixed keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
      
      // Scroll to active input when keyboard appears
      if (activeInput && inputRefs.current[activeInput]) {
        setTimeout(() => {
          const inputRef = inputRefs.current[activeInput];
          if (inputRef && scrollViewRef.current) {
            inputRef.measure((x, y, width, height, pageX, pageY) => {
              scrollViewRef.current.scrollTo({
                y: pageY - 100, // Offset to show input above keyboard
                animated: true,
              });
            });
          }
        }, 100);
      }
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
      setActiveInput(null);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [activeInput]);

  useEffect(() => {
    const fetchCitiesForPincode = async () => {
      if (formData.pincode && formData.pincode.length === 6) {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data[0]?.Status === "Success" && data[0]?.PostOffice) {
              const postOffices = data[0].PostOffice;
              const cityList = [...new Set(postOffices.map((po) => po.Name))];
              setCities(cityList);
              const stateName = postOffices[0].State;
              setFormData((prev) => ({ ...prev, selectedState: stateName }));
              if (formData.city && !cityList.includes(formData.city)) {
                setFormData((prev) => ({ ...prev, city: "" }));
              }
            } else {
              setCities([]);
              setFormData((prev) => ({ ...prev, city: "", selectedState: "" }));
              setValidationErrors((prev) => ({
                ...prev,
                pincode: "No cities found for this pincode.",
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
          setCities([]);
          setFormData((prev) => ({ ...prev, city: "", selectedState: "" }));
        }
      } else {
        setCities([]);
        setFormData((prev) => ({ ...prev, city: "", selectedState: "" }));
      }
    };
    fetchCitiesForPincode();
  }, [formData.pincode, setValidationErrors]);

  const validateStep = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "First Name is required";
    if (!formData.surname.trim()) errors.surname = "Surname is required";
    if (!formData.doorNo.trim()) errors.doorNo = "Door No is required";
    if (!formData.address1.trim()) errors.address1 = "Address 1 is required";
    if (!formData.area.trim()) errors.area = "Area is required";
    if (!formData.selectedState) errors.selectedState = "State is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.dob) errors.dob = "Date of Birth is required";

    const pincodeError = validatePincode(formData.pincode);
    if (pincodeError) {
      errors.pincode = pincodeError;
    } else if (formData.pincode && cities.length === 0) {
      errors.pincode = "Please enter a valid pincode (no cities found)";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    } else if (formData.pincode && cities.length > 0 && !cities.includes(formData.city)) {
      errors.city = "Please select a valid city for this pincode";
    }

    const mobileError = validateMobile(formData.mobile);
    if (mobileError) errors.mobile = mobileError;

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const panError = validatePAN(formData.panNumber);
    if (panError) errors.panNumber = panError;

    const aadhaarError = validateAadhaar(formData.aadharNumber);
    if (aadhaarError) errors.aadharNumber = aadhaarError;

    if (formData.country !== "India") errors.country = "Country should be India";

    const ageError = validateAge(formData.dob);
    if (ageError) errors.dob = ageError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext(formData);
    } else {
      Alert.alert("Validation Error", "Please fill all required fields correctly in Member Details.");
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMobileChange = (text) => {
    const cleanedText = text.replace(/\D/g, "");
    if (cleanedText.length <= 10) {
      updateFormData("mobile", cleanedText);
    }
  };

  const handleAadhaarChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    updateFormData("aadharNumber", numericValue);
  };

  const handlePANChange = (text) => {
    const upperText = text.toUpperCase();
    updateFormData("panNumber", upperText);
  };

  const handlePincodeChange = (text) => {
    const numericValue = text.replace(/\D/g, "");
    updateFormData("pincode", numericValue);
  };

  const renderCityInput = () => {
    if (cities.length > 0) {
      return (
        <View style={[styles.inputContainer, validationErrors.city && styles.inputError]}>
          <Text style={[styles.label, FONTS.h6]}>
            City <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
          </Text>
          <CustomPicker
            selectedValue={formData.city}
            onValueChange={(value) => updateFormData("city", value)}
            items={[{ label: "Select a City", value: "" }, ...cities.map((cityName) => ({ label: cityName, value: cityName }))]}
            placeholder="Select a City"
          />
          {validationErrors.city && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.city}</Text>}
        </View>
      );
    }

    return (
      <View style={[styles.inputContainer, validationErrors.city && styles.inputError]}>
        <Text style={[styles.label, FONTS.h6]}>
          City <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }, validationErrors.city && styles.inputError]}
          onChangeText={(text) => updateFormData("city", text)}
          value={formData.city}
          placeholder="Enter City"
          placeholderTextColor={COLORS.placeholder}
          editable={cities.length === 0}
          onFocus={() => setActiveInput("city")}
          ref={(ref) => (inputRefs.current["city"] = ref)}
        />
        {validationErrors.city && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.city}</Text>}
      </View>
    );
  };

  const clearSavedData = async () => {
    try {
      await AsyncStorage.removeItem("memberDetailsForm");
      setFormData({
        namePrefix: "Mr",
        name: "",
        surname: "",
        doorNo: "",
        address1: "",
        address2: "",
        area: "",
        city: "",
        pincode: "",
        selectedState: "",
        country: "India",
        mobile: "",
        email: "",
        panNumber: "",
        aadharNumber: "",
        dob: null,
        ...memberData,
      });
      Alert.alert("Success", "Saved form data has been cleared.");
    } catch (error) {
      console.error("Error clearing saved form data:", error);
      Alert.alert("Error", "Failed to clear saved form data.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 80 })}
      style={styles.container}
    >
      <ImageBackground source={require("../../assets/bg7.jpg")} style={styles.mainBackground} imageStyle={styles.backgroundImageStyle}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: keyboardHeight > 0 ? keyboardHeight - 250 : 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <CommonHeader
          title="Member Details"
          showBack
          backIconName="arrow-back"
          backIconColor={COLORS.white}
          backgroundColor="transparent"
          textColor={COLORS.text}
          transparent
          centerTitle
          rightComponent={
            <TouchableOpacity
              onPress={() => clearSavedData()}
              style={styles.actionButton}
            >
              <MaterialIcons name="delete" size={22} color={COLORS.white} />
            </TouchableOpacity>
          }
        />
          <View style={[styles.card]}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                First Name <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.name && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => updateFormData("name", text)}
                value={formData.name}
                placeholder="Enter First Name"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput("name")}
                ref={(ref) => (inputRefs.current["name"] = ref)}
              />
              {validationErrors.name && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Surname <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.surname && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => updateFormData("surname", text)}
                value={formData.surname}
                placeholder="Enter Surname"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput("surname")}
                ref={(ref) => (inputRefs.current["surname"] = ref)}
              />
              {validationErrors.surname && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.surname}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Door No <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.doorNo && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => updateFormData("doorNo", text)}
                value={formData.doorNo}
                placeholder="Enter Door No"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput("doorNo")}
                ref={(ref) => (inputRefs.current["doorNo"] = ref)}
              />
              {validationErrors.doorNo && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.doorNo}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Address 1 <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.address1 && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => updateFormData("address1", text)}
                value={formData.address1}
                placeholder="Enter Address 1"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput("address1")}
                ref={(ref) => (inputRefs.current["address1"] = ref)}
              />
              {validationErrors.address1 && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.address1}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>Address 2</Text>
              <TextInput
                style={[styles.input, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => updateFormData("address2", text)}
                value={formData.address2}
                placeholder="Enter Address 2"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput("address2")}
                ref={(ref) => (inputRefs.current["address2"] = ref)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Area <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.area && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => updateFormData("area", text)}
                value={formData.area}
                placeholder="Enter Area"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput("area")}
                ref={(ref) => (inputRefs.current["area"] = ref)}
              />
              {validationErrors.area && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.area}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Pincode <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.pincode && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={handlePincodeChange}
                value={formData.pincode}
                placeholder="Enter Pincode"
                keyboardType="numeric"
                maxLength={6}
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput("pincode")}
                ref={(ref) => (inputRefs.current["pincode"] = ref)}
              />
              {validationErrors.pincode && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.pincode}</Text>}
              {cities.length > 0 && <Text style={[styles.hintText, FONTS.fontXs]}>Available cities: {cities.join(", ")}</Text>}
            </View>

            {renderCityInput()}

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                State <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <CustomPicker
                selectedValue={formData.selectedState}
                onValueChange={(itemValue) => updateFormData("selectedState", itemValue)}
                items={[{ label: "Select a State", value: "" }, ...states.map((state) => ({ label: state, value: state }))]}
                placeholder="Select a State"
              />
              {validationErrors.selectedState && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.selectedState}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Country <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.country && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => updateFormData("country", text)}
                value={formData.country}
                placeholder="Enter Country"
                placeholderTextColor={COLORS.placeholder}
                editable={false}
                onFocus={() => setActiveInput("country")}
                ref={(ref) => (inputRefs.current["country"] = ref)}
              />
              {validationErrors.country && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.country}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Mobile Number <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <View
                style={[styles.mobileInputContainer, validationErrors.mobile && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
              >
                <Text style={[styles.countryCode, FONTS.h6, { color: COLORS.primary }]}>+91</Text>
                <TextInput
                  style={[styles.input, styles.mobileInput, { backgroundColor: COLORS.input }]}
                  onChangeText={handleMobileChange}
                  value={formData.mobile}
                  placeholder="Enter 10-digit Mobile Number"
                  keyboardType="numeric"
                  maxLength={10}
                  placeholderTextColor={COLORS.placeholder}
                  onFocus={() => setActiveInput("mobile")}
                  ref={(ref) => (inputRefs.current["mobile"] = ref)}
                />
              </View>
              {validationErrors.mobile && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.mobile}</Text>}
            </View>

            <EnhancedDatePicker
              selectedDate={formData.dob}
              onDateChange={(date) => updateFormData("dob", date)}
              placeholder="Select Date of Birth"
              minimumDate={new Date(1900, 0, 1)}
              maximumDate={new Date()}
              error={validationErrors.dob}
              label="Date of Birth"
              required={true}
            />

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Email <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.email && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={(text) => updateFormData("email", text)}
                value={formData.email}
                placeholder="Enter Email"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setActiveInput("email")}
                ref={(ref) => (inputRefs.current["email"] = ref)}
              />
              {validationErrors.email && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                PAN Number <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.panNumber && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={handlePANChange}
                value={formData.panNumber}
                placeholder="Enter PAN Number (e.g., ABCDE1234F)"
                maxLength={10}
                autoCapitalize="characters"
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput("panNumber")}
                ref={(ref) => (inputRefs.current["panNumber"] = ref)}
              />
              {validationErrors.panNumber && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.panNumber}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, FONTS.h6]}>
                Aadhaar Number <Text style={[styles.asterisk, { color: COLORS.danger }]}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, validationErrors.aadharNumber && styles.inputError, { backgroundColor: COLORS.input, borderColor: COLORS.borderColor }]}
                onChangeText={handleAadhaarChange}
                value={formData.aadharNumber}
                placeholder="Enter 12-digit Aadhaar Number"
                keyboardType="numeric"
                maxLength={12}
                placeholderTextColor={COLORS.placeholder}
                onFocus={() => setActiveInput("aadharNumber")}
                ref={(ref) => (inputRefs.current["aadharNumber"] = ref)}
              />
              {validationErrors.aadharNumber && <Text style={[styles.errorText, FONTS.fontSm]}>{validationErrors.aadharNumber}</Text>}
            </View>

            <View style={[styles.buttonRow, { gap: SIZES.margin }]}>
              <TouchableOpacity
                style={[styles.button, styles.backButton, { backgroundColor: COLORS.secondary, borderColor: COLORS.outline }]}
                onPress={onBack}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, FONTS.h6, { color: COLORS.white }]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.nextButton, { backgroundColor: COLORS.primary }]}
                onPress={handleNext}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, FONTS.h6, { color: COLORS.white }]}>Next</Text>
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
    // backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding,
  },
   actionButton: { 
    padding: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
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
    color: COLORS.goldtext,
    marginBottom: SIZES.margin / 2,
    letterSpacing: 0.3,
  },
  input: {
    height: 50,
    width: "95%",
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
  mobileInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    paddingHorizontal: SIZES.padding,
height: 50,
    width: "95%",
  },
  countryCode: {
    ...FONTS.h6,
    color: COLORS.primary,
    marginRight: SIZES.margin,
  },
  mobileInput: {
    flex: 1,
    borderWidth: 0,
    height: "100%",
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SIZES.margin,
    gap: SIZES.margin,
    marginBottom: SIZES.margin * 2,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    height: 46,
  },
  backButton: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1.5,
    borderColor: COLORS.outline,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
  },
  clearButton: {
    backgroundColor: COLORS.danger,
  },
  buttonText: {
    ...FONTS.h6,
    color: COLORS.white,
  },
  mainBackground: {
    flex: 1,
  },
  backgroundImageStyle: {
    // opacity: 0.1,
  },
});

export default MemberDetailsPage;