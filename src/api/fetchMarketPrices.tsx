// utils/alphaVantageAPI.js

import axios from 'axios';

// Function to fetch bid and ask prices for a stock symbol
export const fetchMarketPrices = async (symbol) => {
  try {
    const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${import.meta.env.VITE_ALPHAVANTAGE_PREMIUM_KEY}`;
    const response = await axios.get(apiUrl);
    const data = response.data['Global Quote'];
    console.log('----gloabal--',data);
    if (data) {
      const bidPrice = parseFloat(data['05. price']);
      const askPrice = parseFloat(data['08. previous close']);
      return { bidPrice, askPrice };
    } else {
      throw new Error('No data available for the symbol');
    }
  } catch (error) {
    console.error('Error fetching data from Alpha Vantage:', error);
    throw error;
  }
};
