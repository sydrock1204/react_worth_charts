import axios from 'axios'
export const fetchData = async (
  symbol: string,
  interval: string
): Promise<any> => {

  const fiveStockData = (timeSeries) => {
      const dates = Object.keys(timeSeries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      const result = {};
      for (let i = 0; i < dates.length; i += 5) {
          const chunk = dates.slice(i, i + 5);
          const firstDay = timeSeries[chunk[0]];
          const lastDay = timeSeries[chunk[chunk.length - 1]];

          const aggregated = chunk.reduce((acc, date) => {
              const dayData = timeSeries[date];
              return {
                  open: acc.open || dayData["1. open"],
                  close: dayData["4. close"],
                  high: Math.max(acc.high, parseFloat(dayData["2. high"])),
                  low: Math.min(acc.low, parseFloat(dayData["3. low"])),
                  volume: acc.volume + parseFloat(dayData["5. volume"])
              };
          }, {
              open: null,
              close: null,
              high: -Infinity,
              low: Infinity,
              volume: 0
          });

          result[chunk[chunk.length - 1]] = {
              "1. open": aggregated.open,
              "2. high": aggregated.high.toFixed(4),
              "3. low": aggregated.low.toFixed(4),
              "4. close": aggregated.close,
              "5. volume": aggregated.volume
          };
      }
      return result;
  };

  const mothStockData = (monthlyData, month) => {
      const dates = Object.keys(monthlyData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      const result = {};
      for (let i = 0; i < dates.length; i += month) {
          const chunk = dates.slice(i, i + month);
          const firstDay = monthlyData[chunk[0]];
          const lastDay = monthlyData[chunk[chunk.length - 1]];

          const aggregated = chunk.reduce((acc, date) => {
              const dayData = monthlyData[date];
              return {
                  open: acc.open || dayData["1. open"],
                  close: dayData["4. close"],
                  high: Math.max(acc.high, parseFloat(dayData["2. high"])),
                  low: Math.min(acc.low, parseFloat(dayData["3. low"])),
                  volume: acc.volume + parseFloat(dayData["5. volume"])
              };
          }, {
              open: null,
              close: null,
              high: -Infinity,
              low: Infinity,
              volume: 0
          });

          result[chunk[chunk.length - 1]] = {
              "1. open": aggregated.open,
              "2. high": aggregated.high.toFixed(4),
              "3. low": aggregated.low.toFixed(4),
              "4. close": aggregated.close,
              "5. volume": aggregated.volume
          };
      }

      return result;
  }

  try {
    let url = ''
    let response = { data: null }
    const dayData = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`);
    const monthData = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`);
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
        const dailyData = dayData.data['Time Series (Daily)'];
        const fiveDayData = fiveStockData(dailyData);
        return(fiveDayData)
        break;
      case '3M':
        const threeMothData = mothStockData(monthData.data['Monthly Time Series'], 3);
        return (threeMothData)
        break;
      case '6M':
        const sixMothData = mothStockData(monthData.data['Monthly Time Series'], 6);
        return (sixMothData)
        break;
      case '1Y':
        const yearilyData = mothStockData(monthData.data['Monthly Time Series'], 12);
        return (yearilyData)
        break;
      case '5Y':
        const fiveYearData = mothStockData(monthData.data['Monthly Time Series'], 60);
        return (fiveYearData)
        break;
    }

  } catch (error) {
    if(interval === '5D' || interval === '3M' || interval === '6M' || interval === '1Y' || interval === '5Y') {
      
    } else {
      console.log('Error fetching data: ', error)
    }
    return null
  }




}
