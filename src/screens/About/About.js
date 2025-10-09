import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TextDefault } from '../../components';
import { colors1 } from '../../utils/colors';

const AboutPage = () => {
  const navigation = useNavigation();

  const features = [
    {
      icon: 'diamond',
      title: 'Uncompromising Quality',
      description: 'We use only the finest materials and employ skilled artisans to create jewellery that stands the test of time.',
      color: '#FFD700'
    },
    {
      icon: 'handshake',
      title: 'Trust & Transparency',
      description: "For generations, we've built relationships based on honesty, with no hidden costs or compromises.",
      color: '#4A90E2'
    },
    {
      icon: 'auto-awesome',
      title: 'Heritage & Innovation',
      description: 'We honor traditional craftsmanship while embracing innovative designs for the modern customer.',
      color: '#9C27B0'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors1.primary} barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={colors1.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors1.textLight} />
        </TouchableOpacity>
        
        <TextDefault style={styles.headerTitle} H3>
          About BMG Jewellers
        </TextDefault>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Company Logo/Icon Section */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="storefront" size={60} color="#FFF" />
          </LinearGradient>
        </View>

        {/* Our Story Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="book" size={24} color={colors1.primary} />
            <TextDefault style={styles.sectionTitle} H4>Our Story</TextDefault>
          </View>
          <TextDefault style={styles.sectionContent} H6>
            BMG Jewellers began as a small, family-run business with a simple goal: to offer high-quality, genuine jewellery to the people of Madurai. What started as a humble endeavour has now grown into a trusted name, recognized for our dedication to craftsmanship, value, and customer care.
          </TextDefault>
          <TextDefault style={styles.sectionContent} H6>
            In a city known for its cultural richness and historic landmarks, BMG Jewellers has created a legacy of trust by offering fine jewellery that embodies both tradition and modern elegance.
          </TextDefault>
          <TextDefault style={styles.sectionContent} H6>
            Over the years, we have expanded our offerings while staying true to our core principles of fairness, transparency, and integrity. We take pride in the fact that we have built lasting relationships with our customers, many of whom continue to return to us for their special occasions and jewellery needs.
          </TextDefault>
        </View>

        {/* Our Craftsmanship Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="precision-manufacturing" size={24} color={colors1.primary} />
            <TextDefault style={styles.sectionTitle} H4>Our Craftsmanship</TextDefault>
          </View>
          <TextDefault style={styles.sectionContent} H6>
            Our master craftsmen blend traditional techniques with contemporary design, creating pieces that honor heritage while embracing modern aesthetics. Each jewellery item is meticulously crafted with attention to every detail.
          </TextDefault>
          <TextDefault style={styles.sectionContent} H6>
            We specialize in exquisite gold jewellery, brilliant diamonds, and vibrant precious stones, ensuring that every piece meets our rigorous standards of quality and beauty.
          </TextDefault>
          
          {/* BIS Certification Highlight */}
          <View style={styles.certificationBox}>
            <LinearGradient
              colors={['#E8F5E8', '#F0FFF0']}
              style={styles.certificationGradient}
            >
              <MaterialIcons name="verified" size={30} color="#4CAF50" />
              <TextDefault style={styles.certificationText} H6>
                Every item in our collection is crafted using <TextDefault style={styles.boldText}>92.5 BIS hallmark-certified silver</TextDefault>, ensuring purity, quality, and authenticity.
              </TextDefault>
            </LinearGradient>
          </View>
        </View>

        {/* Why Choose Us Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="star" size={24} color={colors1.primary} />
            <TextDefault style={styles.sectionTitle} H4>Why Choose Us</TextDefault>
          </View>
          
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <LinearGradient
                colors={[feature.color + '20', feature.color + '10']}
                style={styles.featureGradient}
              >
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '30' }]}>
                  <MaterialIcons name={feature.icon} size={24} color={feature.color} />
                </View>
                <View style={styles.featureContent}>
                  <TextDefault style={styles.featureTitle} H5>{feature.title}</TextDefault>
                  <TextDefault style={styles.featureDescription} H6>
                    {feature.description}
                  </TextDefault>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="flag" size={24} color={colors1.primary} />
            <TextDefault style={styles.sectionTitle} H4>Our Mission</TextDefault>
          </View>
          <View style={styles.missionBox}>
            <LinearGradient
              colors={colors1.gradientPrimary}
              style={styles.missionGradient}
            >
              <TextDefault style={styles.missionText} H5>
                At BMG Jewellers, our mission is to make high-quality, beautifully designed jewellery accessible to everyone.
              </TextDefault>
            </LinearGradient>
          </View>
          <TextDefault style={styles.sectionContent} H6>
            We believe in offering our customers genuine products without hidden costs or extra charges. Every item reflects our commitment to providing products that meet the highest standards in the industry.
          </TextDefault>
        </View>

        {/* Vision Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="visibility" size={24} color={colors1.primary} />
            <TextDefault style={styles.sectionTitle} H4>Our Vision</TextDefault>
          </View>
          <View style={styles.visionBox}>
            <LinearGradient
              colors={['#FFF8E1', '#FFFDE7']}
              style={styles.visionGradient}
            >
              <MaterialIcons name="trending-up" size={30} color="#FF9800" />
              <TextDefault style={styles.visionText} H6>
                As we continue to grow, our vision is to become a leading name in the jewellery industry, known for our unwavering commitment to quality, transparency, and customer satisfaction.
              </TextDefault>
            </LinearGradient>
          </View>
          <TextDefault style={styles.sectionContent} H6>
            We aim to expand our reach beyond Madurai, bringing our exceptional services and products to customers across South India and beyond, while always maintaining the same personal touch that has defined us since day one.
          </TextDefault>
        </View>

        {/* Our Promise Section */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="favorite" size={24} color={colors1.primary} />
            <TextDefault style={styles.sectionTitle} H4>Our Promise</TextDefault>
          </View>
          <View style={styles.promiseBox}>
            <LinearGradient
              colors={['#FFE0E6', '#FFF0F5']}
              style={styles.promiseGradient}
            >
              <MaterialIcons name="handshake" size={30} color="#E91E63" />
              <TextDefault style={styles.promiseText} H6>
                We promise to continue delivering exceptional value, maintaining the highest standards of craftsmanship, and upholding the trust that our customers have placed in us for generations.
              </TextDefault>
              <TextDefault style={[styles.promiseText, styles.boldText]} H6>
                Your satisfaction is our ultimate goal, and we strive to make every interaction with BMG Jewellers a memorable experience.
              </TextDefault>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  section: {
    backgroundColor: '#FFF',
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContent: {
    lineHeight: 24,
    color: '#555',
    marginBottom: 12,
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  certificationBox: {
    marginTop: 15,
  },
  certificationGradient: {
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  certificationText: {
    marginLeft: 15,
    flex: 1,
    lineHeight: 22,
    color: '#2E7D32',
  },
  featureCard: {
    marginBottom: 15,
  },
  featureGradient: {
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    marginLeft: 15,
    flex: 1,
  },
  featureTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  featureDescription: {
    color: '#555',
    lineHeight: 20,
  },
  missionBox: {
    marginBottom: 15,
  },
  missionGradient: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  missionText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  visionBox: {
    marginBottom: 15,
  },
  visionGradient: {
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  visionText: {
    marginLeft: 15,
    flex: 1,
    lineHeight: 22,
    color: '#E65100',
    fontWeight: '500',
  },
  promiseBox: {
    marginTop: 10,
  },
  promiseGradient: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  promiseText: {
    textAlign: 'center',
    lineHeight: 22,
    color: '#C2185B',
    marginTop: 10,
  },
};

export default AboutPage;