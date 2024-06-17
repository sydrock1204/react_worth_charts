import { FC, useState, useEffect } from 'react'
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
import { supabase } from '../../context/supabase'

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
} from '../../assets/icons'
import { useAuthContext } from '../../context/authContext'

import { ChartComponent } from '../../components/chartview'

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

  const [magnet, setMagnet] = useState<boolean>(false)
  const [editType, setEditType] = useState<string>('arrow')
  const [editClickCounts, setEditClickCounts] = useState<number>(0)
  const [tempPoint, setTempPoint] = useState<Point | null>(null)
  const [symbol, setSymbol] = useState('AAPL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [interval, setInterval] = useState('60min')
  // const [exportLines, setExportLines] = useState([])
  const [save, setSave] = useState<boolean>(false)
  const { session, user, signOutHandler } = useAuthContext()
  const [isVisibleDaily, setIsVisibleDaily] = useState<boolean>(false)
  const [hoverData, setHoverData] = useState<HoverInfo>({
    index: 0,
    open: 0,
    close: 0,
    high: 0,
    low: 0,
    volume: 0,
  })

  const handleTemplePoint = (point: Point) => {
    // console.log('point: ', point)

    setTempPoint(point)
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
    console.log('O H L C', tempData.get(time))
    if (tempData.get(time)) {
      // console.log('!!!')
      setHoverData(tempData.get(time))
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
      const lineDataArray = JSON.parse(data[0].linedata)
      lineDataArray.map(lineData => {
        console.log(lineData)
        switch (lineData.toolType) {
          case 'Rectangle':
            setRectanglePoints({
              point1: lineData.points[0],
              point2: lineData.points[1],
            })
            break
          case 'Circle':
            setCirclePoints({
              point1: lineData.points[0],
              point2: lineData.points[1],
            })
            break
          case 'Callout':
            setCalloutPoint({
              point1: lineData.points[0],
              point2: lineData.points[1],
            })
            break
          case 'Text':
            setLabelPoint(lineData.points[0])
            break
          case 'TrendLine':
            setTrendPoints({
              point1: lineData.points[0],
              point2: lineData.points[1],
            })
            break
          case 'PriceRange':
            setPriceRangePoint({
              point1: lineData.point[0],
              point2: lineData.point[1],
            })
            break
          case 'HorizontalLine':
            setHorizontalPoint(lineData.points[0])
            break
          case 'VerticalLine':
            setVerticalPoint(lineData.points[0])
            break
        }
      })
      // setExportLines(JSON.parse(lineDataArray))
    }
  }

  useEffect(() => {
    const fetchWrapper = async () => {
      const { stockDataSeries, tempDataArray, Volume } = await fetchStockData(
        symbol,
        interval
      )
      setData(stockDataSeries)
      setTempData(tempDataArray)
      setVolume(Volume)
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
      setData(stockDataSeries)
      setTempData(tempDataArray)
      setVolume(Volume)
    }

    fetchWrapper().catch(e => {
      console.log(e)
    })
  }, [symbol, interval])

  useEffect(() => {
    // console.log('tempPoint', tempPoint, 'editClickCounts', editClickCounts)
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
      case 'pricerange':
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

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleChange = event => {
    setSymbol(event.target.value.toUpperCase())
  }

  return (
    <div id="Chart" className="relative flex flex-row">
      <div className="absolute w-[800px] flex flex-col z-30 ">
        <div className="flex flex-row h-[40px] bg-white border-color-[#E0E3EB] border-b-2">
          <div className="flex flex-row">
            <div className="flex">
              <img src={MagnifierSvg} alt="magnifier" className="flex p-2" />
              <input
                className="my-[4px] mx-[2px] w-[100px] p-1 font-mono font-bold"
                value={symbol}
                onChange={handleChange}
                onFocus={handleOpenModal}
              />
            </div>
            <div className="flex">
              <img
                src={CompareSvg}
                alt="compare"
                className="flex p-2 cursor-pointer hover:bg-gray5 border-r-2 border-b-gray-800"
                // onClick={() => setSymbol(symbol)}
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
                  className="w-24 bg-color-brand-green text-red-600 rounded-md"
                  onClick={() => {
                    setInterval('daily')
                    setIsVisibleDaily(!isVisibleDaily)
                  }}
                >
                  Daily
                </button>
                <button
                  className="w-24 bg-color-brand-green text-red-600 rounded-md"
                  onClick={() => {
                    setInterval('weekly')
                    setIsVisibleDaily(!isVisibleDaily)
                  }}
                >
                  Weekly
                </button>
                <button
                  className="w-24 bg-color-brand-green text-red-600 rounded-md"
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
              src={StickSvg}
              alt="stick"
              className="cursor-pointer hover:bg-gray5 mr-4"
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
            />
            <button
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
            </button>
          </div>
        </div>
        <div className="flex flex-row h-[40px] bg-transparent">
          <p>{`Open: `}</p>
          <span className="text-red-700">{hoverData.open}&nbsp;</span>
          <p>{`Close: `}</p>
          <span className="text-red-700">{hoverData.close}&nbsp;</span>
          <p>{`High: `}</p>
          <span className="text-red-700">{hoverData.high}&nbsp;</span>
          <p>{`Low: `}</p>
          <span className="text-red-700">{hoverData.low}&nbsp;</span>
          <p>{`Volume: `}</p>
          <span className="text-red-700">{hoverData.volume}&nbsp;</span>
        </div>
      </div>
      <div className="absolute z-20 flex flex-col w-[61px] h-[640px]  bg-white top-[40px] pt-10 pb-4 px-2 gap-4">
        <img
          src={editType == 'arrow' ? ArrowSelectedSvg : ArrowSvg}
          alt="Text"
          width={50}
          className="cursor-pointer"
          onClick={() => {
            setEditType('arrow')
          }}
        />
        <img
          src={editType == 'label' ? TextSelectedSvg : TextSvg}
          alt="Text"
          width={30}
          className="ml-2 cursor-pointer"
          onClick={() => {
            setEditType('label')
          }}
        />
        <img
          src={editType == 'circle' ? CircleSelectedSvg : CircleSvg}
          alt="Circle"
          width={50}
          onClick={() => {
            setEditType('circle')
          }}
          className="cursor-pointer"
        />
        <img
          src={editType == 'vertical' ? VerticalSelectedSvg : VerticalSvg}
          alt="Vertical"
          onClick={() => {
            setEditType('vertical')
          }}
          className="cursor-pointer"
        />
        <img
          src={editType == 'trendline' ? TrendSelectedSvg : TrendSvg}
          alt="Trend"
          width={50}
          onClick={() => {
            setEditType('trendline')
          }}
          className="cursor-pointer"
        />
        <img
          src={editType == 'horizontal' ? HorizontalSelectedSvg : HorizontalSvg}
          alt="Horizontal"
          width={50}
          onClick={() => {
            setEditType('horizontal')
          }}
          className="cursor-pointer"
        />
        <img
          src={editType == 'rectangle' ? RectangleSelectedSvg : RectangleSvg}
          alt="Rectangle"
          width={50}
          onClick={() => {
            setEditType('rectangle')
          }}
          className="cursor-pointer"
        />
        <img
          src={editType == 'callout' ? CalloutSelectedSvg : CalloutSvg}
          alt="Callout"
          width={50}
          onClick={() => {
            setEditType('callout')
          }}
          className="cursor-pointer"
        />
        <img
          src={editType == 'pricerange' ? PriceRangeSelectedSvg : PriceRangeSvg}
          alt="priceRange"
          width={50}
          onClick={() => {
            setEditType('pricerange')
          }}
          className="cursor-pointer"
        />
        <img
          src={magnet ? MagnetSelectedSvg : MagnetSvg}
          alt="magnet"
          width={50}
          className="cursor-pointer"
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
          }}
          className="cursor-pointer"
        />
      </div>
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
      />
    </div>
  )
}

export default Chart
