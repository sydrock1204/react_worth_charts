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
import { fetchStockIndicator } from '../../api/fetchStockIndicator'
import { getTimeStamp } from '../../utils/getTimeStamp'
import useWindowWidth from '../../context/useScreenWidth'
import useHeaderWidthStore from '../../context/useHeadherWidth'

export const ChartOnlyView = (props: any) => {
  const {
    data,
    volume,
    handleCrosshairMove,
    handleTemplePoint,
    lineSeries,
    indicatorArray,
    symbol,
    interval,
    colors: {
      backgroundColor = 'white',
      lineColor = '#2962FF',
      textColor = 'black',
      areaTopColor = '#2962FF',
      areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {},
  } = props

  const width = useWindowWidth()
  const headerWidth = useHeaderWidthStore(state => state.width)
  const chartContainerRef = useRef<IChartApi | null>(null)
  const chart = useRef<IChartApi | null>(null)
  const candleStickSeries = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const indicatorColors = {
    RSI: '#FF00FF',
    SMA: '#00FFFF',
    EMA: '#FFFF00',
    WMA: '#FF0000',
    ADX: '#0000FF',
  }

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
    if (width > 1024) {
      chart.current?.applyOptions({
        width: (width - headerWidth - 38) / 2,
      })
    } else if (width <= 1024) {
      chart.current?.applyOptions({
        width: width - headerWidth - 18,
      })
    }
  }, [width])

  useEffect(() => {
    let tempWidth =
      width > 1024 ? (width - headerWidth - 38) / 2 : width - headerWidth - 18
    chart.current = createChart(chartContainerRef.current, {
      crosshair: {
        horzLine: {
          visible: false,
        },
        vertLine: {
          visible: false,
        },
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
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
      height: 500,
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

    chart.current.timeScale().setVisibleLogicalRange({
      from: data.length - 100,
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
        console.log('indicatorArray', indicatorArray)

        const indifunction = indicatorArray[indicatorArray.length - 1]
        const indicatorSeries = await fetchStockIndicator(
          indifunction,
          symbol,
          interval,
          20,
          'high'
        )

        const indicatorLineSeries = chart.current.addLineSeries({
          color: indicatorColors[indifunction],
        })

        const indicatorData = Object.entries(indicatorSeries)
          .map((data, index) => {
            const indiData = {
              time: getTimeStamp(data[0]),
              value: Number(data[1][indifunction]),
            }
            return indiData
          })
          .reverse()
        console.log('indicatorData: ', indicatorData)

        indicatorLineSeries.setData(indicatorData)
      }
    }

    fetchWrapper().catch(e => {
      console.log(e)
    })
  }, [indicatorArray])

  return <div ref={chartContainerRef} />
}
