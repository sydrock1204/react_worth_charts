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
    // console.log(
    //   `Crosshair moved to ${param.point.x}, ${param.point.y}. The time is ${param.time}.`
    // )
  }

  const myVisibleLogicalRangeChangeHandler = (newVisibleLogicalRange: any) => {
    if (newVisibleLogicalRange === null) {
      // handle null
      return
    }
    // console.log(Math.floor(newVisibleLogicalRange.from))
    // console.log(chart.current?.timeScale().getVisibleLogicalRange())
    // handle new logical range
  }

  const handleResize = () => {
    chart.current?.applyOptions({
      // width: chartContainerRef.current?.clientWidth,
    })
  }

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
      console.log(newOptions)
      chart.current?.applyOptions(newOptions)
    } else {
      const newCrosshair = { ...crosshair, magnetThreshold: 14 }
      const newOptions = { ...options, crosshair: newCrosshair }
      chart.current?.applyOptions(newOptions)
    }
  }, [magnet])

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      leftPriceScale: {
        visible: true,
      },
      width: 800,
      height: 800,
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
    // chart.current.timeScale().setVisibleLogicalRange({
    //   from: new Date('2024-06-01').getTime() / 1000,
    //   to: new Date('2024-06-06').getTime() / 1000,
    //   from: 30,
    //   to: 60,
    // })

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

    chart.current?.timeScale().fitContent()
  }, [labelPoint])

  useEffect(() => {
    if (horizontalPoint) {
      chart.current?.addLineTool(
        'HorizontalLine',
        [horizontalPoint],
        horizontalLineDefaultOption
      )
    }

    chart.current?.timeScale().fitContent()
  }, [horizontalPoint])

  useEffect(() => {
    if (verticalPoint) {
      chart.current?.addLineTool(
        'VerticalLine',
        [verticalPoint],
        verticalDefaultOption
      )
    }

    chart.current?.timeScale().fitContent()
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

    chart.current?.timeScale().fitContent()
  }, [calloutPoint])

  useEffect(() => {
    if (priceRangePoint) {
      chart.current?.addLineTool(
        'PriceRange',
        [priceRangePoint.point1, priceRangePoint.point2],
        pricerangeDefaultOption
      )
    }

    chart.current?.timeScale().fitContent()
  }, [priceRangePoint])

  useEffect(() => {
    // console.log(chart.current?.timeScale().options())
    console.log(chart.current?.getSelectedLineTools())
    // calloutPointLineSeries?.applyOptions({
    //   text: {
    //     value: 'hello callout',
    //   },
    // })
    chart.current?.removeSelectedLineTools()
  }, [selectDelete])

  return <div ref={chartContainerRef} />
}
