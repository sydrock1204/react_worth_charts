export interface StockPriceData {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface VolumeData {
  time: string
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
