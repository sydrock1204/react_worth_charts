import { FC, useState, useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  StockPriceData,
  VolumeData,
  Point,
  PointXY,
  HoverInfo,
} from '../../utils/typing'
import { fetchStockData } from '../../api/fetchStockData'
import { fetchCompanyData } from '../../api/fetchCompanyData'
import { fetchMarketPrices } from '../../api/fetchMarketPrices'
import { BaseInput } from '../../components/common/BaseInput'
import { BaseSelect } from '../../components/common/BaseSelect'
import { WatchList } from './watchList'
import RemoveSvg from '../../assets/icons/Remove.png'
import allRemoveSvg from '../../assets/icons/allRemoveSvg.png'
import toolSvg from '../../assets/icons/tools.svg'
import {
  ArrowSvg,
  ArrowSelectedSvg,
  TextSvg,
  TextSelectedSvg,
  TrendSvg,
  TrendSelectedSvg,
  HorizontalSvg,
  HorizontalSelectedSvg,
  VerticalSvg,
  VerticalSelectedSvg,
  CalloutSvg,
  CalloutSelectedSvg,
  PriceRangeSvg,
  PriceRangeSelectedSvg,
  MagnetSvg,
  MagnetSelectedSvg,
  MagnifierSvg,
  CompareSvg,
  IntervalSvg,
  IndicatorsSvg,
  CircleSvg,
  CircleSelectedSvg,
  SettingsSvg,
} from '../../assets/icons'
import { ChartComponent } from '../../components/chartview'
import Spinner from './spinner';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { fetchCompanyName } from '../../api/fetchCompanyName'
import Modal from 'react-modal';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@nextui-org/date-picker";

