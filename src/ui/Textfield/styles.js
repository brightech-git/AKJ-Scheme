import { alignment, colors, scale } from '../../utils'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  input_view: {
    backgroundColor: colors.white,
    borderRadius: 3,
    height: scale(40),
    justifyContent: 'center',
    borderWidth: 1
  },
  input: {
  
    fontSize: scale(13),
    ...alignment.PLsmall
  }
})
export default styles
