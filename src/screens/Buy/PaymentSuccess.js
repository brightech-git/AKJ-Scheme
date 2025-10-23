import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../../utils/Theme';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generateReceiptHTML } from "./Receipt/PrintReceipt";
import { generateShareMessage } from './Receipt/ShareReceipt';

const { width, height } = Dimensions.get('window');

function PaymentSuccess() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const [isPrinting, setIsPrinting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();

  const {
    orderId,
    amount,
    weight,
    goldRate,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
    phoneNumber,
    userName,
    productData,
    isDreamGoldPlan,
    timestamp,
    paymentDetails
  } = route.params || {};

  const paymentData = route.params?.paymentData;

  const paymentInfo = {
    orderId: orderId || paymentData?.orderId || 'N/A',
    amount: amount || paymentData?.amount || '0',
    weight: weight || paymentData?.weight || '0',
    goldRate: goldRate || paymentData?.goldRate || '0',
    razorpayPaymentId: razorpayPaymentId || paymentData?.razorpay_payment_id || 'N/A',
    razorpayOrderId: razorpayOrderId || paymentData?.razorpay_order_id || 'N/A',
    razorpaySignature: razorpaySignature || paymentData?.razorpay_signature || 'N/A',
    phoneNumber: phoneNumber || paymentData?.phoneNumber || 'N/A',
    userName: userName || paymentData?.userName || 'Customer',
    productData: productData || paymentData?.productData || {},
    isDreamGoldPlan: isDreamGoldPlan || paymentData?.isDreamGoldPlan || false,
    timestamp: timestamp || paymentData?.timestamp || new Date().toISOString(),
    paymentDetails: paymentDetails || paymentData || {}
  };

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(checkAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainLanding' }],
    });
  };

  const handleShareReceipt = async () => {
    try {
      const shareMessage = generateShareMessage(paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate);
      
      const result = await Share.share({
        message: shareMessage,
        title: 'Payment Receipt - Gold Purchase',
      });

      if (result.action === Share.sharedAction) {
        Alert.alert('Success', 'Receipt shared successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share receipt. Please try again.');
      console.error('Share error:', error);
    }
  };

  const handlePrintReceipt = async () => {
    try {
      setIsPrinting(true);
      const html = generateReceiptHTML(paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate);
      const { uri } = await Print.printToFileAsync({ html });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save or Print Receipt',
          UTI: 'com.adobe.pdf'
        });
        Alert.alert('Success', 'Receipt generated successfully!');
      } else {
        await Print.printAsync({ html });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate receipt. Please try again.');
      console.error('Print error:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return new Date().toLocaleDateString('en-IN');
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return new Date().toLocaleDateString('en-IN');
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return new Date().toLocaleDateString('en-IN');
    }
  };

  const formatId = (id, prefixLength = 8, suffixLength = 4) => {
    if (!id || id === 'N/A') return 'N/A';
    if (id.length <= prefixLength + suffixLength) return id;
    return `${id.substring(0, prefixLength)}...${id.substring(id.length - suffixLength)}`;
  };

  const formatAmount = (amt) => {
    const numAmount = parseFloat(amt);
    if (isNaN(numAmount)) return '0';
    return numAmount.toLocaleString('en-IN');
  };

  const formatWeight = (wgt) => {
    const numWeight = parseFloat(wgt);
    if (isNaN(numWeight)) return '0.00';
    return numWeight.toFixed(2);
  };

  const formatGoldRate = (rate) => {
    const numRate = parseFloat(rate);
    if (isNaN(numRate)) return '0';
    return numRate.toLocaleString('en-IN');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Animation */}
          <Animated.View 
            style={[
              styles.successContainer,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <View style={styles.checkmarkContainer}>
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.checkmarkGradient}
              >
                <Animated.View style={{ opacity: checkAnim }}>
                  <Icon name="check" size={60} color={COLORS.white} />
                </Animated.View>
              </LinearGradient>
              <View style={styles.pulseRing} />
            </View>
            
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successAmount}>₹{formatAmount(paymentInfo.amount)}</Text>
          </Animated.View>

          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* Compact Gold Info Card */}
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.15)', 'rgba(255, 193, 7, 0.1)']}
              style={styles.goldInfoCard}
            >
              <View style={styles.goldRow}>
                <View style={styles.goldItem}>
                  <Icon name="scale" size={20} color={COLORS.goldtext} />
                  <View style={styles.goldTextBlock}>
                    <Text style={styles.goldLabel}>Gold Weight</Text>
                    <Text style={styles.goldValue}>{formatWeight(paymentInfo.weight)} g</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.goldItem}>
                  <Icon name="trending-up" size={20} color={COLORS.goldtext} />
                  <View style={styles.goldTextBlock}>
                    <Text style={styles.goldLabel}>Rate</Text>
                    <Text style={styles.goldValue}>₹{formatGoldRate(paymentInfo.goldRate)}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* Order Details - Compact */}
            <View style={styles.detailsCard}>
              <TouchableOpacity 
                style={styles.detailsHeader}
                onPress={() => setShowDetails(!showDetails)}
                activeOpacity={0.7}
              >
                <Text style={styles.detailsHeaderText}>Order Details</Text>
                <Icon 
                  name={showDetails ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={24} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
              
              <View style={styles.compactDetails}>
                <View style={styles.compactRow}>
                  <Text style={styles.compactLabel}>Order ID</Text>
                  <Text style={styles.compactValue} numberOfLines={1}>
                    {formatId(paymentInfo.orderId, 6, 40)}
                  </Text>
                </View>
                <View style={styles.compactRow}>
                  <Text style={styles.compactLabel}>Date</Text>
                  <Text style={styles.compactValue}>{formatDate(paymentInfo.timestamp)}</Text>
                </View>
              </View>

              {showDetails && (
                <View style={styles.expandedDetails}>
                  <View style={styles.separator} />
                  <View style={styles.compactRow}>
                    <Text style={styles.compactLabel}>Payment ID</Text>
                    <Text style={styles.compactValue} numberOfLines={1}>
                      {formatId(paymentInfo.razorpayPaymentId, 6, 80)}
                    </Text>
                  </View>
                  {paymentInfo.razorpayOrderId !== 'N/A' && (
                    <View style={styles.compactRow}>
                      <Text style={styles.compactLabel}>Razorpay Order</Text>
                      <Text style={styles.compactValue} numberOfLines={1}>
                        {formatId(paymentInfo.razorpayOrderId, 6, 4)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.compactRow}>
                    <Text style={styles.compactLabel}>Customer</Text>
                    <Text style={styles.compactValue}>{paymentInfo.userName}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Quick Info Badges */}
            <View style={styles.badgesContainer}>
              <View style={styles.infoBadge}>
                <Icon name="verified-user" size={16} color={COLORS.success} />
                <Text style={styles.badgeText}>Secured</Text>
              </View>
              <View style={[styles.infoBadge, styles.statusBadge]}>
                <Icon name="check-circle" size={16} color={COLORS.success} />
                <Text style={styles.badgeText}>Completed</Text>
              </View>
              {paymentInfo.isDreamGoldPlan && (
                <View style={[styles.infoBadge, styles.planBadge]}>
                  <Icon name="card-giftcard" size={16} color={COLORS.goldtext} />
                  <Text style={styles.badgeText}>Dream Plan</Text>
                </View>
              )}
            </View>

            {/* Action Buttons - Compact */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleContinueShopping}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, '#0066cc']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Icon name="shopping-cart" size={20} color={COLORS.white} />
                  <Text style={styles.primaryButtonText}>Continue Shopping</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.secondaryButtons}>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={handleShareReceipt}
                  activeOpacity={0.8}
                >
                  <View style={styles.iconButtonInner}>
                    <Icon name="share" size={22} color={COLORS.primary} />
                    <Text style={styles.iconButtonText}>Share</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={handlePrintReceipt}
                  activeOpacity={0.8}
                  disabled={isPrinting}
                >
                  <View style={styles.iconButtonInner}>
                    <Icon name="print" size={22} color={COLORS.primary} />
                    <Text style={styles.iconButtonText}>
                      {isPrinting ? 'Wait...' : 'Print'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <TouchableOpacity 
              style={styles.supportLink}
              onPress={() => navigation.navigate('Support')}
            >
              <Icon name="help-outline" size={18} color={COLORS.textLight} />
              <Text style={styles.supportText}>Need help? Contact Support</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  checkmarkContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  checkmarkGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    top: -10,
    left: -10,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    ...FONTS.heading,
  },
  successAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.success,
    letterSpacing: 1,
  },
  content: {
    width: '100%',
  },
  goldInfoCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  goldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  goldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goldTextBlock: {
    marginLeft: 10,
  },
  goldLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  goldValue: {
    fontSize: 16,
    color: COLORS.goldtext,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    marginHorizontal: 16,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  compactDetails: {
    gap: 10,
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  compactLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  compactValue: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  expandedDetails: {
    marginTop: 8,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  statusBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  planBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionButtons: {
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  iconButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  iconButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  supportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  supportText: {
    marginLeft: 6,
    color: COLORS.textLight,
    fontSize: 14,
  },
});

export default PaymentSuccess;