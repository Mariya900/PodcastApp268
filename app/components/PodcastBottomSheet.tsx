import React, { useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeOut,
  FadeIn,
  Layout,
  runOnJS,
} from "react-native-reanimated"
import FastImage from "react-native-fast-image"
import { Gesture, GestureDetector } from "react-native-gesture-handler"

const { height } = Dimensions.get("window")
const SHEET_HEIGHT = height * 0.8

interface PodcastItem {
  id: string
  title: string
  channel: string
  image: string
}

interface Props {
  visible: boolean
  onClose: () => void
  selectedItems: PodcastItem[]
  onRemove: (id: string) => void
}

export const PodcastBottomSheet = ({
  visible,
  onClose,
  selectedItems,
  onRemove,
}: Props) => {
  const translateY = useSharedValue(height)

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(height - SHEET_HEIGHT, {
        damping: 50,
        stiffness: 30,
        mass: 0.7,
      })
    } else {
      translateY.value = withSpring(height, {
        damping: 50,
        stiffness: 30,
        mass: 0.5,
      })
    }
  }, [visible])

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = height - SHEET_HEIGHT + event.translationY
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100) {
        translateY.value = withSpring(height, {
          damping: 50,
          stiffness: 30,
        })
        runOnJS(onClose)()
      } else {
        translateY.value = withSpring(height - SHEET_HEIGHT, {
          damping: 50,
          stiffness: 30,
        })
      }
    })

  const renderItem = ({ item }: { item: PodcastItem }) => (
    <Animated.View
      style={styles.item}
      layout={Layout.springify()}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <FastImage
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.channel}>{item.channel}</Text>
      </View>
      <TouchableOpacity onPress={() => onRemove(item.id)}>
        <Text style={styles.remove}>Remove</Text>
      </TouchableOpacity>
    </Animated.View>
  )

  return (
    <>
      {visible && <Pressable style={styles.backdrop} onPress={onClose} />}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.sheet, sheetStyle]}
          entering={FadeIn.springify().damping(15)}
          exiting={FadeOut}
        >
          <Text style={styles.header}>Selected Podcasts</Text>
          <FlatList
            data={selectedItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No podcasts selected</Text>
            }
          />
        </Animated.View>
      </GestureDetector>
    </>
  )
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    width: "100%",
    height: SHEET_HEIGHT,
    bottom: 0,
    left: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    zIndex: 999,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  channel: {
    fontSize: 13,
    color: "#666",
  },
  remove: {
    color: "red",
    fontWeight: "600",
    marginLeft: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
})
