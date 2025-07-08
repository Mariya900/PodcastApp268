import { Instance, types } from "mobx-state-tree"

export const PodcastModel = types.model("Podcast", {
  id: types.identifier,
  title: types.string,
  channel: types.string,
  image: types.string,
})

export const PodcastStoreModel = types
  .model("PodcastStore", {
    podcasts: types.array(PodcastModel),
    selected: types.array(types.reference(PodcastModel)),
  })
  .actions((self) => ({
    setPodcasts(data: Instance<typeof PodcastModel>[]) {
      self.podcasts.replace(data)
    },
    toggleSelection(id: string) {
      const existing = self.selected.find((p) => p.id === id)
      if (existing) {
        self.selected.remove(existing)
      } else {
        const toAdd = self.podcasts.find((p) => p.id === id)
        if (toAdd) self.selected.push(toAdd)
      }
    },
        removeSelected(id: string) {
        const existing = self.selected.find((p) => p.id === id)
        if (existing) {
            self.selected.remove(existing)
        }
        },
  }))
