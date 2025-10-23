// styles.js
import { StyleSheet, Platform } from 'react-native';
import appTheme from '../../utils/Theme';
import { scale } from '../../utils';

const { COLORS, SIZES, FONTS, moderateScale, verticalScale } = appTheme;

const styles = StyleSheet.create({
  // Background & Container
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: verticalScale(20),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(10),
    
  },

  // Logo Section - Smaller and closer to top
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(10),
    marginTop: verticalScale(-60),
    borderWidth: 1,
    borderColor: COLORS.black1,
    borderRadius: moderateScale(50),
  },
  logoImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    resizeMode: 'contain',
    borderRadius: scale(50),
  },

  // Card Container - Compact height
  card: {
    width: '100%',
    maxWidth: moderateScale(380),
    backgroundColor: COLORS.card1,
    borderRadius: SIZES.radius,
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(20), // Reduced padding
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: moderateScale(6),
    },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(12),
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginTop: verticalScale(5),
  },

  // Typography - Compact spacing
  title: {
    ...FONTS.heading,
    textAlign: 'center',
    marginBottom: verticalScale(4),
    color: COLORS.goldtext,
    fontSize: SIZES.h3,
  },
  subtitle: {
    ...FONTS.body,
    textAlign: 'center',
    marginBottom: verticalScale(16),
    color: COLORS.goldtext1,
    fontSize: SIZES.h3,
  },
  label: {
    ...FONTS.heading,
    fontWeight: '600',
    marginBottom: verticalScale(4),
    color: COLORS.goldtext,
    marginTop: verticalScale(12), // Reduced margin
    fontSize: SIZES.h6,
  },
  linkText: {
    ...FONTS.subheading,
    textAlign: 'center',
    color: COLORS.primary,
    marginTop: verticalScale(16),
    // textDecorationLine: 'underline',
    fontWeight: '500',
    fontSize: SIZES.fontLg,
  },
  linkText1: {
    ...FONTS.subheading,
    textAlign: 'center',
    color: COLORS.linktext,
    marginTop: verticalScale(16),
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.linktext,
    fontWeight: '500',
     fontSize: SIZES.fontLg,
  },
  errorText: {
    ...FONTS.fontXs,
    color: COLORS.danger,
    marginTop: verticalScale(2),
    marginLeft: moderateScale(4),
    fontFamily:FONTS.body1.fontFamily
  },

  // Input Fields - Compact
  input: {
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius_sm,
    paddingHorizontal: moderateScale(14),
    paddingVertical: Platform.OS === 'ios' ? verticalScale(10) : verticalScale(8),
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    fontSize: SIZES.font,
    color: COLORS.white,
    ...FONTS.body1,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: 1,
    minHeight: verticalScale(38), // Fixed height for consistency
  },

  // Phone Input Container - Compact
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius_sm,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    paddingHorizontal: moderateScale(14),
    paddingVertical: Platform.OS === 'ios' ? verticalScale(8) : verticalScale(6),
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: 1,
    minHeight: verticalScale(40), // Fixed height
  },
  inputError: {
    borderColor: COLORS.danger,
    borderWidth: 1.5,
  },
  countryCode: {
    ...FONTS.fontSm,
    color: COLORS.white,
    marginRight: moderateScale(6),
    fontWeight: '600',
    paddingRight: moderateScale(6),
    borderRightWidth: 1,
    borderRightColor: COLORS.borderColor,
  },
  phoneInput: {
    flex: 1,
    fontSize: SIZES.font,
    color: COLORS.white,
    ...FONTS.body1,
    paddingLeft: moderateScale(6),
  },

  // Buttons - Compact
  primaryButton: {
   borderRadius: moderateScale(15),
    marginTop: verticalScale(24),
    overflow: Platform.OS === "ios" ? "visible" : "hidden", // avoids cutting shadow on iOS
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: moderateScale(4),
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(6),
    elevation: 6, // Android shadow
    height: moderateScale(48),
    width: "85%",
    alignSelf: "center",
    backgroundColor: COLORS.primary, // fallback if gradient not rendered
  },
  buttonGradient: {
    paddingVertical: verticalScale(10), // Reduced padding
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(44), // Fixed button height
  },
  primaryButtonText: {
    ...FONTS.h5,
    fontWeight: '600',
    color: COLORS.black,
    fontSize: SIZES.h5,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default styles;