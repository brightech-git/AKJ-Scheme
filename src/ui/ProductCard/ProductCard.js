import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextDefault } from '../../components';
import { COLORS, SIZES, FONTS, moderateScale } from '../../utils/Theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function ProductCard({ productData, navigation }) {
  // If productData is an array, take the first item (for single card display)
  // If it's a single object, use it directly
  const item = Array.isArray(productData) ? productData[0] : productData;

  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="inbox" size={40} color={COLORS.gray} />
        <TextDefault style={styles.emptyText}>No product data</TextDefault>
      </View>
    );
  }

  const { pname, regno, groupcode, maturityDate } = item;
  const accountDetails = item.accountDetails;
  const { schemeSummary } = accountDetails || {};
  const isActive = item.status === 'Active';

  // Determine scheme type based on schemeSName or fallback to groupcode
  const schemeSName = schemeSummary?.schemeSName;
  const isBMGAmountScheme = schemeSName === 'BAS' || groupcode === 'BMB';
  const isBMGDigiSilver = schemeSName === 'BDS' || groupcode === 'BDS';

  // For BMG Amount Scheme (BAS): Show installments
  // For BMG Digi Silver (BDS): Show amount as silver value/weight
  const statValue1 = isBMGAmountScheme
    ? `${schemeSummary?.schemaSummaryTransBalance?.insPaid || 0}/${schemeSummary?.instalment || 0}`
    : `₹${parseFloat(schemeSummary?.amount || accountDetails?.amount || 0).toLocaleString('en-IN')}`;
  const statLabel1 = isBMGAmountScheme ? 'Installments' : 'Silver Value';

  const totalAmount = `₹${parseFloat(schemeSummary?.amount || accountDetails?.amount || 0).toLocaleString('en-IN')}`;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleViewDetails = () => {
    navigation.navigate('ProductDescription', {
      productData: item,
      status: item.status,
      accountDetails,
    });
  };

  const handlePayNow = () => {
    const isDigiSilverPlan = isBMGDigiSilver;
    navigation.navigate('Buy', {
      productData: item,
      status: item.status,
      accountDetails,
      isDigiSilverPlan,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleViewDetails}
      style={[styles.cardContainer, !isActive && styles.inactiveCard]}
    >
      <LinearGradient
        colors={isActive ? COLORS.gradientPrimary : ['#bdc3c7', '#95a5a6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBadge}>
              <MaterialIcons name="account-balance" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.headerInfo}>
              <TextDefault style={styles.schemeCode}>
                {groupcode} - {regno}
              </TextDefault>
              {/* <TextDefault style={styles.schemeName} numberOfLines={1}>
                {pname} {isBMGDigiSilver ? '(BMG Digi Silver)' : isBMGAmountScheme ? '(BMG Amount Scheme)' : ''}
              </TextDefault> */}
            </View>
          </View>
          
          {item.status && (
            <View style={[
              styles.statusBadge,
              { backgroundColor: isActive ? COLORS.success : COLORS.danger }
            ]}>
              <TextDefault style={styles.statusText}>{item.status}</TextDefault>
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <MaterialIcons 
              name={isBMGAmountScheme ? "event-note" : "scale"} 
              size={20} 
              color={isActive ? "rgba(255,255,255,0.9)" : "#7f8c8d"} 
            />
            <TextDefault style={[styles.statLabel, { color: isActive ? 'rgba(255,255,255,0.9)' : '#7f8c8d' }]}>
              {statLabel1}
            </TextDefault>
            <TextDefault style={[styles.statValue, { color: isActive ? COLORS.white : '#7f8c8d' }]}>
              {statValue1}
            </TextDefault>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <MaterialIcons name="payments" size={20} color={isActive ? "rgba(255,255,255,0.9)" : "#7f8c8d"} />
            <TextDefault style={[styles.statLabel, { color: isActive ? 'rgba(255,255,255,0.9)' : '#7f8c8d' }]}>Total Amount</TextDefault>
            <TextDefault style={[styles.statValue, { color: isActive ? COLORS.white : '#7f8c8d' }]}>
              {totalAmount}
            </TextDefault>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <MaterialIcons name="event" size={20} color={isActive ? "rgba(255,255,255,0.9)" : "#7f8c8d"} />
            <TextDefault style={[styles.statLabel, { color: isActive ? 'rgba(255,255,255,0.9)' : '#7f8c8d' }]}>Maturity</TextDefault>
            <TextDefault style={[styles.statValue, { color: isActive ? COLORS.white : '#7f8c8d' }]} numberOfLines={1}>
              {formatDate(maturityDate)}
            </TextDefault>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewDetails}
            activeOpacity={0.7}
          >
            <MaterialIcons name="visibility" size={16} color={COLORS.primary} />
            <TextDefault style={styles.actionButtonText}>View Details</TextDefault>
          </TouchableOpacity>

          {isActive && (
            <TouchableOpacity
              style={[styles.actionButton, styles.payButton]}
              onPress={handlePayNow}
              activeOpacity={0.7}
            >
              <MaterialIcons name="payment" size={16} color={COLORS.white} />
              <TextDefault style={styles.payButtonText}>Pay Now</TextDefault>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
    margin: moderateScale(8),
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: SIZES.radius_lg,
  },
  emptyText: {
    color: COLORS.gray,
    marginTop: moderateScale(10),
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  cardContainer: {
    margin: moderateScale(15),
    borderRadius: SIZES.radius_lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  inactiveCard: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  gradientBackground: {
    borderRadius: SIZES.radius_lg,
    padding: moderateScale(16),
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: moderateScale(12),
  },
  iconBadge: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  schemeCode: {
    color: COLORS.white,
    fontSize: moderateScale(14),
    opacity: 0.9,
    marginBottom: moderateScale(2),
    ...FONTS.subheading,
  },
  schemeName: {
    color: COLORS.white,
    fontSize: moderateScale(14),
    ...FONTS.body1,
  },
  statusBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  statusText: {
    color: COLORS.white,
    fontSize: moderateScale(10),
    fontWeight: '700',
    ...FONTS.body1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SIZES.radius,
    padding: moderateScale(12),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: moderateScale(4),
  },
  statLabel: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    textAlign: 'center',
    ...FONTS.body1,
  },
  statValue: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    textAlign: 'center',
    ...FONTS.body1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: moderateScale(8),
  },
  actionContainer: {
    flexDirection: 'row',
    gap: moderateScale(10),
    marginBottom: moderateScale(8),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(10),
    gap: moderateScale(6),
  },
  payButton: {
    backgroundColor: COLORS.success,
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: moderateScale(12),
    fontWeight: '700',
    ...FONTS.body1,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: moderateScale(12),
    fontWeight: '700',
    ...FONTS.body1,
  },
});

export default ProductCard;