import axios from 'axios'

export const fetchCompanyData = async (symbol: string): Promise<any> => {
  try {
    let url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    let response = await axios.get(url)
    return response.data['Name']
    // console.log(Object.entries(response.data["Time Series (1min)"]))
  } catch (error) {
    console.log('Error fetching data: ', error)
    return null
  }
}
