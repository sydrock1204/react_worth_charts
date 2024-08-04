import axios from 'axios'

export const fetchData = async (
  symbol: string,
  interval: string
): Promise<any> => {
  try {
    let url = ''
    let response = { data: null }
    const dayData = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`);
    const monthData = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`);
    // console.log('---dayData--',dayData.data['Time Series (Daily)']);
    // console.log('--monthData--',monthData.data['Monthly Time Series']);
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
      case '1D':
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
        response = await axios.get(url)
        return response.data['Time Series (Daily)']
        break
      case '1W':
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
        response = await axios.get(url)
        return response.data['Weekly Time Series']
      case '1M':
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
        response = await axios.get(url)
        return response.data['Monthly Time Series']
        break
      case '5D':

      case '3M':

      case '6M':

      case '1Y':

      case '5Y':
    }

  } catch (error) {
    console.log('Error fetching data: ', error)
    return null
  }
}
