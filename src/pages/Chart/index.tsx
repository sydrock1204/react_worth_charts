import { FC, useState, useEffect, useRef } from 'react'

import { StockPriceData, VolumeData, Point, PointXY } from '../../utils/typing'
// import { fetchData } from '../../api/fetchData'
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
} from '../../assets/icons'

import { rawData } from './rawData'

import {
  createChart,
  ColorType,
  TextAlignment,
  BoxHorizontalAlignment,
  BoxVerticalAlignment,
  CrosshairMode,
} from '../../components/lightweights-line-tools'
import {
  IChartApi,
  MouseEventParams,
} from '../../components/lightweights-line-tools/api/ichart-api'
import { ILineToolApi } from '../../components/lightweights-line-tools/api/iline-tool-api'
import { ISeriesApi } from '../../components/lightweights-line-tools/api/iseries-api'

const ChartComponent = (props: any) => {
  const {
    data,
    volume,
    circlePoint,
    trendPoints,
    selectDelete,
    rectanglePoints,
    labelPoint,
    horizontalPoint,
    verticalPoint,
    calloutPoint,
    priceRangePoint,
    handleTemplePoint,
    magnet,
    colors: {
      backgroundColor = 'white',
      lineColor = '#2962FF',
      textColor = 'black',
      areaTopColor = '#2962FF',
      areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {},
  } = props

  const chartContainerRef = useRef<IChartApi | null>(null)
  const chart = useRef<IChartApi | null>(null)
  const candleStickSeries = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const [calloutPointLineSeries, setCalloutPointLineSeries] =
    useState<ILineToolApi<'Callout'>>()
  const [priorSelectDelete, setPriorSelectDelete] =
    useState<boolean>(selectDelete)

  const getPointInformation = (param: MouseEventParams) => {
    if (!param.point) {
      return
    }

    // console.log(candleStickSeries.current?.coordinateToPrice(param.point.y))
    // console.log(param.time)\

    let pointPrice = candleStickSeries.current?.coordinateToPrice(param.point.y)
    handleTemplePoint({
      price: pointPrice,
      timestamp: param.time,
    })
  }

  useEffect(() => {
    if (magnet) {
      chart.current?.applyOptions({
        crosshair: {
          magnetThreshold: 40,
          mode: CrosshairMode.Magnet,
        },
      })
    } else {
      chart.current?.applyOptions({
        crosshair: {
          magnetThreshold: 14,
          mode: CrosshairMode.Normal,
        },
      })
    }
  }, [magnet])

  useEffect(() => {
    const handleResize = () => {
      chart.current?.applyOptions({
        // width: chartContainerRef.current?.,
      })
    }

    chart.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      leftPriceScale: {
        visible: true,
      },
      width: 800,
      height: 850,
    })

    candleStickSeries.current = chart.current.addCandlestickSeries({
      upColor: 'green',
      downColor: 'red',
    })
    candleStickSeries.current.setData(data)

    const volumeSeries = chart.current.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'left',
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    })
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.75,
        bottom: 0,
      },
    })
    volumeSeries.setData(volume)

    chart.current.timeScale().fitContent()

    chart.current?.subscribeClick(getPointInformation)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.current?.unsubscribeClick(getPointInformation)
      chart.current?.remove()
    }
  }, [
    data,
    volume,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ])

  useEffect(() => {
    if (circlePoint) {
      chart.current?.addLineTool(
        'Circle',
        [circlePoint.point1, circlePoint.point2],
        {
          text: {
            value: 'circle text',
            alignment: TextAlignment.Center,
            font: {
              color: 'rgba(255,255,255,1)',
              size: 18,
              bold: false,
              italic: false,
              family: 'Roboto',
            },
            box: {
              alignment: {
                vertical: BoxVerticalAlignment.Middle,
                horizontal: BoxHorizontalAlignment.Center,
              },
              angle: 0,
              scale: 3,
              offset: {
                x: 0,
                y: 30,
              },
              padding: {
                x: 0,
                y: 0,
              },
              maxHeight: 500,
              border: {
                color: 'rgba(126,211,33,1)',
                width: 4,
                radius: 20,
                highlight: false,
                style: 3,
              },
              background: {
                color: 'rgba(208,2,27,1)',
                inflation: {
                  x: 10,
                  y: 30,
                },
              },
            },
            padding: 30,
            wordWrapWidth: 0,
            forceTextAlign: false,
            forceCalculateMaxLineWidth: false,
          },
          circle: {
            background: {
              color: 'rgba(39,176,119,0.2)',
            },
            border: {
              color: 'rgba(156,39,176,0.5)',
              width: 1,
              style: 3,
            },
            extend: {
              right: true, //does not do anything, left in for ease of use with rectangle settings
              left: false, //does not do anything, left in for ease of use with rectangle settings
            },
          },
          visible: true,
          editable: true,
        }
      )
      chart.current?.timeScale().fitContent()
    }
  }, [circlePoint])

  useEffect(() => {
    if (trendPoints) {
      chart.current?.addLineTool(
        'TrendLine',
        [trendPoints.point1, trendPoints.point2],
        {
          text: {
            value: 'TrendLine with box',
            alignment: TextAlignment.Left,
            font: {
              color: 'rgba(255,255,255,1)',
              size: 14,
              bold: true,
              italic: true,
              family: 'Arial',
            },
            box: {
              alignment: {
                vertical: BoxVerticalAlignment.Bottom,
                horizontal: BoxHorizontalAlignment.Center,
              },
              angle: 0,
              scale: 1,
              offset: {
                x: 0,
                y: 20,
              },
              padding: {
                x: 0,
                y: 0,
              },
              maxHeight: 100,
              shadow: {
                blur: 0,
                color: 'rgba(255,255,255,1)',
                offset: {
                  x: 0,
                  y: 0,
                },
              },
              border: {
                color: 'rgba(126,211,33,1)',
                width: 4,
                radius: 20,
                highlight: false,
                style: 1,
              },
              background: {
                color: 'rgba(199,56,56,0.25)',
                inflation: {
                  x: 10,
                  y: 10,
                },
              },
            },
            padding: 0,
            wordWrapWidth: 0,
            forceTextAlign: false,
            forceCalculateMaxLineWidth: false,
          },
          line: {
            color: 'rgba(41,98,255,1)',
            width: 4,
            style: 0,
            end: {
              left: 0,
              right: 0,
            },
            extend: {
              right: false,
              left: false,
            },
          },
          visible: true,
          editable: true,
        }
      )
    }
    chart.current?.timeScale().fitContent()
  }, [trendPoints])

  useEffect(() => {
    if (rectanglePoints) {
      const lineTools = chart.current?.addLineTool(
        'Rectangle',
        [rectanglePoints.point1, rectanglePoints.point2],
        {
          text: {
            value: 'This is the Box Area',
            alignment: TextAlignment.Left,
            font: {
              color: 'rgba(41,98,255,1)',
              size: 20,
              bold: false,
              italic: false,
              family: 'Arial',
            },
            box: {
              alignment: {
                vertical: BoxVerticalAlignment.Middle,
                horizontal: BoxHorizontalAlignment.Center,
              },
              angle: 0,
              scale: 1,
              offset: {
                x: 0,
                y: 0,
              },
              padding: {
                x: 0,
                y: 0,
              },
              maxHeight: 100,
              shadow: {
                blur: 0,
                color: 'rgba(255,255,255,1)',
                offset: {
                  x: 0,
                  y: 0,
                },
              },
              border: {
                color: 'rgba(126,211,33,0)',
                width: 4,
                radius: 0,
                highlight: false,
                style: 3,
              },
              background: {
                color: 'rgba(199,56,56,0)',
                inflation: {
                  x: 0,
                  y: 0,
                },
              },
            },
            padding: 0,
            wordWrapWidth: 0,
            forceTextAlign: false,
            forceCalculateMaxLineWidth: false,
          },
          rectangle: {
            background: {
              color: 'rgba(156,39,176,0.2)',
            },
            border: {
              color: 'rgba(39,176,80,1)',
              width: 3,
              style: 3,
            },
            extend: {
              right: false,
              left: false,
            },
          },
          visible: true,
          editable: true,
        }
      )
    }
    chart.current?.timeScale().fitContent()
  }, [rectanglePoints])

  useEffect(() => {
    if (labelPoint) {
      chart.current?.addLineTool('Text', [labelPoint], {
        text: {
          value: 'Text Line Tool, below is highlighter',
          alignment: TextAlignment.Left,
          font: {
            color: 'rgba(255,255,255,1)',
            size: 14,
            bold: false,
            italic: false,
            family: 'Arial',
          },
          box: {
            alignment: {
              vertical: BoxVerticalAlignment.Bottom,
              horizontal: BoxHorizontalAlignment.Center,
            },
            angle: 0,
            scale: 1,
            offset: {
              x: 0,
              y: 0,
            },
            padding: {
              x: 0,
              y: 0,
            },
            maxHeight: 100,
            shadow: {
              blur: 0,
              color: 'rgba(255,255,255,1)',
              offset: {
                x: 0,
                y: 0,
              },
            },
            border: {
              color: 'rgba(126,211,33,1)',
              width: 4,
              radius: 0,
              highlight: false,
              style: 0,
            },
            background: {
              color: 'rgba(153,27,27,1)',
              inflation: {
                x: 10,
                y: 10,
              },
            },
          },
          padding: 0,
          wordWrapWidth: 0,
          forceTextAlign: false,
          forceCalculateMaxLineWidth: false,
        },
        visible: true,
        editable: true,
      })
    }

    chart.current?.timeScale().fitContent()
  }, [labelPoint])

  useEffect(() => {
    if (horizontalPoint) {
      chart.current?.addLineTool('HorizontalLine', [horizontalPoint], {
        text: {
          value: 'HorizontalLine Line Tool',
          alignment: TextAlignment.Left,
          font: {
            color: 'rgba(41,98,255,1)',
            size: 20,
            bold: false,
            italic: false,
            family: 'Arial',
          },
          box: {
            alignment: {
              vertical: BoxVerticalAlignment.Top,
              horizontal: BoxHorizontalAlignment.Left,
            },
            angle: 0,
            scale: 1,
            offset: {
              x: 0,
              y: 0,
            },
            padding: {
              x: 0,
              y: 0,
            },
            maxHeight: 100,
            shadow: {
              blur: 0,
              color: 'rgba(255,255,255,1)',
              offset: {
                x: 0,
                y: 0,
              },
            },
            border: {
              color: 'rgba(126,211,33,0)',
              width: 1,
              radius: 0,
              highlight: false,
              style: 0,
            },
            background: {
              color: 'rgba(199,56,56,0)',
              inflation: {
                x: 0,
                y: 0,
              },
            },
          },
          padding: 0,
          wordWrapWidth: 0,
          forceTextAlign: false,
          forceCalculateMaxLineWidth: false,
        },
        line: {
          color: 'rgba(41,98,255,1)',
          width: 1,
          style: 0,
          end: {
            left: 0,
            right: 0,
          },
          extend: {
            right: true,
            left: true,
          },
        },
        visible: true,
        editable: true,
      })
    }

    chart.current?.timeScale().fitContent()
  }, [horizontalPoint])

  useEffect(() => {
    if (verticalPoint) {
      chart.current?.addLineTool('VerticalLine', [verticalPoint], {
        text: {
          value: 'VerticalLine Line Tool',
          alignment: TextAlignment.Left,
          font: {
            color: 'rgba(41,98,255,1)',
            size: 20,
            bold: false,
            italic: false,
            family: 'Arial',
          },
          box: {
            alignment: {
              vertical: BoxVerticalAlignment.Bottom,
              horizontal: BoxHorizontalAlignment.Center,
            },
            angle: 0,
            scale: 1,
            offset: {
              x: 0,
              y: 0,
            },
            padding: {
              x: 0,
              y: 0,
            },
            maxHeight: 100,
            shadow: {
              blur: 0,
              color: 'rgba(255,255,255,1)',
              offset: {
                x: 0,
                y: 0,
              },
            },
            border: {
              color: 'rgba(126,211,33,0)',
              width: 1,
              radius: 0,
              highlight: false,
              style: 0,
            },
            background: {
              color: 'rgba(199,56,56,0)',
              inflation: {
                x: 0,
                y: 0,
              },
            },
          },
          padding: 0,
          wordWrapWidth: 0,
          forceTextAlign: false,
          forceCalculateMaxLineWidth: false,
        },
        line: {
          color: 'rgba(41,98,255,1)',
          width: 2,
          style: 1,
        },
        visible: true,
        editable: true,
      })
    }

    chart.current?.timeScale().fitContent()
  }, [verticalPoint])

  useEffect(() => {
    if (calloutPoint) {
      setCalloutPointLineSeries(
        chart.current?.addLineTool(
          'Callout',
          [calloutPoint.point1, calloutPoint.point2],
          {
            text: {
              value: 'callout tool text',
              alignment: TextAlignment.Left,
              font: {
                color: 'rgba(255,255,255,1)',
                size: 14,
                bold: false,
                italic: false,
                family: 'Arial',
              },
              box: {
                alignment: {
                  vertical: BoxVerticalAlignment.Middle,
                  horizontal: BoxHorizontalAlignment.Center,
                },
                angle: 0,
                scale: 1,
                offset: {
                  x: 0,
                  y: 0,
                },
                padding: {
                  x: 0,
                  y: 0,
                },
                maxHeight: 300,
                shadow: {
                  blur: 0,
                  color: 'rgba(255,255,255,1)',
                  offset: {
                    x: 0,
                    y: 0,
                  },
                },
                border: {
                  color: 'rgba(74,144,226,1)',
                  width: 4,
                  radius: 10,
                  highlight: false,
                  style: 0,
                },
                background: {
                  color: 'rgba(19,73,133,1)',
                  inflation: {
                    x: 10,
                    y: 10,
                  },
                },
              },
              padding: 0,
              wordWrapWidth: 120,
              forceTextAlign: false,
              forceCalculateMaxLineWidth: true,
            },
            line: {
              color: 'rgba(74,144,226,1)',
              width: 1,
              style: 0,
              end: {
                left: 1,
                right: 0,
              },
              extend: {
                right: false,
                left: false,
              },
            },
            visible: true,
            editable: true,
          }
        )
      )
    }

    chart.current?.timeScale().fitContent()
  }, [calloutPoint])

  useEffect(() => {
    if (priceRangePoint) {
      chart.current?.addLineTool(
        'PriceRange',
        [priceRangePoint.point1, priceRangePoint.point2],
        {
          text: {
            value: 'Price Range Line Tool',
            alignment: TextAlignment.Left,
            font: {
              color: 'rgba(41,98,255,1)',
              size: 16,
              bold: false,
              italic: false,
              family: 'Arial',
            },
            box: {
              alignment: {
                vertical: BoxVerticalAlignment.Top,
                horizontal: BoxHorizontalAlignment.Center,
              },
              angle: 0,
              scale: 1,
              offset: {
                x: 0,
                y: 0,
              },
              padding: {
                x: 0,
                y: 0,
              },
              maxHeight: 100,
              shadow: {
                blur: 0,
                color: 'rgba(255,255,255,1)',
                offset: {
                  x: 0,
                  y: 0,
                },
              },
              border: {
                color: 'rgba(126,211,33,0)',
                width: 4,
                radius: 0,
                highlight: false,
                style: 3,
              },
              background: {
                color: 'rgba(199,56,56,0)',
                inflation: {
                  x: 0,
                  y: 0,
                },
              },
            },
            padding: 0,
            wordWrapWidth: 0,
            forceTextAlign: true,
            forceCalculateMaxLineWidth: true,
          },
          priceRange: {
            background: {
              color: 'rgba(156,39,176,0.2)',
              inflation: {
                x: 0,
                y: 0,
              },
            },
            border: {
              color: 'rgba(39,176,80,1)',
              width: 3,
              radius: 0,
              highlight: true,
              style: 3,
            },
            extend: {
              right: false,
              left: false,
            },
          },
          visible: true,
          editable: true,
        }
      )
    }

    chart.current?.timeScale().fitContent()
  }, [priceRangePoint])

  useEffect(() => {
    console.log(chart.current?.getSelectedLineTools())
    calloutPointLineSeries?.applyOptions({
      text: {
        value: 'hello callout',
      },
    })
    chart.current?.removeSelectedLineTools()
  }, [selectDelete])

  return <div ref={chartContainerRef} />
}

