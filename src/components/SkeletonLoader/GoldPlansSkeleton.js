import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import { scale, verticalScale, colors } from '../../utils';

const GoldPlansSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonLoader width={scale(150)} height={verticalScale(25)} style={styles.darkSkeleton} />
        <SkeletonLoader width={scale(100)} height={verticalScale(20)} style={styles.lightSkeleton} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.planRow}>
          <SkeletonLoader width={scale(80)} height={verticalScale(80)} style={[styles.planIcon, styles.mediumSkeleton]} />
          <View style={styles.planDetails}>
            <SkeletonLoader width={scale(120)} height={verticalScale(20)} style={styles.darkSkeleton} />
            <SkeletonLoader width={scale(100)} height={verticalScale(15)} style={[styles.mediumSkeleton, styles.marginTop]} />
            <SkeletonLoader width={scale(80)} height={verticalScale(15)} style={[styles.lightSkeleton, styles.marginTop]} />
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.planRow}>
          <SkeletonLoader width={scale(80)} height={verticalScale(80)} style={[styles.planIcon, styles.mediumSkeleton]} />
          <View style={styles.planDetails}>
            <SkeletonLoader width={scale(120)} height={verticalScale(20)} style={styles.darkSkeleton} />
            <SkeletonLoader width={scale(100)} height={verticalScale(15)} style={[styles.mediumSkeleton, styles.marginTop]} />
            <SkeletonLoader width={scale(80)} height={verticalScale(15)} style={[styles.lightSkeleton, styles.marginTop]} />
          </View>
        </View>
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
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  content: {
    marginBottom: verticalScale(10),
  },
  planRow: {
    flexDirection: 'row',
    marginBottom: verticalScale(20),
  },
  planIcon: {
    borderRadius: 40,
  },
  planDetails: {
    marginLeft: scale(15),
    flex: 1,
  },
  marginTop: {
    marginTop: verticalScale(8),
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightBrown,
    marginVertical: verticalScale(15),
  },
  darkSkeleton: {
    backgroundColor: colors.btncolor,
  },
  mediumSkeleton: {
    backgroundColor: colors.lightpink,
  },
  lightSkeleton: {
    backgroundColor: colors.lightyellow,
  },
});

export default GoldPlansSkeleton; 