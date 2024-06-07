import axios from "axios"

export const fetchData = async (symbol:string) => {
    try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=NH0VSFDQ9H140BGJ`)
        // console.log(Object.entries(response.data["Time Series (1min)"]))
        return response.data["Time Series (1min)"]
    } catch (error) {
        console.log('Error fetching data: ', error)
        return null
    }
}