// @ts-nocheck
import { useEffect, useRef, useState } from 'react'

import {
  createChart,
  ColorType,
  TextAlignment,
  BoxHorizontalAlignment,
  BoxVerticalAlignment,
  PriceScaleMode,
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
import { fetchStockIndicator } from '../../api/fetchStockIndicator'
import { getTimeStamp } from '../../utils/getTimeStamp'
import useWindowWidth from '../../context/useScreenWidth'
import { trendLineOption } from './trendLineOption'
import { priceRangeOption } from './priceRangeOption'
import { circleOption } from './circleOption'
import { calloutOption } from './callloutOption'

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
    handleSelectedLine,
    selectedLine,
    selectedLineText,
    indicatorArray,
    symbol,
    interval,
    selectLineColor,
    selectTextColor,
    selectBackgroundColor,
    setLastLineJSON,
    editType,
    templeWidth,
    selectedToolType,
    thickness,
    addData,
    addVolume,
    isAddStock,
    templeHeight,
    isAllDelete,
    loadingHandler,
    isStockBtn,
    colors: {
      backgroundColor = 'white',
      lineColor = '#2962FF',
      textColor = '#000000',
      areaTopColor = '#2962FF',
      areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {},
  } = props

  const chartContainerRef = useRef<IChartApi | null>(null)
  const chart = useRef<IChartApi | null>(null)
  const candleStickSeries = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const addCandleStickSeries = useRef <ISeriesApi<'Candlestick'> | null>(null)
  const [calloutPointLineSeries, setCalloutPointLineSeries] =
    useState<ILineToolApi<'Callout'>>()
  const width = useWindowWidth()
  const existingSeries = useRef({});
  
  useEffect(() => {
    if(!isAddStock) {
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
        rightPriceScale: {
          visible: true,
          autoScale:false,
          minimize: false,
          borderVisible: false,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
        },
        width: templeWidth,
        height: templeHeight,
      })

      candleStickSeries.current = chart.current.addBarSeries({
        upColor: '#000000',
        downColor: '#000000',
      })
      
      candleStickSeries.current.setData(data)

      const volumeSeries = chart.current.addHistogramSeries({
        color: '#7685AA',
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
    }
    
    if(isAddStock) {
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
          mode: PriceScaleMode.Percentage,
          scaleMargins: {
            top: 0.1,
            bottom: 0,
          },
        },
        rightPriceScale: {
          visible: true,
          autoScale: false,
          minimize: false,
          borderVisible: false,
          mode: PriceScaleMode.Percentage,
          scaleMargins: {
            top: 0.1,
            bottom: 0,
          },
        },
        width: templeWidth,
        height: templeHeight,
      })
      
      if(addData !== null) {
          const convertData = Object.keys(data).map(date => ({
            time: data[date]["time"],
            value: parseFloat(data[date]["open"])
          }));

          const addConvertData = Object.keys(addData).map(date => ({
            time: addData[date]["time"],
            value: parseFloat(addData[date]["open"])
          }));
         
          candleStickSeries.current = chart.current.addAreaSeries({ lineColor: 'blue', topColor: '#ffffff00', bottomColor: '#ffffff00', lineWidth: 2,  });
          candleStickSeries.current.setData(convertData);

          addCandleStickSeries.current = chart.current.addAreaSeries({ lineColor: 'red', topColor: '#ffffff00', bottomColor: '#ffffff00', lineWidth: 2,   });
          addCandleStickSeries.current.setData(addConvertData);
      }

      chart.current.timeScale().setVisibleLogicalRange({
        from: addData.length - 50,
        to: addData.length,
      })

      chart.current.subscribeClick(getPointInformation)
      chart.current.subscribeCrosshairMove(myCrosshairMoveHandler)
      chart.current
        .timeScale()
        .subscribeVisibleLogicalRangeChange(myVisibleLogicalRangeChangeHandler)
    }

    return () => {
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
    addData,
    addVolume,
    isAddStock
  ])

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
    if(editType === "callout") {
      chart.current?.addLineTool('Callout', [], calloutOption)
    }
  }, [editType])

  useEffect(() => {
    chart.current?.applyOptions({
      width: templeWidth,
    })
  }, [templeWidth])

  useEffect(() => {
    chart.current?.applyOptions({
      height: templeHeight,
    })
  }, [templeHeight])

  useEffect(() => {
    const options = chart.current?.options()
    const crosshair = options?.crosshair
    if (magnet) {
      const newCrosshair = { ...crosshair, magnetThreshold: 40 }
      const newOptions = { ...options, crosshair: newCrosshair }
      chart.current?.applyOptions(newOptions)
    } else {
      const newCrosshair = { ...crosshair, magnetThreshold: 0 }
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
      console.log(event.code)
      if(event.code === 'Delete') {
        handleDeleteKeyPressed();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown',handleKeyDown);
  }
  
  },[selectedLine])

  useEffect(() => {
    const fetchWrapper = async () => {
      loadingHandler(true)
      try {
        // Remove lines for indicators not in the new array
        Object.keys(existingSeries.current).forEach((indicator) => {
          if (!indicatorArray.includes(indicator)) {
            chart.current.removeSeries(existingSeries.current[indicator]);
            delete existingSeries.current[indicator];
          }
        });
  
        // Add or update lines for indicators in the new array
        for (const indifunction of indicatorArray) {
          if (!existingSeries.current[indifunction]) {
            const indicatorLineSeries = chart.current.addLineSeries({
              color: '#2962FF',
            });
            existingSeries.current[indifunction] = indicatorLineSeries;
          }
  
          const indicatorSeries = await fetchStockIndicator(
            indifunction,
            symbol,
            interval,
            20,
            'high'
          );
  
          const indicatorData = Object.entries(indicatorSeries)
            .map(([timestamp, values]) => ({
              time: getTimeStamp(timestamp),
              value: Number(values[indifunction]),
            }))
            .reverse();
  
          existingSeries.current[indifunction].setData(indicatorData);
        }
        loadingHandler(false)
      } catch (e) {
        console.error(e);
      }
    };
  
    fetchWrapper();
  }, [indicatorArray]);
 
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
    if(selectedLine !== '[]' && selectedLine && selectedToolType !== null) {
      let selectedLineTextJSON = JSON.parse(selectedLine)
      if(selectedToolType !== "label" && selectedToolType !== "Circle" && selectedToolType !== "PriceRange") {
        chart.current.applyLineToolOptions({
          ...selectedLineTextJSON[0],
          options: {
            line: {
              width: thickness
            }
          }
        })
      } else if (selectedToolType == "Circle") {
        chart.current.applyLineToolOptions({
          ...selectedLineTextJSON[0],
          options: {
            circle: {
              border: {
                width: thickness
              }
            }
          }
        })
      } else if (selectedToolType == "PriceRange") {
        chart.current.applyLineToolOptions({
          ...selectedLineTextJSON[0],
          options: {
            priceRange: {
              border: {
                width: thickness
              }
            }
          }
        })
      } else if (selectedToolType == "Callout") {
        chart.current.applyLineToolOptions({
          ...selectedLineTextJSON[0],
          options: {
            line: {
              width: thickness
            }
          }
        })
      }
    }
  },[thickness])

  useEffect(() => {
    if (selectedLine !== '[]' && selectedLine && selectedToolType !== null) {
        let selectedLineTextJSON = JSON.parse(selectedLine)
        if (selectedToolType === "TrendLine" || selectedToolType === "HorizontalLine" || selectedToolType === "VerticalLine" || selectedToolType === "Callout") {
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
         } else if (selectedToolType === "PriceRange" ) {
          chart.current.applyLineToolOptions({
              ...selectedLineTextJSON[0],
              options : {
                priceRange: {
                  border: {
                    color: selectLineColor.hex
                  },
                  text: {
                    value: selectedLineText,
                  },
                }
              }
          })
         } else if (selectedToolType === "Circle") {
            chart.current.applyLineToolOptions({
              ...selectedLineTextJSON[0],
              options : {
                circle: {
                  border: {
                    color: selectLineColor.hex
                  },
                  text: {
                    value: selectedLineText,
                  },
                }
              }
          })
         }
    }
  }, [selectLineColor])

  useEffect(() => {
    if (selectedLine !== '[]' && selectedLine) {
     let selectedLineTextJSON = JSON.parse(selectedLine)
      chart.current.applyLineToolOptions({
        ...selectedLineTextJSON[0],
        options: {
          text:{
            font: {
              color: selectTextColor.hex,
              value: selectedLineText
            }
          }
        }
      })
    }
  }, [selectTextColor])

  useEffect(() => {
    if (selectedLine !== '[]' && selectedLine) {
      let selectedLineTextJSON = JSON.parse(selectedLine)
      if(selectedToolType === "PriceRange") {
        chart.current.applyLineToolOptions({
          ...selectedLineTextJSON[0],
          options: {
            priceRange: {
              background: {
                color: selectBackgroundColor.hex
              }
            },
            text: {
              font: {
                value: selectedLineText
              }
            }
          },
        })
      } else if (selectedToolType === "Callout") {
        chart.current.applyLineToolOptions({
          ...selectedLineTextJSON[0],
          options: {
            text: {
              box: {
                background: {
                  color: selectBackgroundColor.hex
                }
              }
            }
          }
        })
      } else if (selectedToolType === "Circle") {
        chart.current.applyLineToolOptions({
          ...selectedLineTextJSON[0],
          options: {
            circle: {
              background: {
                color: selectBackgroundColor.hex
              }
            },
            text: {
              font: {
                value: selectedLineText
              }
            }
          },
        })
      }
      }
  }, [selectBackgroundColor])

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
    if (labelPoint) {
      const ret = chart.current?.addLineTool('Text', [labelPoint], labelDefaultOption)
      setLastLineJSON (ret); 
    }

    chart.current.applyOptions({})
  }, [labelPoint])

  useEffect(() => {
    if (horizontalPoint) {
      chart.current?.removeSelectedLineTools();
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
      chart.current?.removeSelectedLineTools();
      if(verticalPoint.timestamp == 0) {
        return;
      }
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
        chart.current?.addLineTool(
          'Callout',
          [calloutPoint.point1, calloutPoint.point2],
          calloutOption,
        )
        chart.current?.removeSelectedLineTools();
      }
    chart.current?.applyOptions({})
  }, [calloutPoint])

  useEffect(() => {
    if (priceRangePoint) {
      chart.current?.addLineTool(
        'PriceRange',
        [priceRangePoint.point1, priceRangePoint.point2],
        priceRangeOption
      )
      chart.current?.removeSelectedLineTools();
    }

    chart.current.applyOptions({})
  }, [priceRangePoint])

  useEffect(() => {
    chart.current?.removeSelectedLineTools()
  }, [selectDelete])

  useEffect(() => {
    if(isAllDelete) {
      chart.current?.removeAllLineTools();
    }
  },[isAllDelete])

  return (
    <div ref={chartContainerRef} />
  )
 
}
