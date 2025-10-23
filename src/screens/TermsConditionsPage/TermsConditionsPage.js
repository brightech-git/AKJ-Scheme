import React from 'react';
import { ScrollView, View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { TextDefault } from '../../components';
import appTheme from '../../utils/Theme';
import CommonHeader from '../../components/CommonHeader/CommonHeader';

const { COLORS, SIZES, FONTS } = appTheme;

const TermsConditionsPage = () => {
  const termsData = [
    {
      title: "Introduction",
      content: [
        "Welcome to AKJ Mini Gold Souk (“the Website”). These terms of use govern your access and use of the Website. By accessing or using the Website, you agree to be bound by these terms. If you do not agree with these terms, please refrain from using the Website."
      ]
    },
    {
      title: "Use of Content",
      content: [
        "All content on the Website, including but not limited to text, images, graphics, logos, and videos, is the property of AKJ Mini Gold Souk and protected by applicable copyright and intellectual property laws. You may use the content solely for personal, non-commercial purposes. Any unauthorized use, reproduction, or distribution of the content is strictly prohibited."
      ]
    },
    {
      title: "Website Access",
      content: [
        "AKJ Mini Gold Souk grants you a limited, non-exclusive, and non-transferable right to access and use the Website for informational purposes only. We reserve the right to modify, suspend, or discontinue any aspect of the Website without prior notice."
      ]
    },
    {
      title: "User Conduct",
      content: [
        "You agree to use the Website in compliance with all applicable laws and regulations. You shall not engage in any activities that may interfere with or disrupt the functionality or security of the Website.",
        "Additionally, you agree not to:"
      ],
      subsections: [
        {
          title: "Prohibited Activities",
          content: [
            "Post or transmit any unlawful, defamatory, obscene, or harmful content.",
            "Use the Website to distribute spam, viruses, or any other malicious software.",
            "Impersonate any person or entity, or falsely represent your affiliation with any entity.",
            "Collect or store the personal information of other users without their consent."
          ]
        }
      ]
    },
    {
      title: "Links to Third-Party Websites",
      content: [
        "The Website may contain links to third-party websites for your convenience. AKJ Mini Gold Souk does not endorse or assume any responsibility for the content or practices of these third-party websites. Your use of third-party websites is at your own risk and subject to their respective terms of use and privacy policies."
      ]
    },
    {
      title: "Disclaimer of Warranties",
      content: [
        "The Website and its content are provided on an “as is” and “as available” basis, without any warranties or representations, express or implied. AKJ Mini Gold Souk disclaims all warranties, including but not limited to the accuracy, reliability, or fitness for a particular purpose of the content on the Website."
      ]
    },
    {
      title: "Limitation of Liability",
      content: [
        "AKJ Mini Gold Souk shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use or inability to use the Website or its content. This includes any damages resulting from errors, omissions, interruptions, or any loss of data."
      ]
    },
    {
      title: "Indemnification",
      content: [
        "You agree to indemnify and hold AKJ Mini Gold Souk and its officers, directors, employees, and agents harmless from any claims, liabilities, damages, expenses, and costs, including reasonable attorneys' fees, arising out of your use of the Website or any violation of these terms of use."
      ]
    },
    {
      title: "Governing Law",
      content: [
        "These terms of use shall be governed by and construed in accordance with the laws of India. Any disputes arising from or relating to these terms or the Website shall be subject to the exclusive jurisdiction of the courts in India."
      ]
    },
    {
      title: "Modifications",
      content: [
        "AKJ Mini Gold Souk reserves the right to modify or update these terms of use at any time. It is your responsibility to review these terms periodically. Continued use of the Website after any modifications constitutes your acceptance of the updated terms."
      ]
    },
    {
      title: "Contact Information",
      content: [
        "If you have any questions or concerns regarding these terms of use, please contact us at care@akjminigoldsouk.com."
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/bg7.jpg')}
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
              <TextDefault style={styles.lastUpdated}>Last Updated: 01/06/2023</TextDefault>
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
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
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
    color: COLORS.text,
    marginBottom: SIZES.margin / 2,
    fontWeight: '600',
  },
  subtitle: {
    ...FONTS.font,
    color: COLORS.goldtext,
    marginBottom: SIZES.margin / 2,
  },
  subsection: {
    marginLeft: SIZES.margin,
    marginTop: SIZES.margin / 2,
  },
  subsectionTitle: {
    ...FONTS.font,
    color: COLORS.goldtext,
    marginBottom: SIZES.margin / 4,
    fontWeight: '600',
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
    backgroundColor: COLORS.goldtext,
    marginRight: SIZES.margin,
    marginTop: SIZES.fontSm,
  },
  pointText: {
    flex: 1,
    ...FONTS.font,
    color: COLORS.goldtext,
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
    color: COLORS.goldtext,
    fontStyle: 'italic',
  },
});

export default TermsConditionsPage;