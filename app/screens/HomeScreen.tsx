import { FloatingButton } from "@/components/FloatingButton"
import { PodcastBottomSheet } from "@/components/PodcastBottomSheet"
import React, { useState, useCallback, useMemo, useEffect } from "react"
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models/RootStoreContext"
import FastImage from "react-native-fast-image"


interface Podcast {
  id: string
  title: string
  channel: string
  image: string
}

const generateMockPodcasts = (): Podcast[] => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: `${i + 1}`,
    title: `Podcast Episode ${i + 1}`,
    channel: `Channel ${Math.floor(i / 10) + 1}`,
    image: `https://picsum.photos/id/${i + 10}/200/200`,
  }))
}

export const HomeScreen = observer(() => {
  const [isSheetOpen, setSheetOpen] = useState(false)

  const podcasts = useMemo(() => generateMockPodcasts(), [])
  const { podcastStore } = useStores()

  useEffect(() => {
  podcastStore.setPodcasts(generateMockPodcasts())
}, [])
const selectedIds = podcastStore.selected.map((p) => p.id)
  const renderItem = ({ item }: { item: Podcast }) => {
    const isSelected = selectedIds.includes(item.id)

    return (
      <View style={styles.itemContainer}>
        {/* <Image source={{ uri: item.image }} style={styles.image} /> */}
        <FastImage
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.channel}>{item.channel}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, isSelected && styles.buttonSelected]}
          onPress={() => podcastStore.toggleSelection(item.id)}
        >
          <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
            {isSelected ? "Selected" : "Subscribe"}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={podcasts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No podcasts found.</Text>
    </View>
  }
      />
      
      <FloatingButton
    visible={selectedIds.length > 0}
    count={selectedIds.length}
    onPress={() => {
      setSheetOpen(true)
      console.log("Show Added Pressed")
    }}
  />
  <PodcastBottomSheet
  visible={isSheetOpen}
  onClose={() => setSheetOpen(false)}
  selectedItems={podcastStore.selected}
  onRemove={(id) => podcastStore.removeSelected(id)}
/>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(200,200,255,0.2)", 
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  channel: {
    fontSize: 13,
    color: "#888",
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#ccc",
  },
  buttonSelected: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "#000",
    fontWeight: "500",
  },
  buttonTextSelected: {
    color: "#fff",
  },
  emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 50,
},
emptyText: {
  fontSize: 16,
  color: "#999",
}
})
