import { StyleSheet, Platform } from 'react-native';
import { COLORS, SIZES, FONTS, scale, verticalScale, moderateScale } from '../../utils/Theme';

const styles = StyleSheet.create({
  // Container Styles
  flex: {
    flex: 1,
  },
  safeAreaStyle: {
    flex: 1,
    // backgroundColor: COLORS.background,
  },
  mainBackground: {
    flex: 1,
    width: SIZES.width,
    height: SIZES.height,
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
  },
  

  //Header-------------
  header: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000, // keeps it above content
  backgroundColor: COLORS.background, // or your preferred color
  height: moderateScale(60),
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: SIZES.padding,
  shadowColor: COLORS.shadow,
  shadowOffset: {
    width: 0,
    height: moderateScale(2),
  },
  shadowOpacity: 0.15,
  shadowRadius: moderateScale(4),
  elevation: 4, // Android shadow
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: COLORS.border, // subtle separator line
},

  // ========== CONTENT WRAPPER ==========
  contentWrapper: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    backgroundColor: COLORS.surface,
    marginHorizontal: scale(16),
    marginTop: verticalScale(15),
    borderRadius: SIZES.radius,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentText: {
    ...FONTS.h6,
    fontSize: moderateScale(16),
    color: COLORS.title,
    marginBottom: verticalScale(8),
    fontWeight: '600',
    justifyContent: 'center',
    textAlign: 'center',
  },
  contentText1: {
    ...FONTS.body1,
    color: COLORS.goldtext,
    lineHeight: moderateScale(22),
    textAlign: 'justify',
  },

  // ========== SECTION STYLES ==========
  titleSpacer: {
    marginTop: verticalScale(10),
    paddingHorizontal: scale(8),
    gap: verticalScale(20),
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(-10),
    paddingBottom: verticalScale(8),
  },
  titletext: {
    ...FONTS.heading,
    color: COLORS.white,
    // fontWeight: 'bold',
    letterSpacing: 0.5,
    fontSize: SIZES.h5,
  },
  viewAllText: {
    ...FONTS.heading,
    color: COLORS.text,
    // fontWeight: 'bold',
    letterSpacing: 0.5,
    fontSize: SIZES.h6-6,
    paddingRight: scale(10),
  },

  // ========== PRODUCT SCROLL CONTAINERS ==========
  productScrollContainer: {
    flexDirection: 'row',
    paddingVertical: verticalScale(10),
  },
  productgoldContainer: {
    flexDirection: 'row',
    paddingVertical: verticalScale(10),
  },

  // ========== EMPTY STATE ==========
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(40),
    paddingHorizontal: scale(20),
  },

  // ========== YOUTUBE SECTION ==========
  youtubeContainer: {
    marginTop: verticalScale(20),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(20),
  },
  youtubeWrapper: {
    marginBottom: verticalScale(12),
    paddingBottom: verticalScale(8),
  },

  // ========== ITEM CARD ==========
  itemCardContainer: {
   marginRight: scale(8),
  },

  // ========== LOADING STATES ==========
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(50),
  },
  loadingText: {
    ...FONTS.font,
    color: COLORS.textLight,
    marginTop: verticalScale(12),
  },

  // ========== ERROR STATES ==========
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(40),
    paddingHorizontal: scale(20),
  },
  errorText: {
    ...FONTS.font,
    color: COLORS.danger,
    textAlign: 'center',
    marginTop: verticalScale(12),
  },

  // ========== PLATFORM SPECIFIC ==========
  iosHeaderPadding: Platform.select({
    ios: {
      paddingTop: verticalScale(20),
    },
    android: {
      paddingTop: verticalScale(10),
    },
  }),
});

export default styles;