import {
  FC,
  useState,
  useEffect,
  useContext,
  useRef,
  SetStateAction,
} from 'react'
import { useNavigate, redirect } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { StockPriceData, VolumeData, Point, PointXY } from '../../utils/typing'
import { fetchData } from '../../api/fetchData'
import { fetchStockData } from '../../api/fetchStockData'
import { getTimeStamp } from '../../utils/getTimeStamp'
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

import { rawData2, rawData1, rawData3 } from './rawData'

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

  const [magnet, setMagnet] = useState<Boolean>(false)
  const [editType, setEditType] = useState<string>('arrow')
  const [editClickCounts, setEditClickCounts] = useState<number>(0)
  const [tempPoint, setTempPoint] = useState<Point | null>(null)
  const [symbol, setSymbol] = useState('AAPL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [interval, setInterval] = useState('60min')
  // const [exportLines, setExportLines] = useState([])
  const [save, setSave] = useState<boolean>(false)
  const { session, user, signOutHandler } = useAuthContext()

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

    let { data: savedData, error: savedDataError } = await supabase
      .from('linedata')
      .select('id')
      .eq('user_id', user?.id)
      .eq('interval', interval)
      .eq('symbol', symbol)
      .limit(1)
      .select()

    console.log('data: ', savedData, 'error: ', savedDataError)
    if (savedData && savedData.length > 0) {
      console.log('exportlines: ', exportLines)
      let { data, error } = await supabase
        .from('linedata')
        .update({ linedata: exportLines })
        .eq('id', savedData[0].id)
        .select()
      console.log('update res:', data, error)
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
    // const Index
    // console.log('O H L C', tempData.get(time))
  }

  const loadLineData = async (symbol: string, interval: string) => {
    if (!user) return navigate('/auth/login')
    let { data, error } = await supabase
      .from('linedata')
      .select('linedata')
      .eq('user_id', user.id)
      .eq('interval', interval)
      .eq('symbol', symbol)
      .limit(1)
      .select()

    if (data && data.length > 0) {
      let lineDataArray = JSON.parse(data[0].linedata)
      console.log(lineDataArray)
      lineDataArray.map(lineData => {
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

    fetchWrapper().catch(e => console.log(e))
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

    fetchWrapper().catch(e => console.log(e))
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
              onClick={() => setInterval('1min')}
            >
              1m
            </button>
            <button
              className={
                interval == '30min'
                  ? 'w-[40px] cursor-pointer hover:bg-gray5 text-blue-700'
                  : 'w-[40px] cursor-pointer hover:bg-gray5'
              }
              onClick={() => setInterval('30min')}
            >
              30m
            </button>
            <button
              className={
                interval == '60min'
                  ? 'w-[40px] cursor-pointer hover:bg-gray5 text-blue-700'
                  : 'w-[40px] cursor-pointer hover:bg-gray5'
              }
              onClick={() => setInterval('60min')}
            >
              1h
            </button>
            <button
              className={
                interval == 'D'
                  ? 'w-[40px] cursor-pointer hover:bg-gray5 text-blue-700'
                  : 'w-[40px] cursor-pointer hover:bg-gray5'
              }
              onClick={() => setInterval('D')}
            >
              D
            </button>
            <img src={IntervalSvg} className="cursor-pointer hover:bg-gray5" />
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
        <div className="h-[40px] bg-transparent" />
      </div>
      <div className="absolute z-20 flex flex-col w-[61px] h-[640px]  bg-white top-[40px] pt-10 pb-4 px-2 gap-4">
        <img
          src={editType == 'arrow' ? ArrowSelectedSvg : ArrowSvg}
          alt="Text"
          width={50}
          className="cursor-pointer"
          onClick={() => setEditType('arrow')}
        />
        <img
          src={editType == 'label' ? TextSelectedSvg : TextSvg}
          alt="Text"
          width={30}
          className="ml-2 cursor-pointer"
          onClick={() => setEditType('label')}
        />
        <img
          src={editType == 'circle' ? CircleSelectedSvg : CircleSvg}
          alt="Circle"
          width={50}
          onClick={() => setEditType('circle')}
          className="cursor-pointer"
        />
        <img
          src={editType == 'vertical' ? VerticalSelectedSvg : VerticalSvg}
          alt="Vertical"
          onClick={() => setEditType('vertical')}
          className="cursor-pointer"
        />
        <img
          src={editType == 'trendline' ? TrendSelectedSvg : TrendSvg}
          alt="Trend"
          width={50}
          onClick={() => setEditType('trendline')}
          className="cursor-pointer"
        />
        <img
          src={editType == 'horizontal' ? HorizontalSelectedSvg : HorizontalSvg}
          alt="Horizontal"
          width={50}
          onClick={() => setEditType('horizontal')}
          className="cursor-pointer"
        />
        <img
          src={editType == 'rectangle' ? RectangleSelectedSvg : RectangleSvg}
          alt="Rectangle"
          width={50}
          onClick={() => setEditType('rectangle')}
          className="cursor-pointer"
        />
        <img
          src={editType == 'callout' ? CalloutSelectedSvg : CalloutSvg}
          alt="Callout"
          width={50}
          onClick={() => setEditType('callout')}
          className="cursor-pointer"
        />
        <img
          src={editType == 'pricerange' ? PriceRangeSelectedSvg : PriceRangeSvg}
          alt="priceRange"
          width={50}
          onClick={() => setEditType('pricerange')}
          className="cursor-pointer"
        />
        <img
          src={magnet ? MagnetSelectedSvg : MagnetSvg}
          alt="magnet"
          width={50}
          className="cursor-pointer"
          onClick={() => setMagnet(!magnet)}
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
      {/* <ReactModal isOpen={isModalOpen}>
        <p>Select the Symbol</p>
      </ReactModal> */}
    </div>
  )
}

export default Chart
