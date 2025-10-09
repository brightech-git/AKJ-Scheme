import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
// import { Icon } from 'react-native-vector-icons/Icon'
import styles from './styles'
import { MaterialIcons } from '@expo/vector-icons'
import { colors } from '../../utils'

function BackHeader(props) {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        {/* Back Arrow Inside Circle */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.leftContainer}
          onPress={() => props.backPressed()}>
          <View style={styles.circle}>
          <MaterialIcons name="chevron-left" size={28} color={colors.black} />
          </View>
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.headerText}>
          {props.title}
        </Text>
      </View>
    </View>
  )
}

function HeaderRightText(props) {
  return (
    <View style={styles.container}>
      <View style={[styles.subContainer, { justifyContent: 'space-between' }]}>
        <View style={styles.titleContainer}>
          <TouchableOpacity
            activeOpacity={0}
            onPress={() => props.backPressed()}>
            <Ionicons name="ios-arrow-back" size={30} />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.headerText}>
            {props.title}
          </Text>
        </View>
        <Text style={styles.rightTitle}>New Address</Text>
      </View>
    </View>
  )
}
export { BackHeader, HeaderRightText }
