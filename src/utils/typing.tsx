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
