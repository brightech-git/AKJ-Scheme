import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import appTheme from "../../utils/Theme";
import MemberDetailsPage from "./MemberDetailsPage";
import SchemeDetailsPage from "./SchemeDetailsPage";
import { API_BASE_URL_OLD } from "../../Config/API";

const { COLORS } = appTheme;

// Schemes array - Only BMG AMOUNT SCHEME and BMG DIGI SILVER
const schemes = [
  { SchemeId: 1, schemeName: "BMG AMOUNT SCHEME", SchemeSName: "BAS" },
  { SchemeId: 2, schemeName: "BMG DIGI SILVER", SchemeSName: "BDS" },
];

const AddNewMember = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigation = useNavigation();
  const route = useRoute();
  const { schemeId } = route.params || {};

  const [memberData, setMemberData] = useState({
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
  });

  const [schemeData, setSchemeData] = useState({
    selectedSchemeId: null,
    selectedGroupCodeObj: null,
    selectedCurrentRegNoObj: null,
    amount: "",
    accCode: "",
    modePay: "C",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (schemeId) {
      setSchemeData(prev => ({ ...prev, selectedSchemeId: schemeId }));
    }
  }, [schemeId]);

  const handleBack = () => {
    navigation.navigate("MainLanding");
  };

  const getDefaultInitial = (firstName) => {
    if (!firstName || firstName.trim().length === 0) return "";
    return firstName.trim().charAt(0).toUpperCase();
  };

  const handleNextStep = (memberFormData) => {
    setMemberData(memberFormData);
    setCurrentStep(2);
  };

  // Check if member already exists
  const checkDuplicateMember = async () => {
    try {
      const query = `mobile=${memberData.mobile}&aadhaar=${memberData.aadharNumber}&pan=${memberData.panNumber}`;
      const response = await fetch(`${API_BASE_URL_OLD}/member/check?${query}`);
      if (!response.ok) return false;

      const data = await response.json();
      if (data.exists) {
        Alert.alert("Duplicate Member", data.message || "Member already exists.");
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error checking duplicate member:", error);
      return false; // Allow submit if check fails
    }
  };

  // Generate random registration number
  const generateRandomRegNo = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (schemeFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSchemeData(schemeFormData);

    // Basic validation
    if (!memberData.mobile || !memberData.aadharNumber || !memberData.panNumber) {
      Alert.alert("Error", "Mobile, Aadhaar, and PAN are required.");
      setIsSubmitting(false);
      return;
    }

    // Check for duplicate
    const isDuplicate = await checkDuplicateMember();
    if (isDuplicate) {
      setIsSubmitting(false);
      return;
    }

    console.log("---- SUBMIT STARTED ----");

    const newMember = {
      title: memberData.namePrefix,
      initial: getDefaultInitial(memberData.name),
      pName: memberData.name,
      sName: memberData.surname,
      doorNo: memberData.doorNo,
      address1: memberData.address1,
      address2: memberData.address2,
      area: memberData.area,
      city: memberData.city,
      state: memberData.selectedState,
      country: memberData.country,
      pinCode: memberData.pincode,
      mobile: memberData.mobile,
      idProof: "Aadhaar",
      idProofNo: memberData.aadharNumber,
      panNumber: memberData.panNumber,
      dob: memberData.dob ? memberData.dob.toISOString().split("T")[0] : "",
      email: memberData.email,
      upDateTime: new Date().toISOString().slice(0, 19).replace("T", " "),
      userId: "999",
      appVer: "19.12.10.1",
    };

    const selectedScheme = schemes.find(s => s.SchemeId === schemeFormData.selectedSchemeId);
    
    if (!selectedScheme) {
      Alert.alert("Error", "Please select a valid scheme.");
      setIsSubmitting(false);
      return;
    }

    // Common createSchemeSummary for both schemes
    const createSchemeSummary = {
      schemeId: schemeFormData.selectedSchemeId,
      groupCode: selectedScheme.SchemeSName,
      regNo: generateRandomRegNo(),
      joinDate: new Date().toISOString().slice(0, 19).replace("T", " "),
      upDateTime2: new Date().toISOString().slice(0, 19).replace("T", " "),
      openingDate: new Date().toISOString().slice(0, 19).replace("T", " "),
      userId2: "9999",
      amount: parseFloat(schemeFormData.amount || "0"),
    };

    // Scheme collect insert data
    const schemeCollectInsert = {
      amount: parseFloat(schemeFormData.amount || "0"),
      modePay: schemeFormData.modePay,
      accCode: schemeFormData.accCode,
    };

    const requestBody = {
      newMember,
      createSchemeSummary,
      schemeCollectInsert,
    };

    console.log("Final Request Body:", JSON.stringify(requestBody, null, 2));
    console.log("Selected Scheme:", selectedScheme.schemeName);

    try {
      const response = await fetch(`${API_BASE_URL_OLD}/member/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.log("Error parsing response JSON:", e);
        }
        throw new Error(
          "Error creating member: " + (errorData.message || response.statusText)
        );
      }

      const responseData = await response.text();
      console.log("Success Response Data:", responseData);

      Alert.alert(
        "Success", 
        `Member added successfully to ${selectedScheme.schemeName}!`, 
        [
          { 
            text: "OK", 
            onPress: () => navigation.navigate("MainLanding") 
          },
        ]
      );

      resetFormFields();
    } catch (error) {
      console.error("Error during member creation:", error);
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      console.log("---- SUBMIT ENDED ----");
      setIsSubmitting(false);
    }
  };

  const resetFormFields = () => {
    setMemberData({
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
    });

    setSchemeData({
      selectedSchemeId: null,
      selectedGroupCodeObj: null,
      selectedCurrentRegNoObj: null,
      amount: "",
      accCode: "",
      modePay: "C",
    });

    setValidationErrors({});
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <MemberDetailsPage
            memberData={memberData}
            onNext={handleNextStep}
            onBack={handleBack}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
          />
        );
      case 2:
        return (
          <SchemeDetailsPage
            schemeData={schemeData}
            onSubmit={handleSubmit}
            onBack={() => setCurrentStep(1)}
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            isSubmitting={isSubmitting}
            API_BASE_URL={API_BASE_URL_OLD}
            schemes={schemes} // Pass schemes to SchemeDetailsPage
          />
        );
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderStep()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default AddNewMember;