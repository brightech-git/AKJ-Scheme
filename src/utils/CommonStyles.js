// CommonStyles.js
import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS, moderateScale } from './Theme';

const CommonStyles = StyleSheet.create({
  // ==================== CONTAINERS ====================
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  containerPadded: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ==================== CARDS ====================
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardElevated: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardFlat: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  cardOutline: {
    backgroundColor: 'transparent',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  cardCompact: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_sm,
    padding: moderateScale(12),
    marginBottom: moderateScale(12),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // ==================== BUTTONS ====================
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: moderateScale(14),
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonLarge: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonSmall: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius_sm,
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderRadius: SIZES.radius,
    paddingVertical: moderateScale(14),
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    paddingVertical: moderateScale(14),
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSuccess: {
    backgroundColor: COLORS.success,
    borderRadius: SIZES.radius,
    paddingVertical: moderateScale(14),
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDanger: {
    backgroundColor: COLORS.danger,
    borderRadius: SIZES.radius,
    paddingVertical: moderateScale(14),
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: SIZES.radius,
    paddingVertical: moderateScale(14),
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    paddingVertical: moderateScale(14),
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ==================== BUTTON TEXT ====================
  buttonText: {
    ...FONTS.font,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextLarge: {
    ...FONTS.fontLg,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextSmall: {
    ...FONTS.fontSm,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextOutline: {
    ...FONTS.font,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextGhost: {
    ...FONTS.font,
    color: COLORS.primary,
    fontWeight: '500',
    textAlign: 'center',
  },

  // ==================== TEXT STYLES ====================
  h1: FONTS.h1,
  h2: FONTS.h2,
  h3: FONTS.h3,
  h4: FONTS.h4,
  h5: FONTS.h5,
  h6: FONTS.h6,

  textLg: FONTS.fontLg,
  text: FONTS.font,
  textSm: FONTS.fontSm,
  textXs: FONTS.fontXs,

  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },

  textBold: {
    fontWeight: '700',
  },
  textSemibold: {
    fontWeight: '600',
  },
  textMedium: {
    fontWeight: '500',
  },

  textPrimary: {
    color: COLORS.primary,
  },
  textSecondary: {
    color: COLORS.secondary,
  },
  textLight: {
    color: COLORS.textLight,
  },
  textWhite: {
    color: COLORS.white,
  },
  textDanger: {
    color: COLORS.danger,
  },
  textSuccess: {
    color: COLORS.success,
  },
  textWarning: {
    color: COLORS.warning,
  },

  label: {
    ...FONTS.fontSm,
    color: COLORS.label,
    marginBottom: moderateScale(6),
  },
  placeholder: {
    color: COLORS.placeholder,
  },

  // ==================== HEADERS ====================
  header: {
    ...FONTS.h3,
    marginBottom: moderateScale(8),
  },
  headerLarge: {
    ...FONTS.h1,
    marginBottom: moderateScale(12),
  },
  headerMedium: {
    ...FONTS.h4,
    marginBottom: moderateScale(8),
  },
  headerSmall: {
    ...FONTS.h5,
    marginBottom: moderateScale(6),
  },
  headerPrimary: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: moderateScale(8),
  },
  headerCenter: {
    ...FONTS.h3,
    textAlign: 'center',
    marginBottom: moderateScale(8),
  },

  // ==================== SUBHEADERS ====================
  subheader: {
    ...FONTS.font,
    color: COLORS.textLight,
    marginBottom: moderateScale(4),
  },
  subheaderLarge: {
    ...FONTS.fontLg,
    color: COLORS.textLight,
    marginBottom: moderateScale(6),
  },
  subheaderSmall: {
    ...FONTS.fontSm,
    color: COLORS.textLight,
    marginBottom: moderateScale(4),
  },
  subheaderCenter: {
    ...FONTS.font,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: moderateScale(4),
  },

  // ==================== INPUTS ====================
  input: {
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius_sm,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    ...FONTS.font,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  inputFocused: {
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius_sm,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    ...FONTS.font,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  inputError: {
    backgroundColor: COLORS.input,
    borderRadius: SIZES.radius_sm,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    ...FONTS.font,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
  },
  inputDark: {
    backgroundColor: COLORS.darkInput,
    borderRadius: SIZES.radius_sm,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(14),
    ...FONTS.font,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  inputContainer: {
    marginBottom: SIZES.margin,
  },

  // ==================== DIVIDERS ====================
  divider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginVertical: SIZES.margin,
  },
  dividerThick: {
    height: 2,
    backgroundColor: COLORS.outline,
    marginVertical: SIZES.margin,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: COLORS.borderColor,
    marginHorizontal: moderateScale(12),
  },

  // ==================== SPACING ====================
  mt_xs: { marginTop: moderateScale(4) },
  mt_sm: { marginTop: moderateScale(8) },
  mt: { marginTop: SIZES.margin },
  mt_lg: { marginTop: moderateScale(24) },
  mt_xl: { marginTop: moderateScale(32) },

  mb_xs: { marginBottom: moderateScale(4) },
  mb_sm: { marginBottom: moderateScale(8) },
  mb: { marginBottom: SIZES.margin },
  mb_lg: { marginBottom: moderateScale(24) },
  mb_xl: { marginBottom: moderateScale(32) },

  ml_xs: { marginLeft: moderateScale(4) },
  ml_sm: { marginLeft: moderateScale(8) },
  ml: { marginLeft: SIZES.margin },
  ml_lg: { marginLeft: moderateScale(24) },

  mr_xs: { marginRight: moderateScale(4) },
  mr_sm: { marginRight: moderateScale(8) },
  mr: { marginRight: SIZES.margin },
  mr_lg: { marginRight: moderateScale(24) },

  mx_xs: { marginHorizontal: moderateScale(4) },
  mx_sm: { marginHorizontal: moderateScale(8) },
  mx: { marginHorizontal: SIZES.margin },
  mx_lg: { marginHorizontal: moderateScale(24) },

  my_xs: { marginVertical: moderateScale(4) },
  my_sm: { marginVertical: moderateScale(8) },
  my: { marginVertical: SIZES.margin },
  my_lg: { marginVertical: moderateScale(24) },

  pt_xs: { paddingTop: moderateScale(4) },
  pt_sm: { paddingTop: moderateScale(8) },
  pt: { paddingTop: SIZES.padding },
  pt_lg: { paddingTop: moderateScale(24) },

  pb_xs: { paddingBottom: moderateScale(4) },
  pb_sm: { paddingBottom: moderateScale(8) },
  pb: { paddingBottom: SIZES.padding },
  pb_lg: { paddingBottom: moderateScale(24) },

  pl_xs: { paddingLeft: moderateScale(4) },
  pl_sm: { paddingLeft: moderateScale(8) },
  pl: { paddingLeft: SIZES.padding },
  pl_lg: { paddingLeft: moderateScale(24) },

  pr_xs: { paddingRight: moderateScale(4) },
  pr_sm: { paddingRight: moderateScale(8) },
  pr: { paddingRight: SIZES.padding },
  pr_lg: { paddingRight: moderateScale(24) },

  px_xs: { paddingHorizontal: moderateScale(4) },
  px_sm: { paddingHorizontal: moderateScale(8) },
  px: { paddingHorizontal: SIZES.padding },
  px_lg: { paddingHorizontal: moderateScale(24) },

  py_xs: { paddingVertical: moderateScale(4) },
  py_sm: { paddingVertical: moderateScale(8) },
  py: { paddingVertical: SIZES.padding },
  py_lg: { paddingVertical: moderateScale(24) },

  // ==================== LAYOUT ====================
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  flexWrap: {
    flexWrap: 'wrap',
  },

  // ==================== BADGES ====================
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(10),
    alignSelf: 'flex-start',
  },
  badgeSuccess: {
    backgroundColor: COLORS.success,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(10),
    alignSelf: 'flex-start',
  },
  badgeDanger: {
    backgroundColor: COLORS.danger,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(10),
    alignSelf: 'flex-start',
  },
  badgeWarning: {
    backgroundColor: COLORS.warning,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(10),
    alignSelf: 'flex-start',
  },
  badgeOutline: {
    backgroundColor: 'transparent',
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(10),
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...FONTS.fontXs,
    color: COLORS.white,
    fontWeight: '600',
  },
  badgeTextOutline: {
    ...FONTS.fontXs,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // ==================== SHADOWS ====================
  shadowSm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  shadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowLg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  // ==================== BORDERS ====================
  border: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  borderPrimary: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.borderColor,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: COLORS.borderColor,
  },
  rounded: {
    borderRadius: SIZES.radius,
  },
  roundedSm: {
    borderRadius: SIZES.radius_sm,
  },
  roundedLg: {
    borderRadius: SIZES.radius_lg,
  },
  roundedFull: {
    borderRadius: 9999,
  },

  // ==================== OVERLAYS ====================
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
  },
  overlayLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // ==================== ICONS ====================
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerSmall: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerLarge: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ==================== LISTS ====================
  listItem: {
    paddingVertical: moderateScale(12),
    paddingHorizontal: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  listItemLast: {
    paddingVertical: moderateScale(12),
    paddingHorizontal: SIZES.padding,
  },

  // ==================== ERROR & SUCCESS ====================
  errorText: {
    ...FONTS.fontSm,
    color: COLORS.danger,
    marginTop: moderateScale(4),
  },
  successText: {
    ...FONTS.fontSm,
    color: COLORS.success,
    marginTop: moderateScale(4),
  },
  infoText: {
    ...FONTS.fontSm,
    color: COLORS.info,
    marginTop: moderateScale(4),
  },
});

export default CommonStyles;