const Chart: FC = () => {
  const [data, setData] = useState<StockPriceData[]>([])
  const [tempData, setTempData] = useState<any | null>(null)
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [volume, setVolume] = useState<VolumeData[]>([])
  const [trendPoints, setTrendPoints] = useState<PointXY | null>(null)
  const [rectanglePoints, setRectanglePoints] = useState<PointXY | null>(null)
  const [selectDelete, setSelectDelete] = useState<boolean>(false)
  const [labelPoint, setLabelPoint] = useState<Point | null>(null)
  const [horizontalPoint, setHorizontalPoint] = useState<Point | null>(null)
  const [verticalPoint, setVerticalPoint] = useState<Point | null>(null)
  const [calloutPoint, setCalloutPoint] = useState<PointXY | null>(null)
  const [priceRangePoint, setPriceRangePoint] = useState<PointXY | null>(null)
  const [magnet, setMagnet] = useState<boolean>(false)
  const [editType, setEditType] = useState<string>('arrow')
  const [editClickCounts, setEditClickCounts] = useState<number>(0)
  const [tempPoint, setTempPoint] = useState<Point | null>(null)
  const [symbol, setSymbol] = useState('AAPL')
  const [interval, setInterval] = useState('1D')
  const [importLines, setImportLines] = useState<string>('')
  const [isVisibleDaily, setIsVisibleDaily] = useState<boolean>(false)
  const [isVisibleSelectDate, setIsVisibleSelectDate] = useState<boolean>(false)
  const [hoverData, setHoverData] = useState<HoverInfo>({
    index: 0,
    open: 0,
    close: 0,
    high: 0,
    low: 0,
    volume: 0,
  })
  const [companyData, setCompanyData] = useState<string>('')
  const [hoverTime, setHoverTime] = useState<any>(null)
  const [selectedLine, setSelectedLine] = useState<any>(null)
  const [isLineSelected, setIsLineSelected] = useState<boolean>(false)
  const [selectedLineText, setSelectedLineText] = useState<string>('')
  const [isVisibleIndicator, setIsVisibleIndicator] = useState<boolean>(false)
  const [indicatorArray, setIndicatorArray] = useState<string[]>([])
  const [timeIndexArray, setTimeIndexArray] = useState<any>([])
  const [lastLineJSON, setLastLineJSON] = useState<any>() 
  const [changeValue, setChangeValue] = useState({
    value: 0,
    percent: 0,
  })
  const indicators = ['RSI', 'EMA', 'WMA', 'ADX']
  const [loading, setLoading] = useState(false);
  const [bidPrice, setBidPrice] = useState(null);
  const [askPrice, setAskPrice] = useState(null);
  const templeWidthRef = useRef(null);
  const [templeWidth, setTempleWidth] = useState(0);
  const [templeHeight, setTempleHeight] = useState(0);
  const [circlePoints, setCirclePoints] = useState<PointXY | null>(null)
  const [selectedToolType, setSelectedToolType] = useState<String>(null);
  const [addStock, setAddStock] = useState<any>(null);
  const [selectedLineColor, setSelectedLineColor] = useColor("#561ecb");
  const [selectTextColor, setSelectTextColor] = useColor("#000000")
  const [selectBackgroundColor, setselectBackgroundColor] = useColor("#000000");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [keywords, setKeywords] = useState<string>('APPLE');
  const [suggestionList, setSuggestionList ] = useState<any>([]); 
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [startDate1, setStartDate1] = useState<Date | null>(new Date());
  const [startDate2, setStartDate2] = useState<Date | null>(new Date());
  const [showCalendar1, setShowCalendar1] = useState(false);
  const [showCalendar2, setShowCalendar2] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [isVerticalCalendar,setIsVerticalCalendar] = useState(false);
  const [verticalDate, setVerticalDate] = useState(null)
  const [horizontalValue, setHorizontalValue] = useState(null); 
  const [utcTimestamp, setUtcTimestamp] = useState("1718928000");
  const [thickness, setThickness] = useState(2);
  const [isTextcolor, setIsTextcolor] = useState(false);
  const [isLinecolor, setIsLinecolor] = useState(false);
  const [isBackgroundcolor, setIsBackgroundcolor] = useState(false);
  const [addData, setAddData] = useState<StockPriceData[]>([])
  const [addVolume, setAddVolume] = useState<VolumeData[]>([])
  const [isAllDelete, setIsAllDelete] = useState<boolean>(false)
  const thicknessOptions = [
    { value: '1', label: '1 pixel' },
    { value: '2', label: '2 pixels' },
    { value: '3', label: '3 pixels' },
    { value: '4', label: '4 pixels' },
  ];
  const [addStockChart, setAddStockChart] = useState<string>(null)
  const [isAddStock, setIsAddStock] = useState<Boolean>(false)
  const [isIndicator, setIsIndicator] = useState<Boolean>(false)
  const selectDataRef = useRef(null)
  const draggableRef = useRef(null)
  const timeFrameRef = useRef(null)
  const indicatorRef = useRef(null)
  const textColorRef = useRef(null)
  const lineColorRef = useRef(null)
  const backgroundColorRef = useRef(null)
  const [isToolbarSelect, setIsToolbarSelect] = useState<Boolean>(false)
  const [IndicatorLoading, setIndicatorLoading] = useState<Boolean>(false);
  const handleFocus = () => setIsSearchModalOpen(true);
  
  const handleClose = (v) => setIsSearchModalOpen(false);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => 
        prevIndex === null ? 0 : (prevIndex + 1) % suggestionList.length
      );
    } else if (event.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => 
        prevIndex === null ? suggestionList.length - 1 : (prevIndex - 1 + suggestionList.length) % suggestionList.length
      );
    } else if (event.key === 'Enter') {
      if (selectedIndex !== null) {
        const firstKey = Object.keys(suggestionList[selectedIndex])[0];
        suggestItemselector(suggestionList[selectedIndex][firstKey]);
      }
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      if (templeWidthRef.current) {
        setTempleWidth(templeWidthRef.current.offsetWidth);
      }
    };

    updateWidth();

    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const updateHeight = () => {
    setTempleHeight(window.screen.height - 351)
  }

  useEffect(() => {
    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  },[])
  
  useEffect (() => { 
    if (lastLineJSON && lastLineJSON.lineTool) { 
      setSelectedLine(JSON.stringify([{ 
        id: lastLineJSON.lineTool.id(), 
        options: lastLineJSON.lineTool.options(),
        points: lastLineJSON.lineTool.points(),
        toolType: lastLineJSON.lineTool.toolType(), 
      }])) 
      setIsLineSelected(true) 
      setSelectedLineText('') 
    } 
  },  [lastLineJSON]); 

  const handleEscKey = (event) => {
    if (event.key === 'Escape') {
      setIsLineSelected(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleTemplePoint = (point: Point) => {
    setTempPoint(point)
  }

  const handleSelectedLine = (line: any) => {
    let lineJSON = JSON.parse(line)
    if (line !== '[]') {
      setSelectedLine(line)
      setIsLineSelected(true)
      setSelectedLineText(lineJSON[0].options.text.value)
    } else {
      setIsLineSelected(false)
    }
  }

  const handleCrosshairMove = (time: number) => {
    if (tempData && tempData.get(time)) {
      setHoverData(tempData.get(time))
      let pastTime = timeIndexArray[tempData.get(time)['index'] + 1]
      setChangeValue({
        value: tempData.get(time)['close'] - tempData.get(pastTime)['close'],
        percent:
          ((tempData.get(time)['close'] - tempData.get(pastTime)['close']) /
            tempData.get(pastTime)['close']) *
          100,
      })

      const dateObject = new Date(time * 1000)
      const year = dateObject.getFullYear()
      const month = dateObject.getMonth() + 1 
      const day = dateObject.getDate()
      const hours = dateObject.getHours()
      const minutes = dateObject.getMinutes().toString().padStart(2, '0') 
      const amPm = hours >= 12 ? 'PM' : 'AM'
      const adjustedHours = hours % 12 || 12

      setHoverTime(
        `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${amPm} ${adjustedHours}:${minutes}`
      )
    }
  }
 
  const modalcloseHandler = () => {
    setIsLineSelected(false);
  }

  useEffect(() => {
    const fetchWrapper = async () => {
      let { stockDataSeries, tempDataArray, Volume, timeIndex } = await fetchStockData(symbol, interval, start, end)
      setData(stockDataSeries)
      setTempData(tempDataArray)
      setVolume(Volume)
      setTimeIndexArray(timeIndex)
    }

    fetchWrapper().catch(e => {
      console.log(e)
    })

  }, [])
 
  useEffect(() => {
    const fetchWrapper = async () => {
      setLoading(true);
      try {
        let { stockDataSeries, tempDataArray, Volume, timeIndex } = await fetchStockData(symbol, interval, start, end)
        const companyName = await fetchCompanyData(symbol)
        setCompanyData(companyName)
        setData(stockDataSeries)
        setTempData(tempDataArray)
        setTimeIndexArray(timeIndex)
        setVolume(Volume)
        setLoading(true)

      } catch (err) {
        console.log('---Not found data---')
      } finally {
        setLoading(false)
      }
    }
   
    if(isAddStock) {
      const fetchAddWrapper = async () => {
        try {
        const addStockDataSeries = await fetchStockData(addStockChart, interval, start, end);
        setAddData(addStockDataSeries.stockDataSeries);
        setAddVolume(addStockDataSeries.Volume);
        } catch (err) {
          console.log('----Not found addData---')
        }
      }
      fetchAddWrapper();
    } else {
      const fetchAddWrapper = async () => {
        try {
        const addStockDataSeries = await fetchStockData('', interval, start, end);
        setAddData(addStockDataSeries.stockDataSeries);
        setAddVolume(addStockDataSeries.Volume);
        } catch (err) {
          console.log('----Not found addData---')
        }
      }
      fetchAddWrapper();
    }

    const fetchPrices = async () => {
      setLoading(true)
      try {
        const { bidPrice, askPrice } = await fetchMarketPrices(symbol);
        setBidPrice(bidPrice);
        setAskPrice(askPrice);
      } catch (error) {
        console.error('Error fetching market prices:', error);
      }
    }
    fetchWrapper();
    fetchPrices();
    
  }, [symbol, interval, start, end, addStockChart])
  
  useEffect(() => {
    switch (editType) {
      case 'trendline':
        if (editClickCounts == 0) {
          setEditClickCounts(editClickCounts + 1)
          setStartPoint(tempPoint)
        } else if (editClickCounts == 1) {
          setEditClickCounts(0)
          setTrendPoints({ point1: startPoint, point2: tempPoint })
          setEditType('arrow')
          setStartPoint(tempPoint)
          setIsLineSelected(false)
        }
        break
        case 'Circle':
          if (editClickCounts == 0) {
            setEditClickCounts(editClickCounts + 1)
            setStartPoint(tempPoint)
          } else if (editClickCounts == 1) {
            setEditClickCounts(0)
            setCirclePoints({ point1: startPoint, point2: tempPoint })
            setEditType('arrow')
            setStartPoint(tempPoint)
            setIsLineSelected(false)
          }
        break
      case 'callout':
        if (editClickCounts == 0) {
          setEditClickCounts(editClickCounts + 1)
          setStartPoint(tempPoint)
        } else if (editClickCounts == 1) {
          setEditClickCounts(0)
          setCalloutPoint({ point1: startPoint, point2: tempPoint })
          setEditType('arrow')
          setStartPoint(tempPoint)
          setIsLineSelected(false)
        }
        break
      case 'PriceRange':
        if (editClickCounts == 0) {
          setEditClickCounts(editClickCounts + 1)
          setStartPoint(tempPoint)
        } else if (editClickCounts == 1) {
          setEditClickCounts(0)
          setPriceRangePoint({ point1: startPoint, point2: tempPoint })
          setEditType('arrow')
          setStartPoint(tempPoint)
          setIsLineSelected(false)
        }
        break
      case 'label':
        setLabelPoint(tempPoint)
        setEditType('arrow')
        break
      case 'horizontal':
        setHorizontalPoint(tempPoint)
        setEditType('arrow')
        break
      case 'vertical':
        setVerticalPoint(tempPoint)
        setEditType('arrow')
        break
    }
  }, [tempPoint])

  const preventDrag = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if(selectedLine !== null ) {
      try{
        const data = JSON.parse(selectedLine);
        if (Array.isArray(data) && data.length > 0) {
          const toolType = data[0].toolType;
          setSelectedToolType(toolType);
      } else {
          console.log("Invalid data1 structure or empty array");
      }
      } catch (error) {
        console.error("Error parsing JSON:", error);
    }
    }
  }, [selectedLine])
  
  const addStockHandler = () => {
    setAddStock(symbol);
  }

  useEffect(() =>{
    const fetchData = async () => {
      try {
        const suggestionData = await fetchCompanyName(keywords);
        setSuggestionList(suggestionData);
      } catch (error) {
        console.log('Error fetching data',error);
      }
    }

    fetchData();
  },[keywords])

  const searchHandleChange = event => {
    const value = event.target.value.toUpperCase();
    setKeywords(value);
  }

  const suggestItemselector = (symbol) => {
    setSuggestionList([]);
    setSymbol(symbol);
    handleClose(true);
  }

  const indicatorButtonSelect = (value) => {
    const isValueInArray = indicatorArray.includes(value);
  
    const nextIndicatorArray = isValueInArray
      ? indicatorArray.filter(e => e !== value)  // Remove the value
      : [...indicatorArray, value];             // Add the value
    setIndicatorArray(nextIndicatorArray);
  };
  
  const horizontalKeyDown = (e) => {
    if(e.key === 'Enter') {
      setHorizontalPoint({price: horizontalValue, timestamp: 1718928000});
      e.preventDefault();
    }
  }

  const verticalValueHandler = (date) => {
    setVerticalDate(date);
    setIsVerticalCalendar(false);
    const vdate = new Date(verticalDate);
    const utcDateString = vdate.toISOString();
    const utcdate = new Date(utcDateString);
    const value = utcdate.getTime()/1000;
    setUtcTimestamp(String(value));
    setVerticalPoint({price: 200, timestamp: Number(utcTimestamp)})
  }

  const thicknessListhandler = (value) => {
    setThickness(value);
  };

  const addStockChartHandler = (addStockValue, isClicked) => {
      setAddStockChart(addStockValue);
      setIsAddStock(isClicked);
  }

  const clickOutsideSelectData = (event) => {
    if(selectDataRef.current && !selectDataRef.current.contains(event.target)) {
        setIsVisibleSelectDate(false)
        setShowCalendar1(false)
        setShowCalendar2(false)
    }
  }

  const draggableClickOutside = (event) => {
    if (draggableRef.current && !draggableRef.current.contains(event.target)) {
      setIsTextcolor(false);
      setIsLinecolor(false);
      setIsBackgroundcolor(false);
      setIsVerticalCalendar(false);
    }
  };

  const timeFrameClickOutside = (event) => {
    if(timeFrameRef.current && !timeFrameRef.current.contains(event.target)) {
      setIsVisibleDaily(false);
    }
  }

  const indicatorClickOutside = (event) => {
    if(indicatorRef.current && !indicatorRef.current.contains(event.target)) {
      setIsVisibleIndicator(false);
    }
  }

  const textcolorClickOutside = (event) => {
    if(textColorRef.current && !textColorRef.current.contains(event.target)) {
      setIsTextcolor(false);
    }
  }

  const linecolorClickOutside = (event) => {
    if(lineColorRef.current && !lineColorRef.current.contains(event.target)) {
      setIsLinecolor(false);
    }
  }

  const backgroundcolorClickOutside = (event) => {
    if(backgroundColorRef.current && !backgroundColorRef.current.contains(event.target)) {
      setIsBackgroundcolor(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', draggableClickOutside);
    document.addEventListener('mousedown', timeFrameClickOutside);
    document.addEventListener('mousedown', indicatorClickOutside);
    document.addEventListener('mousedown', textcolorClickOutside);
    document.addEventListener('mousedown', linecolorClickOutside);
    document.addEventListener('mousedown', backgroundcolorClickOutside);
    document.addEventListener('mousedown', clickOutsideSelectData);
    return () => {
      document.removeEventListener('mousedown', draggableClickOutside);
      document.removeEventListener('mousedown', timeFrameClickOutside);
      document.removeEventListener('mousedown', indicatorClickOutside);
      document.removeEventListener('mousedown', textcolorClickOutside);
      document.removeEventListener('mousedown', linecolorClickOutside);
      document.removeEventListener('mousedown', backgroundcolorClickOutside);
      document.removeEventListener('mousedown', clickOutsideSelectData);
    };
  }, []);

  const handleStartDate = (date ) => {
    const { year, month, day } = date;
    const jsDate = new Date(year, month - 1, day);
    setStartDate1(jsDate);
  }

  const handleEndDate = (date) => {
    const { year, month, day } = date;
    const jsDate = new Date(year, month - 1, day);
    setStartDate2(date);
  }

  const loadingHandler = (value) => {
    if(value === true) {
      setIndicatorLoading(true)
    } else {
      setIndicatorLoading(false)
    }
  }

  useEffect(() => {
    if(IndicatorLoading === true) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  },[IndicatorLoading])

 return (
    <div id='Chart' className="pt-[36px] pl-[13px] pr-[50px]">
      <Spinner isLoading={loading} />
      {/* main chart---- */}
      <div className="flex flex-row justify-between w-full bg-white" style={{height: `${templeHeight + 100}px`}}>
        {/* main chartView ---- */}
        <div className='flex-1'>
          {/* header bar ------- */}
          <div ref={templeWidthRef} className="flex flex-row h-[49.34px] bg-white border-color-[#E0E3EB] border-b-2 min-w-[800px]">
              <div className="flex flex-row">
                <div className="flex pt-[3px] pl-[8px]">    
                  <img src={MagnifierSvg} alt="magnifier" className="w-[20.06px]" />
                  <input 
                    type="text"
                    title='Symbol Search' 
                    className='border-2 border-gray-500 rounded-lg h-[40px] w-[94px] p-[2px] text-center'
                    onFocus={handleFocus}
                    value={symbol}
                    readOnly
                  />
                  {isSearchModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                      <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full h-3/4">
                        <button
                          className="absolute top-4 right-4 text-red-500 text-2xl hover:text-red-700"
                          onClick={handleClose}
                        >
                          &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">Symbol search</h2>
                        <div className='w-full'>
                          <input
                            title='Symbol'
                            className="text-center w-full p-1 font-mono font-bold text-[15.6px] border-b-[2px] border-b-grey-500 border-t-[2px] border-t-grey-500"
                            value={keywords}
                            onInput={searchHandleChange}
                            type="text" 
                            onKeyDown={handleKeyDown}
                          />
                            <ul>
                              <li 
                                className=" hover:bg-gray-100 flex w-[100%] pt-[8px] pb-[8px] mt-[20px]"
                              >
                                <p className='text-center w-1/2'>SYMBOL</p>  
                                <p className='text-center w-1/2'>COMPANY NAME</p>
                              </li>
                            </ul>
                            <ul className="w-full  h-[470px] overflow-y-auto">
                            {
                              suggestionList !== undefined && suggestionList.length > 0 && (
                                suggestionList.map((item, index) => {
                                  const keys = Object.keys(item);
                                  if (keys.length < 2) {
                                    return null;
                                  }
                                  const firstKey = Object.keys(item)[0];
                                  const secondeKey = Object.keys(item)[1];
                                  return (
                                    <li 
                                      key={index} 
                                      onClick={() => suggestItemselector(item[firstKey])} 
                                      className={` hover:bg-gray-100 flex w-[100%] pt-[8px] pb-[8px] ${index === selectedIndex ? 'bg-gray-100' : ''}`}
                                    >
                                      <p className='text-center w-1/2'>{item[firstKey]}</p>  
                                      <p className='text-center w-1/2'>{item[secondeKey]}</p>
                                    </li>
                                  );
                                })
                              )
                            }
                            {
                              suggestionList == undefined && (
                                <li className='h-[470px] flex justify-center items-center text-center text-[24px] '>no data</li>
                              )
                            }
                            </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex">
                    <img
                      src={CompareSvg}
                      alt="compare"
                      className="w-[31.2px] flex p-0.1 cursor-pointer hover:bg-gray5 border-r-2 border-b-gray-800"
                      onClick={addStockHandler}
                    />
                  </div>
                </div>
              </div>
            <div className="flex flex-row my-1">
              {/* <button
                className={
                  interval == '15min'
                    ? 'w-[40px] cursor-pointer hover:bg-gray5 text-blue-700 text-16 text-black '
                    : 'w-[40px] cursor-pointer hover:bg-gray5 text-16 '
                }
                onClick={() => {
                  setInterval('15min')
                }}
              >
                15m
              </button>
              <button
                className={
                  interval == '30min'
                    ? 'w-[40px] cursor-pointer hover:bg-gray5 text-blue-700'
                    : 'w-[40px] cursor-pointer hover:bg-gray5'
                }
                onClick={() => {
                  setInterval('30min')
                }}
              >
                30m
              </button>
              <button
                className={
                  interval == '60min'
                    ? 'w-[40px] cursor-pointer hover:bg-gray5 text-blue-700'
                    : 'w-[40px] cursor-pointer hover:bg-gray5'
                }
                onClick={() => {
                  setInterval('60min')
                }}
              >
                1h
              </button> */}
              <p
                className={
                  ['1D','5D','1W', '1M','3M','6M','1Y','5Y'].includes(interval)
                    ? 'flex justify-center items-center w-[40px] cursor-pointer hover:bg-gray5 text-blue-700'
                    : 'flex justify-center items-center w-[40px] cursor-pointer hover:bg-gray5'
                }
              >
                {['1D','5D','1W', '1M','3M','6M','1Y','5Y'].includes(interval)
                  ? interval.slice(0, 2).toUpperCase()
                  : '1D'}
              </p>
              <div ref={timeFrameRef} className='z-[40]'>
                <img
                  src={IntervalSvg}
                  alt=''
                  className="cursor-pointer hover:bg-gray5"
                  onClick={() => setIsVisibleDaily(!isVisibleDaily)}
                />
                {isVisibleDaily && (
                  <div 
                    className="flex flex-col top-12 gap-1 absolute  mt-[130px]" 
                  >
                    <button
                      className="w-24 bg-[#f9f9f9] text-red-600 rounded-md"
                      onClick={() => {
                        setInterval('1D')
                        setIsVisibleDaily(!isVisibleDaily)
                      }}
                    >
                      1D
                    </button>
                    <button
                      className="w-24 bg-[#f9f9f9] text-red-600 rounded-md"
                      onClick={() => {
                        setInterval('5D')
                        setIsVisibleDaily(!isVisibleDaily)
                      }}
                    >
                      5D
                    </button>
                    <button
                      className="w-24 bg-[#f9f9f9] text-red-600 rounded-md"
                      onClick={() => {
                        setInterval('1W')
                        setIsVisibleDaily(!isVisibleDaily)
                      }}
                    >
                      1W
                    </button>
                    <button
                      className="w-24 bg-[#f9f9f9] text-red-600 rounded-md"
                      onClick={() => {
                        setInterval('1M')
                        setIsVisibleDaily(!isVisibleDaily)
                      }}
                    >
                      1M
                    </button>
                    <button
                      className="w-24 bg-[#f9f9f9] text-red-600 rounded-md"
                      onClick={() => {
                        setInterval('3M')
                        setIsVisibleDaily(!isVisibleDaily)
                      }}
                    >
                      3M
                    </button>
                    <button
                      className="w-24 bg-[#f9f9f9] text-red-600 rounded-md"
                      onClick={() => {
                        setInterval('6M')
                        setIsVisibleDaily(!isVisibleDaily)
                      }}
                    >
                      6M
                    </button>
                    <button
                      className="w-24 bg-[#f9f9f9] text-red-600 rounded-md"
                      onClick={() => {
                        setInterval('1Y')
                        setIsVisibleDaily(!isVisibleDaily)
                      }}
                    >
                      1Y
                    </button>
                    <button
                      className="w-24 bg-[#f9f9f9] text-red-600 rounded-md"
                      onClick={() => {
                        setInterval('5Y')
                        setIsVisibleDaily(!isVisibleDaily)
                      }}
                    >
                      5Y
                    </button>
                  </div>
                )}
              </div>
              <div 
                className={`flex-row flex justify-center hover:bg-gray5 ${isVisibleSelectDate&& 'bg-gray5'} p-[5px]`}
                ref={selectDataRef} 
              >
                <div                 
                  onClick={() => {
                  setIsVisibleSelectDate(!isVisibleSelectDate)}}
                  className='flex'
                >
                  <button>Select Date</button>
                  <img
                    src={IntervalSvg}
                    alt=''
                    className="cursor-pointer hover:bg-gray5"
                  />
                </div>
                  {isVisibleSelectDate && (
                    <div  className="flex flex-col gap-1 absolute mt-12 bg-white border border-gray-300  z-[34]">
                      <div className="relative">
                        <div className='flex'>
                          <div className='flex items-center p-[5px]'>
                            <DatePicker 
                              label="First"
                              className='border border-gray-300 rounded-md w-[140px]'
                              classNames={{
                                calendar: "bg-white border border-gray-300 ",
                              }}
                              onChange={handleStartDate}
                            />  
                          </div>
                        </div>
                        <div className='flex'>
                          <div className='flex items-center p-[5px]'>
                            <DatePicker 
                              label="End"
                              className='ml-[5px] border border-gray-300 rounded-md w-[140px]'
                              classNames={{
                                calendar: "bg-white border border-gray-300 ",
                              }}
                              onChange={handleEndDate}
                            />  
                          </div>
                        </div>
                      </div>
                      <button onClick={() => {
                          if(startDate1 !== null || startDate2 !== null) {
                              if(interval === '15min' || interval === '30min' || interval === '60min') {
                                alert('Not support function!')
                                return;
                              }
                              if(startDate1 >= startDate2) {
                                alert('error! start should be before that end date');
                                return;
                              }
                            }
                            setStart(startDate1);
                            setEnd(startDate2);
                            setIsVisibleSelectDate(false)
                          }}
                          className='p-[5px] m-[5px] bg-gray-400 hover:bg-gray-200'
                      >
                        submit
                      </button>
                    </div>
                  )}
              </div>
              <div className="w-2 border-r-2 border-b-gray-800" />
              <div className='flex'>
                <img
                  src={SettingsSvg}
                  alt="settings"
                  className="cursor-pointer hover:bg-gray5"
                />
                <img
                  src={IntervalSvg}
                  alt=''
                  className="cursor-pointer hover:bg-gray5"
                  onClick={() => {
                    setIsVisibleIndicator(!isVisibleIndicator)
                  }}
                />
                {isVisibleIndicator && (
                  <div 
                    className="flex flex-col top-12 gap-1 left-[520px] z-[11]"
                    ref={indicatorRef}
                  >
                    {indicators.map((value, index) => {
                      const buttonColor = indicatorArray.includes(value)
                        ? 'bg-gray4'
                        : `bg-[#f9f9f9]`

                      return (
                        <button
                          className={`w-24 ${buttonColor} text-red-600 rounded-md`}
                          onClick={() => {indicatorButtonSelect(value); setIsVisibleIndicator(!isVisibleIndicator)}}
                          key={index}
                        >
                          {value}
                        </button>
                      )
                    })}
                  </div>
                )}
              <div className="w-1 border-r-2 border-b-gray-800" />
              <img
                src={IndicatorsSvg}
                className={`cursor-pointer hover:bg-gray5 ${isIndicator && 'bg-gray-200'}`}
                alt=''
                onClick={() => {
                  indicatorButtonSelect('SMA')
                  setIsIndicator(!isIndicator)
                }}
              />
              <p className='pt-1'>Indicators</p>
              </div>
            </div>
            <div className='bg-gray-300 w-[50px] ml-auto'></div>
          </div>
          {/* ------ header bar */}
          {/* coordinate bar --- */}
          <div className="flex flex-col h-[40px]  text-sm ml-2 bg-white min-w-[800px]">
            <div className="flex flex-row w-[136%] mt-[7.11px]">
              <div className=" bg-black  w-[20.06px] h-[20.06px] rounded-full"></div>
              <span className='mr-4 ml-2  text-base'>{`${companyData} · ${interval} · Cboe One `}</span>
              <div className="flex rounded-full overflow-hidden w-[44.57px] h-[20.06px] mr-5 mt-0.5">
                <div className="flex-1 flex justify-center items-center relative bg-gradient-to-r from-lightgreen to-green-200 bg-[#089981] bg-opacity-20">
                  <div className="rounded-full w-[8.91px] h-[8.91px] bg-[#089981]" ></div>
                </div>
                <div className="flex-1 flex justify-center bg-[#F57C00] bg-opacity-15 items-center relative bg-gradient-to-r from-lightyellow to-yellow-200 ">
                  <span className="text-[#F57C00] font-bold pt-[2.5px]" >D</span>
                </div>
              </div>
              <div className='flex mt-[3px] text-sm'>
                <p >{`O `}</p>
                <span
                  className={
                    changeValue.value > 0 ? 'text-green-700' : 'text-red-700'
                  }
                >
                  &nbsp;{hoverData.open}&nbsp;
                </span>
                <p>{`H `}</p>
                <span
                  className={
                    changeValue.value > 0 ? 'text-green-700' : 'text-red-700'
                  }
                >
                  &nbsp;{hoverData.high}&nbsp;
                </span>
                <p>{`L `}</p>
                <span
                  className={
                    changeValue.value > 0 ? 'text-green-700' : 'text-red-700'
                  }
                >
                  &nbsp;{hoverData.low}&nbsp;
                </span>
                <p>{`C `}</p>
                <span
                  className={
                    changeValue.value > 0 ? 'text-green-700' : 'text-red-700'
                  }
                >
                  &nbsp;{hoverData.close}&nbsp;
                </span>
                <span
                  className={
                    changeValue.value > 0 ? 'text-green-700' : 'text-red-700'
                  }
                >
                  &nbsp;{changeValue.value.toFixed(2)}(
                  {changeValue.percent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className='flex mt-[5px] ml-[3px] z-30 w-[300px]'>
                <div className='w-[70px] h-[37px] ml-[53px] mr-3 border rounded-md text-center align-center border-black pt-[7px]'>{bidPrice}</div>
                <p className='pr-3 pt-3'>0.00</p>
                <div className='w-[70px] h-[37px] border rounded-md text-center pt-2 border-blue-500 text-blue-800'>{askPrice}</div>
            </div>
            <div className="flex flex-row gap-2 mt-3">
              <p className='ml-[53px] text-base'>{`Vol`}</p>
              <span className="text-red-700 text-base">
                &nbsp;{hoverData.volume}&nbsp;
              </span>
            </div>
          </div>
          {/* ---- coordinate bar */}
  
          {/* main display ----- */}
          <div className='flex relative visible'>
            <div className="z-[40]" >
              <img src={toolSvg} alt="tool" onClick={() => setIsToolbarSelect(!isToolbarSelect)} className={`w-[35px] h-auto ml-[10px] p-[3px] border border-black rounded-[8px] ${isToolbarSelect ? "bg-gray-400" : "bg-white"}`}/>
            </div>
            {
              isToolbarSelect && (
                <div className="w-[52px] bg-white pt-[3px] pb-4 absolute top-[40px] left-[7px]  z-20 border-[2px] border-grey ">
                  <div>
                    <img
                      src={editType == 'arrow' ? ArrowSelectedSvg : ArrowSvg}
                      alt="Text"
                      width={50}
                      className=" cursor-pointer p-1 ml-[5px] w-[35px] h-auto"
                      onClick={() => {
                        setEditType('arrow')
                      }}
                    />
                    <img
                      src={editType == 'label' ? TextSelectedSvg : TextSvg}
                      alt="Text"
                      width={30}
                      className="ml-2 cursor-pointer p-1 ml-[10px] w-[25px] h-auto"
                      onClick={() => {
                        setEditType('label')
                      }}
                    />
                    <img
                      src={editType == 'Circle' ? CircleSelectedSvg : CircleSvg}
                      alt="Text"
                      width={30}
                      className="ml-2 cursor-pointer p-1  w-[30px] h-auto"
                      onClick={() => {
                        setEditType('Circle')
                      }}
                    />
                    <img
                      src={editType == 'trendline' ? TrendSelectedSvg : TrendSvg}
                      alt="Trend"
                      width={50}
                      onClick={() => {
                        setEditType('trendline')
                      }}
                      className="cursor-pointer p-1 ml-[5px] w-[35px] h-auto"
                    />
                    <img
                      src={editType == 'vertical' ? VerticalSelectedSvg : VerticalSvg}
                      alt="Vertical"
                      onClick={() => {
                        setEditType('vertical')
                      }}
                      className="cursor-pointer p-1 ml-[3px] w-[38px] h-auto"
                    />
                    <img
                      src={
                        editType == 'horizontal' ? HorizontalSelectedSvg : HorizontalSvg
                      }
                      alt="Horizontal"
                      width={50}
                      onClick={() => {
                        setEditType('horizontal')
                      }}
                      className="cursor-pointer p-1  ml-[5px] w-[40px] h-auto"
                    />
                    <img
                      src={editType == 'callout' ? CalloutSelectedSvg : CalloutSvg}
                      alt="Callout"
                      width={50}
                      onClick={() => {
                        setEditType('callout')
                      }}
                      className="cursor-pointer p-1  ml-[3px] w-[40px] h-auto"
                    />
                    <img
                      src={
                        editType == 'PriceRange' ? PriceRangeSelectedSvg : PriceRangeSvg
                      }
                      alt="priceRange"
                      width={50}
                      onClick={() => {
                        setEditType('PriceRange')
                      }}
                      className="cursor-pointer p-1  ml-[9px] w-[35px] h-auto"
                    />
                    <img
                      src={magnet ? MagnetSelectedSvg : MagnetSvg}
                      alt="magnet"
                      width={50}
                      className="cursor-pointer p-1 ml-[3px] w-[41px] h-auto"
                      onClick={() => {
                        setMagnet(!magnet)
                      }}
                    />
                    <img
                      src={RemoveSvg}
                      alt="Remove"
                      width={50}
                      onClick={() => {
                        setSelectDelete(!selectDelete)
                        setIsLineSelected(false)
                      }}
                      className="cursor-pointer p-1 ml-[4px] w-[38px] h-auto"
                    />
                    <img
                      src={allRemoveSvg}
                      alt="allRemove"
                      width={50}
                      onClick={() => {
                        setIsAllDelete(true);
                        setTimeout(() => {
                          setIsAllDelete(false);
                        }, 1000)
                      }}
                      className="cursor-pointer p-1 ml-[3px] w-[38px] h-auto"
                    />
                  </div>
                </div> 
              )
            }
            {/* !!! */}
            <div className='absolute inset-0  z-10'>
              <ChartComponent
                data={data}
                volume={volume}
                circlePoint={circlePoints}
                trendPoints={trendPoints}
                rectanglePoints={rectanglePoints}
                labelPoint={labelPoint}
                horizontalPoint={horizontalPoint}
                verticalPoint={verticalPoint}
                calloutPoint={calloutPoint}
                priceRangePoint={priceRangePoint}
                magnet={magnet}
                handleTemplePoint={handleTemplePoint}
                handleCrosshairMove={handleCrosshairMove}
                importLines={importLines}
                handleSelectedLine={handleSelectedLine}
                selectedLine={selectedLine}
                selectedLineText={selectedLineText}
                indicatorArray={indicatorArray}
                symbol={symbol}
                interval={interval}
                selectLineColor={selectedLineColor}
                selectTextColor={selectTextColor}
                selectBackgroundColor={selectBackgroundColor}
                setLastLineJSON={setLastLineJSON}
                editType={editType}
                templeWidth={templeWidth}
                selectDelete={selectDelete}
                selectedToolType={selectedToolType}
                thickness={thickness}
                addData={addData}
                addVolume={addVolume}
                isAddStock={isAddStock}
                templeHeight={templeHeight}
                isAllDelete={isAllDelete}
                loadingHandler={loadingHandler}
              />
            </div>
            {/* !!!!! */}
            { isLineSelected === true && (
              <Draggable defaultPosition={{ x: 300, y: 100 }}>
                <div className="p-3 z-30 bg-white w-[340px] h-auto cursor-pointer border-[1px] border-black" ref={draggableRef} >
                  <div>
                    <CloseIcon onClick={modalcloseHandler} className='float-right text-xl' />
                  </div>
                  <br /><hr />
                  <div>
                    <div className='p-2'>
                      <BaseInput
                        name="text"
                        label="text:"
                        placeholder=""
                        value={selectedLineText}
                        handleChange={e => {
                          setSelectedLineText(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                  <hr />
                  <div>
                    <div className='p-2'>
                      <BaseSelect 
                        name='thickness'
                        label='thickness:'
                        options={thicknessOptions}
                        value={String(thickness)}
                        isClearable={false}
                        setFieldValue={(field, value) => thicknessListhandler(value)}
                      />
                    </div>
                  </div>
                  {(selectedToolType == "HorizontalLine" || selectedToolType == "VerticalLine") && (
                  <div>
                    <hr />
                    <div className='p-2'>
                      move to:
                        <div>
                          {(selectedToolType == "HorizontalLine") && (
                            <input 
                              type="text"
                              value={horizontalValue}
                              onChange={(e) => setHorizontalValue(e.target.value)}
                              onKeyDown={horizontalKeyDown}
                              className='p-2 border-[1px] w-full border-green-400 h-[34px] rounded-md'
                            />
                          )}
                          {(selectedToolType == "VerticalLine") && (
                            <div>
                              <DatePicker 
                                label='Date'
                                className='border border-gray-300 rounded-md w-full'
                                classNames={{
                                  calendar: "bg-white border border-gray-300 ",
                                }}
                                onChange={(date) => {
                                  const { year, month, day } = date;
                                  const jsDate = new Date(year, month - 1, day);
                                  verticalValueHandler(jsDate)
                                }}
                              />
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                  )}
                  <hr />
                  <div>
                    <div className='p-2'>
                      color
                      <div className='p-2 flex'>
                       text: <div className="w-[20px] h-[20px] rounded-md ml-[65px]"
                                style={{backgroundColor: selectTextColor.hex}} 
                                onClick={() => {setIsTextcolor(!isTextcolor); setIsLinecolor(false); setIsBackgroundcolor(false)}}/> 
                      </div>
                      <div>
                        { isTextcolor &&(
                          <div onMouseDown={preventDrag} ref={textColorRef}> 
                            <ColorPicker color={selectTextColor} onChange={setSelectTextColor} />
                          </div>
                        )}
                      </div>
                      {(selectedToolType !== 'Text') && (
                        <div>
                          <div className='p-2 flex'>
                            line: <div 
                                    className='bg-red-400 w-[20px] h-[20px] rounded-md ml-[65px]'
                                    style={{backgroundColor: selectedLineColor.hex}}
                                    onClick={() => {setIsLinecolor(!isLinecolor); setIsTextcolor(false);  setIsBackgroundcolor(false)}}/>
                          </div>
                          <div>
                            { isLinecolor && (
                              <div onMouseDown={preventDrag} ref={lineColorRef}> 
                                <ColorPicker color={selectedLineColor} onChange={setSelectedLineColor} />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {(selectedToolType == 'Circle' || selectedToolType == 'PriceRange'|| selectedToolType == 'Callout') && (
                        <div>
                          <div className='p-2 flex'>
                            background: <div 
                                          className='bg-blue-400 w-[20px] h-[20px] rounded-md ml-[13px]'
                                          style={{backgroundColor: selectBackgroundColor.hex}}
                                          onClick={() => {setIsBackgroundcolor(!isBackgroundcolor); setIsTextcolor(false); setIsLinecolor(false)}}/>
                          </div>
                          <div>
                            { isBackgroundcolor && (
                              <div onMouseDown={preventDrag} ref={backgroundColorRef}> 
                                <ColorPicker color={selectBackgroundColor} onChange={setselectBackgroundColor} />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <hr />
                </div>
             </Draggable>
            )}
          </div>
          {/* -----main display */}
        </div>
        {/* ---main chartView */}
        {/* Watchlist------ */}

        <div className='bg-white border-l-[2px] border-l-grey'>
          <WatchList 
            addStockfromheader={addStock}
            addStockChartHandler={ addStockChartHandler}
            symbol={symbol}
            isAddStock={isAddStock}
          />
        </div>
        {/* -----Watchlist */}
      </div>
      {/* ----main chart*/}
    </div>
  )
}

export default Chart
