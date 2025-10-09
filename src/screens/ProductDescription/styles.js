import { StyleSheet } from 'react-native';
import { colors, scale } from '../../utils';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeAreaStyle: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainer: {
    flex: 1,
    padding: scale(15),
  },
  productInfoContainer: {
    marginBottom: scale(20),
  },
  productName: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: colors.fontMainColor,
    marginBottom: scale(10),
  },
  amountText: {
    fontSize: scale(16),
    color: colors.fontSecondColor,
    marginBottom: scale(5),
  },
  savedWeightText: {
    fontSize: scale(16),
    color: colors.fontSecondColor,
    marginBottom: scale(5),
  },
  benefitWeightText: {
    fontSize: scale(16),
    color: colors.fontSecondColor,
    marginBottom: scale(5),
  },
  dateOfJoinText: {
    fontSize: scale(16),
    color: colors.fontSecondColor,
    marginBottom: scale(5),
  },
  dateOfMaturityText: {
    fontSize: scale(16),
    color: colors.fontSecondColor,
    marginBottom: scale(20),
  },
  transactionHistoryContainer: {
    marginTop: scale(10),
  },
  transactionHistoryTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: colors.fontMainColor,
    marginBottom: scale(10),
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(10),
    borderBottomWidth: 1,
    borderColor: colors.gray,
    paddingBottom: scale(10),
  },
  transactionStatus: {
    fontSize: scale(14),
    color: colors.fontMainColor,
  },
  transactionDate: {
    fontSize: scale(14),
    color: colors.fontSecondColor,
  },
  transactionWeight: {
    fontSize: scale(14),
    color: colors.fontMainColor,
  },
  transactionIns: {
    fontSize: scale(14),
    color: colors.fontMainColor,
  },
});

export default styles;
