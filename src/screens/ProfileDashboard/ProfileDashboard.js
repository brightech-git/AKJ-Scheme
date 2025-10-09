import React, { useContext } from 'react';
import { View, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import styles from './ProfileContainer/styles';
import ProfileContainer from './ProfileContainer/ProfileContainer';
import { BottomTab, TextDefault } from '../../components';
// import CardContainer from './CardContainer/CardContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils';
import { MaterialIcons } from '@expo/vector-icons';
import { colors1 } from '../../utils/colors';

function ProfileDashboard(props) {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../assets/bg6.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        {/* <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors1.primaryText} />
        </TouchableOpacity> */}

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileContainer />
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomTab screen="PROFILE" />
      </SafeAreaView>
    </ImageBackground>
  );
}

export default ProfileDashboard;
