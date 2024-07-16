import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Draggable from 'react-draggable'

import {
  StockPriceData,
  VolumeData,
  Point,
  PointXY,
  HoverInfo,
} from '../../utils/typing'
import { fetchStockData } from '../../api/fetchStockData'
import { fetchCompanyData } from '../../api/fetchCompanyData'
import { supabase } from '../../context/supabase'
import { BaseInput } from '../../components/common/BaseInput'
import { BaseSelect } from '../../components/common/BaseSelect'
import { WatchList } from './watchList'

import RemoveSvg from '../../assets/icons/Remove.png'
import {
  RectangleSelectedSvg,
  RectangleSvg,
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
  CircleSvg,
  CircleSelectedSvg,
  CalloutSvg,
  CalloutSelectedSvg,
  PriceRangeSvg,
  PriceRangeSelectedSvg,
  MagnetSvg,
  MagnetSelectedSvg,
  MagnifierSvg,
  CompareSvg,
  IntervalSvg,
  StickSvg,
  SettingsSvg,
  IndicatorsSvg,
  CandleSvg,
  ThumbSvg,
  OpenListSvg,
  CloseListSvg,
} from '../../assets/icons'
import { useAuthContext } from '../../context/authContext'
import useWindowWidth from '../../context/useScreenWidth'

import { ChartComponent } from '../../components/chartview'
import { ChartView } from './chartView'
import { FlatTree, color } from 'framer-motion'

