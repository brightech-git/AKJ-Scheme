import React from 'react';
import { ScrollView, View, SafeAreaView, StatusBar, Image, ImageBackground, StyleSheet, Dimensions, Linking, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TextDefault } from '../../components';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import { COLORS, SIZES, FONTS } from '../../utils/Theme';

const CONTENT = {
  hero: {
    title: "AKJ Mini Gold Souk",
    subtitle: "Take a memory home with a jewelry"
  },
  whoWeAre: {
    title: "WHO WE ARE",
    description: "Founded from art inspiration and elegance fashion.",
    content: [
      "AKJ Mini Gold Souk is a retail business establishment, that specializes in selling (and also buying) jewellery. Founded from art inspiration and elegance fashion, AKJ Gold Souk has built its reputation on the quality of the products they offer to its customers.",
      "With a traditional background but with a modern approach to business, AKJ Mini Gold Souk strives to provide the highest quality products for its customers."
    ]
  },
  professionalJeweler: {
    title: "Professional Jeweler",
    description: "Finest materials in crafting beautiful pieces to the most exquisite designs"
  },
  whyChooseUs: {
    title: "WHY CHOOSE US",
    subtitle: "Bright and shiny jewellery made just for you",
    description: "If you are looking to buy gold or sell gold, you have come to the right place.",
    features: [
      {
        icon: 'design-services',
        title: 'Elegant Designs',
        description: 'AKJ Mini Gold Souk brings to you a wide array of exquisite & handcrafted designs with a perfect fusion of eastern & western jewellery.',
        color: COLORS.primary
      },
      {
        icon: 'verified',
        title: 'Finest Purity',
        description: 'The Finest Purity Gold; 99.99% for all our Gold Jewellery. AKJ Mini Gold Souk is a personality driven brand of gold jewellery',
        color: COLORS.success
      },
      {
        icon: 'groups',
        title: 'Industry Experts',
        description: 'At AKJ Mini Gold Souk, we have a team of industry experts who are always there to help you, with the right product at the right time.',
        color: COLORS.secondary
      },
      {
        icon: 'diamond',
        title: 'Exclusive Jewellery',
        description: 'Finest Gold For Finest Movement. AKJ Mini Gold Souk is a unique gold jewellery store, dedicated to fine jewellery and its making.',
        color: COLORS.warning
      }
    ]
  },
  exclusiveJewellery: {
    title: "Exclusive Jewellery",
    subtitle: "Finest Gold For Finest Movement",
    description: "AKJ Mini Gold Souk is a unique gold jewellery store, dedicated to fine jewellery and its making. We aim to be the ultimate destination for all your gold & jewellery needs."
  },
  contact: {
    title: "Get In Touch",
    phone: "+91-XXXXXXXXXX",
    email: "info@akjgoldsouk.com",
    address: "Your Store Address Here"
  }
};

