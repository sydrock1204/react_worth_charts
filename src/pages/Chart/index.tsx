import { FC, useState, useEffect, useRef } from 'react'

import { StockPriceData, VolumeData, Point, CirclePoint } from '../../utils/typing'
import { fetchData } from '../../api/fetchData'
import { getTimeStamp } from '../../utils/getTimeStamp'
// import { ChartView } from '../../components/chartview'

import TrendSvg from '../../assets/icons/Trend.svg'
import CircleSvg from '../../assets/icons/Circle.png'
import Remove from '../../assets/icons/Remove.png'

import { rawData } from './rawData'

import { createChart, ColorType, TextAlignment, BoxHorizontalAlignment, BoxVerticalAlignment } from '../../components/lightweights-line-tools';
import { IChartApi } from '../../components/lightweights-line-tools/api/ichart-api'

function myClickHandler(param:any) {
	if (!param.point){
		return;
	}
	console.log(`Click at ${param.point.x}, ${param.point.y}. The time is ${param.time}.`)
}

const ChartComponent = (props : any) => {
    const {
        data,
        volume,
		circlePoint,
		selectDelete,
        colors: {
            backgroundColor = 'white',
            lineColor = '#2962FF',
            textColor = 'black',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    const chartContainerRef = useRef<IChartApi | null>(null);
	const chart = useRef<IChartApi | null>(null)
    const [priorSelectDelete, setPriorSelectDelete]= useState<boolean>(selectDelete)

    useEffect(
        () => {
            const handleResize = () => {
                chart.current?.applyOptions({ width: chartContainerRef.current?.clientWidth });
            };

            chart.current = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,
                },
                width: 800,
                height: 800,
            });
            
            const candleStickSeries = chart.current.addCandlestickSeries({upColor:"green", downColor:"red"});
            candleStickSeries.setData(data);
            
            const volumeSeries = chart.current.addHistogramSeries({
                color: '#26a69a',
                priceFormat: {
                    type: 'volume'
                },
                priceScaleId: '',
                scaleMargins: {
                    top: 0.7,
                    bottom: 0,
                },
            });
            volumeSeries.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.75,
                    bottom: 0,
                },
            })
            volumeSeries.setData(volume);
            
            chart.current.timeScale().fitContent();

            // const rPrice1 = 200;
			// const rTS1 = Date.parse("2024-03-10") / 1000;
			// const rPointl = { price: rPrice1, timestamp: rTS1 };

			// const rPrice2 = 180;
			// const rTS2 = Date.parse("2024-04-19") / 1000;
			// const rPoint2 = { price: rPrice2, timestamp: rTS2 };

			// const lineTools = chart.addLineTool("Rectangle", [rPointl, rPoint2], {
			// 	text: {
			// 		value: "This is the Box Area",
			// 		alignment: TextAlignment.Left,
			// 		font: {
			// 			color: "rgba(41,98,255,1)",
			// 			size: 20,
			// 			bold: false,
			// 			italic: false,
			// 			family: "Arial",
			// 		},
			// 		box: {
			// 			alignment: {
			// 				vertical: BoxVerticalAlignment.Middle,
			// 				horizontal: BoxHorizontalAlignment.Center,
			// 			},
			// 			angle: 0,
			// 			scale: 1,
			// 			offset: {
			// 				x: 0,
			// 				y: 0,
			// 			},
			// 			padding: {
			// 				x: 0,
			// 				y: 0,
			// 			},
			// 			maxHeight: 100,
			// 			shadow: {
			// 				blur: 0,
			// 				color: "rgba(255,255,255,1)",
			// 				offset: {
			// 					x: 0,
			// 					y: 0,
			// 				},
			// 			},
			// 			border: {
			// 				color: "rgba(126,211,33,0)",
			// 				width: 4,
			// 				radius: 0,
			// 				highlight: false,
			// 				style: 3,
			// 			},
			// 			background: {
			// 				color: "rgba(199,56,56,0)",
			// 				inflation: {
			// 					x: 0,
			// 					y: 0,
			// 				},
			// 			},
			// 		},
			// 		padding: 0,
			// 		wordWrapWidth: 0,
			// 		forceTextAlign: false,
			// 		forceCalculateMaxLineWidth: false,
			// 	},
			// 	rectangle: {
			// 		background: {
			// 			color: "rgba(156,39,176,0.2)",
			// 			// inflation: {
			// 			// 	x: 0,
			// 			// 	y: 0,
			// 			// },
			// 		},
			// 		border: {
			// 			color: "rgba(39,176,80,1)",
			// 			width: 3,
			// 			// radius: 0,
			// 			// highlight: false,
			// 			style: 3,
			// 		},
			// 		extend: {
			// 			right: false,
			// 			left: false,
			// 		},
			// 	},
			// 	visible: true,
			// 	editable: true,
			// });

			const tlPrice1 = 180.0;
			const tlTS1 = Date.parse("2024-01-20") / 1000;
			const tlPoint1 = { price: tlPrice1, timestamp: tlTS1 };
			const tlPrice2 = 190.0;
			const tlTS2 = Date.parse("2024-03-15") / 1000;
			const tlPoint2 = { price: tlPrice2, timestamp: tlTS2 };

			const trendLineTool = chart.current.addLineTool(
				"TrendLine",
				[tlPoint1, tlPoint2],
				{
					text: {
						value: "TrendLine with box",
						alignment: TextAlignment.Left,
						font: {
							color: "rgba(255,255,255,1)",
							size: 14,
							bold: true,
							italic: true,
							family: "Arial",
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
								color: "rgba(255,255,255,1)",
								offset: {
									x: 0,
									y: 0,
								},
							},
							border: {
								color: "rgba(126,211,33,1)",
								width: 4,
								radius: 20,
								highlight: false,
								style: 1,
							},
							background: {
								color: "rgba(199,56,56,0.25)",
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
						color: "rgba(41,98,255,1)",
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
			);

			if (circlePoint) {
			var circleLineTools = chart.current.addLineTool("Circle", [circlePoint.point1, circlePoint.point2], {
				text: {
					value: "circle text\nline 2 of text",
					alignment: TextAlignment.Center,
					font: {
						color: "rgba(255,255,255,1)",
						size: 18,
						bold: false,
						italic: false,
						family: "Roboto",
					},
					box: {
						alignment: {
							vertical: BoxVerticalAlignment.Bottom,
							horizontal: BoxHorizontalAlignment.Right,
						},
						angle: 0,
						scale: 1,
						offset: {
							x: 0,
							y: 10,
						},
						padding: {
							x: 0,
							y: 0,
						},
						maxHeight: 500,
						shadow: {
							blur: 50,
							color: "rgba(248,231,28,1)",
							offset: {
								x: 10,
								y: 10,
							},
						},
						border: {
							color: "rgba(126,211,33,1)",
							width: 4,
							radius: 50,
							highlight: false,
							style: 3,
						},
						background: {
							color: "rgba(208,2,27,1)",
							inflation: {
								x: 20,
								y: 20,
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
						color: "rgba(39,176,119,0.2)",
					},
					border: {
						color: "rgba(156,39,176,0.5)",
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
			});
			}

			// chart.subscribeClick(myClickHandler)

			// if (selectDelete != priorSelectDelete) {
            //     console.log("PriorSelectDelete", priorSelectDelete)
			// 	console.log("Inside UseEffect",selectDelete)
			// 	let id = JSON.parse(chart.exportLineTools())[0]["id"]
			// 	console.log("Chart All Lines: ", JSON.parse(chart.exportLineTools()))
			// 	console.log("first Id: ",id)
			// 	// chart.removeAllLineTools()
			// 	chart.removeLineToolsById([id])
			// 	// chart.importLineTools(JSON.stringify(initialData))
            //     setPriorSelectDelete(selectDelete)
			// }

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
				// chart.unsubscribeClick(myClickHandler);
                chart.current?.remove();
            };
        },
        [data, 
			// selectDelete, 
			volume, circlePoint, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
    );

    useEffect(()=>{
		// console.log("Chart All Lines: ", JSON.parse(chart.current.exportLineTools()))
		// chart.current.removeAllLineTools()
		// console.log(chart.current?.getSelectedLineTools())
		chart.current?.removeSelectedLineTools()
		    // const rPrice1 = 200;
			// const rTS1 = Date.parse("2024-03-10") / 1000;
			// const rPointl = { price: rPrice1, timestamp: rTS1 };

			// const rPrice2 = 180;
			// const rTS2 = Date.parse("2024-04-19") / 1000;
			// const rPoint2 = { price: rPrice2, timestamp: rTS2 };

			// const lineTools = chart.current.addLineTool("Rectangle", [rPointl, rPoint2], {
			// 	text: {
			// 		value: "This is the Box Area",
			// 		alignment: TextAlignment.Left,
			// 		font: {
			// 			color: "rgba(41,98,255,1)",
			// 			size: 20,
			// 			bold: false,
			// 			italic: false,
			// 			family: "Arial",
			// 		},
			// 		box: {
			// 			alignment: {
			// 				vertical: BoxVerticalAlignment.Middle,
			// 				horizontal: BoxHorizontalAlignment.Center,
			// 			},
			// 			angle: 0,
			// 			scale: 1,
			// 			offset: {
			// 				x: 0,
			// 				y: 0,
			// 			},
			// 			padding: {
			// 				x: 0,
			// 				y: 0,
			// 			},
			// 			maxHeight: 100,
			// 			shadow: {
			// 				blur: 0,
			// 				color: "rgba(255,255,255,1)",
			// 				offset: {
			// 					x: 0,
			// 					y: 0,
			// 				},
			// 			},
			// 			border: {
			// 				color: "rgba(126,211,33,0)",
			// 				width: 4,
			// 				radius: 0,
			// 				highlight: false,
			// 				style: 3,
			// 			},
			// 			background: {
			// 				color: "rgba(199,56,56,0)",
			// 				inflation: {
			// 					x: 0,
			// 					y: 0,
			// 				},
			// 			},
			// 		},
			// 		padding: 0,
			// 		wordWrapWidth: 0,
			// 		forceTextAlign: false,
			// 		forceCalculateMaxLineWidth: false,
			// 	},
			// 	rectangle: {
			// 		background: {
			// 			color: "rgba(156,39,176,0.2)",
			// 			// inflation: {
			// 			// 	x: 0,
			// 			// 	y: 0,
			// 			// },
			// 		},
			// 		border: {
			// 			color: "rgba(39,176,80,1)",
			// 			width: 3,
			// 			// radius: 0,
			// 			// highlight: false,
			// 			style: 3,
			// 		},
			// 		extend: {
			// 			right: false,
			// 			left: false,
			// 		},
			// 	},
			// 	visible: true,
			// 	editable: true,
			// });

			// chart.current.timeScale().fitContent();

    }, [selectDelete])

    // useEffect(()=>{
    //     console.log("Individual selectDete", selectDelete)
    //     // const chart=createChart(chartContainerRef.current)
    //     // chart.removeSelectedLineTools()
    // }, [selectDelete])

    return (
        <div
            ref={chartContainerRef}
        />
    );
};

const Chart:FC = () => {
    const [data, setData] = useState<StockPriceData[]>([])
    const [volume, setVolume] = useState<VolumeData[]>([])
    const [circlePoints, setCirclePoints] = useState< CirclePoint | null>(null)
    const [selectDelete, setSelectDelete] = useState<boolean>(false)

    const createCircleLine = () => {
        const circlePrice1 = 183.0;
        const circleTS1 = Date.parse("2024-02-29") / 1000;
        const circlePoint1: Point = { price: circlePrice1, timestamp: circleTS1 };

        const circlePrice2 = 178.5;
        const circleTS2 = Date.parse("2024-03-24") / 1000;
        const circlePoint2: Point = { price: circlePrice2, timestamp: circleTS2 };

        setCirclePoints({ point1: circlePoint1, point2: circlePoint2})
    }

    useEffect(() => {
        const Data = Object.entries(rawData).map( data => {
            let stockData = {
                time: getTimeStamp(data[0]),
                open: Number(data[1]["1. open"]),
                high: Number(data[1]["2. high"]),
                low: Number(data[1]["3. low"]),
                close: Number(data[1]["4. close"]),
            }
            return stockData
        }).reverse()
        setData(Data)
        
        const Volume = Object.entries(rawData).map( (data, index) => {
            let volumeData = {
                time: data[0],
                value: Number(data[1]["5. volume"]),
                color: index%2===0? "#26a69a":"#ef5350"
            }
            return volumeData
        }).reverse()
        setVolume(Volume)
    }, [])

    return (
        <div id='Chart' className="flex flex-row">
            <div className="flex flex-col w-16 h-[800px] border border-color-black bg-white p-2">
                <img src={CircleSvg} alt="Circle" width={50} onClick = {createCircleLine} />
                <img src={TrendSvg} alt="Trend" width={50} />
				<img src={Remove} alt="Remove" width={50} onClick={()=>{setSelectDelete(!selectDelete); console.log(selectDelete)}} />
            </div>
            <ChartComponent 
                selectDelete={selectDelete}
                data={data} 
                volume={volume} 
                circlePoint={circlePoints}
            />
        </div>
    )
}

export default Chart