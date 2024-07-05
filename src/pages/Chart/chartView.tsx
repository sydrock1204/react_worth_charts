import { FC, useState, useEffect } from 'react'

import {
  StockPriceData,
  VolumeData,
  Point,
  PointXY,
  HoverInfo,
} from '../../utils/typing'

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

import { fetchStockData } from '../../api/fetchStockData'
import { fetchCompanyData } from '../../api/fetchCompanyData'
import { useAuthContext } from '../../context/authContext'
import { ChartOnlyView } from '../../components/chartview/chartOnlyView'
import useHeaderWidthStore from '../../context/useHeadherWidth'
import useWindowWidth from '../../context/useScreenWidth'

export const ChartView: FC = () => {
  const [data, setData] = useState<StockPriceData[]>([])
  const [volume, setVolume] = useState<VolumeData[]>([])
  const [symbol, setSymbol] = useState('TSLA')
  const [tempData, setTempData] = useState<any | null>(null)
  const [interval, setInterval] = useState('60min')
  const [lineSeries, setLineSeries] = useState<string>('bar')
  const [tempPoint, setTempPoint] = useState<Point | null>(null)
  const [hoverData, setHoverData] = useState<HoverInfo>({
    index: 0,
    open: 0,
    close: 0,
    high: 0,
    low: 0,
    volume: 0,
  })
  const [hoverTime, setHoverTime] = useState<any>(null)

  const [isVisibleDaily, setIsVisibleDaily] = useState<boolean>(false)
  const [indicatorArray, setIndicatorArray] = useState<string[]>([])
  const [companyData, setCompanyData] = useState<string>('')
  const [timeIndexArray, setTimeIndexArray] = useState<any>([])
  const [changeValue, setChangeValue] = useState({
    value: 0,
    percent: 0,
  })
  const [isVisibleIndicator, setIsVisibleIndicator] = useState<boolean>(false)
  const [controlPanelWidth, setControlPanelWidth] = useState<number>(0)

  const width = useWindowWidth()
  const headerWidth = useHeaderWidthStore(state => state.width)

  const indicators = ['RSI', 'SMA', 'EMA', 'WMA', 'ADX']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value.toUpperCase())
  }

  const selectLineStyle = () => {
    if (lineSeries == 'candlestick') {
      setLineSeries('bar')
    } else if (lineSeries == 'bar') {
      setLineSeries('candlestick')
    }
  }

  const handleTemplePoint = (point: Point) => {
    setTempPoint(point)
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
      const { stockDataSeries, tempDataArray, Volume } = await fetchStockData(
        symbol,
        interval
      )
      const companyName = await fetchCompanyData(symbol)
      setCompanyData(companyName)
      setData(stockDataSeries)
      setTempData(tempDataArray)
      setVolume(Volume)
    }
    fetchWrapper().catch(e => {
      console.log(e)
    })
  }, [symbol, interval])

  useEffect(() => {
    if (width > 1024) {
      setControlPanelWidth((width - headerWidth - 12) / 2)
    } else if (width <= 1024) {
      setControlPanelWidth(width - headerWidth - 16)
    }
  }, [width])

  return (
    <div>
      <div className="absolute w-[700px] flex flex-col z-30 lg:max-w-[370px]">
        <div
          className={`flex flex-row h-[40px] bg-white border-color-[#E0E3EB] border-b-2`}
        >
          <div className="flex flex-row">
            <div className="flex">
              <img src={MagnifierSvg} alt="magnifier" className="flex p-2" />
              <input
                className="my-[4px] mx-[2px] w-[80px] p-1 font-mono font-bold"
                value={symbol}
                onChange={handleChange}
              />
            </div>
            <div className="flex">
              <img
                src={CompareSvg}
                alt="compare"
                className="flex p-2 cursor-pointer hover:bg-gray5 border-r-2 border-b-gray-800"
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 my-1">
            <button
              className={
                interval == '1min'
                  ? 'w-[40px] cursor-pointer hover:bg-gray5 text-blue-700'
                  : 'w-[40px] cursor-pointer hover:bg-gray5'
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
            <img
              src={lineSeries === 'candlestick' ? CandleSvg : StickSvg}
              alt="stick"
              className="cursor-pointer hover:bg-gray5 mr-4"
              onClick={selectLineStyle}
            />
            <img
              src={SettingsSvg}
              alt="settings"
              className="cursor-pointer hover:bg-gray5"
            />
            <img src={IntervalSvg} className="cursor-pointer hover:bg-gray5" />
            <div className="w-1 border-r-2 border-b-gray-800" />
            <img
              src={IndicatorsSvg}
              className="cursor-pointer hover:bg-gray5"
              onClick={() => {
                setIsVisibleIndicator(!isVisibleIndicator)
              }}
            />
            {isVisibleIndicator && (
              <div className="flex flex-col absolute top-12 gap-1 left-[520px] lg:left-[320px] xl:left-[480px]">
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
          </div>
        </div>
        <div className="flex flex-col h-[40px] bg-white text-sm ml-2 mr-14">
          <div className="flex flex-row">
            {controlPanelWidth > 640 && (
              <span>{`${companyData} * ${interval} :`}</span>
            )}
            <p>{`O `}</p>
            <span
              // className="text-green-700"
              className={
                changeValue.value > 0 ? 'text-green-700' : 'text-red-700'
              }
            >
              &nbsp;{hoverData.open}&nbsp;
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
            <span
              className={
                changeValue.value > 0 ? 'text-green-700' : 'text-red-700'
              }
            >
              &nbsp;{changeValue.value.toFixed(2)}(
              {changeValue.percent.toFixed(2)}%)
            </span>
          </div>
          <div className="flex flex-row gap-2">
            <p>{`Vol`}</p>
            <span className="text-red-700">&nbsp;{hoverData.volume}&nbsp;</span>
          </div>
        </div>
      </div>
      <ChartOnlyView
        data={data}
        volume={volume}
        symbol={symbol}
        interval={interval}
        lineSeries={lineSeries}
        handleCrosshairMove={handleCrosshairMove}
        indicatorArray={indicatorArray}
        handleTemplePoint={handleTemplePoint}
      />
    </div>
  )
}
