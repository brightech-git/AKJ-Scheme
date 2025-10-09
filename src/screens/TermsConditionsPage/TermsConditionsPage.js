import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { TextDefault } from '../../components';
import appTheme from '../../utils/Theme';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

const { COLORS, SIZES, FONTS } = appTheme;

const TermsConditionsPage = () => {
  const termsData = [
    {
      title: "1. Product Representation",
      content: [
        "Images are for reference only. Minor variations in color or finish may occur.",
        "All products are handcrafted, so slight irregularities are natural.",
        "For exact details, contact us before ordering."
      ]
    },
    {
      title: "2. Pricing",
      subtitle: "Currency & Taxes",
      content: [
        "All prices are in INR and inclusive of GST"
      ],
      subsections: [
        {
          title: "Price Changes",
          content: [
            "Prices may change without prior notice",
            "Final amount charged will be as displayed at checkout."
          ]
        }
      ]
    },
    {
      title: "3. Payments",
      content: [
        "We accept:",
        "• Online Payments",
        "• UPI",
        "• Debit/Credit Cards",
        "• Net Banking",
        "• Cash on Delivery (Selected PIN codes only)",
        "• ₹50 COD fee may apply"
      ]
    },
    {
      title: "4. Product Use & Care",
      content: [
        "Handle gold-polished jewellery with care. Avoid water & chemicals.",
        "Store in a dry pouch when not in use.",
        "No guarantee for polish durability; depends on usage.",
        "Ask us for maintenance tips to extend product life."
      ]
    },
    {
      title: "5. Limitation of Liability",
      content: [
        "We are not liable for:",
        "• Shipping delays or damage",
        "• Force majeure events",
        "• Improper use or care"
      ]
    },
    {
      title: "6. Intellectual Property",
      content: [
        "All content is © and the property of our brand. No part may be:",
        "• Copied or redistributed without permission",
        "• Used commercially",
        "• Altered or modified"
      ]
    },
    {
      title: "7. Governing Law",
      content: [
        "These terms are governed by Indian law.",
        "Disputes will be settled in Madurai, Tamil Nadu.",
        "Contact us before placing orders if you have any questions."
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/bg6.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CommonHeader title="Terms & Conditions" />
          
          <View style={styles.contentContainer}>
            {termsData.map((section, index) => (
              <View key={index} style={styles.section}>
                <TextDefault style={styles.sectionTitle}>{section.title}</TextDefault>
                
                {section.subtitle && (
                  <TextDefault style={styles.subtitle}>{section.subtitle}</TextDefault>
                )}
                
                {section.content.map((point, pointIndex) => (
                  <View key={pointIndex} style={styles.pointContainer}>
                    <View style={styles.bullet} />
                    <TextDefault style={styles.pointText}>{point}</TextDefault>
                  </View>
                ))}
                
                {section.subsections && section.subsections.map((subsection, subIndex) => (
                  <View key={subIndex} style={styles.subsection}>
                    <TextDefault style={styles.subsectionTitle}>{subsection.title}</TextDefault>
                    {subsection.content.map((point, pointIndex) => (
                      <View key={pointIndex} style={styles.pointContainer}>
                        <View style={styles.bullet} />
                        <TextDefault style={styles.pointText}>{point}</TextDefault>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
            
            <View style={styles.footer}>
              <TextDefault style={styles.lastUpdated}>Last Updated: 23 August 2025</TextDefault>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // overlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: 'rgba(255, 249, 246, 0.92)',
  // },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2.5,
  },
  contentContainer: {
    backgroundColor: COLORS.card1,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  section: {
    marginBottom: SIZES.margin * 1.5,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryLight,
    paddingLeft: SIZES.margin,
  },
  sectionTitle: {
    ...FONTS.h5,
    color: COLORS.primary,
    marginBottom: SIZES.margin / 2,
  },
  subtitle: {
    ...FONTS.font,
    color: COLORS.secondary,
    marginBottom: SIZES.margin / 2,
  },
  subsection: {
    marginLeft: SIZES.margin,
    marginTop: SIZES.margin / 2,
  },
  subsectionTitle: {
    ...FONTS.font,
    color: COLORS.text,
    marginBottom: SIZES.margin / 4,
  },
  pointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.margin / 3,
  },
  bullet: {
    width: SIZES.fontSm,
    height: SIZES.fontSm,
    borderRadius: SIZES.radius_sm,
    backgroundColor: COLORS.primary,
    marginRight: SIZES.margin,
    marginTop: SIZES.fontSm,
  },
  pointText: {
    flex: 1,
    ...FONTS.font,
    color: COLORS.text,
    lineHeight: SIZES.font * 1.4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
    paddingTop: SIZES.padding,
    alignItems: 'center',
  },
  lastUpdated: {
    ...FONTS.fontSm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});

export default TermsConditionsPage;