import { FC, useState, useEffect, useRef, SetStateAction } from 'react'

import { StockPriceData, VolumeData, Point, PointXY } from '../../utils/typing'
import { fetchData } from '../../api/fetchData'
import { getTimeStamp } from '../../utils/getTimeStamp'

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

import { rawData2, rawData1, rawData3 } from './rawData'

import { ChartComponent } from '../../components/chartview'

const Chart: FC = () => {
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

  const handleTemplePoint = (point: Point) => {
    console.log('point: ', point)

    setTempPoint(point)
  }

  const handleCrosshairMove = (time: number) => {
    // const Index
    // console.log('O H L C', tempData.get(time))
  }
  useEffect(() => {
    // fetchData(symbol, interval).then(value => {
    //   console.log(value)
    const Data = Object.entries(rawData3)
      .map(data => {
        let stockData = {
          time: getTimeStamp(data[0]),
          open: Number(data[1]['1. open']),
          high: Number(data[1]['2. high']),
          low: Number(data[1]['3. low']),
          close: Number(data[1]['4. close']),
        }
        return stockData
      })
      .reverse()
    setData(Data)
    const timeData = Data.map(data => {
      return [
        data.time,
        { open: data.open, close: data.close, high: data.high, low: data.low },
      ]
    })
    // console.log(timeData)
    const tempDataArray = new Map(timeData)
    setTempData(tempDataArray)

    let start = Math.floor(Data.length / 2)
    let startTime = Data[start].time
    let startPrice = Data[start].low
    let startPoint = { price: startPrice, timestamp: startTime }

    setStartPoint(startPoint)

    const Volume = Object.entries(rawData3)
      .map((data, index) => {
        let volumeData = {
          time: getTimeStamp(data[0]),
          value: Number(data[1]['5. volume']),
          color: index % 2 === 0 ? '#26a69a' : '#ef5350',
        }
        // console.log(volumeData)
        return volumeData
      })
      .reverse()
    // console.log(Volume)
    setVolume(Volume)
    // })
  }, [])

  useEffect(() => {
    console.log('tempPoint', tempPoint, 'editClickCounts', editClickCounts)
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
                // onClick={fetchSeriesData}
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
                interval == '1h'
                  ? 'w-[40px] cursor-pointer hover:bg-gray5 text-blue-700'
                  : 'w-[40px] cursor-pointer hover:bg-gray5'
              }
              onClick={() => setInterval('1h')}
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
      />
      {/* <ReactModal isOpen={isModalOpen}>
        <p>Select the Symbol</p>
      </ReactModal> */}
    </div>
  )
}

export default Chart
