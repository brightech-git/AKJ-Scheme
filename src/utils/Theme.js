// theme.js
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

// Scaling functions
const guidelineBaseWidth = 350
const guidelineBaseHeight = 680
const scale = size => (width / guidelineBaseWidth) * size
const verticalScale = size => (height / guidelineBaseHeight) * size
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor

export const COLORS = {
  // Base - Dark Theme
  background: "rgba(18, 18, 18, 1)",           // Deep black
  card: "rgb(37, 36, 36)",                 // Dark card
  card1: "rgba(78, 78, 78, 0.33)",             // Semi-transparent dark card
  surface: "rgba(30, 30, 30, 1)",              // Dark surface
  surfaceVariant: "rgba(38, 38, 38, 1)",       // Variant surface
  transparent: "rgba(0, 0, 0, 0)",

  // Core Brand (bright colors for dark theme)
  primary: "rgba(202, 67, 67, 1)",           // Lighter blue for contrast
  primary1: "rgba(255, 255, 255, 1)",           // Lighter blue for contrast
  primaryLight: "rgba(100, 170, 255, 0.15)",
  secondary: "rgba(240, 120, 255, 1)",         // Lighter magenta/pink
  notification: "rgba(255, 193, 7, 1)",        // Brighter gold

  // Status
  success: "rgba(76, 175, 80, 1)",             // Brighter green
  danger: "rgba(244, 67, 54, 1)",              // Brighter red
  danger1: "rgba(180, 226, 238, 1)",              // Brighter red
  warning: "rgba(255, 183, 77, 1)",            // Brighter orange
  info: "rgba(66, 165, 245, 1)",               // Brighter info blue
  // Additional status colors can be added here
  light: "rgba(255, 255, 255, 0.5)",           // Light status color
  dark: "rgba(0, 0, 0, 0.5)",                   // Dark status color
  linktext: "rgba(70, 255, 46, 1)",           // Link text color
  goldtext: "rgba(255, 215, 0, 1)",           // Gold text color
  goldtext1: "rgba(180, 157, 28, 1)",           // Gold text color

  // Text - Light text on dark background
  title: "rgba(255, 255, 255, 1)",             // Near white
  text: "rgba(255, 255, 255, 1)",              // Light gray
  textLight: "rgba(170, 170, 170, 1)",         // Medium gray
  label: "rgba(150, 150, 150, 1)",             // Dim gray
  label1: "rgba(80, 80, 80, 1)",               // Darker label
  placeholder: "rgba(255, 255, 255, 0.4)",     // Light placeholder
  white: "rgba(255, 255, 255, 1)",
  black: "rgba(0, 0, 0, 1)",
  black1: "rgba(156, 149, 149, 1)",
  black2: "rgba(53, 50, 50, 1)",

  // Borders & Shadows
  borderColor: "rgba(255, 255, 255, 0.12)",    // Light border
  outline: "rgba(60, 60, 60, 1)",              // Dark outline
  shadow: "rgba(0, 0, 0, 0.5)",                // Stronger shadow
  overlay: "rgba(0, 0, 0, 0.7)",               // Darker overlay

  // Inputs
  input: "rgba(28, 28, 28, 1)",                // Dark input
  darkInput: "rgba(150, 150, 150, 1)",            // Darker input

  // Icons
  iconPrimary: "rgba(100, 170, 255, 1)",       // Light blue
  iconSecondary: "rgba(150, 150, 150, 1)",     // Gray

  // Gradients (rgba arrays) - Adjusted for dark theme
  gradientPrimary: ["rgba(73, 73, 73, 1)", "rgba(56, 56, 56, 1)"],
  gradientSecondary: ["rgba(100, 170, 255, 0.15)", "rgba(240, 120, 255, 1)"],
  gradientText: ["rgba(100, 170, 255, 1)", "rgba(240, 120, 255, 1)"],
  gradientBackground: "linear-gradient(135deg, rgba(20, 20, 20, 1), rgba(30, 30, 30, 1))",
  gradientPrimary1: ["rgba(100, 170, 255, 1)", "rgba(240, 120, 255, 1)"],
  gradientPrimary2: ["rgba(100, 170, 255, 1)", "rgba(240, 120, 255, 1)"],
  gradientPrimary3: ["rgba(28, 28, 28, 1)", "rgba(38, 38, 38, 1)"],
  gradientPrimary4: ["rgba(45, 45, 45, 1)", "rgba(55, 55, 55, 1)"],
  gradientPrimary5: ["rgb(255, 110, 100)", "rgb(75, 36, 80)"],
  gradientPrimary6: ["rgba(255, 215, 0, 1)", "rgba(109, 97, 27, 1)"],

  // Product card
  gradientcolor1: "rgba(100, 170, 255, 1)",
  gradientcolor2: "rgba(240, 120, 255, 1)",

  // Gold plan (themed with blue/pink)
  gradientcolor3: "rgba(100, 170, 255, 1)",
  gradientcolor4: "rgba(240, 120, 255, 1)",

  gradientcolor5: "rgba(100, 170, 255, 1)",
  gradientcolor6: "rgba(240, 120, 255, 1)",

  gradientcolor7: "rgba(255, 215, 0, 1)",
  gradientcolor8: "rgba(109, 97, 27, 1)",

  gradientcolor9: "rgba(73, 73, 73, 1)",
  gradientcolor10: "rgba(56, 56, 56, 1)",

  gradientcolor11: "rgba(207, 194, 2, 1)",
  gradientcolor12: "rgba(71, 70, 6, 1)",
};

