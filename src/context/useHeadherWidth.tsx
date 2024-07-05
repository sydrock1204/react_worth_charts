import { create } from 'zustand'

export interface HeaderWidthState {
  width: number
  setWidth: (width: number) => void
}

const useHeaderWidthStore = create<HeaderWidthState>(set => ({
  width: 0,
  setWidth: width => set({ width }),
}))

export default useHeaderWidthStore
