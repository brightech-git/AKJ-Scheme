import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS, SIZES, scale, verticalScale, moderateScale } from '../../utils/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CommonHeader = ({
  title,
  subtitle = null,
  showBack = true,
  rightComponent = null,
  leftComponent = null,
  onBackPress = null,
  backgroundColor = COLORS.transparent,
  textColor = COLORS.title,
  transparent = false,
  elevated = true,
  animated = true,
  centerTitle = true,
  backIconName = 'arrow-back',
  backIconColor = COLORS.white,
  statusBarStyle = 'dark-content',
  style = {},
}) => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(animated ? -50 : 0)).current;
  const fadeAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animated]);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const containerStyle = [
    styles.container,
    transparent && styles.transparentContainer,
    elevated && styles.elevated,
    { backgroundColor: transparent ? 'transparent' : backgroundColor },
    style,
  ];

  const animatedStyle = animated
    ? {
        transform: [{ translateY: slideAnim }],
        opacity: fadeAnim,
      }
    : {};

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={transparent ? 'transparent' : backgroundColor}
        translucent={transparent}
      />
      <SafeAreaView edges={['top']} style={{ backgroundColor: transparent ? 'transparent' : backgroundColor }}>
        <Animated.View style={[containerStyle, animatedStyle]}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {leftComponent ? (
              leftComponent
            ) : showBack ? (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={backIconName} size={moderateScale(24)} color={backIconColor} />
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.leftPlaceholder} />
            )}
          </View>

          {/* Center Section */}
          <View style={[styles.centerSection, !centerTitle && styles.centerSectionLeft]}>
            <Text
              style={[styles.title, { color: textColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            {rightComponent || <View style={styles.rightPlaceholder} />}
          </View>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

// Enhanced Header with Search
export const SearchHeader = ({
  title,
  onSearchPress,
  onFilterPress,
  ...props
}) => {
  return (
    <CommonHeader
      title={title}
      rightComponent={
        <View style={styles.actionButtons}>
          {onSearchPress && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onSearchPress}
              activeOpacity={0.7}
            >
              <Ionicons name="search" size={moderateScale(22)} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          {onFilterPress && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onFilterPress}
              activeOpacity={0.7}
            >
              <Ionicons name="filter" size={moderateScale(22)} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      }
      {...props}
    />
  );
};

// Enhanced Header with Actions
export const ActionHeader = ({
  title,
  actions = [],
  ...props
}) => {
  return (
    <CommonHeader
      title={title}
      rightComponent={
        <View style={styles.actionButtons}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.iconButton}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={action.icon}
                size={moderateScale(22)}
                color={action.color || COLORS.primary}
              />
              {action.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{action.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      }
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  // elevated: {
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: COLORS.shadow,
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.1,
  //       shadowRadius: 4,
  //     },
  //     android: {
  //       elevation: 4,
  //     },
  //   }),
  // },

  // Sections
  leftSection: {
    width: moderateScale(50),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(8),
  },
  centerSectionLeft: {
    alignItems: 'flex-start',
  },
  rightSection: {
    width: moderateScale(50),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  // Icon Button
  iconButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(20),
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.primary,
  },

  // Placeholders
  leftPlaceholder: {
    width: moderateScale(40),
  },
  rightPlaceholder: {
    width: moderateScale(40),
  },

  // Text
  title: {
    ...FONTS.h5,
    fontSize: moderateScale(18),
    // fontWeight: '700',
    color: COLORS.title,
    letterSpacing: 0.3,
  },
  subtitle: {
    ...FONTS.fontSm,
    fontSize: moderateScale(12),
    color: COLORS.textLight,
    marginTop: verticalScale(2),
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },

  // Badge
  badge: {
    position: 'absolute',
    top: moderateScale(4),
    right: moderateScale(4),
    backgroundColor: COLORS.danger,
    borderRadius: moderateScale(10),
    minWidth: moderateScale(16),
    height: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(4),
  },
  badgeText: {
    ...FONTS.fontXs,
    fontSize: moderateScale(10),
    color: COLORS.white,
    // fontWeight: '700',
  },
});

export default CommonHeader;