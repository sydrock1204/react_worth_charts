import { fetchData } from './fetchData'
import { getTimeStamp } from '../utils/getTimeStamp'

export const fetchStockData = async (symbol: string, interval: string) => {
  const rawData = await fetchData(symbol, interval)
  const stockDataSeries = Object.entries(rawData)
    .map(data => {
      const stockData = {
        time: getTimeStamp(data[0]),
        open: Number(data[1]['1. open']),
        high: Number(data[1]['2. high']),
        low: Number(data[1]['3. low']),
        close: Number(data[1]['4. close']),
      }
      return stockData
    })
    .reverse()

  const timeData = Object.entries(rawData)
    .map((data, index) => {
      const stockData = [
        getTimeStamp(data[0]),
        {
          index: index,
          open: Number(data[1]['1. open']),
          high: Number(data[1]['2. high']),
          low: Number(data[1]['3. low']),
          close: Number(data[1]['4. close']),
          volume: Number(data[1]['5. volume']),
        },
      ]
      return stockData
    })
    .reverse()

  // @ts-ignore
  const tempDataArray = new Map(timeData)

  const Volume = Object.entries(rawData)
    .map((data, index) => {
      const volumeData = {
        time: getTimeStamp(data[0]),
        value: Number(data[1]['5. volume']),
        color: index % 2 === 0 ? '#7685AA' : '#7685AA',
        index: index,
      }
      return volumeData
    })
    .reverse()

  const timeIndex = Object.entries(rawData).map((data, index) => {
    return getTimeStamp(data[0])
  })

  return {
    stockDataSeries,
    tempDataArray,
    Volume,
    timeIndex,
  }
}
