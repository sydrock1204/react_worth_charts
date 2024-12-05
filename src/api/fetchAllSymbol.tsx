import axios from 'axios'

export const fetchAllSymbol = async () => {
  try {
    let url = `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    let response = await axios.get(url)
    return response.data
  } catch (error) {
    console.log('Error fetching data: ', error)
    return null
  }
}