const AboutPage = () => {
  const navigation = useNavigation();
  const { height, width } = Dimensions.get('window');

  const handleContactPress = (type, value) => {
    switch (type) {
      case 'phone':
        Linking.openURL(`tel:${value}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      case 'address':
        // You can implement map opening logic here
        break;
      default:
        break;
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg7.jpg')}
      style={[styles.background, { width, height }]}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        <CommonHeader title="About Us" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            
              <TextDefault style={[FONTS.h3, styles.heroTitle]}>
                {CONTENT.hero.title}
              </TextDefault>
              <TextDefault style={[FONTS.h4, styles.heroSubtitle]}>
                {CONTENT.hero.subtitle}
              </TextDefault>
           
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <LinearGradient
              colors={COLORS.gradientPrimary}
              style={styles.logoGradient}
            >
              <Image
                source={require('../../assets/image/icon2.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>

          {/* Who We Are Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="business" size={SIZES.h5} color={COLORS.primary} />
              <TextDefault style={[FONTS.h4, styles.sectionTitle]}>
                {CONTENT.whoWeAre.title}
              </TextDefault>
            </View>
            <TextDefault style={[FONTS.h5, styles.sectionSubtitle]}>
              {CONTENT.whoWeAre.description}
            </TextDefault>
            {CONTENT.whoWeAre.content.map((text, index) => (
              <TextDefault key={index} style={[FONTS.font, styles.sectionContent]}>
                {text}
              </TextDefault>
            ))}
          </View>

          {/* Professional Jeweler Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="workspace-premium" size={SIZES.h5} color={COLORS.primary} />
              <TextDefault style={[FONTS.h4, styles.sectionTitle]}>
                {CONTENT.professionalJeweler.title}
              </TextDefault>
            </View>
            <LinearGradient
              colors={[COLORS.warning + '15', COLORS.transparent]}
              style={styles.professionalGradient}
            >
              <TextDefault style={[FONTS.h5, styles.professionalText]}>
                {CONTENT.professionalJeweler.description}
              </TextDefault>
            </LinearGradient>
          </View>

          {/* Why Choose Us Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="star" size={SIZES.h5} color={COLORS.primary} />
              <TextDefault style={[FONTS.h4, styles.sectionTitle]}>
                {CONTENT.whyChooseUs.title}
              </TextDefault>
            </View>
            <TextDefault style={[FONTS.h5, styles.sectionSubtitle]}>
              {CONTENT.whyChooseUs.subtitle}
            </TextDefault>
            <TextDefault style={[FONTS.font, styles.sectionContent]}>
              {CONTENT.whyChooseUs.description}
            </TextDefault>
            
            {CONTENT.whyChooseUs.features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <LinearGradient
                  colors={[feature.color + '15', COLORS.transparent]}
                  style={styles.featureGradient}
                >
                  <View style={[styles.featureIcon, { backgroundColor: feature.color + '30' }]}>
                    <MaterialIcons name={feature.icon} size={SIZES.h5} color={feature.color} />
                  </View>
                  <View style={styles.featureContent}>
                    <TextDefault style={[FONTS.h5, styles.featureTitle]}>
                      {feature.title}
                    </TextDefault>
                    <TextDefault style={[FONTS.fontSm, styles.featureDescription]}>
                      {feature.description}
                    </TextDefault>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>

          {/* Exclusive Jewellery Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="diamond" size={SIZES.h5} color={COLORS.primary} />
              <TextDefault style={[FONTS.h4, styles.sectionTitle]}>
                {CONTENT.exclusiveJewellery.title}
              </TextDefault>
            </View>
            <TextDefault style={[FONTS.h5, styles.sectionSubtitle]}>
              {CONTENT.exclusiveJewellery.subtitle}
            </TextDefault>
            <LinearGradient
              colors={COLORS.gradientPrimary}
              style={styles.exclusiveGradient}
            >
              <TextDefault style={[FONTS.h5, styles.exclusiveText]}>
                {CONTENT.exclusiveJewellery.description}
              </TextDefault>
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.padding * 2,
  },
  heroSection: {
    marginBottom: SIZES.margin,
  },
  heroGradient: {
    padding: SIZES.padding * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.padding * 0.5,
  },
  heroSubtitle: {
    color: COLORS.goldtext,
    textAlign: 'center',
    opacity: 0.9,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    marginBottom: SIZES.margin,
  },
  logoGradient: {
    width: SIZES.width * 0.2,
    height: SIZES.width * 0.2,
    borderRadius: SIZES.radius_lg,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: SIZES.width * 0.15,
    height: SIZES.width * 0.15,
    borderRadius: SIZES.radius_lg,
  },
  section: {
    backgroundColor: COLORS.card,
    marginBottom: SIZES.margin,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    marginLeft: SIZES.padding * 0.5,
    color: COLORS.text,
  },
  sectionSubtitle: {
    marginBottom: SIZES.padding * 0.75,
    color: COLORS.goldtext1,
    textAlign: 'center',
  },
  sectionContent: {
    marginBottom: SIZES.padding * 0.75,
    textAlign: 'justify',
    lineHeight: SIZES.font * 1.4,
    color: COLORS.goldtext,
  },
  professionalGradient: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  professionalText: {
    color: COLORS.goldtext,
    textAlign: 'center',
    fontWeight: '600',
  },
  featureCard: {
    marginBottom: SIZES.padding,
  },
  featureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  featureIcon: {
    width: SIZES.width * 0.1,
    height: SIZES.width * 0.1,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  featureTitle: {
    marginBottom: SIZES.radius_sm * 0.5,
    color: COLORS.text,
  },
  featureDescription: {
    lineHeight: SIZES.font * 1.2,
    color: COLORS.textLight,
  },
  exclusiveGradient: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  exclusiveText: {
    color: COLORS.goldtext,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding * 0.5,
  },
  contactText: {
    marginLeft: SIZES.padding,
    color: COLORS.text,
  },
});

export default AboutPage;