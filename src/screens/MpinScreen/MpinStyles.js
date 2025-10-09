import { StyleSheet, Dimensions, Platform } from 'react-native'
import { scale, verticalScale } from '../../utils/scaling'
import {
  FontSize,
  Color,
  Padding,
  Border
} from '../../utils/Global_Styles'
import { colors } from '../../utils/colors'

const { width, height } = Dimensions.get('window')

export default StyleSheet.create({
  // ─── Base Styles ──────────────────────────────────────────────────
  container: {
    flex: 1,
    // backgroundColor: colors.white
  },
  animatedBackground: {
    position: 'absolute',
    width: width * 2,
    height,
    backgroundColor: colors.white,
    opacity: 0.3
  },
  keyboardContainer: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: scale(24),
    justifyContent: 'center'
  },
  progressBar: {
    height: 3,
    backgroundColor: '#f5f5f5',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  progressFill: {
    height: 3,
    backgroundColor: colors.primaryGold
  },

  // ─── Header Styles ────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(40)
  },
  lockAnimation: {
    width: scale(100),
    height: verticalScale(100),
    marginBottom: verticalScale(20)
  },
  title: {
    fontSize: 24,
    // fontWeight: 'bold',
    color: colors.black,
    marginBottom: verticalScale(8),
    textAlign: 'center',
    fontFamily: 'TrajanPro-Bold'
  },
  subtitle: {
    fontSize: scale(15),
    color: colors.gray,
    textAlign: 'center',
    fontFamily: 'TrajanPro-Normal',
    lineHeight: scale(20),
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10)
  },

  // ─── MPIN Input Styles ────────────────────────────────────────────
  mpinContainer: {
    marginBottom: verticalScale(30)
  },
  mpinLabel: {
    fontSize: scale(16),
    color: colors.black,
    marginBottom: verticalScale(16),
    textAlign: 'center',
    fontFamily: 'TrajanPro-Bold'
  },
  mpinInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(16)
  },
  mpinInput: {
    width: scale(60),
    height: verticalScale(60),
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    fontSize: scale(20),
    // fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginHorizontal: scale(4),
    borderRadius: Border.radiusMedium,
    fontFamily: 'TrajanPro-Bold',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: Border.br_mini
  },
  leftRadius: {
    borderTopLeftRadius: Border.radiusMedium,
    borderBottomLeftRadius: Border.radiusMedium
  },
  rightRadius: {
    borderTopRightRadius: Border.radiusMedium,
    borderBottomRightRadius: Border.radiusMedium
  },
  attemptsText: {
    fontSize: FontSize.xs,
    color: colors.red,
    textAlign: 'center',
    marginTop: verticalScale(8),
    fontFamily: 'TrajanPro-Normal'
  },

  // ─── Button Styles ────────────────────────────────────────────────
  buttonContainer: {
    marginTop: verticalScale(20),
    borderRadius: Border.br_mini
  },
  primaryButton: {
    backgroundColor: colors.ButtonColor,
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    marginBottom: verticalScale(16),
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    borderRadius: Border.br_mini
  },
  primaryButtonActive: {
    backgroundColor: colors.ButtonColor,
    borderColor: colors.primaryGold,
    borderRadius: Border.br_mini
  },
  primaryButtonDisabled: {
    opacity: 0.6
  },
  primaryButtonText: {
    color: colors.black,
    fontSize: FontSize.medium,
    // fontWeight: 'bold',
    fontFamily: 'TrajanPro-Bold',
    borderRadius: Border.radiusLarge
  },
  secondaryButton: {
    padding: scale(16),
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: colors.errorColor,
    fontSize: FontSize.small,
    fontWeight: '500',
    fontFamily: 'TrajanPro-Normal',
    borderRadius: Border.radiusLarge
  }

  // Uncomment if needed
  // loadingAnimation: {
  //   width: scale(60),
  //   height: scale(60)
  // }
});
