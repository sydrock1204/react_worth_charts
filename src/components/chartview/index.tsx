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

const trendLineOption = {
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
    color: '#27c36c',
    width: 2,
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

const priceRangeOption = {
  text: {
    value: '',
    alignment: TextAlignment.Left,
    font: {
      color: 'rgba(41,98,255,1)',
      size: 23,
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
      scale: 0.6,
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
    },
    border: {
      color: 'rgba(41,98,255,1)',
      width: 2,
      style: 0,
    },
    extend: {
      right: false,
      left: false,
    },
  },
  visible: true,
  editable: true,
}

const circleOption = {
  text: {
    value: '',
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
      color: 'rgba(41,98,255,1)',
      width: 2,
      style: 0,
    },
    extend: {
      right: true, //does not do anything, left in for ease of use with rectangle settings
      left: false, //does not do anything, left in for ease of use with rectangle settings
    },
  },
  visible: true,
  editable: true,
}

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
    setLastLineJSON,
    editType,
    templeWidth,
    colors: {
      backgroundColor = 'white',
      lineColor = '#2962FF',
      textColor = '#000000',
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

    })
  }

  useEffect(() => {
    if (editType === 'trendline') {
      chart.current?.addLineTool('TrendLine', [], trendLineOption)
    }
    if (editType === 'PriceRange') {
      chart.current?.addLineTool('PriceRange', [], priceRangeOption)
    }
    if(editType === "Circle") {
      chart.current?.addLineTool('Circle', [], circleOption)
    }
  }, [editType])

  useEffect(() => {
    chart.current?.applyOptions({
      width: templeWidth,
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
      chart.current?.applyOptions(newOptions)
    } else {
      const newCrosshair = { ...crosshair, magnetThreshold: 14 }
      const newOptions = { ...options, crosshair: newCrosshair }
      chart.current?.applyOptions(newOptions)
    }
  }, [magnet])

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

  useEffect(() => {
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
      width: templeWidth,
      height: 800,
    })

    if (lineSeries == 'candlestick') {
      candleStickSeries.current = chart.current.addCandlestickSeries({
        upColor: '#000000',
        downColor: '#000000',
      })
    } else if (lineSeries == 'bar') {
      candleStickSeries.current = chart.current.addBarSeries({
        upColor: '#000000',
        downColor: '#000000',
      })
    }
    candleStickSeries.current.setData(data)
    const volumeSeries = chart.current.addHistogramSeries({
      color: '#00FF00',
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
              value: Number(data[1][indifunction]),
            }
            return indiData
          })
          .reverse()

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
            color: selectLineColor.hex,
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
        circleOption
      )
      chart.current?.removeSelectedLineTools()
     }
     chart.current?.applyOptions({})
  }, [circlePoint])

  useEffect(() => {
    if (trendPoints) {
      chart.current?.addLineTool( 
        'TrendLine',
        [trendPoints.point1, trendPoints.point2],
        trendLineOption,
        )
        chart.current?.removeSelectedLineTools()
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
      const ret = chart.current?.addLineTool('Text', [labelPoint], labelDefaultOption)
      setLastLineJSON (ret); 
    }

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
      chart.current?.removeSelectedLineTools();
      chart.current?.addLineTool(
        'PriceRange',
        [priceRangePoint.point1, priceRangePoint.point2],
        priceRangeOption
      )
    }

    chart.current.applyOptions({})
  }, [priceRangePoint])

  useEffect(() => {
    chart.current?.removeSelectedLineTools()
  }, [selectDelete])

  useEffect(() => {
    chart.current?.importLineTools(importLines)
    chart.current?.timeScale().fitContent()
  }, [importLines])

  return (
    <div ref={chartContainerRef} />
  )
 
}
