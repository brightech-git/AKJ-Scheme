import React, { useMemo } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { TextDefault } from '../../components'
import appTheme from '../../utils/Theme'
import { scale } from '../../utils'

const { COLORS, SIZES, FONTS } = appTheme
const { width } = Dimensions.get('window')

// Constants for better maintainability
const SCHEME_TYPES = {
  DREAM_GOLD: 'DREAM GOLD PLAN'
}

const STATUS_TYPES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
}

function ProductCard({
  productData,
  loading,
  error,
  navigation,
  status,
  accountDetails,
  style,
  onViewPress,
  onPayPress,
}) {
  // Memoized calculations
  const isDreamGoldPlan = useMemo(() => 
    accountDetails?.schemeSummary?.schemeName?.trim() === SCHEME_TYPES.DREAM_GOLD,
    [accountDetails?.schemeSummary?.schemeName]
  )

  const isActive = useMemo(() => 
    status === STATUS_TYPES.ACTIVE,
    [status]
  )

  // Check if installments are fully paid
const isInstallmentFullyPaid = useMemo(() => {
  if (!isDreamGoldPlan) return false;

  const insPaid = accountDetails?.schemeSummary?.schemaSummaryTransBalance?.insPaid ?? 0;
  const instalment = accountDetails?.schemeSummary?.instalment ?? 0;

  return insPaid === instalment && instalment > 0;
}, [accountDetails, isDreamGoldPlan]);

  const formattedMaturityDate = useMemo(() => {
    if (!productData?.maturityDate) return 'N/A'
    try {
      const date = new Date(productData.maturityDate)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return 'N/A'
    }
  }, [productData?.maturityDate])

  // Memoized stats data
  const statsData = useMemo(() => {
    const weight = productData?.amountWeight?.Weight || 0
    const amount = productData?.amountWeight?.Amount || 0
    const insPaid = accountDetails?.schemeSummary?.schemaSummaryTransBalance?.insPaid || 0
    const instalment = accountDetails?.schemeSummary?.instalment || 0
    const amtrecd = accountDetails?.schemeSummary?.schemaSummaryTransBalance?.amtrecd || 0

    if (isDreamGoldPlan) {
      return [
        { label: 'Ins Paid', value: `${insPaid}/${instalment}` },
        { label: 'Total Amount', value: `₹${amount}` },
        { label: 'Amount Saved', value: `₹${amtrecd}` }
      ]
    }

    return [
      { label: 'Weight Saved', value: `${weight} g` },
      { label: 'Total Amount', value: `₹${amount}` },
      { label: 'Weight Saved', value: `${weight} g` }
    ]
  }, [productData, accountDetails, isDreamGoldPlan])

  // Event handlers
  const handleCardPress = () => {
    navigation.navigate('ProductDescription', {
      productData,
      status,
      accountDetails,
    })
  }

  const handleViewPress = (e) => {
    e?.stopPropagation()
    if (onViewPress) {
      onViewPress()
    } else {
      navigation.navigate('ProductDescription', {
        productData,
        status,
        accountDetails
      })
    }
  }

  const handlePayPress = (e) => {
    e?.stopPropagation()
    if (onPayPress) {
      onPayPress()
    } else {
      navigation.navigate('Buy', {
        productData,
        status,
        accountDetails,
        isDreamGoldPlan
      })
    }
  }

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: scale(20) }}
        />
        <TextDefault style={styles.loadingText}>Loading product...</TextDefault>
      </View>
    )
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <TextDefault style={styles.errorText}>{error}</TextDefault>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <TextDefault style={styles.retryButtonText}>Go Back</TextDefault>
        </TouchableOpacity>
      </View>
    )
  }

  // Ensure productData exists
  if (!productData) {
    return (
      <View style={styles.errorContainer}>
        <TextDefault style={styles.errorText}>No product data available</TextDefault>
      </View>
    )
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleCardPress}
      style={[styles.cardContainer, style]}
    >
      <LinearGradient
        colors={['rgba(58, 58, 53, 1)', 'rgba(46, 46, 42, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <TextDefault style={styles.productCode} bold numberOfLines={1}>
              {productData.groupcode} - {productData.regno}
            </TextDefault>
            <TextDefault style={styles.productName} numberOfLines={2}>
              {productData.pname}
            </TextDefault>
          </View>
          
          <View style={styles.headerRight}>
            <View style={[
              styles.statusContainer, 
              isActive ? styles.statusActive : styles.statusInactive
            ]}>
              <TextDefault style={styles.statusText} bold>
                {status}
              </TextDefault>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isActive ? COLORS.success : COLORS.error }
                ]}
              />
            </View>
            
            {accountDetails?.schemeSummary?.schemeName && (
              <TextDefault style={styles.schemeName} bold numberOfLines={2}>
                {accountDetails.schemeSummary.schemeName.trim()}
              </TextDefault>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          {statsData.map((stat, index) => (
            <React.Fragment key={index}>
              <View style={styles.statItem}>
                <TextDefault style={styles.statLabel}>
                  {stat.label}
                </TextDefault>
                <TextDefault style={styles.statValue} numberOfLines={1}>
                  {stat.value}
                </TextDefault>
              </View>
              {index < statsData.length - 1 && (
                <View style={styles.statDivider} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <View style={styles.maturityContainer}>
            <TextDefault style={styles.maturityLabel}>
              Maturity Date
            </TextDefault>
            <TextDefault style={styles.maturityDate}>
              {formattedMaturityDate}
            </TextDefault>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.viewButton]}
              onPress={handleViewPress}
              activeOpacity={0.7}
            >
              <TextDefault style={styles.buttonText}>
                {isInstallmentFullyPaid ? 'View Details' : 'View'}
              </TextDefault>
            </TouchableOpacity>
            
            {/* Conditionally render Pay button */}
            {!isInstallmentFullyPaid && (
              <TouchableOpacity
                style={[styles.button, styles.payButton]}
                onPress={handlePayPress}
                activeOpacity={0.7}
              >
                <TextDefault style={[styles.buttonText, styles.payButtonText]}>
                  Pay
                </TextDefault>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Premium Badge for Dream Gold Plan */}
        {isDreamGoldPlan && accountDetails?.amount && (
          <View style={styles.premiumBadge}>
            <TextDefault style={styles.premiumBadgeText}>
              Premium: ₹{accountDetails.amount}
            </TextDefault>
          </View>
        )}

        {/* Active Indicator Glow */}
        {isActive && <View style={styles.activeGlow} />}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scale(200),
  },
  loadingText: {
    color: COLORS.primary,
    fontSize: scale(14),
    marginTop: scale(10),
    ...FONTS.body,
  },
  errorContainer: {
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: SIZES.radius,
    margin: scale(10),
    minHeight: scale(120),
  },
  errorText: {
    color: 'rgba(255, 0, 0, 1)',
    fontSize: scale(14),
    textAlign: 'center',
    marginBottom: scale(12),
    ...FONTS.body,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    borderRadius: SIZES.radius_sm,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: scale(14),
    fontWeight: 'bold',
    ...FONTS.body,
  },
  cardContainer: {
    borderRadius: SIZES.radius_lg,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginHorizontal: scale(10),
    marginVertical: scale(8),
  },
  gradientBackground: {
    padding: scale(16),
    position: 'relative',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scale(16),
  },
  headerLeft: {
    flex: 1,
    marginRight: scale(8),
  },
  headerRight: {
    alignItems: 'flex-end',
    maxWidth: '45%',
  },
  productCode: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: scale(16),
    marginBottom: scale(4),
    ...FONTS.heading,
  },
  productName: {
    color: COLORS.text,
    fontSize: scale(13),
    opacity: 0.9,
    ...FONTS.body1,
  },
  schemeName: {
    color: COLORS.text,
    fontSize: scale(11),
    marginTop: scale(4),
    opacity: 0.9,
    textAlign: 'right',
    ...FONTS.heading,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: SIZES.radius_sm,
    marginBottom: scale(4),
  },
  statusActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusInactive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: scale(12),
    marginRight: scale(4),
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SIZES.radius,
    padding: scale(12),
    marginBottom: scale(16),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: scale(12),
    opacity: 0.8,
    marginBottom: scale(4),
    textAlign: 'center',
    ...FONTS.subheading,
  },
  statValue: {
    color: 'rgba(255, 215, 0, 1)',
    fontSize: scale(14),
    fontWeight: '600',
    textAlign: 'center',
    ...FONTS.subheading,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: scale(4),
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  maturityContainer: {
    flex: 1,
  },
  maturityLabel: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: scale(10),
    opacity: 0.8,
    marginBottom: scale(2),
    ...FONTS.heading,
  },
  maturityDate: {
    color: COLORS.goldtext,
    fontSize: scale(13),
    fontWeight: '600',
    ...FONTS.subheading,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: scale(8),
  },
  button: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: SIZES.radius_sm,
    minWidth: scale(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  payButton: {
    backgroundColor: 'rgba(255, 215, 0, 1)',
  },
  buttonText: {
    fontSize: scale(12),
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    ...FONTS.subheading,
  },
  payButtonText: {
    color: 'rgba(0, 0, 0, 1)',
  },
  premiumBadge: {
    position: 'absolute',
    top: scale(16),
    right: scale(12),
    backgroundColor: 'rgba(109, 97, 27, 1)',
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: SIZES.radius_sm,
    elevation: 4,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  premiumBadgeText: {
    color: 'rgba(255, 215, 0, 1)',
    fontSize: scale(11),
    fontWeight: 'bold',
    ...FONTS.body,
  },
  activeGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: scale(3),
    backgroundColor: 'rgba(34, 197, 94, 0.6)',
  },
})

export default ProductCard