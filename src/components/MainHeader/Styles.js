// styles.js
import { StyleSheet } from "react-native";
import { COLORS, SIZES, FONTS, moderateScale, verticalScale, scale } from "../../utils/Theme";

export default StyleSheet.create({
  // ========== Main Header Container ==========
  headerContainer1: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.padding,
    paddingTop: verticalScale(10),
    marginBottom: verticalScale(40), // Increased bottom margin for overlay cards
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
    height: verticalScale(110),
  },
  headerGradientContainer: {
  width: "100%",
  paddingBottom: 12,
  paddingTop: 12,
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  overflow: "hidden",
},


  // ========== Top Header Section ==========
  topHeaderSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
    marginTop: verticalScale(8),
  },

  // FAQ Icon Container
  faqIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: scale(22),
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },

  // Menu Icon Container
  menuIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: scale(22),
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },

  // ========== Main Header Section (Logo + Company Name) ==========
  mainHeaderSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: SIZES.margin,
  },

  logoContainer: {
    marginRight: moderateScale(12),
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  headerLogo: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: scale(25),
  },

  companyNameContainer: {
    alignItems: "center",
  },

  companyName: {
    ...FONTS.h5,
    color: COLORS.white,
    fontSize: moderateScale(18),
    letterSpacing: 0.5,
  },

  companySubtitle: {
    ...FONTS.body1,
    color: COLORS.white,
    fontSize: moderateScale(13),
    marginTop: verticalScale(-2),
    fontStyle: "italic",
  },

  // ========== Rate Timestamp ==========
  rateTimestampContainer: {
    alignItems: "center",
    marginBottom: verticalScale(12),
  },

  rateTimestamp: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    fontSize: moderateScale(11),
    fontStyle: "italic",
  },

  // ========== Rate Cards Overlay Container ==========
  rateCardsOverlayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: moderateScale(12),
    position: 'absolute',
    bottom: verticalScale(-30), // This makes cards extend below the container
    left: SIZES.padding,
    right: SIZES.padding,
    // height: verticalScale(50),
  },

  // ========== Individual Rate Card Overlay ==========
  rateCardOverlay: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: moderateScale(8),
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    minHeight: moderateScale(80),
  },

  rateCardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  rateIconContainer: {
    marginRight: moderateScale(12),
  },

  animatedCoinContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    alignItems: "center",
    justifyContent: "center",
  },

  rateCoinIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
  },

  rateTextContainer: {
    flex: 1,
  },

  rateLabel: {
    ...FONTS.body1,
    color: COLORS.black,
    fontSize: moderateScale(14),
    marginBottom: verticalScale(2),
  },

  rateValue: {
    ...FONTS.body1,
    color: COLORS.primary,
    fontSize: moderateScale(18),
    fontWeight: "700",
    marginBottom: verticalScale(2),
  },

  rateUnit: {
    ...FONTS.subheading,
    color: COLORS.black,
    fontSize: moderateScale(13),
  },
});

// ========== Alternative Style Variations ==========
export const headerStyles = {
  // Gold-themed variation
  goldTheme: StyleSheet.create({
    headerContainer1: {
      backgroundColor: "#FFFDF5",
      paddingHorizontal: SIZES.padding,
      paddingTop: verticalScale(10),
      paddingBottom: verticalScale(16),
      borderBottomWidth: 1,
      borderBottomColor: "#F0E6CC",
    },
    rateCard: {
      flex: 1,
      backgroundColor: "#FFF9E6",
      borderRadius: SIZES.radius,
      padding: moderateScale(16),
      borderWidth: 1,
      borderColor: "#F0E6CC",
    },
    companyName: {
      ...FONTS.h5,
      color: "#B8860B",
      fontSize: moderateScale(18),
    },
  }),

  // Compact variation for smaller screens
  compact: StyleSheet.create({
    headerContainer1: {
      paddingHorizontal: moderateScale(12),
      paddingTop: verticalScale(8),
      paddingBottom: verticalScale(12),
    },
    rateCard: {
      padding: moderateScale(12),
    },
    animatedCoinContainer: {
      width: moderateScale(40),
      height: moderateScale(40),
    },
    rateCoinIcon: {
      width: moderateScale(32),
      height: moderateScale(32),
    },
    companyName: {
      fontSize: moderateScale(16),
    },
  }),
};