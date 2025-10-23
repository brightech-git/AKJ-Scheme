import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  ImageBackground
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, SIZES, FONTS, scale, verticalScale, moderateScale } from '../../utils/Theme'
import CommonHeader from '../../components/CommonHeader/CommonHeader'
import { BottomTab } from '../../components'

const { width } = Dimensions.get('window')
const SUPPORT_NUMBER = '919514333601'

function HelpCenterPage() {
  const handlePhoneCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`)
  }

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`)
  }

  const handleOpenMap = () => {
    const address = 'Old # 52, New # 68, Ellis Road, Mount Road, Chennai 600002, Tamilnadu, India'
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    Linking.openURL(url)
  }

  const handleWhatsApp = (message) => {
    const url = `https://wa.me/${SUPPORT_NUMBER}?text=${encodeURIComponent(message)}`
    Linking.openURL(url).catch(() => {
      alert('Make sure WhatsApp is installed')
    })
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/bg7.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <CommonHeader title="Help Center" subtitle="We're here to help you" />
        
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Contact Cards */}
          <View style={styles.cardsContainer}>
            {/* Phone Numbers Card */}
            <LinearGradient
              colors={[COLORS.background, COLORS.surfaceVariant]}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, styles.phoneIconContainer]}>
                  <Icon name='phone' size={24} color={COLORS.goldtext} />
                </View>
                <Text style={styles.cardTitle}>Phone Numbers</Text>
              </View>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handlePhoneCall('04442157157')}
              >
                <Text style={styles.contactText}>044 42 157 157</Text>
                <Icon name='call' size={20} color={COLORS.goldtext} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handlePhoneCall('04428588888')}
              >
                <Text style={styles.contactText}>044 2858 8888</Text>
                <Icon name='call' size={20} color={COLORS.goldtext} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handlePhoneCall('04428580506')}
              >
                <Text style={styles.contactText}>044 2858 0506</Text>
                <Icon name='call' size={20} color={COLORS.goldtext} />
              </TouchableOpacity>
            </LinearGradient>

            {/* Email Card */}
            <LinearGradient
              colors={[COLORS.background, COLORS.surfaceVariant]}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, styles.emailIconContainer]}>
                  <Icon name='email' size={24} color={COLORS.goldtext} />
                </View>
                <Text style={styles.cardTitle}>Email Address</Text>
              </View>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handleEmail('care@akjminigoldsouk.com')}
              >
                <Text style={styles.contactText}>care@akjminigoldsouk.com</Text>
                <Icon name='mail-outline' size={20} color={COLORS.goldtext} />
              </TouchableOpacity>
            </LinearGradient>

            {/* Office Address Card */}
            <LinearGradient
              colors={[COLORS.background, COLORS.surfaceVariant]}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[styles.iconContainer, styles.locationIconContainer]}
                >
                  <Icon name='location-on' size={24} color={COLORS.goldtext} />
                </View>
                <Text style={styles.cardTitle}>Office Address</Text>
              </View>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={handleOpenMap}
              >
                <View style={styles.addressContainer}>
                  <Text style={styles.contactText}>
                    AKJ Mini Gold Souk
                  </Text>
                  <Text style={styles.contactText}>
                    Old # 52, New # 68, Ellis Road
                  </Text>
                  <Text style={styles.contactText}>
                    Mount Road, Chennai 600002
                  </Text>
                  <Text style={styles.contactText}>
                    Tamilnadu, India
                  </Text>
                </View>
                <Icon name='place' size={20} color={COLORS.goldtext} />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Support Hours */}
          <View style={styles.hoursContainer}>
            <Text style={styles.hoursTitle}>Customer Support Hours</Text>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Monday - Saturday</Text>
              <Text style={styles.hoursTime}>10:00 AM - 6:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Sunday</Text>
              <Text style={styles.hoursTime}>11:00 AM - 4:00 PM</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <Text style={styles.actionsTitle}>Quick Actions</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  handleWhatsApp('Hello! I need help via Live Chat.')
                }
              >
                <Icon name='chat' size={24} color={COLORS.goldtext} />
                <Text style={styles.actionText}>Live Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleWhatsApp('I would like to see the FAQs.')}
              >
                <Icon name='help-outline' size={24} color={COLORS.goldtext} />
                <Text style={styles.actionText}>FAQs</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handlePhoneCall('04442157157')}
              >
                <Icon name='description' size={24} color={COLORS.goldtext} />
                <Text style={styles.actionText}>Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
      <BottomTab />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    // backgroundColor: COLORS.background 
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  scrollContainer: { 
    flexGrow: 1,
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(10)
  },
  cardsContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: verticalScale(25),
    marginTop: verticalScale(10)
  },
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: verticalScale(16),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    backgroundColor: COLORS.background
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
    paddingBottom: verticalScale(12)
  },
  iconContainer: {
    width: scale(44),
    height: scale(44),
    borderRadius: SIZES.radius_sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12)
  },
  phoneIconContainer: { 
    backgroundColor: COLORS.primaryLight 
  },
  emailIconContainer: { 
    backgroundColor: COLORS.primaryLight 
  },
  locationIconContainer: { 
    backgroundColor: COLORS.primaryLight 
  },
  cardTitle: {
    ...FONTS.h5,
    color: COLORS.goldtext
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight
  },
  contactText: {
    ...FONTS.font,
    color: COLORS.text,
    flex: 1,
    marginRight: scale(10)
  },
  addressContainer: { 
    flex: 1 
  },
  hoursContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginBottom: verticalScale(25),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor
  },
  hoursTitle: {
    ...FONTS.h5,
    color: COLORS.goldtext,
    marginBottom: verticalScale(16),
    textAlign: 'center'
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight
  },
  hoursDay: {
    ...FONTS.font,
    color: COLORS.text,
    fontWeight: '500'
  },
  hoursTime: { 
    ...FONTS.font, 
    color: COLORS.goldtext1, 
    fontWeight: '600' 
  },
  actionsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor
  },
  actionsTitle: {
    ...FONTS.h5,
    color: COLORS.goldtext,
    marginBottom: verticalScale(16),
    textAlign: 'center'
  },
  actionsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
  },
  actionButton: {
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radius_sm,
    width: width * 0.25,
    minHeight: verticalScale(80),
    justifyContent: 'center'
  },
  actionText: {
    ...FONTS.fontSm,
    color: COLORS.goldtext1,
    marginTop: verticalScale(8),
    textAlign: 'center',
    fontWeight: '600'
  }
})

export default HelpCenterPage