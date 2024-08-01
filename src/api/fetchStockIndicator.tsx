import axios from 'axios'

export const fetchStockIndicator = async (
  indifunction: string,
  symbol: string,
  interval: string,
  time_period: number,
  series_type: string
): Promise<any> => {
  try {
    let url = `https://www.alphavantage.co/query?function=${indifunction}&symbol=${symbol}&interval=${interval}&time_period=${time_period}&series_type=${series_type}&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    let response = await axios.get(url)
    return response.data[`Technical Analysis: ${indifunction}`]
  } catch (error) {
    console.log('Error fetching data: ', error)
    return null
  }
}
