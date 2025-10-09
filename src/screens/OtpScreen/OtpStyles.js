import { StyleSheet, Platform } from 'react-native';
import appTheme from '../../utils/Theme';

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
    justifyContent: 'flex-start',
    paddingTop: verticalScale(20),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(10),
  },

  // Logo Section
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(15),
    marginTop: verticalScale(-25),
  },
  logoImage: {
    width: moderateScale(120),
    height: moderateScale(120),
    resizeMode: 'contain',
  },

  // Card Container
  card: {
    width: '100%',
    maxWidth: moderateScale(380),
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(20),
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

  // Typography
  title: {
    ...FONTS.h4,
    textAlign: 'center',
    marginBottom: verticalScale(4),
    color: COLORS.primary,
  },
  subtitle: {
    ...FONTS.body,
    textAlign: 'center',
    marginBottom: verticalScale(24),
    color: COLORS.text,
    lineHeight: moderateScale(20),
    fontSize: SIZES.h5,
  },
 linkContainer: {
  borderRadius: SIZES.radius_sm,
  paddingVertical: verticalScale(8),
  paddingHorizontal: moderateScale(12),
  marginBottom: verticalScale(16),
  alignItems: 'center',
  justifyContent: 'center',
},

linkText: {
  ...FONTS.subheading,
  textAlign: 'center',
  color: COLORS.primary,
  fontWeight: '600',
  textDecorationLine: 'underline', // makes it look like a link
  letterSpacing: 0.3,
},


  // OTP Container
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(24),
    marginTop: verticalScale(16),
  },
  otpInputWrapper: {
    width: moderateScale(44),
    height: moderateScale(50),
    borderRadius: SIZES.radius_sm,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  waitingContainer: {
  alignItems: "center",
  marginVertical: 20,
  padding: 15,
  backgroundColor: COLORS.background + "80", // semi-transparent
  borderRadius: 10,
  borderWidth: 1,
  borderColor: COLORS.primary,
},
waitingText: {
  color: COLORS.primary,
  marginTop: 10,
  fontSize: 16,
  fontWeight: "bold",
  textAlign: "center",
},
waitingSubtext: {
  color: COLORS.textDark,
  marginTop: 5,
  fontSize: 12,
  textAlign: "center",
},
disabledText: {
  color: COLORS.text,
  opacity: 0.5,
},
  otpInput: {
    width: '100%',
    height: '100%',
    fontSize: SIZES.h4,
    color: COLORS.white,
    ...FONTS.body1,
    fontWeight: '600',
  },

  // Buttons
  primaryButton: {
    borderRadius: SIZES.radius_sm,
    marginTop: verticalScale(16),
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: moderateScale(3),
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(6),
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(44),
  },
  primaryButtonText: {
    ...FONTS.body1,
    fontWeight: '600',
    color: COLORS.white,
    fontSize: SIZES.font,
  },
  disabledButton: {
    opacity: 0.6,
  },

  // Resend OTP
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(8),
  },
  resendText: {
    ...FONTS.body1,
    color: COLORS.textLight,
    
  },
  resendLink: {
    ...FONTS.body1,
    color: COLORS.danger,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendDisabled: {
    color: COLORS.textLight,
  },
  // Add these styles to your existing OtpStyles.js

fullScreenLoader: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
},
loaderBackground: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: Platform.OS === 'web' ? 'blur(10px)' : undefined,
  // For React Native, we use opacity instead of backdrop-filter
},
loaderContent: {
  backgroundColor: COLORS.white,
  padding: 30,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 250,
  minHeight: 200,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
loadingText: {
  marginTop: 20,
  fontSize: 18,
  fontWeight: 'bold',
  color: COLORS.primary,
  textAlign: 'center',
},
loadingSubtext: {
  marginTop: 10,
  fontSize: 14,
  color: COLORS.gray,
  textAlign: 'center',
},
// Add/Update these styles in your OtpStyles.js

fullScreenLoader: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
},
loaderBackground: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  // For React Native, we use opacity instead of backdrop-filter
},
loaderContent: {
  backgroundColor: COLORS.white,
  padding: 30,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 280,
  minHeight: 220,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 8,
  margin: 20,
},
loadingText: {
  marginTop: 20,
  fontSize: 18,
  fontWeight: 'bold',
  color: COLORS.primary,
  textAlign: 'center',
},
loadingSubtext: {
  marginTop: 10,
  fontSize: 14,
  color: COLORS.gray,
  textAlign: 'center',
  lineHeight: 20,
},
loadingTimer: {
  marginTop: 8,
  fontSize: 12,
  color: COLORS.secondary,
  textAlign: 'center',
  fontStyle: 'italic',
},
disabledText: {
  opacity: 0.5,
},
disabledButton: {
  opacity: 0.6,
},
});

// Platform-specific adjustments
if (Platform.OS === 'web') {
  styles.card = {
    ...styles.card,
    cursor: 'default',
    maxHeight: verticalScale(450),
  };
  
  styles.primaryButton = {
    ...styles.primaryButton,
    cursor: 'pointer',
  };
  
  styles.resendContainer = {
    ...styles.resendContainer,
    cursor: 'pointer',
  };
  
  styles.scrollContainer = {
    ...styles.scrollContainer,
    paddingTop: verticalScale(10),
  };
}

// Additional responsive adjustments for small screens
if (SIZES.height < 600) {
  styles.scrollContainer = {
    ...styles.scrollContainer,
    paddingTop: verticalScale(10),
  };
  
  styles.container = {
    ...styles.container,
    paddingVertical: verticalScale(5),
  };
  
  styles.card = {
    ...styles.card,
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(16),
  };
  
  styles.logoImage = {
    ...styles.logoImage,
    width: moderateScale(70),
    height: moderateScale(70),
  };
  
  styles.title = {
    ...styles.title,
    fontSize: moderateScale(20),
    marginBottom: verticalScale(2),
  };
  
  styles.otpInputWrapper = {
    ...styles.otpInputWrapper,
    width: moderateScale(40),
    height: moderateScale(46),
  };
}

// For large screens
if (SIZES.height > 800) {
  styles.card = {
    ...styles.card,
    maxWidth: moderateScale(360),
  };
}

export default styles;