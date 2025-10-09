// import { StyleSheet } from 'react-native';
import { verticalScale, scale } from '../../../utils/scaling';
import { colors } from '../../../utils';
import { colors1 } from '../../../utils/colors';
import { StyleSheet, Dimensions } from 'react-native';


const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: colors1.primary,
  },
  scrollView: {
    flex: 1,
  },
   // New styles for sidebar
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  sidebarSafeArea: {
    flex: 1,
  },
  sidebarScrollView: {
    flex: 1,
  },
  sidebarScrollContent: {
    paddingBottom: 20,
  },
  sidebarCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1001,
    padding: 10,
  },
   // Top Header Section
  topHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors1.primary,
  },
  faqIconContainer: {
    padding: 5,
  },
  menuIconContainer: {
    padding: 5,
  },
  
  // New styles for sidebar
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  sidebarSafeArea: {
    flex: 1,
  },
  sidebarScrollView: {
    flex: 1,
  },
  sidebarScrollContent: {
    paddingBottom: 20,
  },
  sidebarCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1001,
    padding: 10,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(15),
    left: scale(15),
    zIndex: 10,
    padding: scale(10),
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
  },
  profileHeader: {
    padding: scale(20),
    paddingTop: verticalScale(10),
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
    alignItems: 'center',
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  profileIconContainer: {
    marginBottom: verticalScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileIconGradient: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileName: {
    color: colors1.textLight,
    marginBottom: verticalScale(5),
    fontWeight: 'bold',
    fontSize: verticalScale(20),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(5),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
  },
  phoneIcon: {
    marginRight: scale(8),
  },
  phoneNumber: {
    color: colors1.textLight,
    fontSize: verticalScale(16),
  },
  settingsCard: {
    backgroundColor: colors1.cardBackground,
    borderRadius: scale(20),
    padding: verticalScale(20),
    marginHorizontal: scale(15),
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingsTitle: {
    color: colors1.primary,
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
    paddingLeft: scale(10),
    borderLeftWidth: 3,
    borderLeftColor: colors1.primary,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: colors1.borderLight,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(10),
    backgroundColor: 'rgba(205, 134, 92, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(15),
  },
  settingsItemText: {
    color: colors1.textPrimary,
    fontSize: verticalScale(16),
    fontWeight: '600',
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: verticalScale(10),
  },
  logoutIconContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  logoutText: {
    color: colors1.error,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  versionText: {
    color: colors1.textSecondary,
    fontSize: verticalScale(12),
  },
});

export default styles;