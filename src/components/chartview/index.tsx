// import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, FC } from 'react';

import { createChart, ColorType, TextAlignment, BoxHorizontalAlignment, BoxVerticalAlignment } from '../lightweights-line-tools';
import { IChartApi } from '../lightweights-line-tools/api/ichart-api';

function myClickHandler(param:any) {
	if (!param.point){
		return;
	}
	console.log(`Click at ${param.point.x}, ${param.point.y}. The time is ${param.time}.`)
}

export const ChartComponent = (props : any) => {
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

    useEffect(
        () => {
            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
            };

            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,
                },
                width: 800,
                height: 800,
            });
            
            const candleStickSeries = chart.addCandlestickSeries({upColor:"green", downColor:"red"});
            candleStickSeries.setData(data);
            
            const volumeSeries = chart.addHistogramSeries({
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
            
            chart.timeScale().fitContent();

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

			const trendLineTool = chart.addLineTool(
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
			var circleLineTools = chart.addLineTool("Circle", [circlePoint.point1, circlePoint.point2], {
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

			chart.subscribeClick(myClickHandler)

			// if (selectDelete === true) {
			// 	console.log(selectDelete)
			// 	console.log("hello")
			// 	// chart.removeSelectedLineTools()
			// }

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
				chart.unsubscribeClick(myClickHandler);
                chart.remove();
            };
        },
        [data, selectDelete, volume, circlePoint, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
    );

    return (
        <div
            ref={chartContainerRef}
        />
    );
};

export function ChartView(props: any, child:FC ) {
    return (
        <ChartComponent {...props} />
    );
}
