import { createContext, useContext } from "react"
import { createRootStore } from "./RootStore"

const rootStore = createRootStore()
export const RootStoreContext = createContext(rootStore)

export const useStores = () => useContext(RootStoreContext)
