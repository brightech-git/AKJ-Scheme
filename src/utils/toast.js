import { Platform, ToastAndroid, Alert } from 'react-native';

export const showToast = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // For iOS, you can use a third-party toast library or implement a custom toast
    // For now, we'll use Alert as fallback
    Alert.alert('', message);
  }
}; 