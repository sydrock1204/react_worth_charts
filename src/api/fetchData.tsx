import axios from 'axios'

export const fetchData = async (
  symbol: string,
  interval: string
): Promise<any> => {
  try {
    let url = ''
    let response = { data: null }
    switch (interval) {
      case '15min':
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
        response = await axios.get(url)
        return response.data[`Time Series (${interval})`]
      case '30min':
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
        response = await axios.get(url)
        return response.data[`Time Series (${interval})`]
      case '60min':
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
        response = await axios.get(url)
        return response.data[`Time Series (${interval})`]
      case 'daily':
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
        response = await axios.get(url)
        console.log('response: ', response)
        return response.data['Time Series (Daily)']
        break
      case 'weekly':
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
        response = await axios.get(url)
        return response.data['Weekly Time Series']
      case 'monthly':
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
        response = await axios.get(url)
        return response.data['Monthly Time Series']
        break
    }
    // console.log(Object.entries(response.data["Time Series (1min)"]))
  } catch (error) {
    console.log('Error fetching data: ', error)
    return null
  }
}
