import { UUID } from 'crypto'

export interface StockPriceData {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface VolumeData {
  time: number
  value: number
  color?: string
}

export interface Point {
  timestamp: number
  price: number
}

export interface PointXY {
  point1: Point | null
  point2: Point | null
}

export interface UserInfo {
  id: number
  email: string
  phone: number
  uid: string
  role: string
  fullname: string
}

export interface HoverInfo {
  index: number
  open: number
  close: number
  high: number
  low: number
  volume: number
}

export interface stockWatchList {
  visible: boolean
  lists: string[]
}

export interface stockWatchLists {
  [key: string]: stockWatchList
}

export interface stockWatchListState {
  watchLists: stockWatchLists
  initWatchLists: () => void
  updateWatchLists: (header: string, stock: string) => void
  deleteWatchLists: (header: string, stock: string) => void
  saveWatchLists: (userId: any) => void
  loadWatchLists: (userId: any) => void
  setWatchLists: (watchLists: stockWatchLists) => void
}
