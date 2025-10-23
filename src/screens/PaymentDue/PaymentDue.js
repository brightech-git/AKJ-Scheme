import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import { BackHeader } from '../../components';
import { alignment, colors, scale } from '../../utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL_OLD } from '../../Config/API';

const { width } = Dimensions.get('window');

// Formatting functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return 'N/A';
  }
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ' • ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return 'N/A';
  }
};

// Scheme Card Component
const SchemeCard = React.memo(({ scheme, onPress, animation }) => {
  return (
    <Animated.View style={{ transform: [{ scale: animation }] }}>
      <TouchableOpacity 
        style={styles.schemeCard}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.schemeCardHeader}>
          <Text style={styles.schemeName}>{scheme.pname}</Text>
          <View style={[
            styles.statusBadge,
            scheme.maturityDate ? styles.inactiveBadge : styles.activeBadge
          ]}>
            <Text style={styles.statusText}>
              {scheme.maturityDate ? 'Completed' : 'Active'}
            </Text>
          </View>
        </View>
        
        <View style={styles.schemeDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Scheme Code:</Text>
            <Text style={styles.detailValue}>{scheme.groupcode}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Registration No:</Text>
            <Text style={styles.detailValue}>{scheme.regno}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Join Date:</Text>
            <Text style={styles.detailValue}>{formatDate(scheme.joindate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Maturity Date:</Text>
            <Text style={styles.detailValue}>{formatDate(scheme.maturityDate)}</Text>
          </View>
        </View>
        
        <View style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>VIEW DETAILS</Text>
          <MaterialIcons name="chevron-right" size={20} color="#D4AF37" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

// Payment/Due Item Component
const PaymentItem = React.memo(({ item, index, animDelay, isDue = false }) => {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        delay: animDelay + (index * 100),
        useNativeDriver: true,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        delay: animDelay + (index * 100),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        delay: animDelay + (index * 100),
        useNativeDriver: true,
      })
    ]).start();
  }, [animDelay, index, opacity, scale, translateY]);

  return (
    <Animated.View
      style={[
        styles.paymentItem,
        {
          opacity,
          transform: [
            { translateY },
            { scale }
          ],
        },
      ]}
    >
      <View style={styles.paymentContainer}>
        <View style={styles.paymentHeader}>
          <View style={styles.receiptContainer}>
            <View style={[styles.receiptIcon, isDue ? styles.dueIcon : styles.paidIcon]}>
              <Feather 
                name={isDue ? "alert-circle" : "credit-card"} 
                size={18} 
                color="#FFFFFF" 
              />
            </View>
            <Text style={styles.receiptText}>
              {isDue ? `DUE #${item.installment}` : `RECEIPT #${item.receiptNo || index + 1}`}
            </Text>
          </View>
          <View style={[styles.statusContainer, isDue ? styles.dueStatus : styles.paidStatus]}>
            <Icon 
              name={isDue ? "exclamation-circle" : "check-circle"} 
              size={16} 
              color={isDue ? "#FF9800" : "#4CAF50"} 
            />
            <Text style={styles.statusText}>
              {isDue ? 'DUE' : 'PAID'}
            </Text>
          </View>
        </View>
        
        <View style={styles.paymentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Installment:</Text>
            <Text style={styles.detailValue}>INST. {item.installment || index + 1}</Text>
          </View>
          {!isDue && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={[styles.detailValue, styles.amountText]}>
                ₹{item.amount || '0'}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{isDue ? 'Due Date:' : 'Date:'}</Text>
            <Text style={styles.detailValue}>
              {isDue ? formatDate(item.dueDate) : formatDateTime(item.updateTime)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

// Main Component
const SchemesScreen = ({ navigation }) => {
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const animationRefs = useRef({
    fadeAnim: new Animated.Value(0),
    slideAnim: new Animated.Value(30),
    headerScale: new Animated.Value(0.95),
    cardScale: new Animated.Value(1)
  }).current;

  // Fetch schemes data with error handling
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const storedPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');
        if (!storedPhoneNumber) {
          throw new Error('Phone number not found');
        }

        const response = await fetch(
          `${API_BASE_URL_OLD}/account/phonesearch?phoneNo=${storedPhoneNumber}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setSchemes(data);
      } catch (error) {
        console.error('Error fetching schemes:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  // Calculate dues for a scheme
  const calculateDues = useCallback((scheme) => {
    if (!scheme?.joindate || !scheme?.maturityDate) return [];
    
    const startDate = new Date(scheme.joindate);
    const endDate = new Date(scheme.maturityDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return [];
    
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                     (endDate.getMonth() - startDate.getMonth());
    
    const totalInstallments = scheme.installments || 12;
    const installmentInterval = Math.floor(monthDiff / totalInstallments);
    const calculatedDues = [];
    
    for (let i = 1; i <= totalInstallments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + (i * installmentInterval));
      
      calculatedDues.push({
        id: `${scheme.regno}-${scheme.groupcode}-installment-${i}`,
        installment: i,
        dueDate: dueDate.toISOString(),
        status: 'Pending'
      });
    }
    
    return calculatedDues;
  }, []);

  // Handle scheme selection
  const handleSchemeSelect = useCallback(async (scheme) => {
    try {
      setSelectedScheme(scheme);
      setDetailLoading(true);
      
      // Fetch account details
      const accountRes = await fetch(
        `${API_BASE_URL_OLD}/account?regno=${scheme.regno}&groupcode=${scheme.groupcode}`
      );
      const accountDetails = await accountRes.json();

      // Process payment history
      const paymentHistory = accountDetails?.paymentHistoryList?.map((payment, index) => ({
        id: `payment-${payment?.receiptNo || index}`,
        receiptNo: payment?.receiptNo || `receipt-${index}`,
        installment: payment?.installment || index + 1,
        amount: payment?.amount || '0',
        updateTime: payment?.updateTime || new Date().toISOString(),
      })) || [];
      
      setPaymentHistory(paymentHistory);

      // Calculate dues
      const calculatedDues = calculateDues(scheme);
      if (paymentHistory.length > 0) {
        const paidInstallments = paymentHistory.map(p => p.installment);
        const updatedDues = calculatedDues.map(due => ({
          ...due,
          status: paidInstallments.includes(due.installment) ? 'Paid' : 'Pending'
        }));
        setDues(updatedDues);
      } else {
        setDues(calculatedDues);
      }

      // Run animations
      Animated.parallel([
        Animated.spring(animationRefs.headerScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(animationRefs.fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(animationRefs.slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error loading scheme details:', error);
      setError('Failed to load scheme details');
    } finally {
      setDetailLoading(false);
    }
  }, [calculateDues, animationRefs]);

  // Render scheme list
  const renderSchemeItem = ({ item, index }) => {
    const scaleValue = new Animated.Value(1);
    
    const onPressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };
    
    const onPressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <SchemeCard 
        scheme={item} 
        onPress={() => {
          onPressIn();
          setTimeout(() => {
            onPressOut();
            handleSchemeSelect(item);
          }, 100);
        }}
        animation={scaleValue}
      />
    );
  };

  // Render payment history or dues
  const renderPaymentHistory = ({ item, index }) => (
    <PaymentItem item={item} index={index} animDelay={400} />
  );

  const renderDueItem = ({ item, index }) => (
    <PaymentItem item={item} index={index} animDelay={400} isDue={true} />
  );

  // Calculate summary values
const totalAmountPaid = paymentHistory.reduce((total, payment) => {
  return total + (parseFloat(payment.amount) || 0);
}, 0);

const pendingDues = dues.filter(due => due.status === 'Pending');
const paidDues = dues.filter(due => due.status === 'Paid');


  if (selectedScheme) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={{ transform: [{ scale: animationRefs.headerScale }] }}>
          <View style={styles.headerContainer}>
            <BackHeader
              title={selectedScheme.pname || "SCHEME DETAILS"}
              backPressed={() => setSelectedScheme(null)}
              titleStyle={styles.headerTitle}
              backColor="#FFFFFF"
            />
          </View>
        </Animated.View>

        {detailLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>Loading scheme details...</Text>
          </View>
        ) : (
          <Animated.View
            style={[
              styles.content,
              {
                opacity: animationRefs.fadeAnim,
                transform: [{ translateY: animationRefs.slideAnim }],
              },
            ]}
          >
            {/* Summary Card */}
            <Animated.View 
              style={[
                styles.summaryCard,
                {
                  transform: [{
                    scale: animationRefs.fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1]
                    })
                  }]
                }
              ]}
            >
              <View style={styles.summaryContainer}>
                <Text style={styles.schemeTitle}>{selectedScheme.pname || "Scheme"}</Text>
                
                <View style={styles.schemeDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Scheme Code:</Text>
                    <Text style={styles.detailValue}>{selectedScheme.groupcode || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Registration No:</Text>
                    <Text style={styles.detailValue}>{selectedScheme.regno || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Join Date:</Text>
                    <Text style={styles.detailValue}>{formatDate(selectedScheme.joindate)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Maturity Date:</Text>
                    <Text style={styles.detailValue}>{formatDate(selectedScheme.maturityDate)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[
                      styles.detailValue,
                      selectedScheme.maturityDate ? styles.inactiveStatus : styles.activeStatus
                    ]}>
                      {selectedScheme.maturityDate ? 'Completed' : 'Active'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>TOTAL PAID</Text>
                    <Text style={styles.summaryValue}>
                      ₹{totalAmountPaid.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>PENDING DUES</Text>
                    <Text style={styles.summaryValue}>
                      {pendingDues.length}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  styles.historyTab,
                  !selectedScheme.maturityDate && styles.activeTab
                ]}
                onPress={() => {}}
              >
                <MaterialIcons 
                  name="schedule" 
                  size={20} 
                  color={!selectedScheme.maturityDate ? '#D4AF37' : '#86754E'} 
                />
                <Text style={[
                  styles.tabText,
                  !selectedScheme.maturityDate && styles.activeTabText
                ]}>
                  PAYMENT DUES
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  styles.paymentsTab,
                  selectedScheme.maturityDate && styles.activeTab
                ]}
                onPress={() => {}}
              >
                <MaterialIcons 
                  name="history" 
                  size={20} 
                  color={selectedScheme.maturityDate ? '#D4AF37' : '#86754E'} 
                />
                <Text style={[
                  styles.tabText,
                  selectedScheme.maturityDate && styles.activeTabText
                ]}>
                  PAYMENT HISTORY
                </Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.historyContainer}>
              {!selectedScheme.maturityDate ? (
                <>
                  <Animated.View 
                    style={[
                      styles.historyHeader,
                      {
                        opacity: animationRefs.fadeAnim,
                        transform: [{
                          translateX: animationRefs.fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0]
                          })
                        }]
                      }
                    ]}
                  >
                    <Text style={styles.historyTitle}>PAYMENT DUES</Text>
                  </Animated.View>

                  {pendingDues.length > 0 ? (
                    <ScrollView>
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>PENDING PAYMENTS</Text>
                        <Text style={styles.sectionCount}>{pendingDues.length}</Text>
                      </View>
                      <FlatList
                        data={pendingDues}
                        renderItem={renderDueItem}
                        keyExtractor={(item) => `pending-${item.id}`}
                        scrollEnabled={false}
                        contentContainerStyle={styles.listContainer}
                      />
                      
                      {paidDues.length > 0 && (
                        <>
                          <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>COMPLETED PAYMENTS</Text>
                            <Text style={styles.sectionCount}>{paidDues.length}</Text>
                          </View>
                          <FlatList
                            data={paidDues}
                            renderItem={renderDueItem}
                            keyExtractor={(item) => `paid-${item.id}`}
                            scrollEnabled={false}
                            contentContainerStyle={styles.listContainer}
                          />
                        </>
                      )}
                    </ScrollView>
                  ) : (
                    <Animated.View
                      style={[
                        styles.noDataContainer, 
                        { 
                          opacity: animationRefs.fadeAnim,
                          transform: [{
                            scale: animationRefs.fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.9, 1]
                            })
                          }]
                        }
                      ]}
                    >
                      <Feather name="check-circle" size={48} color="#4CAF50" />
                      <Text style={styles.noDataText}>All Dues Cleared</Text>
                      <Text style={styles.noDataSubtext}>
                        You have no pending payments for this scheme
                      </Text>
                    </Animated.View>
                  )}
                </>
              ) : (
                <>
                  <Animated.View 
                    style={[
                      styles.historyHeader,
                      {
                        opacity: animationRefs.fadeAnim,
                        transform: [{
                          translateX: animationRefs.fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0]
                          })
                        }]
                      }
                    ]}
                  >
                    <Text style={styles.historyTitle}>TRANSACTION DETAILS</Text>
                  </Animated.View>

                  {paymentHistory.length > 0 ? (
                    <FlatList
                      data={paymentHistory}
                      renderItem={renderPaymentHistory}
                      keyExtractor={(item) => item.id}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.listContainer}
                    />
                  ) : (
                    <Animated.View
                      style={[
                        styles.noDataContainer, 
                        { 
                          opacity: animationRefs.fadeAnim,
                          transform: [{
                            scale: animationRefs.fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.9, 1]
                            })
                          }]
                        }
                      ]}
                    >
                      <Feather name="inbox" size={48} color="#D4AF37" />
                      <Text style={styles.noDataText}>No Payment History</Text>
                      <Text style={styles.noDataSubtext}>
                        Your completed payments will appear here
                      </Text>
                    </Animated.View>
                  )}
                </>
              )}
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    );
  }

  // Main schemes list view
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/bg7.jpg')}
        style={styles.mainBackground}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Your Schemes</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D4AF37" />
            <Text style={styles.loadingText}>Loading your schemes...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setLoading(true);
                fetchSchemes();
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : schemes.length > 0 ? (
          <FlatList
            data={schemes}
            renderItem={renderSchemeItem}
            keyExtractor={(item) => `${item.regno}-${item.groupcode}`}
            contentContainerStyle={styles.schemesList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noSchemesContainer}>
            <Feather name="inbox" size={48} color="#D4AF37" />
            <Text style={styles.noSchemesText}>No Schemes Available</Text>
            <Text style={styles.noSchemesSubtext}>
              You haven't joined any schemes yet
            </Text>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5F0',
  },
  mainBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  backgroundImageStyle: {
    opacity: 0.1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontFamily: 'TrajanPro-Bold',
    color: '#6B4F28',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  schemesList: {
    padding: 16,
  },
  schemeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6D4A3',
  },
  schemeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  schemeName: {
    fontSize: 18,
    fontFamily: 'TrajanPro-Bold',
    color: '#6B4F28',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  activeBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'TrajanPro-Bold',
    textTransform: 'uppercase',
  },
  schemeDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#86754E',
    fontFamily: 'TrajanPro-Bold',
  },
  detailValue: {
    fontSize: 14,
    color: '#3E2E1D',
    fontFamily: 'TrajanPro-Bold',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0E6D2',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#D4AF37',
    fontFamily: 'TrajanPro-Bold',
    marginRight: 4,
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B4F28',
    fontFamily: 'TrajanPro-Bold',
    marginTop: 16,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#F44336',
    marginBottom: 10,
    fontFamily: 'TrajanPro-Bold',
  },
  retryButton: {
    backgroundColor: '#6B4F28',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontFamily: 'TrajanPro-Bold',
  },
  noSchemesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noSchemesText: {
    fontSize: 18,
    color: '#6B4F28',
    fontFamily: 'TrajanPro-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noSchemesSubtext: {
    fontSize: 14,
    color: '#86754E',
    textAlign: 'center',
    fontFamily: 'TrajanPro-Bold',
  },
  // Detail view styles
  headerContainer: {
    backgroundColor: '#6B4F28',
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  headerTitle: {
    fontSize: scale(18),
    fontFamily: 'TrajanPro-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: { 
    flex: 1, 
    padding: scale(16),
  },
  summaryCard: {
    borderRadius: 20,
    marginBottom: scale(20),
    shadowColor: '#BFA06B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: '#FFF',
  },
  summaryContainer: {
    borderRadius: 20,
    padding: scale(20),
    borderWidth: 1,
    borderColor: '#E6D4A3',
    backgroundColor: '#F9F2E7',
  },
  schemeTitle: {
    color: '#6B4F28',
    fontSize: scale(20),
    fontFamily: 'TrajanPro-Bold',
    marginBottom: scale(16),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(107, 79, 40, 0.2)',
    marginHorizontal: scale(10),
  },
  summaryLabel: {
    color: '#86754E',
    fontSize: scale(12),
    marginBottom: scale(6),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'TrajanPro-Bold',
  },
  summaryValue: {
    color: '#3E2E1D',
    fontSize: scale(20),
    fontFamily: 'TrajanPro-Bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(16),
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(10),
    borderRadius: 8,
  },
  historyTab: {
    marginRight: scale(4),
  },
  paymentsTab: {
    marginLeft: scale(4),
  },
  activeTab: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  tabText: {
    fontSize: scale(12),
    color: '#86754E',
    fontFamily: 'TrajanPro-Bold',
    marginLeft: scale(6),
    textTransform: 'uppercase',
  },
  activeTabText: {
    color: '#D4AF37',
  },
  historyContainer: { 
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
    paddingHorizontal: scale(5),
  },
  historyTitle: {
    fontSize: scale(16),
    fontFamily: 'TrajanPro-Bold',
    color: '#6B4F28',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(16),
    marginBottom: scale(8),
    paddingHorizontal: scale(8),
  },
  sectionTitle: {
    fontSize: scale(14),
    fontFamily: 'TrajanPro-Bold',
    color: '#6B4F28',
    textTransform: 'uppercase',
  },
  sectionCount: {
    fontSize: scale(12),
    fontFamily: 'TrajanPro-Bold',
    color: '#86754E',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: 10,
  },
  listContainer: { 
    paddingBottom: scale(20),
  },
  paymentItem: {
    marginBottom: scale(12),
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentContainer: {
    padding: scale(16),
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(214, 196, 161, 0.3)',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
    paddingBottom: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 79, 40, 0.1)',
  },
  receiptContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  receiptIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  paidIcon: {
    backgroundColor: '#D4AF37',
  },
  dueIcon: {
    backgroundColor: '#FF9800',
  },
  receiptText: {
    fontSize: scale(14),
    color: '#6B4F28',
    fontFamily: 'TrajanPro-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: 12,
  },
  paidStatus: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  dueStatus: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  statusText: {
    fontSize: scale(12),
    fontFamily: 'TrajanPro-Bold',
    marginLeft: scale(4),
    textTransform: 'uppercase',
  },
  paymentDetails: { 
    gap: scale(10),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: scale(13),
    color: '#86754E',
    fontFamily: 'TrajanPro-Bold',
  },
  detailValue: {
    fontSize: scale(13),
    color: '#3E2E1D',
    fontFamily: 'TrajanPro-Bold',
  },
  amountText: {
    color: '#D4AF37',
    fontFamily: 'TrajanPro-Bold',
    fontSize: scale(15),
  },
  activeStatus: {
    color: '#4CAF50',
  },
  inactiveStatus: {
    color: '#F44336',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(40),
  },
  noDataText: {
    color: '#6B4F28',
    fontSize: scale(18),
    fontFamily: 'TrajanPro-Bold',
    marginTop: scale(16),
    marginBottom: scale(8),
  },
  noDataSubtext: {
    color: '#86754E',
    fontSize: scale(14),
    textAlign: 'center',
    paddingHorizontal: scale(40),
    lineHeight: scale(20),
    fontFamily: 'TrajanPro-Bold',
  },
});

export default SchemesScreen;