const Chart: FC = () => {
  const navigate = useNavigate()

  const [data, setData] = useState<StockPriceData[]>([])
  const [tempData, setTempData] = useState<any | null>(null)
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [volume, setVolume] = useState<VolumeData[]>([])
  const [circlePoints, setCirclePoints] = useState<PointXY | null>(null)
  const [trendPoints, setTrendPoints] = useState<PointXY | null>(null)
  const [rectanglePoints, setRectanglePoints] = useState<PointXY | null>(null)
  const [selectDelete, setSelectDelete] = useState<boolean>(false)
  const [labelPoint, setLabelPoint] = useState<Point | null>(null)
  const [horizontalPoint, setHorizontalPoint] = useState<Point | null>(null)
  const [verticalPoint, setVerticalPoint] = useState<Point | null>(null)
  const [calloutPoint, setCalloutPoint] = useState<PointXY | null>(null)
  const [priceRangePoint, setPriceRangePoint] = useState<PointXY | null>(null)

  const width = useWindowWidth()
  const [magnet, setMagnet] = useState<boolean>(false)
  const [editType, setEditType] = useState<string>('arrow')
  const [editClickCounts, setEditClickCounts] = useState<number>(0)
  const [tempPoint, setTempPoint] = useState<Point | null>(null)
  const [symbol, setSymbol] = useState('AAPL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [interval, setInterval] = useState('60min')
  const [importLines, setImportLines] = useState<string>('')
  const [save, setSave] = useState<boolean>(false)
  const { session, user, signOutHandler, userInfo } = useAuthContext()
  const [isVisibleDaily, setIsVisibleDaily] = useState<boolean>(false)
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
  const [lineSeries, setLineSeries] = useState<string>('bar')
  const [selectedLine, setSelectedLine] = useState<any>(null)
  const [isLineSelected, setIsLineSelected] = useState<boolean>(false)
  const [selectedLineText, setSelectedLineText] = useState<string>('')
  const [selectedLineColor, setSelectedLineColor] = useState<string>('green')
  const [isVisibleIndicator, setIsVisibleIndicator] = useState<boolean>(false)
  const [indicatorArray, setIndicatorArray] = useState<string[]>([])
  const [timeIndexArray, setTimeIndexArray] = useState<any>([])
  const [lastLineJSON, setLastLineJSON] = useState<any>() // #
  const [changeValue, setChangeValue] = useState({
    value: 0,
    percent: 0,
  })

  const indicators = ['RSI', 'SMA', 'EMA', 'WMA', 'ADX']

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
      // The function you want to execute when ESC is pressed
      setIsLineSelected(false);
      // Add your function here
    }
  };

  useEffect(() => {
    // Add event listener for keydown
    document.addEventListener('keydown', handleEscKey);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);
  // 

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

  const onSaveLines = () => {
    if (!save) setSave(true)
  }

  const handleExportData = async exportLines => {
    if (!session && signOutHandler) {
      toast('session is expired!')
      signOutHandler()
      return
    }

    const { data: savedData, error: savedDataError } = await supabase
      .from('linedata')
      .select('id')
      .eq('user_id', user?.id)
      .eq('interval', interval)
      .eq('symbol', symbol)
      .limit(1)
      .select()

    if (savedData && savedData.length > 0) {
      const { data, error } = await supabase
        .from('linedata')
        .update({ linedata: exportLines })
        .eq('id', savedData[0].id)
        .select()
    } else if (savedData && savedData.length == 0) {
      await supabase
        .from('linedata')
        .insert([
          { user_id: user?.id, symbol, interval, linedata: exportLines },
        ])
    }

    // setExportLines(exportLines)
    setSave(false)
  }

  const onLoadLines = async () => {
    await loadLineData(symbol, interval)
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
      const month = dateObject.getMonth() + 1 // Add 1 to get actual month
      const day = dateObject.getDate()
      const hours = dateObject.getHours()
      const minutes = dateObject.getMinutes().toString().padStart(2, '0') // Pad minutes with leading 0 if needed

      const amPm = hours >= 12 ? 'PM' : 'AM'

      const adjustedHours = hours % 12 || 12

      setHoverTime(
        `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${amPm} ${adjustedHours}:${minutes}`
      )
    }
  }

  const loadLineData = async (symbol: string, interval: string) => {
    if (!user) {
      navigate('/auth/login')
      return
    }
    const { data, error } = await supabase
      .from('linedata')
      .select('linedata')
      .eq('user_id', user.id)
      .eq('interval', interval)
      .eq('symbol', symbol)
      .limit(1)
      .select()

    if (data && data.length > 0) {
      setImportLines(data[0].linedata)
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const selectLineStyle = () => {
    if (lineSeries == 'candlestick') {
      setLineSeries('bar')
    } else if (lineSeries == 'bar') {
      setLineSeries('candlestick')
    }
  }

  const handleChange = event => {
    setSymbol(event.target.value.toUpperCase())
  }

  const handleSelectedLineColor = (name: any, option: any) => {
    setSelectedLineColor(option)
  }
  const modalcloseHandler = () => {
    setIsLineSelected(false);
  }

  useEffect(() => {
    const fetchWrapper = async () => {
      const { stockDataSeries, tempDataArray, Volume, timeIndex } =
        await fetchStockData(symbol, interval)
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
      const { stockDataSeries, tempDataArray, Volume, timeIndex } =
        await fetchStockData(symbol, interval)
      const companyName = await fetchCompanyData(symbol)
      setCompanyData(companyName)
      setData(stockDataSeries)
      setTempData(tempDataArray)
      setTimeIndexArray(timeIndex)
      setVolume(Volume)
    }
    fetchWrapper().catch(e => {
      console.log(e)
    })
  }, [symbol, interval])

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
      case 'rectangle':
        if (editClickCounts == 0) {
          setEditClickCounts(editClickCounts + 1)
          setStartPoint(tempPoint)
        } else if (editClickCounts == 1) {
          setEditClickCounts(0)
          setRectanglePoints({ point1: startPoint, point2: tempPoint })
          setEditType('arrow')
          setStartPoint(tempPoint)
        }
        break
      case 'circle':
        if (editClickCounts == 0) {
          setEditClickCounts(editClickCounts + 1)
          setStartPoint(tempPoint)
        } else if (editClickCounts == 1) {
          setEditClickCounts(0)
          setCirclePoints({ point1: startPoint, point2: tempPoint })
          setEditType('arrow')
          setStartPoint(tempPoint)
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


  const [isDoubleClick, setIsdoubleclick] = useState<boolean>(false)

  // useEffect(() => {
  //     const handleDoubleClick = (event) => {
  //       setIsdoubleclick(true);
  //     }
  //     // Add event listener for double-click events
      // console.log('--------selectedLine----',isLineSelected);
  //     if(isLineSelected === true && isDoubleClick === true) {
  //       console.log('-----------!!!----');
  //       }
  //     window.addEventListener('dblclick', handleDoubleClick);
  //     // Clean up the event listener on component unmount
  //     return () => {
  //       window.removeEventListener('dblclick', handleDoubleClick);
  //     };
  // },[])

  return (
    <div className="flex flex-col gap-2">
      <div id="Chart" className="relative flex flex-row">
        <div className="absolute w-[800px] flex flex-col z-30 md:w-[660px]">
      {/*Header bar-----*/}
          <div className="flex flex-row h-[42.34px] bg-white border-color-[#E0E3EB] border-b-2 ">
            <div className="flex flex-row">
              <div className="flex">
                <img src={MagnifierSvg} alt="magnifier" className="w-[20.06px] h-[20.06px] ml-[11.14px] mt-[11.14px]" />
                <input
                  className="my-[4px] mx-[2px] w-[70px] p-1 font-mono font-bold text-[15.6px] "
                  value={symbol}
                  onChange={handleChange}
                  onFocus={handleOpenModal}
                />
              </div>
              <div className="flex">
                <img
                  src={CompareSvg}
                  alt="compare"
                  className="w-[31.2px] flex p-0.1 cursor-pointer hover:bg-gray5 border-r-2 border-b-gray-800"
                  // onClick={() => setSymbol(symbol)}
                />
              </div>
            </div>
            <div className="flex flex-row my-1">
              <button
                className={
                  interval == '1min'
                    ? 'w-[40px] cursor-pointer hover:bg-gray5 text-blue-700 text-16 text-black '
                    : 'w-[40px] cursor-pointer hover:bg-gray5 text-16 '
                }
                onClick={() => {
                  setInterval('1min')
                }}
              >
                1m
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
              </button>
              <p
                className={
                  ['daily', 'weekly', 'monthly'].includes(interval)
                    ? 'flex justify-center items-center w-[40px] cursor-pointer hover:bg-gray5 text-blue-700'
                    : 'flex justify-center items-center w-[40px] cursor-pointer hover:bg-gray5'
                }
              >
                {['daily', 'weekly', 'monthly'].includes(interval)
                  ? interval.slice(0, 1).toUpperCase()
                  : 'D'}
              </p>
              <img
                src={IntervalSvg}
                className="cursor-pointer hover:bg-gray5"
                onClick={() => setIsVisibleDaily(!isVisibleDaily)}
              />
              {isVisibleDaily && (
                <div className="flex flex-col absolute top-12 gap-1 left-[340px]">
                  <button
                    className="w-24 bg-[#f9f9f9] text-red-600 rounded-md"
                    onClick={() => {
                      setInterval('daily')
                      setIsVisibleDaily(!isVisibleDaily)
                    }}
                  >
                    Daily
                  </button>
                  <button
                    className="w-24 bg-[#f9f9f9] text-red-600 rounded-md"
                    onClick={() => {
                      setInterval('weekly')
                      setIsVisibleDaily(!isVisibleDaily)
                    }}
                  >
                    Weekly
                  </button>
                  <button
                    className="w-24 bg-[#f9f9f9] text-red-600 rounded-md"
                    onClick={() => {
                      setInterval('monthly')
                      setIsVisibleDaily(!isVisibleDaily)
                    }}
                  >
                    Monthly
                  </button>
                </div>
              )}
              <div className="w-2 border-r-2 border-b-gray-800" />
              <div className='flex w-[110px]'>
                <img
                  src={lineSeries === 'candlestick' ? CandleSvg : StickSvg}
                  alt="stick"
                  className="cursor-pointer hover:bg-gray5 mr-[33.43px]"
                  onClick={selectLineStyle}
                />
                <img
                  src={SettingsSvg}
                  alt="settings"
                  className="cursor-pointer hover:bg-gray5"
                />
                <img
                  src={IntervalSvg}
                  className="cursor-pointer hover:bg-gray5"
                />
              </div>
              <div className="w-1 border-r-2 border-b-gray-800" />
              <img
                src={IndicatorsSvg}
                className="cursor-pointer hover:bg-gray5"
                onClick={() => {
                  setIsVisibleIndicator(!isVisibleIndicator)
                }}
              />
              <p className='pt-1'>indicators</p>
              {isVisibleIndicator && (
                <div className="flex flex-col absolute top-12 gap-1 left-[520px]">
                  {indicators.map((value, index) => {
                    const buttonColor = indicatorArray.includes(value)
                      ? 'bg-gray4'
                      : `bg-[#f9f9f9]`

                    const indicatorButtonSelect = () => {
                      let nextIndicatorArray = indicatorArray.includes(value)
                        ? indicatorArray.filter(e => e != value)
                        : [...indicatorArray, value]
                      setIndicatorArray(nextIndicatorArray)
                      setIsVisibleIndicator(!isVisibleIndicator)
                    }
                    return (
                      <button
                        className={`w-24 ${buttonColor} text-red-600 rounded-md`}
                        onClick={indicatorButtonSelect}
                        key={index}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* <button
                className="ml-8 w-16 bg-color-brand-green rounded-md text-white"
                onClick={onSaveLines}
              >
                Save
              </button>
              <button
                className="ml-8 w-16 bg-gray3 rounded-md text-white"
                onClick={onLoadLines}
              >
                Load
              </button> */}
            </div>
          </div>
      {/* ---header bar */}
   
      {/*coordinate header display---*/}
          <div className="flex flex-col h-[40px] bg-transparent text-sm ml-2">
            <div className="flex flex-row w-[136%] mt-[7.11px]">
              <div className=" bg-black  w-[20.06px] h-[20.06px] rounded-full"></div>
              <span className='mr-4 ml-2  text-base'>{`${companyData} · ${interval} · Cboe One `}</span>
              <div className="flex rounded-full overflow-hidden w-[44.57px] h-[20.06px] mr-5 mt-0.5">
                <div className="flex-1 flex justify-center items-center relative bg-gradient-to-r from-lightgreen to-green-200 bg-[#089981] bg-opacity-20">
                  <div className="rounded-full w-[8.91px] h-[8.91px] bg-[#089981]" ></div>
                </div>
                <div className="flex-1 flex justify-center bg-[#F57C00] bg-opacity-15 items-center relative bg-gradient-to-r from-lightyellow to-yellow-200">
                  <span className="text-[#F57C00] font-bold pt-[2.5px]">D</span>
                </div>
              </div>
              <div className='flex mt-[3px] text-sm'>
                <p >{`O `}</p>
                <span
                  // className="text-green-700"
                  className={
                    changeValue.value > 0 ? 'text-green-700' : 'text-red-700'
                  }
                >
                  &nbsp;{hoverData.open}&nbsp;
                </span>
                
                <p>{`H `}</p>
                <span
                  // className="text-green-700"
                  className={
                    changeValue.value > 0 ? 'text-green-700' : 'text-red-700'
                  }
                >
                  &nbsp;{hoverData.high}&nbsp;
                </span>
                <p>{`L `}</p>
                <span
                  // className="text-green-700"
                  className={
                    changeValue.value > 0 ? 'text-green-700' : 'text-red-700'
                  }
                >
                  &nbsp;{hoverData.low}&nbsp;
                </span>
                <p>{`C `}</p>
                <span
                  // className="text-green-700"
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
            <div className='flex mt-[5px]'>
                <div className='ml-[53px] mr-3 border rounded-md pl-2 pr-2 pt-2 pb-2 border-black'>169.58</div>
                <p className='pr-3 pt-3'>0.00</p>
                <div className='border rounded-md pl-2 pr-2 pt-2 pb-2 border-blue-500 text-blue-800'>169.58</div>
            </div>
            <div className="flex flex-row gap-2 mt-3">
              <p className='ml-[53px] text-base'>{`Vol`}</p>
              <span className="text-red-700 text-base">
                &nbsp;{hoverData.volume}&nbsp;
              </span>
            </div>
          </div>
        </div>
      {/*----coordinate header display*/}

      {/* tool bar----*/}
        <div className="absolute z-20 flex flex-col w-[63px] h-[580px] bg-white top-[40px] pt-10 pb-4 px-2">
          <div className="absolute flex flex-col -ml-[10px] bg-transparent w-[61px] h-[696px] border-t border-t-gray3 border-r border-r-gray3 px-2 gap-4">
            <img
              src={editType == 'arrow' ? ArrowSelectedSvg : ArrowSvg}
              alt="Text"
              width={50}
              className=" cursor-pointer p-[10px]"
              onClick={() => {
                setEditType('arrow')
              }}
            />
            <img
              src={editType == 'label' ? TextSelectedSvg : TextSvg}
              alt="Text"
              width={30}
              className="ml-2 cursor-pointer p-1"
              onClick={() => {
                setEditType('label')
              }}
            />
            <img
              src={editType == 'trendline' ? TrendSelectedSvg : TrendSvg}
              alt="Trend"
              width={50}
              onClick={() => {
                setEditType('trendline')
              }}
              className="cursor-pointer p-1"
            />
            <img
              src={editType == 'vertical' ? VerticalSelectedSvg : VerticalSvg}
              alt="Vertical"
              onClick={() => {
                setEditType('vertical')
              }}
              className="cursor-pointer p-1"
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
              className="cursor-pointer p-1"
            />
            <img
              src={editType == 'callout' ? CalloutSelectedSvg : CalloutSvg}
              alt="Callout"
              width={50}
              onClick={() => {
                setEditType('callout')
              }}
              className="cursor-pointer p-1"
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
              className="cursor-pointer p-2"
            />
            <img
              src={magnet ? MagnetSelectedSvg : MagnetSvg}
              alt="magnet"
              width={50}
              className="cursor-pointer p-2"
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
              className="cursor-pointer p-2"
            />
          </div>
        </div>

      {/* ------tool bar */}

        <div>
          <ChartComponent
            selectDelete={selectDelete}
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
            save={save}
            handleExportData={handleExportData}
            lineSeries={lineSeries}
            importLines={importLines}
            handleSelectedLine={handleSelectedLine}
            selectedLine={selectedLine}
            selectedLineText={selectedLineText}
            indicatorArray={indicatorArray}
            symbol={symbol}
            interval={interval}
            selectLineColor={selectedLineColor}
            setLastLineJSON={setLastLineJSON} // #
            editType={editType}
          />
        </div>

        { isLineSelected === true && (
          <Draggable defaultPosition={{ x: 550, y: 100 }}>
            <div className="absolute p-2 z-30 bg-white w-[200px] h-[180px] border border-black rounded-md cursor-pointer">
            <button onClick={modalcloseHandler}>&times;</button>
              <BaseInput
                name="text"
                label="text"
                placeholder=""
                value={selectedLineText}
                handleChange={e => {
                  setSelectedLineText(e.target.value)
                }}
              />
              <BaseSelect
                name="color"
                label="color"
                options={[
                  { value: 'red', label: 'Red' },
                  { value: 'green', label: 'Green' },
                  { value: 'blue', label: 'Blue' },
                ]}
                value={selectedLineColor}
                setFieldValue={handleSelectedLineColor}
              />
            </div>
          </Draggable>
        )}

        {/* {
          (editType == 'label' && tempPoint) && (
            <input type="text" 
            placeholder='labeltext'
            />
          )
        } */}

        <WatchList />
      </div>
      {width < 1024 && (
        <div className="flex flex-col gap-2">
          <ChartView />
          <ChartView />
          <ChartView />
          <ChartView />
        </div>
      )}
      {width > 1024 && (
        <>
          <div className="flex flex-row gap-2">
            <ChartView />
            <ChartView />
          </div>
          <div className="flex flex-row gap-2">
            <ChartView />
            <ChartView />
          </div>
        </>
      )}
    </div>
  )
}

export default Chart
