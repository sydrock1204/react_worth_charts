import axios from 'axios'

export const fetchCompanyName = async (symbol: string): Promise<any> => {
  try {
    let url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    let response = await axios.get(url)
    return response.data['bestMatches']
  } catch (error) {
    console.log('Error fetching data: ', error)
    return null
  }
}