export const DIGIGOLD_COLORS = {
  primary: "rgba(100, 170, 255, 1)",
  primaryDark: "rgba(70, 140, 220, 1)",        // Darker blue variant
  accent: "rgba(240, 120, 255, 1)",
  background: "rgba(18, 18, 18, 1)",           // Dark background
  surface: "rgba(28, 28, 28, 1)",              // Dark surface
  border: "rgba(60, 60, 60, 1)",               // Dark border
  textPrimary: "rgba(245, 245, 245, 1)",       // Light text
  textSecondary: "rgba(170, 170, 170, 1)",     // Medium light text
  success: "rgba(76, 175, 80, 1)",
  error: "rgba(244, 67, 54, 1)",
};



export const SIZES = {
  // Scalable font sizes
  fontLg: moderateScale(16),
  font: moderateScale(14),
  fontSm: moderateScale(13),
  fontXs: moderateScale(12),

  // Scalable radii
  radius_sm: moderateScale(8),
  radius: moderateScale(12),
  radius_lg: moderateScale(16),

  // Scalable spacing
  padding: moderateScale(16),
  margin: moderateScale(16),

  // Scalable headings
  h1: moderateScale(32),
  h2: moderateScale(28),
  h3: moderateScale(24),
  h4: moderateScale(20),
  h5: moderateScale(18),
  h6: moderateScale(16),

  // App dimensions
  width,
  height,
  container: moderateScale(800),
};

export const FONTS = {
  // Paragraph styles with scaling
  fontLg: {
    fontSize: SIZES.fontLg,
    color: COLORS.text,
    lineHeight: moderateScale(24),
    fontFamily: "Domine",
  },
  font: {
    fontSize: SIZES.font,
    color: COLORS.text,
    lineHeight: moderateScale(20),
    fontFamily: "Domine",
  },
  fontSm: {
    fontSize: SIZES.fontSm,
    color: COLORS.text,
    lineHeight: moderateScale(18),
    fontFamily: "Domine",
  },
  fontXs: {
    fontSize: SIZES.fontXs,
    color: COLORS.text,
    lineHeight: moderateScale(16),
    fontFamily: "Domine",
  },

  // Scalable headings
  h1: {
    fontSize: SIZES.h1,
    color: COLORS.title,
    fontFamily: "TrajanProBold",
    lineHeight: moderateScale(40),
  },
  h2: {
    fontSize: SIZES.h2,
    color: COLORS.title,
    fontFamily: "TrajanProBold",
    lineHeight: moderateScale(36),
  },
  h3: {
    fontSize: SIZES.h3,
    color: COLORS.title,
    fontFamily: "DMSerif",
    lineHeight: moderateScale(32),
  },
  h4: {
    fontSize: SIZES.h4,
    color: COLORS.title,
    fontFamily: "DMSerif",
    lineHeight: moderateScale(28),
  },
  h5: {
    fontSize: SIZES.h5,
    fontFamily: "DMSerif",
    lineHeight: moderateScale(26),
    color: COLORS.title,
  },
  h6: {
    fontSize: SIZES.h6,

    fontFamily: "DMSerif",
    lineHeight: moderateScale(24),
  },

  // Custom semantic roles
  heading: {
    fontFamily: "TrajanProBold",
    // lineHeight: moderateScale(25),
  },
  subheading: {
    fontFamily: "DMSerif",
    fontWeight: "500",
  },
  body: {
    fontFamily: "DancingScript",
    fontWeight: "600",
  },
  body1: {
    fontFamily: "Domine",
    fontWeight: "500",
  },
  fancy: {  
    fontFamily: "Fancy",
    // fontWeight: "700",
  },
};

// Export scaling functions
export { scale, verticalScale, moderateScale }

const appTheme = { COLORS, SIZES, FONTS, DIGIGOLD_COLORS, scale, verticalScale, moderateScale }

export default appTheme;