
import { scale } from '../../utils/scaling';
import { colors } from '../../utils/colors';
import { Dimensions } from 'react-native';
import { alignment } from '../../utils';

const { width, height } = Dimensions.get('window');

export default {
  container: {
    width: width,
    height: height * 0.10,
    // backgroundColor: colors.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    width: '100%',
    height: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    ...alignment.MLxSmall
  },
  leftContainer: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Ensures it doesn't affect the layout
    // left: -10, // Stays pinned to the left
  },
  headerText: {

    fontSize: scale(18),
    textAlign: 'center', // Center the text
    position: 'absolute', // Makes the title independent of other elements
    left: '35%', // Centers the title horizontally
    transform: [{ translateX: -width * 0.15 }], // Adjust centering offset (based on width of left and right containers)
    color: colors.fontMainColor, // Optional: Customize text color
    
  },
  titleContainer: {
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'center',
  },
  rightContainer: {
    width: '15%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Prevents it from affecting layout
    right: 0, // Stays pinned to the right
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.grayLinesColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
