import { fetchData } from './fetchData'
import { getTimeStamp } from '../utils/getTimeStamp'

export const fetchStockData = async (symbol: string, interval: string, start: Date, end:Date) => {
  
  const rawData = await fetchData(symbol, interval);
  let newData = {};
  
  if(start === null && end === null) {
      switch(interval) {
      case '1D':
        let prevDate = null;
        for(const date in rawData) {
          const currentDate = date.split(' ')[0];
         
          if(prevDate != currentDate && prevDate !== null) {
            break;
          }
          prevDate = currentDate;
          newData[date] = rawData[date];
        }
        
        break;
      case '5D':
        let fiveprevDate = null;
        let fivecount = 0;
        for(const date in rawData) {
          const currentDate = date.split(' ')[0];
          
          if(fiveprevDate != currentDate && fiveprevDate !== null) {
            fivecount++;
            if(fivecount === 5) {
              break;
            }
          }
          fiveprevDate = currentDate;
          newData[date] = rawData[date];
        }
        
        break;
      case '1M':
        let prevMonth = null;
        for(const date in rawData) {
          const currentMonth = date.split('-')[1];

          if(prevMonth!= currentMonth && prevMonth !== null) {
            break;
          }
          prevMonth = currentMonth;
          newData[date] = rawData[date];;
        }
        
        break;
      case '3M':
        // let threePrevMonth = null;
        // let threeCount = 0;
        // for(const date in rawData) {
        //   const currentDate = date.split('-')[1];
        //   if(threePrevMonth != currentDate && threePrevMonth !== null) {
        //     threeCount++;
        //     if(threeCount === 3) {
        //       break;
        //     }
        //   }
        //   threePrevMonth = currentDate;
        //   newData[date] = rawData[date];
        // }
        newData = rawData;
        break;
      case '6M':
        // let sixPrevMonth = null;
        // let sixCount = 0;
        // for(const date in rawData) {
        //   const currentDate = date.split('-')[1];
        //   if(sixPrevMonth != currentDate && sixPrevMonth !== null) {
        //     sixCount++;
        //     if(sixCount === 6) {
        //       break;
        //     }
        //   }
        //   sixPrevMonth = currentDate;
        //   newData[date] = rawData[date];
        // }
        newData = rawData;
        break;
      case '1Y':
        let prevYear = null;
        for(const date in rawData) {
          const currentDate = date.split('-')[0];
         
          if(prevYear != currentDate && prevYear !== null) {
            break;
          }
          prevYear = currentDate;
          newData[date] = rawData[date];
        }
        
        break;
      case '5Y':
        let fiveprevYear = null;
        let fiveYearcount = 0;
        for(const date in rawData) {
          const currentDate = date.split('-')[0];
          
          if(fiveprevYear != currentDate && fiveprevYear !== null) {
            fiveYearcount++;
            if(fiveYearcount === 5) {
              break;
            }
          }
          fiveprevYear = currentDate;
          newData[date] = rawData[date];
        }
      
        break;
      case 'All':
        newData = rawData;
        break;
    }
  }else {
      if (start === null ) {
        start = new Date("Sat Dec 03 1999 00:00:00 GMT-0400")
      } 

      if (end === null) {
        end = new Date();
      }
     
      const startDate = start.toISOString().split('T')[0];
      const endDate = end.toISOString().split('T')[0];

      for (const date in rawData ) {
        if (date >= startDate && date <=endDate) {
          newData[date] = rawData[date];
        }
      }
      
  }
  
  const stockDataSeries = Object.entries(newData)
    .map(data => {
      const stockData = {
        time: getTimeStamp(data[0]),
        open: Number(data[1]['1. open']),
        high: Number(data[1]['2. high']),
        low: Number(data[1]['3. low']),
        close: Number(data[1]['4. close']),
      }
      return stockData
    })
    .reverse()

  const timeData = Object.entries(newData)
    .map((data, index) => {
      const stockData = [
        getTimeStamp(data[0]),
        {
          index: index,
          open: Number(data[1]['1. open']),
          high: Number(data[1]['2. high']),
          low: Number(data[1]['3. low']),
          close: Number(data[1]['4. close']),
          volume: Number(data[1]['5. volume']),
        },
      ]
      return stockData
    })
    .reverse()

  // @ts-ignore
  const tempDataArray = new Map(timeData)

  const Volume = Object.entries(newData)
  .map((data, index) => {
    const volumeData = {
      time: getTimeStamp(data[0]),
      value: Number(data[1]['5. volume']),
      index: index,
    }
    return volumeData
  })
  .reverse()

  const timeIndex = Object.entries(newData).map((data, index) => {
    return getTimeStamp(data[0])
  })

  return {
    stockDataSeries,
    tempDataArray,
    Volume,
    timeIndex,
  }
}
