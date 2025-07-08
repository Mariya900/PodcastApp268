import { PodcastStoreModel } from "./PodcastStore"
import { types } from "mobx-state-tree"

export const RootStoreModel = types.model("RootStore", {
  podcastStore: PodcastStoreModel,
})

export const createRootStore = () =>
  RootStoreModel.create({
    podcastStore: {
      podcasts: [],
      selected: [],
    },
  })
