import axios from 'axios'
import { format } from 'date-fns';

export const fetchData = async (
  symbol: string,
  interval: string
): Promise<any> => {

  const twoHourStockData = (timeSeries) => {
    // Get all timestamps and sort them in descending order
    const timestamps = Object.keys(timeSeries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const result = {};
    for (let i = 0; i < timestamps.length; i += 2) {
        // Get the current 2-hour chunk
        const chunk = timestamps.slice(i, i + 2);
        // Aggregate data for this 2-hour chunk
        const aggregated = chunk.reduce((acc, timestamp) => {
            const hourData = timeSeries[timestamp];
            return {
                open: acc.open || hourData["1. open"],
                close: hourData["4. close"],
                high: Math.max(acc.high, parseFloat(hourData["2. high"])),
                low: Math.min(acc.low, parseFloat(hourData["3. low"])),
                volume: acc.volume + parseFloat(hourData["5. volume"])
            };
        }, {
            open: null,
            close: null,
            high: -Infinity,
            low: Infinity,
            volume: 0
        });

        // Store the aggregated data using the last timestamp of the chunk
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

const getMonths = (dateStr, monthsCount) => {
  const [year, month] = dateStr.split('-').map(Number);

  // Create an array with the number of months to include (current month + previous months)
  const monthsArray = Array.from({ length: monthsCount }, (_, i) => i);

  // Map through the array to calculate the months
  const months = monthsArray.map(i => {
    const targetDate = new Date(year, month - i - 1, 1); // Calculate target month
    const targetYear = targetDate.getFullYear();
    const targetMonth = String(targetDate.getMonth() + 1).padStart(2, '0'); // Format month
    return `${targetYear}-${targetMonth}`;
  }).reverse(); // Reverse to have months in descending order
  
  return months;
};
  
let currentDate = format(new Date(), 'yyyy-MM');
let previousMonths = []

type DataPoint = {
  [key: string]: string; // Adjust this if your data structure changes
};

type TimeSeries = {
  [timestamp: string]: DataPoint;
};

interface TimeSeriesData {
  [month: string]: TimeSeries;
}

const convertTime = (timeString: string): { timestamp: number } => {
  return { timestamp: new Date(timeString).getTime() };
};

const fetchMonthData = async (previousMonths: string[], symbol: string): Promise<TimeSeriesData> => {
  try {
    // Fetch data for all months
    const requests = previousMonths.map(async (month) => {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&month=${month}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`;
      const response = await axios.get(url);
      const data = response.data[`Time Series (60min)`];
      return data;
    });

    const resultsArray = await Promise.all(requests);

    // Merge all data
    const results = resultsArray.reduce<TimeSeriesData>((acc, curr) => {
      return { ...acc, ...curr };
    }, {} as TimeSeriesData);

    const sortedResults = Object.entries(results)
      .sort(([a], [b]) => convertTime(b).timestamp - convertTime(a).timestamp)
      .reduce<TimeSeriesData>((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as TimeSeriesData);

    return sortedResults;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


try {
  let url = ''
  let response = { data: null }
  switch (interval) {
    case '1D':
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
      response = await axios.get(url)
      return response.data[`Time Series (1min)`]
      break
    case '5D':
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
      response = await axios.get(url)
      return response.data[`Time Series (5min)`]
      break;
    case '1M':
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=30min&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
      response = await axios.get(url)
      return response.data[`Time Series (30min)`]
      break
    case '3M':
      previousMonths = getMonths(currentDate, 3); 
      const result = await fetchMonthData(previousMonths, symbol);
      return result;
      break;
    case '6M':
      previousMonths = getMonths(currentDate, 6); 
      const sixresult = await fetchMonthData(previousMonths, symbol);
      return twoHourStockData(sixresult);
      break;
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
    case '1Y':
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
      response = await axios.get(url)
      return response.data['Time Series (Daily)']
      break
    case '5Y':
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
      response = await axios.get(url)
      return response.data['Weekly Time Series']
      break;
    case 'All':
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&outputsize=full&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`
      response = await axios.get(url)
      return response.data['Monthly Time Series']
      break
  }

} catch (error) {
  console.log('Error fetching data: ', error)
  return null
}

}
