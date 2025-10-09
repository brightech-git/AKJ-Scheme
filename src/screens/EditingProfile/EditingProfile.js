import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { BackHeader, BottomTab } from '../../components';
import { StyleSheet } from 'react-native';
import { colors, scale } from '../../utils';

function EditingProfile() {
  const route = useRoute();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [nameError, setNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Gender options
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  // Handle gender selection
  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  useEffect(() => {
    // Pre-fill data from route params if available
    if (route.params?.profile) {
      const { name, phone, gender } = route.params.profile;
      setName(name || '');
      setPhone(phone || '');
      setGender(gender || '');
    }
  }, [route.params]);

  function validateFields() {
    let valid = true;
    setNameError(null);
    setPhoneError(null);

    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    }

    if (!phone.trim()
        || phone.length < 10) {
            setPhoneError('Valid phone number is required');
            valid = false;
          }
      
          return valid;
        }
      
        function handleSubmit() {
          if (validateFields()) {
            Alert.alert('Profile Updated', 'Your profile has been successfully updated.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          }
        }
      
        return (
          <SafeAreaView style={styles.container}>
            {/* Back Header */}
            <BackHeader title="Edit Profile" backPressed={() => navigation.goBack()} />
      
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}>
              <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.profileTitle}>Complete Your Profile</Text>
                <Text style={styles.profileSubtitle}>
                  Don’t worry, only you can see your personal data. No one else will be able to see it.
                </Text>
      
                <View style={styles.profileImageContainer}>
                  <FontAwesome name="user-circle" size={60} color="#CCCCCC" />
                  <TouchableOpacity style={styles.editIcon}>
                    <FontAwesome name="pencil" size={16} color={colors.white} />
                  </TouchableOpacity>
                </View>
      
                {/* Form Section */}
                <View style={styles.formContainer}>
                  {/* Name Input */}
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                    onBlur={() => {
                      if (!name.trim()) setNameError('Name is required');
                    }}
                  />
                  {nameError && <Text style={styles.errorText}>{nameError}</Text>}
      
                  {/* Phone Input */}
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.phoneContainer}>
                    <Text style={styles.countryCode}>+1</Text>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="Enter phone number"
                      value={phone}
                      keyboardType="phone-pad"
                      onChangeText={setPhone}
                      onBlur={() => {
                        if (!phone.trim() || phone.length < 10) {
                          setPhoneError('Valid phone number is required');
                        }
                      }}
                    />
                  </View>
                  {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
      
                  {/* Gender Dropdown */}
                  <Text style={styles.label}>Gender</Text>
                  <View>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                      <Text style={styles.dropdownText}>{gender || 'Select Gender'}</Text>
                      <FontAwesome name="caret-down" size={16} color="#777" />
                    </TouchableOpacity>
                    {isDropdownOpen && (
                      <View style={styles.dropdownList}>
                        {genderOptions.map((option, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleGenderSelect(option)}>
                            <Text style={styles.dropdownItemText}>{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
      
                {/* Submit Button */}
                <TouchableOpacity style={styles.completeProfileButton} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Complete Profile</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
      
            {/* BottomTab */}
            <BottomTab screen="PROFILE" />
          </SafeAreaView>
        );
      }




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  profileSubtitle: {
    fontSize: 14,
    color: colors.fontThirdColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    marginBottom: 30,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.grayLinesColor,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  editIcon: {
    position: 'absolute',
    bottom: -5,
    right: -7,
    backgroundColor: colors.greenColor,
    borderRadius: 20,
    padding: 5,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 8,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.grayLinesColor,
    borderRadius: 8,
    marginBottom: 20,
    height: scale(45),
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayLinesColor,
    borderRadius: 8,
    marginBottom: 20,
    height: scale(45),
  },
  countryCode: {
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: colors.fontSecondColor,
    fontSize: 14,
    color: colors.fontMainColor,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.fontMainColor,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    backgroundColor: colors.white,
    height: scale(45),
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: colors.grayLinesColor,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginTop: 5,
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLinesColor,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.fontMainColor,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },
  completeProfileButton: {
    width: '100%',
    backgroundColor: colors.greenColor,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

      
export default EditingProfile;
      