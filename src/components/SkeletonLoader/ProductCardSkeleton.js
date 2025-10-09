import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import { scale, verticalScale, colors } from '../../utils';

const ProductCardSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonLoader width={scale(120)} height={verticalScale(20)} style={styles.darkSkeleton} />
        <SkeletonLoader width={scale(80)} height={verticalScale(20)} style={styles.lightSkeleton} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.row}>
          <SkeletonLoader width={scale(100)} height={verticalScale(15)} style={styles.mediumSkeleton} />
          <SkeletonLoader width={scale(80)} height={verticalScale(15)} style={styles.lightSkeleton} />
        </View>
        
        <View style={styles.row}>
          <SkeletonLoader width={scale(120)} height={verticalScale(15)} style={styles.mediumSkeleton} />
          <SkeletonLoader width={scale(90)} height={verticalScale(15)} style={styles.lightSkeleton} />
        </View>
        
        <View style={styles.row}>
          <SkeletonLoader width={scale(140)} height={verticalScale(15)} style={styles.mediumSkeleton} />
          <SkeletonLoader width={scale(70)} height={verticalScale(15)} style={styles.lightSkeleton} />
        </View>
      </View>
      
      <View style={styles.footer}>
        <SkeletonLoader width={scale(100)} height={verticalScale(40)} style={styles.darkSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(15),
    backgroundColor: colors.whiteColor,
    borderRadius: 10,
    marginVertical: verticalScale(8),
    marginHorizontal: scale(10),
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(15),
  },
  content: {
    marginBottom: verticalScale(15),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  footer: {
    alignItems: 'center',
  },
  darkSkeleton: {
    backgroundColor: colors.brownColor,
  },
  mediumSkeleton: {
    backgroundColor: colors.lightpink,
  },
  lightSkeleton: {
    backgroundColor: colors.lightyellow,
  },
});

export default ProductCardSkeleton; 