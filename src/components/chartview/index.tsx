// @ts-nocheck
import { useEffect, useRef, useState } from 'react'

import {
  createChart,
  ColorType,
  TextAlignment,
  BoxHorizontalAlignment,
  BoxVerticalAlignment,
} from '../lightweights-line-tools'

import {
  IChartApi,
  MouseEventParams,
} from '../lightweights-line-tools/api/ichart-api'
import { ISeriesApi } from '../lightweights-line-tools/api/iseries-api'
import { ILineToolApi } from '../lightweights-line-tools/api/iline-tool-api'

import { circleDefaultOption } from './circleDefaultOptions'
import { rectangleDefaultOption } from './rectangleDefaultOption'
import { labelDefaultOption } from './labelDefaultOption'
import { horizontalLineDefaultOption } from './horizontalDefaultOption'
import { verticalDefaultOption } from './verticalDefaultOption'
import { calloutDefaultOption } from './calloutDefaultOption'
import { pricerangeDefaultOption } from './pricerangeDefaultOption'
import { fetchStockIndicator } from '../../api/fetchStockIndicator'
import { getTimeStamp } from '../../utils/getTimeStamp'
import useWindowWidth from '../../context/useScreenWidth'
import useHeaderWidthStore from '../../context/useHeadherWidth'