const Chart: FC = () => {
  const [data, setData] = useState<StockPriceData[]>([])
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

  const handleTemplePoint = (point: Point) => {
    console.log('point: ', point)

    setTempPoint(point)
  }
  useEffect(() => {
    const Data = Object.entries(rawData)
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

    let start = Math.floor(Data.length / 2)
    let startTime = Data[start].time
    let startPrice = Data[start].low
    let startPoint = { price: startPrice, timestamp: startTime }

    setStartPoint(startPoint)

    const Volume = Object.entries(rawData)
      .map((data, index) => {
        let volumeData = {
          time: data[0],
          value: Number(data[1]['5. volume']),
          color: index % 2 === 0 ? '#26a69a' : '#ef5350',
        }
        return volumeData
      })
      .reverse()
    setVolume(Volume)
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

  return (
    <div id="Chart" className="flex flex-row">
      <div className="absolute w-[800px] flex flex-col z-30 ">
        <div className="flex flex-row h-[40px] bg-white border-color-[#E0E3EB] border-b-2">
          <div className="flex flex-row w-40">
            <div className="flex hover:bg-gray4 w-4/6">
              <input className="my-[2px] mx-[2px] w-[100px]" />
            </div>
            <div className="flex hover:bg-gray4 w-2/6"></div>
          </div>
        </div>
        <div className="h-[40px] bg-transparent" />
      </div>
      <div className="absolute z-20 flex flex-col w-16 h-[680px]  bg-white top-[120px] pt-10 pb-4 px-2 gap-4">
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
      />
    </div>
  )
}

export default Chart
