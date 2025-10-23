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
      title: "Who We Are",
      icon: "info",
      content: "Our website address is: https://akjminigoldsouk.com.",
      subsections: []
    },
    {
      title: "Comments",
      icon: "comment",
      content: "When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.",
      subsections: [
        {
          title: "Gravatar Service",
          content: "An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment."
        }
      ]
    },
    {
      title: "Media",
      icon: "image",
      content: "If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.",
      subsections: []
    },
    {
      title: "Cookies",
      icon: "cookie",
      content: "We use cookies to enhance your experience on our website:",
      subsections: [
        {
          title: "Comment Cookies",
          content: "If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year."
        },
        {
          title: "Login Cookies",
          content: "If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser."
        },
        {
          title: "Session Cookies",
          content: "When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select 'Remember Me', your login will persist for two weeks. If you log out of your account, the login cookies will be removed."
        },
        {
          title: "Editing Cookies",
          content: "If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day."
        }
      ]
    },
    {
      title: "Embedded Content",
      icon: "web",
      content: "Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.",
      subsections: [
        {
          title: "Third-Party Tracking",
          content: "These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website."
        }
      ]
    },
    {
      title: "Who We Share Your Data With",
      icon: "share",
      content: "We are committed to protecting your data and only share it when necessary:",
      subsections: [
        {
          title: "Password Reset",
          content: "If you request a password reset, your IP address will be included in the reset email."
        },
        {
          title: "Spam Detection",
          content: "Visitor comments may be checked through an automated spam detection service."
        }
      ]
    },
    {
      title: "How Long We Retain Your Data",
      icon: "schedule",
      content: "We retain your data only for as long as necessary:",
      subsections: [
        {
          title: "Comments",
          content: "If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue."
        },
        {
          title: "User Accounts",
          content: "For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information."
        }
      ]
    },
    {
      title: "Your Data Rights",
      icon: "security",
      content: "You have significant control over your personal data:",
      subsections: [
        {
          title: "Data Access and Portability",
          content: "If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us."
        },
        {
          title: "Data Erasure",
          content: "You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes."
        }
      ]
    },
    {
      title: "Where Your Data Is Sent",
      icon: "public",
      content: "Visitor comments may be checked through an automated spam detection service.",
      subsections: []
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('../../assets/bg7.jpg')}
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
              At AKJ Mini Gold Souk, we value your privacy and are committed to protecting your personal information. 
              This policy outlines how we collect, use, and safeguard your data in compliance with applicable privacy laws.
            </Text>
          </View>

          {/* Policy Sections */}
          {policySections.map((section, index) => (
            <View key={index} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.iconContainer}>
                  <Icon name={section.icon} size={24} color={COLORS.goldtext} />
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

          {/* External Links */}
          <View style={styles.linksCard}>
            <Text style={styles.linksTitle}>External Privacy Policies</Text>
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => handleExternalLink("https://automattic.com/privacy/")}
            >
              <Icon name="open-in-new" size={20} color={COLORS.goldtext} />
              <Text style={styles.linkText}>Gravatar Service Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Icon name="verified-user" size={32} color={COLORS.goldtext} />
            <Text style={styles.securityText}>Your Data is Protected with Industry-Standard Security Measures</Text>
          </View>

          {/* Additional Information */}
          <View style={styles.additionalInfo}>
            <Text style={styles.infoTitle}>Contact Information</Text>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Icon name="language" size={20} color={COLORS.goldtext} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoItemTitle}>Website</Text>
                <TouchableOpacity onPress={() => handleExternalLink("https://akjminigoldsouk.com")}>
                  <Text style={styles.link}>https://akjminigoldsouk.com</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Icon name="support-agent" size={20} color={COLORS.goldtext} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoItemTitle}>Privacy Questions</Text>
                <Text style={styles.infoItemContent}>For privacy-related questions or to exercise your data rights, please contact our support team.</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Icon name="update" size={20} color={COLORS.goldtext} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoItemTitle}>Policy Updates</Text>
                <Text style={styles.infoItemContent}>We may update this policy periodically. Please check back for changes. Last updated: {new Date().toLocaleDateString()}</Text>
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
            <Icon name="done-all" size={24} color={COLORS.goldtext} />
            <Text style={styles.consentText}>
              By using our services, you consent to our privacy policy.
            </Text>
          </LinearGradient>

          {/* Copyright */}
          <View style={styles.copyright}>
            <Text style={styles.copyrightText}>© {new Date().getFullYear()} AKJ Mini Gold Souk. All rights reserved.</Text>
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
  backgroundImage: {
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
    color: COLORS.goldtext,
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
    color: COLORS.text,
    flex: 1,
  },
  sectionContent: {
    ...FONTS.font,
    color: COLORS.goldtext,
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
    backgroundColor: COLORS.goldtext,
    marginRight: SIZES.margin,
  },
  subsectionTitle: {
    ...FONTS.font,
    color: COLORS.text,
    fontWeight: '600',
  },
  subsectionContent: {
    ...FONTS.font,
    color: COLORS.goldtext,
    lineHeight: verticalScale(24),
    paddingLeft: SIZES.padding,
  },
  linksCard: {
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
  linksTitle: {
    ...FONTS.h5,
    color: COLORS.text,
    marginBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    paddingBottom: verticalScale(10),
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  linkText: {
    ...FONTS.font,
    color: COLORS.goldtext,
    textDecorationLine: 'underline',
    marginLeft: SIZES.margin,
    fontWeight: '500',
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
    color: COLORS.goldtext,
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
    color: COLORS.text,
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
    color: COLORS.text,
    marginBottom: verticalScale(5),
    fontWeight: '600',
  },
  infoItemContent: {
    ...FONTS.font,
    color: COLORS.goldtext,
    lineHeight: verticalScale(24),
  },
  link: {
    ...FONTS.font,
    color: COLORS.goldtext,
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