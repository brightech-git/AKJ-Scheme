import React, { useState } from 'react';
import {
  SafeAreaView,
  Alert,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appTheme from '../../utils/Theme';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

const { COLORS, SIZES, FONTS } = appTheme;

function DeleteAccount(props) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Confirm Account Deletion',
      'Are you sure you want to delete your account? This will remove all your data from this device.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // Get all keys from AsyncStorage
              const allKeys = await AsyncStorage.getAllKeys();
              
              // Remove all data from AsyncStorage
              await AsyncStorage.multiRemove(allKeys);
              
              Alert.alert(
                'Account Deleted',
                'Your account data has been removed from this device.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.replace('LoginPage')
                  }
                ]
              );
            } catch (error) {
              console.error('Error deleting account data:', error);
              Alert.alert(
                'Error',
                'Failed to delete account data. Please try again.'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Removing your data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Account Deletion" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.warningContainer}>
          <Text style={styles.warningTitle}>
            Are you sure you want to delete your account?
          </Text>
          
          <Text style={styles.warningText}>
            This will remove all your data from this device. You'll need to sign up again to use the app.
          </Text>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Important Instructions Before Deletion:</Text>
            <Text style={styles.instructionItem}>
              • All your personal information, transaction history, and app preferences will be permanently deleted.
            </Text>
            <Text style={styles.instructionItem}>
              • For Digi Gold: Your Digi Gold holdings will be automatically liquidated at the current market rate. Proceeds will be transferred back to your original payment method within 3-5 business days. Any pending transactions will be canceled.
            </Text>
            <Text style={styles.instructionItem}>
              • You will lose access to any active schemes, subscriptions, or rewards points associated with this account.
            </Text>
            <Text style={styles.instructionItem}>
              • This action cannot be undone. If you have any Digi Gold or other investments, consider withdrawing them first.
            </Text>
            <Text style={styles.instructionItem}>
              • Contact support at support@bmgjewellers.com if you need assistance with withdrawal before deletion.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          disabled={loading}
        >
          <Text style={styles.deleteButtonText}>
            {loading ? 'Deleting...' : 'Delete Account'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  loadingText: {
    ...FONTS.font,
    color: COLORS.text,
    marginTop: SIZES.margin,
  },
  warningContainer: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  warningTitle: {
    ...FONTS.h4,
    color: COLORS.danger,
    textAlign: 'center',
    fontWeight: '900',
    marginBottom: SIZES.margin / 2,
  },
  warningText: {
    ...FONTS.font,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: SIZES.font * 1.4,
    marginBottom: SIZES.margin * 2,
  },
  instructionsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin * 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  instructionsTitle: {
    ...FONTS.h6,
    color: COLORS.warning,
    fontWeight: 'bold',
    marginBottom: SIZES.margin,
    textAlign: 'center',
  },
  instructionItem: {
    ...FONTS.fontSm,
    color: COLORS.text,
    lineHeight: SIZES.fontSm * 1.4,
    marginBottom: SIZES.margin / 2,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    borderRadius: SIZES.radius,
    width: '100%',
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
  },
  deleteButtonText: {
    ...FONTS.h6,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  cancelButton: {
    width: '100%',
    paddingVertical: SIZES.padding,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...FONTS.h6,
    color: COLORS.primary,
    fontWeight: '600',
  },
};

export default DeleteAccount;