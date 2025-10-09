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
    paddingTop: verticalScale(-70), // Added top padding to push content down from very top
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: moderateScale(30),
    // paddingTop: verticalScale(40), // Reduced top padding since we have scrollContainer padding
    paddingBottom: verticalScale(20),
  },

  // Logo Section - Positioned at top
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(10),
    paddingHorizontal: moderateScale(20),
    marginTop: verticalScale(5), // Small top margin for breathing room
  },
  logoImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    resizeMode: 'contain',
    borderRadius: scale(50),
    // borderRadius: SIZES.radius,
    // shadowColor: COLORS.shadow,
    // shadowOffset: {
    //   width: 0,
    //   height: moderateScale(4),
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: moderateScale(6),
    // elevation: 8,
  },

  // Card Container - Positioned below logo
  card: {
    width: '100%',
    maxWidth: moderateScale(400),
    backgroundColor: COLORS.card1,
    borderRadius: SIZES.radius_lg,
    paddingHorizontal: moderateScale(24),
    paddingVertical: verticalScale(32),
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: moderateScale(8),
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(16),
    elevation: 12,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginTop: verticalScale(0), // Added margin to separate from logo
  },

  // Typography
  title: {
    ...FONTS.heading,
    textAlign: 'center',
    marginBottom: verticalScale(8),
    color: COLORS.primary,
    fontSize: SIZES.h3,
  },
  subtitle: {
    ...FONTS.body,
    textAlign: 'center',
    marginBottom: verticalScale(14),
    color: COLORS.text,
    fontSize: SIZES.h3,
  },
  label: {
    ...FONTS.subheading,
    fontWeight: '600',
    marginBottom: verticalScale(8),
    color: COLORS.text,
    marginTop: verticalScale(16),
    fontSize: SIZES.h6,

  },
  linkText: {
    ...FONTS.body1,
    textAlign: 'center',
    color: COLORS.primary,
    marginTop: verticalScale(20),
    // textDecorationLine: 'underline',
    fontWeight: '500',
  },
  linkText1: {
    ...FONTS.body1,
    textAlign: 'center',
    color: COLORS.danger,
    marginTop: verticalScale(20),
    textDecorationLine: 'underline',
    fontWeight: '500',
  },

  // Input Fields
  input: {
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius_sm,
    paddingHorizontal: moderateScale(16),
    paddingVertical: Platform.OS === 'ios' ? verticalScale(14) : verticalScale(12),
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    fontSize: SIZES.font,
    color: COLORS.black,
    fontFamily: 'TimesNewRoman',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 2,
    ...FONTS.body1,
  },

  // Buttons
  primaryButton: {
    borderRadius: SIZES.radius_sm,
    marginTop: verticalScale(24),
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: moderateScale(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(8),
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...FONTS.h5,
    fontWeight: '600',
    color: COLORS.text,
    fontSize: SIZES.h5,
  },
  disabledButton: {
    opacity: 0.7,
    
  },
  dividerContainer:{
    alignItems:"center",
    padding:10
  },
  dividerText:{
    ...FONTS.h6,
    color:COLORS.textLight
  },
Google: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
},
googleButton: {
  backgroundColor: COLORS.white,
  padding: 5,
  borderRadius: 10,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: COLORS.textLight,
  width: '100%',
},
googleIcon: {
  width: 40,
  height: 40,
  marginRight: 10,
},
googleButtonText: {
  color: COLORS.black,
  fontSize: 16,
  fontWeight: '600',
},
disabledButton: {
  opacity: 0.6,
},
loadingOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
},
loadingText: {
  color: COLORS.white,
  marginTop: 20,
  fontSize: 18,
  fontWeight: '600',
},
  
});

// Platform-specific adjustments
if (Platform.OS === 'web') {
  // Web-specific styles
  styles.card = {
    ...styles.card,
    cursor: 'default',
  };
  
  styles.input = {
    ...styles.input,
    outlineStyle: 'none',
  };
  
  styles.primaryButton = {
    ...styles.primaryButton,
    cursor: 'pointer',
  };
  
  // Additional web top spacing
  styles.scrollContainer = {
    ...styles.scrollContainer,
    paddingTop: verticalScale(80),
  };
}

export default styles;