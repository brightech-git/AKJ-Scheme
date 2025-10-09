import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Dimensions,
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import appTheme from '../../utils/Theme';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

const { COLORS, SIZES, FONTS, scale, verticalScale } = appTheme;

const { width } = Dimensions.get('window');

const PrivacyPolicyPage = () => {
  const handleExternalLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const policySections = [
    {
      title: "Information We Collect",
      icon: "person",
      content: "Personal identification details (name, email, phone number, etc.), device information and browsing history, location and IP address."
    },
    {
      title: "How We Use Your Data",
      icon: "data-usage",
      content: "To improve our services and personalize your experience, to communicate offers, promotions, or important updates, for analytics and security enhancement."
    },
    {
      title: "What We Don't Do",
      icon: "block",
      content: "We do not sell your personal information. We do not track your location without consent."
    },
    {
      title: "Data Sharing",
      icon: "share",
      content: "",
      subsections: [
        {
          title: "We Do Not Share With",
          content: "Unaffiliated third parties, social media platforms"
        },
        {
          title: "We May Share With",
          content: "Trusted service providers, legal authorities (when required)"
        }
      ]
    },
    {
      title: "Security Note",
      icon: "security",
      content: "Your data is encrypted and securely stored as per industry standards. We employ the latest security measures to protect your information."
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
              source={require('../../assets/bg6.jpg')}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CommonHeader title={"Privacy Policy"} />

          {/* Introduction */}
          <View style={styles.introCard}>
            <Text style={styles.introText}>
              At BMG Jewellers, we value your privacy and are committed to protecting your personal information. 
              This policy outlines how we collect, use, and safeguard your data.
            </Text>
          </View>

          {/* Policy Sections */}
          {policySections.map((section, index) => (
            <View key={index} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconContainer}>
                  <Icon name={section.icon} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.sectionContent}>{section.content}</Text>
              
              {section.subsections && section.subsections.map((subsection, subIndex) => (
                <View key={subIndex} style={styles.subsection}>
                  <View style={styles.subsectionHeader}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                  </View>
                  <Text style={styles.subsectionContent}>{subsection.content}</Text>
                </View>
              ))}
            </View>
          ))}

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Icon name="verified-user" size={32} color={COLORS.primary} />
            <Text style={styles.securityText}>Your Data is Protected with 256-bit Encryption</Text>
          </View>

          {/* Additional Information */}
          <View style={styles.additionalInfo}>
            <Text style={styles.infoTitle}>Additional Information</Text>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Icon name="language" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoItemTitle}>Website</Text>
                <TouchableOpacity onPress={() => handleExternalLink("https://bmgjewellers.com")}>
                  <Text style={styles.link}>https://bmgjewellers.com</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Icon name="support-agent" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoItemTitle}>Contact</Text>
                <Text style={styles.infoItemContent}>For privacy-related questions, please contact our support team at Contact@bmgjewellers.in</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Icon name="update" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoItemTitle}>Policy Updates</Text>
                <Text style={styles.infoItemContent}>We may update this policy periodically. Please check back for changes.</Text>
              </View>
            </View>
          </View>

          {/* Consent Footer */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.consentFooter}
          >
            <Icon name="done-all" size={24} color={COLORS.white} />
            <Text style={styles.consentText}>
              By using our services, you consent to our privacy policy.
            </Text>
          </LinearGradient>

          {/* Copyright */}
          <View style={styles.copyright}>
            <Text style={styles.copyrightText}>© {new Date().getFullYear()} BMG Jewellers. All rights reserved.</Text>
          </View>
        </ScrollView>
    </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  introCard: {
    backgroundColor: COLORS.card1,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginBottom: verticalScale(20),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  introText: {
    ...FONTS.font,
    color: COLORS.text,
    lineHeight: verticalScale(24),
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: COLORS.card1,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginBottom: verticalScale(15),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    paddingBottom: verticalScale(10),
  },
  iconContainer: {
    width: SIZES.padding,
    height: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.margin,
  },
  sectionTitle: {
    ...FONTS.h5,
    color: COLORS.primary,
    flex: 1,
  },
  sectionContent: {
    ...FONTS.font,
    color: COLORS.text,
    lineHeight: verticalScale(24),
    marginBottom: verticalScale(10),
  },
  subsection: {
    marginTop: verticalScale(10),
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
  bulletPoint: {
    width: SIZES.fontSm,
    height: SIZES.fontSm,
    borderRadius: SIZES.radius_sm,
    backgroundColor: COLORS.primary,
    marginRight: SIZES.margin,
  },
  subsectionTitle: {
    ...FONTS.font,
    color: COLORS.primary,
  },
  subsectionContent: {
    ...FONTS.font,
    color: COLORS.text,
    lineHeight: verticalScale(24),
    paddingLeft: SIZES.padding,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  securityText: {
    ...FONTS.font,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SIZES.margin,
    flex: 1,
  },
  additionalInfo: {
    backgroundColor: COLORS.card1,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginBottom: verticalScale(15),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  infoTitle: {
    ...FONTS.h5,
    color: COLORS.primary,
    marginBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    paddingBottom: verticalScale(10),
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: verticalScale(15),
  },
  infoIcon: {
    width: SIZES.fontLg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.margin,
  },
  infoContent: {
    flex: 1,
  },
  infoItemTitle: {
    ...FONTS.font,
    color: COLORS.primary,
    marginBottom: verticalScale(5),
  },
  infoItemContent: {
    ...FONTS.font,
    color: COLORS.text,
    lineHeight: verticalScale(24),
  },
  link: {
    ...FONTS.font,
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  consentFooter: {
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  consentText: {
    ...FONTS.font,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: SIZES.margin,
  },
  copyright: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    paddingHorizontal: SIZES.padding,
  },
  copyrightText: {
    ...FONTS.fontSm,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default PrivacyPolicyPage;