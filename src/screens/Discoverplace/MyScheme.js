import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ImageBackground,
  Alert,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';
import BottomTab from '../../components/BottomTab/BottomTab';
import { TextDefault } from '../../components';
import ProductCard from '../../ui/ProductCard/ProductCard';
import ProductCardSkeleton from '../../components/SkeletonLoader/ProductCardSkeleton';
import CommonHeader from '../../components/CommonHeader/CommonHeader';
import { API_BASE_URL_OLD } from '../../Config/API';
import { COLORS } from '../../utils/Theme';

function DiscoverPlace({ navigation }) {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPhoneSearchData = async () => {
    try {
      const storedPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');
      if (!storedPhoneNumber) {
        setError('Phone number not found');
        setLoading(false);
        return;
      }

      console.log('Fetching data for phone:', storedPhoneNumber);
      
      // Step 1: Get accounts by phone
      const phoneResponse = await fetch(
        `${API_BASE_URL_OLD}/account/phonesearch?phoneNo=${storedPhoneNumber}`
      );

      if (!phoneResponse.ok) {
        throw new Error(`Phone search HTTP error! status: ${phoneResponse.status}`);
      }

      const accounts = await phoneResponse.json();
      console.log('Raw API response accounts:', accounts);
      console.log('Number of accounts found:', accounts.length);

      if (!accounts || accounts.length === 0) {
        setError('No schemes available for this account, So please join the scheme and enjoy our benifits');
        setProductData([]);
        setLoading(false);
        return;
      }

      // Deduplicate accounts based on regno and groupcode
      const uniqueAccounts = accounts.filter((account, index, self) =>
        index === self.findIndex(a => 
          a.regno === account.regno && a.groupcode === account.groupcode
        )
      );

      console.log(`After deduplication: ${uniqueAccounts.length} unique accounts`);

      // Step 2: Fetch account details & amount/weight for each account
  const resolvedProducts = await Promise.all(
  uniqueAccounts.map(async (item) => {
    if (!item.groupcode || !item.regno) {
      console.warn('Skipping invalid account:', item);
      return null;
    }

    try {
      const groupcodeLower = item.groupcode.toLowerCase();

      const accountRes = await fetch(
        `${API_BASE_URL_OLD}/account?regno=${item.regno}&groupcode=${groupcodeLower}`
      );
      if (!accountRes.ok) throw new Error(`Account details HTTP error`);

      const accountDetails = await accountRes.json();

      const amountWeightRes = await fetch(
        `${API_BASE_URL_OLD}/getAmountWeight?REGNO=${item.regno}&GROUPCODE=${item.groupcode}`
      );
      if (!amountWeightRes.ok) throw new Error(`Amount/Weight HTTP error`);

      const amountWeightJson = await amountWeightRes.json();

      const currentDate = new Date();
      const maturityDate = item.maturityDate ? new Date(item.maturityDate) : null;
      const isActive = !maturityDate || currentDate < maturityDate;
      const status = isActive ? 'Active' : 'Deactive';

      return {
        ...item,
        accountDetails,
        amountWeight: amountWeightJson[0] || null,
        status,
      };
    } catch (err) {
      console.error('Error fetching account data:', err);
      return null; // skip invalid
    }
  })
);

      const validProducts = resolvedProducts.filter(Boolean);
      console.log('Valid products after processing:', validProducts.length);
      setProductData(validProducts);

      if (validProducts.length === 0) {
        setError('No valid product data found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to fetch data: ${err.message}`);
      Alert.alert('Fetch Error', `Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPhoneSearchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPhoneSearchData();
  };

  const renderProductCard = ({ item }) => (
    <ProductCard
      productData={item}
      navigation={navigation}
    />
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={localStyles.loadingContainer}>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </View>
      );
    }

    if (error && productData.length === 0) {
      return (
        <View style={localStyles.errorContainer}>
          <TextDefault style={localStyles.errorText}>
            {error}
          </TextDefault>
        </View>
      );
    }

    return (
      <FlatList
        data={productData}
        renderItem={renderProductCard}
        keyExtractor={(item, index) => `${item.regno}-${item.groupcode}-${index}`}
        contentContainerStyle={localStyles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={localStyles.emptyContainer}>
            <TextDefault style={localStyles.emptyText}>
              No schemes found
            </TextDefault>
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/bg6.jpg')}
        style={styles.mainBackground}
        imageStyle={styles.backgroundImageStyle}
      >
        <SafeAreaView style={styles.safeArea}>
          <CommonHeader title="Your Schemes" />
          
          <View style={localStyles.contentContainer}>
            {renderContent()}
          </View>

          <BottomTab screen="SCHEMES" />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const localStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    color: COLORS.textLight,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default DiscoverPlace;