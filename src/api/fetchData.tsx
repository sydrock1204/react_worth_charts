import axios from 'axios'

export const fetchData = async (
  symbol: string,
  interval: string
): Promise<any> => {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    )
    // console.log(Object.entries(response.data["Time Series (1min)"]))
    return response.data[`Time Series (${interval})`]
  } catch (error) {
    console.log('Error fetching data: ', error)
    return null
  }
}
