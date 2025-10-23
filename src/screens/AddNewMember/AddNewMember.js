import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Alert, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Modal
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from 'react-native-webview';
import appTheme from "../../utils/Theme";
import MemberDetailsPage from "./MemberDetailsPage";
import SchemeDetailsPage from "./SchemeDetailsPage";
import Icon from 'react-native-vector-icons/MaterialIcons';

const { COLORS, SIZES } = appTheme;

const AddNewMember = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigation = useNavigation();
  const route = useRoute();
  const { schemeId } = route.params || {};

  // Member Details State
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

  // Scheme Details State
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
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(''); // 'processing', 'success', 'failed'
  const [schemeJoinResponse, setSchemeJoinResponse] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isJoiningScheme, setIsJoiningScheme] = useState(false);
  const [schemeOptions, setSchemeOptions] = useState([]);
  const [isLoadingSchemeData, setIsLoadingSchemeData] = useState(false);

  const webViewRef = useRef(null);
  const verifyIntervalRef = useRef(null);
  const API_BASE_URL = "https://akj.brightechsoftware.com";

  useEffect(() => {
    if (schemeId) {
      setSchemeData(prev => ({ ...prev, selectedSchemeId: schemeId }));
      fetchSchemeData(schemeId);
    }
  }, [schemeId]);

  // Fetch scheme data based on schemeId
  const fetchSchemeData = async (schemeId) => {
    setIsLoadingSchemeData(true);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/member/schemeid?schemeId=${schemeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Fetched scheme data for ID ${schemeId}:`, data);
      
      setSchemeOptions(data);
      
      // Auto-select first option if available
      if (data && data.length > 0) {
        const firstOption = data[0];
        setSchemeData(prev => ({
          ...prev,
          selectedGroupCodeObj: firstOption.GROUPCODE,
          selectedCurrentRegNoObj: firstOption.REGNO || firstOption.CURRENTREGNO,
          amount: firstOption.AMOUNT ? firstOption.AMOUNT.toString() : ""
        }));
      }
      
    } catch (error) {
      console.error("Error fetching scheme data:", error);
      Alert.alert("Error", "Failed to load scheme details. Please try again.");
    } finally {
      setIsLoadingSchemeData(false);
    }
  };

  // Handle back button for payment webview
  useEffect(() => {
    if (showPaymentWebView) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        Alert.alert(
          'Cancel Payment',
          'Are you sure you want to cancel the payment?',
          [
            { text: 'No', style: 'cancel' },
            { 
              text: 'Yes', 
              onPress: () => {
                setShowPaymentWebView(false);
                setIsSubmitting(false);
              }
            },
          ]
        );
        return true;
      });

      return () => backHandler.remove();
    }
  }, [showPaymentWebView]);

  const handleBack = () => {
    if (showPaymentWebView) {
      setShowPaymentWebView(false);
      setIsSubmitting(false);
    } else if (showSuccessModal) {
      resetFormFields();
      navigation.navigate("MainLanding");
    } else {
      navigation.navigate("MainLanding");
    }
  };

  const getDefaultInitial = (firstName) => {
    if (!firstName || firstName.trim().length === 0) return "";
    return firstName.trim().charAt(0).toUpperCase();
  };

  const handleNextStep = (memberFormData) => {
    setMemberData(memberFormData);
    setCurrentStep(2);
  };

  const initiatePaymentFlow = async (schemeFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSchemeData(schemeFormData);

    console.log("---- PAYMENT FLOW INITIATED ----");
    console.log("Scheme Form Data:", schemeFormData);

    // Validate payment amount
    const paymentAmount = parseFloat(schemeFormData.amount);
    if (!paymentAmount || paymentAmount <= 0) {
      Alert.alert("Error", "Please enter a valid payment amount.");
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    if (!schemeFormData.selectedGroupCodeObj || !schemeFormData.selectedCurrentRegNoObj) {
      Alert.alert("Error", "Please select a valid scheme option.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create payment link
      const paymentResponse = await fetch(`${API_BASE_URL}/api/payment/create-payment-link`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          amount: paymentAmount,
          customer: {
            name: `${memberData.namePrefix} ${memberData.name} ${memberData.surname}`.trim(),
            contact: memberData.mobile,
            email: memberData.email,
            REGNO: schemeFormData.selectedCurrentRegNoObj,
            GROUPCODE: schemeFormData.selectedGroupCodeObj,
          }
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to create payment link");
      }

      const paymentData = await paymentResponse.json();
      
      if (!paymentData.payment_link || !paymentData.order_id) {
        throw new Error("Invalid payment response");
      }

      console.log("Payment link created:", paymentData);
      setPaymentData(paymentData);
      setShowPaymentWebView(true);
      setPaymentStatus('processing');

    } catch (error) {
      console.error("Error initiating payment:", error);
      Alert.alert("Error", "Failed to initiate payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Start payment verification polling
  const startPaymentVerification = (orderId) => {
    clearPaymentPolling();

    verifyIntervalRef.current = setInterval(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const verifyResponse = await fetch(
          `${API_BASE_URL}/api/payment/verify?orderId=${orderId}`,
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        clearTimeout(timeoutId);

        if (!verifyResponse.ok) {
          console.log('Verification response not OK:', {
            status: verifyResponse.status,
            statusText: verifyResponse.statusText
          });
          return;
        }

        const verifyData = await verifyResponse.json();
        
        console.log('=== PAYMENT VERIFICATION RESPONSE ===');
        console.log('Full Response Data:', JSON.stringify(verifyData, null, 2));
        console.log('Razorpay Status:', verifyData.razorpay_status);
        console.log('Payment Success:', verifyData.success);
        
        // Check if payment is successful
        if (verifyData.razorpay_status === 'paid' && verifyData.success) {
          handlePaymentSuccess(verifyData);
        } else if (verifyData.razorpay_status === 'failed' || verifyData.razorpay_status === 'cancelled') {
          handlePaymentFailure('Payment failed or was cancelled');
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    }, 5000); // Check every 5 seconds

    // Timeout after 5 minutes
    setTimeout(() => {
      clearPaymentPolling();
      if (paymentStatus === 'processing') {
        handlePaymentFailure('Payment verification timeout');
      }
    }, 300000);
  };

  const clearPaymentPolling = () => {
    if (verifyIntervalRef.current) {
      clearInterval(verifyIntervalRef.current);
      verifyIntervalRef.current = null;
    }
  };

  const handlePaymentSuccess = async (paymentResult) => {
    console.log("🎉 PAYMENT SUCCESSFUL");
    setPaymentStatus('success');
    clearPaymentPolling();
    setShowPaymentWebView(false);
    
    // Now submit member data and join scheme
    await submitMemberDataAndJoinScheme(paymentResult);
  };

  const handlePaymentFailure = (errorMessage) => {
    console.error("❌ PAYMENT FAILED:", errorMessage);
    setPaymentStatus('failed');
    clearPaymentPolling();
    setShowPaymentWebView(false);
    Alert.alert("Payment Failed", errorMessage || "Payment was not successful. Please try again.");
    setIsSubmitting(false);
  };

  // Handle WebView navigation for return URLs - UPDATED
  const handleWebViewNavigationStateChange = (navState) => {
    const url = navState.url.toLowerCase();
    
    console.log('WebView Navigation Change:', {
      url: url,
      loading: navState.loading,
      title: navState.title
    });
    
    // Check for redirect URL patterns and CLOSE WebView immediately
    if (url.includes('akjminigoldsouk.com/payment-success') || 
        url.includes('akjminigoldsouk.com/payment-failed') ||
        url.includes('success') || 
        url.includes('failure') ||
        url.includes('completed') ||
        url.includes('cancelled')) {
      
      console.log('✅ Redirect URL detected, closing WebView and processing...');
      
      // Extract payment parameters from URL
      const urlParams = new URLSearchParams(navState.url.split('?')[1]);
      const paymentId = urlParams.get('razorpay_payment_id');
      const paymentStatus = urlParams.get('razorpay_payment_link_status');
      
      console.log('Extracted params:', {
        paymentId,
        paymentStatus,
        fullUrl: navState.url
      });
      
      // Close WebView immediately
      setShowPaymentWebView(false);
      
      // If it's a success URL, process the payment
      if (url.includes('payment-success') || url.includes('success') || paymentStatus === 'paid') {
        console.log('Processing successful payment...');
        const paymentResult = {
          razorpay_payment_id: paymentId,
          razorpay_status: 'paid',
          success: true
        };
        handlePaymentSuccess(paymentResult);
      } else {
        // Handle failure case
        console.log('Payment failed or cancelled');
        handlePaymentFailure('Payment was not completed successfully');
      }
      
      // Prevent WebView from loading the external URL
      if (webViewRef.current) {
        webViewRef.current.stopLoading();
      }
    }
  };

  const submitMemberDataAndJoinScheme = async (paymentResult) => {
    console.log("---- SUBMITTING MEMBER DATA AND JOINING SCHEME ----");
    setIsJoiningScheme(true);

    try {
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

      let createSchemeSummary;
      if (schemeData.selectedSchemeId === 7) {
        createSchemeSummary = {
           schemeId: schemeData.selectedSchemeId,
          groupCode: schemeData.selectedGroupCodeObj,
          regNo: schemeData.selectedCurrentRegNoObj,
          joinDate: new Date().toISOString().slice(0, 19).replace("T", " "),
          upDateTime2: new Date().toISOString().slice(0, 19).replace("T", " "),
          openingDate: new Date().toISOString().slice(0, 19).replace("T", " "),
          userId2: "9999",
          goldWeight: parseFloat(schemeData.calculatedWeight),
        };
      } else {
        createSchemeSummary = {
          schemeId: schemeData.selectedSchemeId,
          groupCode: schemeData.selectedGroupCodeObj,
          regNo: schemeData.selectedCurrentRegNoObj,
          joinDate: new Date().toISOString().slice(0, 19).replace("T", " "),
          upDateTime2: new Date().toISOString().slice(0, 19).replace("T", " "),
          openingDate: new Date().toISOString().slice(0, 19).replace("T", " "),
          userId2: "9999",
        };
      }

      const schemeCollectInsert = {
        amount: parseFloat(schemeData.amount),
        modePay: schemeData.modePay,
        accCode: schemeData.accCode,
      };

      const requestBody = {
        newMember,
        createSchemeSummary,
        schemeCollectInsert,
      };

      console.log("Final Request Body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${API_BASE_URL}/v1/api/member/create`, {
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
      setSchemeJoinResponse(responseData);

      // Show success modal after scheme is joined
      setShowSuccessModal(true);

    } catch (error) {
      console.error("Error during member creation:", error);
      Alert.alert(
        "Member Creation Error", 
        "Payment was successful but member creation failed. Please contact support with payment reference: " + 
        (paymentResult?.razorpay_payment_id || "N/A"),
        [
          { 
            text: "OK", 
            onPress: () => {
              resetFormFields();
            }
          }
        ]
      );
    } finally {
      setIsSubmitting(false);
      setIsJoiningScheme(false);
    }
  };

  const handleSubmit = async (schemeFormData) => {
    await initiatePaymentFlow(schemeFormData);
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
    setPaymentStatus('');
    setPaymentData(null);
    setSchemeJoinResponse(null);
    setShowPaymentWebView(false);
    setShowSuccessModal(false);
    setIsJoiningScheme(false);
    setSchemeOptions([]);
  };

  // Render Payment WebView
  const renderPaymentWebView = () => {
    if (!paymentData) return null;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              Alert.alert(
                'Cancel Payment',
                'Are you sure you want to cancel the payment?',
                [
                  { text: 'No', style: 'cancel' },
                  { 
                    text: 'Yes', 
                    onPress: () => {
                      setShowPaymentWebView(false);
                      setIsSubmitting(false);
                    }
                  },
                ]
              );
            }}
          >
            <Icon name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complete Payment</Text>
          <View style={styles.closeButton} />
        </View>
        
        <WebView
          ref={webViewRef}
          source={{ uri: paymentData.payment_link }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          onLoadEnd={() => {
            // Start verification when webview loads as backup
            startPaymentVerification(paymentData.order_id);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
            Alert.alert('Error', 'Failed to load payment page. Please check your internet connection.');
          }}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading payment page...</Text>
            </View>
          )}
        />
      </SafeAreaView>
    );
  };

  // Render Success Modal
  const renderSuccessModal = () => {
    return (
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          resetFormFields();
          navigation.navigate("MainLanding");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Icon name="check-circle" size={60} color={COLORS.success} />
            </View>
            
            <Text style={styles.modalTitle}>Success!</Text>
            
            <Text style={styles.modalMessage}>
              Member has been added and scheme joined successfully!
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                resetFormFields();
                navigation.navigate("MainLanding");
              }}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Main render function
  if (showPaymentWebView) {
    return renderPaymentWebView();
  }

  return (
    <View style={styles.container}>
      {currentStep === 1 ? (
        <MemberDetailsPage
          memberData={memberData}
          onNext={handleNextStep}
          onBack={handleBack}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
        />
      ) : (
        <SchemeDetailsPage
          schemeData={schemeData}
          onSubmit={handleSubmit}
          onBack={() => setCurrentStep(1)}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          isSubmitting={isSubmitting || isJoiningScheme}
          API_BASE_URL={API_BASE_URL}
          schemeOptions={schemeOptions}
          isLoadingSchemeData={isLoadingSchemeData}
          onSchemeOptionSelect={(option) => {
            setSchemeData(prev => ({
              ...prev,
              selectedGroupCodeObj: option.GROUPCODE,
              selectedCurrentRegNoObj: option.REGNO || option.CURRENTREGNO,
              amount: option.AMOUNT ? option.AMOUNT.toString() : ""
            }));
          }}
        />
      )}
      
      {renderSuccessModal()}
      
      {isJoiningScheme && (
        <View style={styles.joiningOverlay}>
          <View style={styles.joiningContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.joiningText}>Joining Scheme...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: COLORS.textLight,
  },
  paymentStatus: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
  },
  paymentStatusText: {
    color: COLORS.white,
    marginLeft: 10,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalDetails: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  modalDetailText: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 6,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: COLORS.black,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    minWidth: 120,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  joiningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joiningContainer: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  joiningText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
});

export default AddNewMember;