export const ChartComponent = (props: any) => {
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
    handleCrosshairMove,
    save,
    handleExportData,
    lineSeries,
    importLines,
    handleSelectedLine,
    selectedLine,
    selectedLineText,
    indicatorArray,
    symbol,
    interval,
    selectLineColor,
    colors: {
      backgroundColor = 'white',
      lineColor = '#2962FF',
      textColor = 'black',
      areaTopColor = '#2962FF',
      areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {},
  } = props


  const colorJSON = {
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
  }

  const chartContainerRef = useRef<IChartApi | null>(null)
  const chart = useRef<IChartApi | null>(null)
  const candleStickSeries = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const [calloutPointLineSeries, setCalloutPointLineSeries] =
    useState<ILineToolApi<'Callout'>>()
  const [priorSelectDelete, setPriorSelectDelete] =
    useState<boolean>(selectDelete)
  const width = useWindowWidth()
  // const headerWidth = useHeaderWidthStore(state => state.width)
  const { width: headerWidth } = useHeaderWidthStore()

  const getPointInformation = (param: MouseEventParams) => {
    if (!param.point) {
      return
    }

    handleSelectedLine(chart.current?.getSelectedLineTools())

    const pointPrice = candleStickSeries.current?.coordinateToPrice(
      param.point.y
    )
    handleTemplePoint({
      price: pointPrice,
      timestamp: param.time,
    })
  }

  const myCrosshairMoveHandler = (param: MouseEventParams) => {
    if (!param.point) {
      return
    }
    handleCrosshairMove(param.time)
  }

  const myVisibleLogicalRangeChangeHandler = (newVisibleLogicalRange: any) => {
    if (newVisibleLogicalRange === null) {
      return
    }
  }

  const handleResize = () => {
    chart.current?.applyOptions({
      // width: chartContainerRef.current?.clientWidth,
    })
  }

  useEffect(() => {
    let tempWidth = 0
    if (width > 1440) {
      tempWidth = width - 510 - headerWidth
    } else if (width > 1024) {
      tempWidth = width - 358 - headerWidth
    } else if (width <= 1024) {
      tempWidth = width - 18 - headerWidth
    }

    chart.current?.applyOptions({
      width: tempWidth,
    })
  }, [width])

  useEffect(() => {
    if (save) {
      const lineData = chart.current?.exportLineTools()
      handleExportData(lineData)
    }
  }, [save])

  useEffect(() => {
    const options = chart.current?.options()
    const crosshair = options?.crosshair
    if (magnet) {
      const newCrosshair = { ...crosshair, magnetThreshold: 40 }
      const newOptions = { ...options, crosshair: newCrosshair }
      // console.log('-----------------newoptions----------',newOptions)
      chart.current?.applyOptions(newOptions)
    } else {
      const newCrosshair = { ...crosshair, magnetThreshold: 14 }
      const newOptions = { ...options, crosshair: newCrosshair }
      chart.current?.applyOptions(newOptions)
    }
  }, [magnet])


  // delete the object when del key is pressed
   useEffect(() => {
    const handleDeleteKeyPressed = () => {
      if(selectedLine !== " ") {
        chart.current?.removeSelectedLineTools()
      }
    }

    const handleKeyDown = (event) => {
      if(event.key === 'Delete') {
        handleDeleteKeyPressed();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown',handleKeyDown);
    }
    
   },[selectedLine])

  // 

  useEffect(() => {
    let tempWidth = 0
    if (width > 1440) {
      tempWidth = width - 510 - headerWidth
    } else if (width > 1024) {
      tempWidth = width - 358 - headerWidth
    } else if (width <= 1024) {
      tempWidth = width - 18 - headerWidth
    }

    chart.current = createChart(chartContainerRef.current, {
      crosshair: {
        horzLine: {
          visible: false,
        },
        vertLine: {
          visible: false,
        },
      },
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      leftPriceScale: {
        visible: true,
        autoScale: true,
        minimize: false,
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0,
        },
      },
      width: tempWidth,
      height: 800,
    })

    if (lineSeries == 'candlestick') {
      candleStickSeries.current = chart.current.addCandlestickSeries({
        upColor: 'green',
        downColor: 'red',
      })
    } else if (lineSeries == 'bar') {
      candleStickSeries.current = chart.current.addBarSeries({
        upColor: 'green',
        downColor: 'red',
      })
    }
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

    // chart.current.timeScale().fitContent()
    chart.current.timeScale().setVisibleLogicalRange({
      from: data.length - 50,
      to: data.length,
    })
    chart.current.subscribeClick(getPointInformation)
    chart.current.subscribeCrosshairMove(myCrosshairMoveHandler)
    chart.current
      .timeScale()
      .subscribeVisibleLogicalRangeChange(myVisibleLogicalRangeChangeHandler)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.current?.unsubscribeClick(getPointInformation)
      chart.current?.unsubscribeCrosshairMove(myCrosshairMoveHandler)
      chart.current
        ?.timeScale()
        .unsubscribeVisibleLogicalRangeChange(
          myVisibleLogicalRangeChangeHandler
        )
      chart.current?.remove()
    }
  }, [
    data,
    volume,
    lineSeries,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ])

  useEffect(() => {
    const fetchWrapper = async () => {
      if (indicatorArray.length > 0) {
        const indicatorLineSeries = chart.current.addLineSeries({
          color: '#2962FF',
        })

        // console.log('indicatorArray', indicatorArray)

        const indifunction = indicatorArray[indicatorArray.length - 1]
        const indicatorSeries = await fetchStockIndicator(
          indifunction,
          symbol,
          interval,
          20,
          'high'
        )

        const indicatorData = Object.entries(indicatorSeries)
          .map((data, index) => {
            const indiData = {
              time: getTimeStamp(data[0]),
              // value: Number(data[1]['Real Upper Band']),
              value: Number(data[1][indifunction]),
            }
            return indiData
          })
          .reverse()
        // console.log('indicatorData: ', indicatorData)

        indicatorLineSeries.setData(indicatorData)
      }
    }

    fetchWrapper().catch(e => {
      console.log(e)
    })
  }, [indicatorArray])

  useEffect(() => {
    if (selectedLine !== '[]' && selectedLine) {
      let selectedLineTextJSON = JSON.parse(selectedLine)
      chart.current.applyLineToolOptions({
        ...selectedLineTextJSON[0],
        options: {
          text: {
            value: selectedLineText,
          },
        },
      })
    }
  }, [selectedLineText])

  useEffect(() => {
    if (selectedLine !== '[]' && selectedLine) {
      let selectedLineTextJSON = JSON.parse(selectedLine)
      chart.current.applyLineToolOptions({
        ...selectedLineTextJSON[0],
        options: {
          line: {
            color: colorJSON[selectLineColor],
          },
          text: {
            value: selectedLineText,
          },
        },
      })
    }
  }, [selectLineColor])

  useEffect(() => {
    if (circlePoint) {
      chart.current?.addLineTool(
        'Circle',
        [circlePoint.point1, circlePoint.point2],
        circleDefaultOption
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
            value: '',
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

    chart.current?.applyOptions({})
  }, [trendPoints])

  useEffect(() => {
    if (rectanglePoints) {
      chart.current?.addLineTool(
        'Rectangle',
        [rectanglePoints.point1, rectanglePoints.point2],
        rectangleDefaultOption
      )
    }
    chart.current?.timeScale().fitContent()
  }, [rectanglePoints])

  useEffect(() => {
    if (labelPoint) {
      chart.current?.addLineTool('Text', [labelPoint], labelDefaultOption)
    }

    // chart.current?.timeScale().fitContent()
    chart.current.applyOptions({})
  }, [labelPoint])

  useEffect(() => {
    if (horizontalPoint) {
      chart.current?.addLineTool(
        'HorizontalLine',
        [horizontalPoint],
        horizontalLineDefaultOption
      )
    }

    chart.current.applyOptions({})
  }, [horizontalPoint])

  useEffect(() => {
    if (verticalPoint) {
      chart.current?.addLineTool(
        'VerticalLine',
        [verticalPoint],
        verticalDefaultOption
      )
    }
    chart.current.applyOptions({})
  }, [verticalPoint])

  useEffect(() => {
    if (calloutPoint) {
      setCalloutPointLineSeries(
        chart.current?.addLineTool(
          'Callout',
          [calloutPoint.point1, calloutPoint.point2],
          calloutDefaultOption
        )
      )
    }

    chart.current.applyOptions({})
  }, [calloutPoint])

  useEffect(() => {
    if (priceRangePoint) {
      chart.current?.addLineTool(
        'PriceRange',
        [priceRangePoint.point1, priceRangePoint.point2],
        pricerangeDefaultOption
      )
    }
    // console.log('--------chart-------------',chart.current.applyOptions({}))
    chart.current.applyOptions({})
  }, [priceRangePoint])

  useEffect(() => {
    // console.log(chart.current.options())
    // console.log(chart.current?.getSelectedLineTools())
    chart.current?.removeSelectedLineTools()
  }, [selectDelete])

  useEffect(() => {
    chart.current?.importLineTools(importLines)
    chart.current?.timeScale().fitContent()
  }, [importLines])

  return <div ref={chartContainerRef} />
}
