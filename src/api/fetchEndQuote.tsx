import axios from 'axios'

export const fetchEndQuote = async (symbol: string): Promise<any> => {
  try {
    let url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    let response = await axios.get(url)
    return response.data['Global Quote']
  } catch (error) {
    console.log('Error fetching data: ', error)
    return null
  }
}
