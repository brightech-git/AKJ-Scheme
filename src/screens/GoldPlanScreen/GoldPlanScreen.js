import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import BottomTab from "../../components/BottomTab/BottomTab";
import { colors } from "../../utils";
import GoldPlan from "../../ui/ProductCard/GoldPlans";
import { StyleSheet } from "react-native";
import GoldPlansSkeleton from "../../components/SkeletonLoader/GoldPlansSkeleton";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import { API_BASE_URL_OLD } from "../../Config/API";

function GoldPlanScreen({ navigation }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL_OLD}/member/scheme`
        );
        const data = await response.json();
        const formattedSchemes = data.map((s) => ({
          schemeId: s.SchemeId,
          schemeName: s.schemeName,
          description: s.SchemeSName,
        }));
        setSchemes(formattedSchemes);
        console.log("Scheme",formattedSchemes)
      } catch (error) {
        console.error("Error fetching schemes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <GoldPlansSkeleton />
          <GoldPlansSkeleton />
        </>
      );
    }

    if (!schemes || schemes.length === 0) {
      return <Text style={styles.noDataText}>No Gold Plans available.</Text>;
    }

    return schemes.map((scheme, index) => (
      <GoldPlan
        key={index}
        schemeId={scheme.schemeId}
        schemeName={scheme.schemeName}
        description={scheme.description}
        styles={styles.itemCardContainer}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/bg7.jpg")}
        style={styles.mainBackground}
        imageStyle={styles.backgroundImageStyle}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Reusable Header */}
          <CommonHeader title="Your Gold Plans" />

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {renderContent()}
          </ScrollView>

          {/* Bottom Navigation */}
          <BottomTab screen="GOLDPLANS" />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImageStyle: {
    opacity: 0.9,
  },
  safeArea: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 15,
    zIndex: 1,
    padding: 10,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.titleText,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  itemCardContainer: {
    marginBottom: 15,
  },
  noDataText: {
    color: colors.redColor,
    textAlign: "center",
    padding: 20,
  },
});

export default GoldPlanScreen;
