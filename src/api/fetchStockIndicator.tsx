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
    // let response = { data: null }
    // switch (interval) {
    //   case '1min':
    //     url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    //     response = await axios.get(url)
    //     return response.data[`Time Series (${interval})`]
    //   case '30min':
    //     url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    //     response = await axios.get(url)
    //     return response.data[`Time Series (${interval})`]
    //   case '60min':
    //     url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    //     response = await axios.get(url)
    //     return response.data[`Time Series (${interval})`]
    //   case 'daily':
    //     url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    //     response = await axios.get(url)
    //     console.log('response: ', response)
    //     return response.data['Time Series (Daily)']
    //     break
    //   case 'weekly':
    //     url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    //     response = await axios.get(url)
    //     return response.data['Weekly Time Series']
    //   case 'monthly':
    //     url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    //     response = await axios.get(url)
    //     return response.data['Montly Time Series']
    //     break
    // }
    // console.log(Object.entries(response.data["Time Series (1min)"]))
  } catch (error) {
    console.log('Error fetching data: ', error)
    return null
  }
}
