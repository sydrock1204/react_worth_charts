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
import { color } from 'framer-motion'

const trendLineOption = {
  text: {
    value: '',
    alignment: TextAlignment.Left,
    font: {
      color: '#000000',
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
        color: '#ffffff00',
        width: 4,
        radius: 20,
        highlight: false,
        style: 1,
      },
      background: {
        color: '#ffffff00',
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
      color: '#000000',
      size: 15,
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
        y: 10,
      },
      padding: {
        x: 0,
        y: 0,
      },
      maxHeight: 500,
      border: {
        color: '#ffffff00',
        width: 4,
        radius: 20,
        highlight: false,
        style: 3,
      },
      background: {
        color: '#ffffff00',
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
  const [priorSelectDelete, setPriorSelectDelete] =
    useState<boolean>(selectDelete)
  const width = useWindowWidth()
  const existingSeries = useRef({});

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
    if(editType === "callout") {
      chart.current?.addLineTool('Callout', [], calloutDefaultOption)
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
      height: templeWidth*0.8
    })

    // candleStickSeries.current = chart.current.addCandlestickSeries({
    //   upColor: '#000000',
    //   downColor: '#000000',
    // })
    
    candleStickSeries.current = chart.current.addBarSeries({
      upColor: '#000000',
      downColor: '#000000',
    })
    candleStickSeries.current.setData(data)
    
    if(isAddStock) {
      if(addData !== null) {
        addCandleStickSeries.current = chart.current.addBarSeries({
          upColor: '#de2626',
          downColor: '#de2626',
        })
  
        addCandleStickSeries.current.setData(addData);
      }
    }
   
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
    
    if(isAddStock) {
      if(addVolume !== null) {
        const addVolumeSeries = chart.current.addHistogramSeries({
          color: '#e1101d6b',
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: 'left',
          scaleMargins: {
            top: 0.7,
            bottom: 0,
          },
        })
        
        addVolumeSeries.priceScale().applyOptions({
          scaleMargins: {
            top: 0.75,
            bottom: 0,
          },
        })    
    
        addVolumeSeries.setData(addVolume);
      }
    }

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
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    addData,
    addVolume,
    isAddStock,
  ])

  useEffect(() => {
    const fetchWrapper = async () => {
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
      setCalloutPointLineSeries(
        chart.current?.addLineTool(
          'Callout',
          [calloutPoint.point1, calloutPoint.point2],
          calloutDefaultOption,
        )
        )
      chart.current?.removeSelectedLineTools();
      }
    chart.current?.applyOptions({})
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
