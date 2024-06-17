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
  // setData(stockDataSeries)
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

  // const timeData = stockDataSeries.map(data => {
  //   return [
  //     data.time,
  //     {
  //       open: data.open,
  //       close: data.close,
  //       high: data.high,
  //       low: data.low,
  //     },
  //   ]
  // })
  // @ts-ignore
  const tempDataArray = new Map(timeData)
  // setTempData(tempDataArray)

  const Volume = Object.entries(rawData)
    .map((data, index) => {
      const volumeData = {
        time: getTimeStamp(data[0]),
        value: Number(data[1]['5. volume']),
        color: index % 2 === 0 ? '#26a69a' : '#ef5350',
      }
      return volumeData
    })
    .reverse()
  // setVolume(Volume)
  return {
    stockDataSeries,
    tempDataArray,
    Volume,
  }
}
