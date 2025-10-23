import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  BackHandler
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS } from '../../utils/Theme';
import { insertSchemeCollection } from '../../services/InstallmentUpdateService'; // Import your service

const API_BASE_URL = 'https://akj.brightechsoftware.com';
const POLLING_INTERVAL = 5000;
const POLLING_TIMEOUT = 300000;

function PaymentWebView() {
  const [loading, setLoading] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [redirectDetected, setRedirectDetected] = useState(false);
  const [insertingCollection, setInsertingCollection] = useState(false);
  
  const verifyIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const webViewRef = useRef(null);

  const navigation = useNavigation();
  const route = useRoute();

  const {
    paymentUrl,
    orderId,
    amount,
    weight,
    goldRate,
    phoneNumber,
    userName,
    productData,
    isDreamGoldPlan,
    orderDetails, // This should contain customer data
    schemeInfo, // This should contain schemaSummaryTransBalance
    personalInfo // This should contain personalId
  } = route.params;

  // Prepare payload for scheme collection using your exact field names
  const prepareSchemeCollectionPayload = (paymentData) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace("T", " ").split(".")[0];
    
    const payload = {
      groupCode: orderDetails?.customer?.groupCode || productData?.groupcode || "BMA",
      regNo: orderDetails?.customer?.regNo?.toString() || productData?.regno?.toString() || "41",
      rDate: formattedDate,
      amount: orderDetails?.amount?.toString() || amount?.toString() || "1000",
      modePay: orderDetails?.payType === "ONLINE" ? "C" : orderDetails?.payType || "C",
      accCode: "1",
      updateTime: formattedDate,
      installment: (parseInt(schemeInfo?.schemeSummary?.schemaSummaryTransBalance?.insPaid?.toString() || "0") + 1) || 1,
      userID: personalInfo?.personalId || "1",
      // Additional tracking fields
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentData?.razorpay_payment_id,
      paymentStatus: "SUCCESS"
    };
    
    console.log('📦 Scheme Collection Payload:', payload);
    return payload;
  };

  // Insert scheme collection after successful payment
  const insertSchemeCollectionRecord = async (paymentData) => {
    try {
      console.log('🔄 Inserting scheme collection record...');
      setInsertingCollection(true);
      
      const payload = prepareSchemeCollectionPayload(paymentData);
      
      const result = await insertSchemeCollection(payload);
      
      console.log('✅ Scheme collection inserted successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to insert scheme collection:', error);
      throw error;
    } finally {
      if (isMountedRef.current) {
        setInsertingCollection(false);
      }
    }
  };

  // Handle back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (paymentCompleted || redirectDetected) {
          return false;
        }
        
        Alert.alert(
          'Cancel Payment',
          'Are you sure you want to cancel the payment?',
          [
            { text: 'No', style: 'cancel' },
            { 
              text: 'Yes', 
              onPress: () => {
                clearPaymentPolling();
                navigation.goBack();
              }
            },
          ]
        );
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation, paymentCompleted, redirectDetected])
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearPaymentPolling();
    };
  }, []);

  // Clear payment polling intervals
  const clearPaymentPolling = () => {
    if (verifyIntervalRef.current) {
      clearInterval(verifyIntervalRef.current);
      verifyIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Navigate to success page after inserting scheme collection
  const navigateToSuccessPage = async (verifyData) => {
    try {
      console.log('🎉 PAYMENT SUCCESSFUL - INSERTING SCHEME COLLECTION');
      
      // Insert scheme collection record
      await insertSchemeCollectionRecord(verifyData);
      
      console.log('✅ NAVIGATING TO SUCCESS PAGE');
      
      if (isMountedRef.current) {
        setPaymentCompleted(true);
        clearPaymentPolling();
        
        // Navigate to Success Page with all data
        navigation.replace('PaymentSuccess', {
          orderId: orderId,
          amount: amount,
          weight: weight,
          goldRate: goldRate,
          razorpayPaymentId: verifyData.razorpay_payment_id,
          razorpayOrderId: verifyData.razorpay_order_id,
          razorpaySignature: verifyData.razorpay_signature,
          phoneNumber: phoneNumber,
          userName: userName,
          productData: productData,
          isDreamGoldPlan: isDreamGoldPlan,
          orderDetails: orderDetails,
          schemeInfo: schemeInfo,
          personalInfo: personalInfo,
          timestamp: new Date().toISOString(),
          paymentDetails: verifyData,
          schemeCollectionInserted: true
        });
      }
    } catch (error) {
      console.error('❌ Error in success flow:', error);
      
      if (isMountedRef.current) {
        // Even if scheme collection fails, navigate to success but show warning
        Alert.alert(
          'Payment Successful',
          'Payment was successful but there was an issue recording the transaction. Please contact support.',
          [
            { 
              text: 'OK', 
              onPress: () => {
                setPaymentCompleted(true);
                clearPaymentPolling();
                navigation.replace('PaymentSuccess', {
                  orderId: orderId,
                  amount: amount,
                  weight: weight,
                  goldRate: goldRate,
                  razorpayPaymentId: verifyData.razorpay_payment_id,
                  razorpayOrderId: verifyData.razorpay_order_id,
                  razorpaySignature: verifyData.razorpay_signature,
                  phoneNumber: phoneNumber,
                  userName: userName,
                  productData: productData,
                  isDreamGoldPlan: isDreamGoldPlan,
                  timestamp: new Date().toISOString(),
                  paymentDetails: verifyData,
                  schemeCollectionInserted: false,
                  schemeCollectionError: error.message
                });
              }
            }
          ]
        );
      }
    }
  };

  // Navigate to MainLanding when redirect URL is detected
  const navigateToMainLanding = async (url) => {
    try {
      console.log('🔄 REDIRECT URL DETECTED - INSERTING SCHEME COLLECTION');
      
      // Extract payment parameters from URL
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const paymentData = {
        razorpay_payment_id: urlParams.get('razorpay_payment_id'),
        razorpay_payment_link_id: urlParams.get('razorpay_payment_link_id'),
        razorpay_payment_link_reference_id: urlParams.get('razorpay_payment_link_reference_id'),
        razorpay_payment_link_status: urlParams.get('razorpay_payment_link_status'),
        razorpay_signature: urlParams.get('razorpay_signature'),
        razorpay_status: 'paid',
        success: true
      };
      
      console.log('📋 Extracted Payment Parameters:', paymentData);

      // Insert scheme collection record for redirect flow
      await insertSchemeCollectionRecord(paymentData);
      
      console.log('✅ NAVIGATING TO SUCCESS PAGE FROM REDIRECT');
      
      if (isMountedRef.current) {
        setRedirectDetected(true);
        clearPaymentPolling();
        
        // Navigate to PaymentSuccess with payment data
        navigation.replace('PaymentSuccess', {
          paymentRedirect: true,
          paymentData: {
            ...paymentData,
            orderId: orderId,
            amount: amount,
            weight: weight,
            goldRate: goldRate,
            phoneNumber: phoneNumber,
            userName: userName,
            productData: productData,
            isDreamGoldPlan: isDreamGoldPlan,
            orderDetails: orderDetails,
            schemeInfo: schemeInfo,
            personalInfo: personalInfo,
            timestamp: new Date().toISOString()
          },
          schemeCollectionInserted: true
        });
      }
    } catch (error) {
      console.error('❌ Error in redirect flow:', error);
      
      if (isMountedRef.current) {
        Alert.alert(
          'Payment Successful',
          'Payment was successful but there was an issue recording the transaction. Please contact support.',
          [
            { 
              text: 'OK', 
              onPress: () => {
                setRedirectDetected(true);
                clearPaymentPolling();
                navigation.replace('PaymentSuccess', {
                  paymentRedirect: true,
                  paymentData: {
                    razorpay_payment_id: urlParams.get('razorpay_payment_id'),
                    razorpay_payment_link_id: urlParams.get('razorpay_payment_link_id'),
                    razorpay_payment_link_reference_id: urlParams.get('razorpay_payment_link_reference_id'),
                    razorpay_payment_link_status: urlParams.get('razorpay_payment_link_status'),
                    razorpay_signature: urlParams.get('razorpay_signature'),
                    orderId: orderId,
                    amount: amount,
                    weight: weight,
                    goldRate: goldRate,
                    phoneNumber: phoneNumber,
                    userName: userName,
                    productData: productData,
                    isDreamGoldPlan: isDreamGoldPlan,
                    timestamp: new Date().toISOString()
                  },
                  schemeCollectionInserted: false,
                  schemeCollectionError: error.message
                });
              }
            }
          ]
        );
      }
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
        console.log('Order ID:', orderId);
        console.log('Razorpay Status:', verifyData.razorpay_status);
        console.log('Payment Success:', verifyData.success);
        
        // Check if payment is successful
        if (verifyData.razorpay_status === 'paid' && verifyData.success) {
          await navigateToSuccessPage(verifyData);
        } else if (verifyData.razorpay_status === 'failed' || verifyData.razorpay_status === 'cancelled') {
          clearPaymentPolling();
          
          if (isMountedRef.current) {
            console.log('❌ PAYMENT FAILED:', {
              orderId: orderId,
              status: verifyData.razorpay_status,
              error: verifyData.error
            });
            Alert.alert('Payment Failed', 'Your payment was not successful. Please try again.', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    }, POLLING_INTERVAL);

    timeoutRef.current = setTimeout(() => {
      clearPaymentPolling();
      if (isMountedRef.current && !paymentCompleted && !redirectDetected) {
        console.log('⏰ PAYMENT VERIFICATION TIMEOUT');
        Alert.alert(
          'Payment Timeout',
          'Payment verification timed out. Please check your payment status manually or contact support.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    }, POLLING_TIMEOUT);
  };

  // Handle WebView navigation changes
  const handleWebViewNavigationStateChange = (navState) => {
    const url = navState.url.toLowerCase();
    
    console.log('WebView Navigation Change:', {
      url: url,
      loading: navState.loading,
      title: navState.title
    });
    
    // If payment is already completed or redirect detected, don't process navigation changes
    if (paymentCompleted || redirectDetected) return;
    
    // Check for redirect URL pattern
    if (url.includes('akjminigoldsouk.com/payment-success')) {
      console.log('✅ REDIRECT URL DETECTED - payment-success');
      navigateToMainLanding(navState.url);
      return;
    }
    
    if (url.includes('success') || url.includes('payment-success') || url.includes('completed')) {
      console.log('✅ Success URL detected, waiting for verification...');
    } else if (url.includes('failure') || url.includes('payment-failed') || url.includes('cancelled')) {
      console.log('❌ Failure URL detected, stopping verification');
      clearPaymentPolling();
      Alert.alert('Payment Failed', 'Your payment was not successful. Please try again.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  // Handle WebView load end
  const handleWebViewLoadEnd = () => {
    setLoading(false);
    
    // Check current URL when loading finishes
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        (function() {
          try {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'current_url',
              url: window.location.href
            }));
          } catch(error) {
            // Ignore errors
          }
        })();
      `);
    }
  };

  // Handle WebView messages
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'current_url' && data.url) {
        const url = data.url.toLowerCase();
        
        // Check for redirect URL in the current page URL
        if (url.includes('akjminigoldsouk.com/payment-success') && !redirectDetected && !paymentCompleted) {
          console.log('🔍 Current URL check - Redirect URL detected:', url);
          navigateToMainLanding(data.url);
        }
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error);
    }
  };

  // Handle WebView errors
  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    Alert.alert('Error', 'Failed to load payment page. Please check your internet connection and try again.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  // Start verification when component mounts
  useEffect(() => {
    if (orderId && !paymentCompleted && !redirectDetected) {
      startPaymentVerification(orderId);
    }
  }, [orderId, paymentCompleted, redirectDetected]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            if (paymentCompleted || redirectDetected) {
              navigation.goBack();
              return;
            }
            
            console.log('🚫 USER CANCELLED PAYMENT MANUALLY');
            Alert.alert(
              'Cancel Payment',
              'Are you sure you want to cancel the payment?',
              [
                { text: 'No', style: 'cancel' },
                { 
                  text: 'Yes', 
                  onPress: () => {
                    clearPaymentPolling();
                    navigation.goBack();
                  }
                },
              ]
            );
          }}
        >
          <Icon name="close" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {paymentCompleted || redirectDetected ? 'Payment Complete' : 'Complete Payment'}
        </Text>
        <View style={styles.closeButton} />
      </View>
      
      {!paymentCompleted && !redirectDetected ? (
        <WebView
          ref={webViewRef}
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          onMessage={handleWebViewMessage}
          onError={handleWebViewError}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading payment page...</Text>
            </View>
          )}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadEnd={handleWebViewLoadEnd}
        />
      ) : (
        <View style={styles.completedContainer}>
          <ActivityIndicator size="large" color={COLORS.success} />
          <Text style={styles.completedText}>
            {insertingCollection ? 'Recording transaction...' : 
             redirectDetected ? 'Redirecting to app...' : 'Payment completed! Redirecting...'}
          </Text>
          {insertingCollection && (
            <Text style={styles.processingText}>Please wait while we record your payment...</Text>
          )}
        </View>
      )}
      
      {loading && !paymentCompleted && !redirectDetected && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading payment page...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

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
    ...FONTS.heading,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: COLORS.textLight,
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  completedText: {
    marginTop: 20,
    fontSize: 18,
    color: COLORS.success,
    fontWeight: '600',
    textAlign: 'center',
  },
  processingText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default PaymentWebView;