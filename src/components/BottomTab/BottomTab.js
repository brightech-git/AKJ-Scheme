import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Remove SimpleLineIcons as it's no longer needed for these icons
import styles from './styles';

import { scale, colors } from '../../utils';
import { colors1 } from '../../utils/colors';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
function BottomTab({ screen }) {
  const navigation = useNavigation();
 
  const getIconColor = (currentScreen) => {
    return screen === currentScreen ? colors1.primaryText : colors.darkGrayText;
  };

  const getTextStyle = (currentScreen) => {
    return screen === currentScreen ? styles.activeText : styles.inactiveText;
  };

  return (
    <View style={styles.footerContainer}>
      {/* Home Icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MainLanding')}
        style={styles.footerBtnContainer}
      >
        <MaterialCommunityIcons
          name="home" // Solid green icon
          size={scale(20)}
          color={getIconColor('HOME')}
        />
        <Text style={getTextStyle('HOME')}>Home</Text>
      </TouchableOpacity>

      {/* Cart Icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MyScheme')}
        style={styles.footerBtnContainer}
      >
        <View style={styles.imgContainer}>
          <SimpleLineIcons
            name="badge" // Solid green icon
            size={scale(20)}
            color={getIconColor('SCHEMES')}
          />

        </View>
        <Text style={getTextStyle('SCHEMES')}>Schemes</Text>
      </TouchableOpacity>

      {/* Favourites Icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate('GoldPlanScreen')}
        style={styles.footerBtnContainer}
      >
        <MaterialCommunityIcons
          name="star"
          size={scale(20)}
          color={getIconColor('GOLDPLANS')}
        />
        <Text style={getTextStyle('GOLDPLANS')}>Gold Plans</Text>
      </TouchableOpacity>
      
     

      {/* Profile Icon */}
      {/* <TouchableOpacity
        onPress={() => {
         
            navigation.navigate('ProfileDashboard');
         
        }}
        style={styles.footerBtnContainer}
      >
        <View style={styles.profileContainer}>
          <MaterialCommunityIcons
            name="menu"
            size={scale(20)}
            color={getIconColor('PROFILE')}
          />
          
        </View>
        <Text style={getTextStyle('PROFILE')}>Menu</Text>
      </TouchableOpacity> */}
    </View>
  );
}

export default BottomTab;
