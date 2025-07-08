import React, { useEffect, useRef } from "react"
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native"

interface Props {
  visible: boolean
  count: number
  onPress: () => void
}

export const FloatingButton = ({ visible, count, onPress }: Props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [visible])

  if (!visible) return null

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity activeOpacity={0.9} style={styles.blurWrapper}>
        <TouchableOpacity activeOpacity={0.2} style={styles.button} onPress={onPress}>
          <Text style={styles.text}>Show Added ({count})</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    zIndex: 100,
  },
  blurWrapper: {
    shadowColor: "rgba(255, 255, 255, 0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    opacity:0.8,
    paddingHorizontal:120,
    paddingVertical:40,
    elevation: 6,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  button: {
    opacity:0.9,
    flex:1,
    width:250,
    alignItems:"center",
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 30,
    backgroundColor: "black",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})
