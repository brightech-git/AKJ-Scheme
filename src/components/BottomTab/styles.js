import { Dimensions, StyleSheet } from 'react-native';
import { verticalScale, scale } from '../../utils/scaling';
import { colors } from '../../utils';
import { colors1 } from '../../utils/colors';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  footerContainer: {
    width,
    height: height * 0.08,
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderTopWidth: 1,
    // borderTopColor: colors.lightGray,
    // paddingHorizontal: scale(10),
    
  },
  footerBtnContainer: {
    width: '25%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeText: {
    marginTop: verticalScale(4),
    color: colors1.primaryText,
    fontSize: 14,

    fontWeight: 'bold',
  },
  inactiveText: {
    marginTop: verticalScale(4),
    color: colors.darkGrayText,
    fontSize: 12,
  
    fontWeight: 'bold',
  },
  profileContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileBadge: {
    width: verticalScale(8),
    height: verticalScale(8),
    position: 'absolute',
    right: '25%',
    top: 0,
    backgroundColor: colors.greenColor,
    borderRadius: verticalScale(4),
  },
  badgeContainer: {
    position: 'absolute',
    top: -scale(5),
    right: -scale(10),
    backgroundColor: colors.redColor,
    borderRadius: scale(10),
    height: scale(16),
    width: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: scale(10),
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25, // Rounded container for the icons.
   
  },
});

export default styles;
