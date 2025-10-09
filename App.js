import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'react-native';
import AppContainer from './src/routes/routes';
import { colors } from './src/utils/colors';
import FlashMessage from 'react-native-flash-message';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './src/utils/Notification';
import useFonts from './src/utils/Fonts'; // import your font loader
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false); 
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Load fonts
    const loadAppFonts = async () => {
      await useFonts();
      setFontsLoaded(true);
    };
    loadAppFonts();

    // Push notification setup
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!fontsLoaded) return null; // optionally show a splash screen

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <AppContainer />
        <FlashMessage position="top" />
      </SafeAreaView>
    </>
  );
}
