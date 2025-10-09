import React, { useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, Linking, Alert, BackHandler } from 'react-native';
import { CommonActions } from '@react-navigation/native';

const PaymentGateway = ({ route, navigation }) => {
  const { paymentUrl } = route.params;

  console.log('PaymentGateway mounted with URL:', paymentUrl);

  useEffect(() => {
    // Listen for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Cancel Payment?',
        'Do you want to cancel the payment and return?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: goToMyScheme }
        ]
      );
      return true;
    });

    // Open payment URL in external browser
    openPaymentUrl();

    return () => {
      subscription.remove();
      backHandler.remove();
      console.log('PaymentGateway listeners removed');
    };
  }, []);

  const openPaymentUrl = async () => {
    try {
      if (!paymentUrl) throw new Error('Payment URL not provided');
      console.log('Opening payment URL in browser:', paymentUrl);

      const supported = await Linking.canOpenURL(paymentUrl);
      if (supported) await Linking.openURL(paymentUrl);
      else throw new Error('Cannot open payment URL');
    } catch (error) {
      console.error('Failed to open payment URL:', error);
      Alert.alert('Error', error.message || 'Unable to open payment page', [{ text: 'OK', onPress: goToMyScheme }]);
    }
  };

  const handleDeepLink = (event) => {
    console.log('Deep link received:', event.url);
    const url = event.url.toLowerCase();

    if (url.includes('payment-success')) {
      console.log('Payment success detected');
      Alert.alert('Payment Successful', 'Your payment has been processed!', [{ text: 'OK', onPress: goToMyScheme }]);
    } else if (url.includes('payment-failure')) {
      console.log('Payment failure detected');
      Alert.alert('Payment Failed', 'Please try again.', [{ text: 'OK', onPress: goToMyScheme }]);
    } else if (url.includes('payment-cancelled')) {
      console.log('Payment cancelled detected');
      Alert.alert('Payment Cancelled', 'You cancelled the payment.', [{ text: 'OK', onPress: goToMyScheme }]);
    }
  };

  const goToMyScheme = () => {
    console.log('Navigating back to MyScheme');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'MainLanding' },
          { name: 'MyScheme' }
        ],
      })
    );
  };

  return (
    <SafeAreaView style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fff' }}>
      <ActivityIndicator size="large" color="#DAA520" />
    </SafeAreaView>
  );
};

export default PaymentGateway;
