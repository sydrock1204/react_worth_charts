import { FC, useEffect, useState } from 'react'
import Draggable from 'react-draggable'
import { ThumbSvg, CloseListSvg, RecycleBinSvg } from '../../assets/icons'
import { useWatchListsStore } from '../../context/watchListStore'
import { useAuthContext } from '../../context/authContext'
import { fetchCompanyName } from '../../api/fetchCompanyName'
import { fetchEndQuote } from '../../api/fetchEndQuote'
import useWindowWidth from '../../context/useScreenWidth'
interface companyData {
  [key: string]: string
}
interface endQuote {
  '01. symbol': string
  '02. open': string
  '03. high': string
  '04. low': string
  '05. price': string
  '06. volume': string
  '07. latest trading day': string
  '08. previous close': string
  '09. change': string
  '10. change percent': string
}
interface endQuoteMap {
  [stock: string]: endQuote
}

export const WatchList = (props : any) => {
  const { 
    addStockfromheader,
    addStockChartHandler,
    symbol
  } = props;
  const { watchLists, setWatchLists, loadWatchLists, saveWatchLists } =
    useWatchListsStore()
  const { user } = useAuthContext()
  const [isVisibleAddList, setIsVisibleAddList] = useState<boolean>(false)
  const [addCategory, setAddCategory] = useState<string>('Stocks')
  const [addStock, setAddStock] = useState<string>('')
  const [companyData, setCompanyData] = useState<companyData[]>([])
  const [endQuote, setEndQuote] = useState<endQuoteMap>({})
  const [watchListWidth, setWatchListWidth] = useState<string>('lg')
  const width = useWindowWidth()
  const [isBtnSelected, setIsBtnSelected] = useState<boolean>(true) 
  const [currentStock, setCurrentStock] = useState(null)

  const onVisibleHeader = (header: string) => {
    setWatchLists({
      ...watchLists,
      [header]: {
        ...watchLists[header],
        visible: !watchLists[header].visible,
      },
    })
  }

  const deleteStock = (header: string, stock: string) => {
    setWatchLists({
      ...watchLists,
      [header]: {
        ...watchLists[header],
        lists: watchLists[header].lists.filter(list => list != stock),
      },
    })
  }

  const handleAddStock = (tempAddStock: string) => {
    if (!watchLists[addCategory].lists.includes(tempAddStock)) {
      setWatchLists({
        ...watchLists,
        [addCategory]: {
          ...watchLists[addCategory],
          lists: [...watchLists[addCategory].lists, tempAddStock],
          visible: true,
        },
      })
    }
    setIsVisibleAddList(false)
  }

  useEffect(() => {
    if ( addStockfromheader != null ) {
      if (!watchLists["STOCKS"].lists.includes(addStockfromheader)) {
        setWatchLists({
          ...watchLists,
          ["STOCKS"]: {
            ...watchLists["STOCKS"],
            lists: [...watchLists["STOCKS"].lists, addStockfromheader],
            visible: true,
          },
        })
      }
      setIsVisibleAddList(false)
    }
  },[addStockfromheader])

  useEffect(() => {
    const updateData = () => {
      let tempLists = []
      Object.keys(watchLists).map((header: string) => {
        watchLists[header].lists.map((stock: string) => {
          tempLists.push(stock)
        })
      })

      const fetchPromises = tempLists.map(async (stock: string) => {
        const quoteData = await fetchEndQuote(stock)
        return { stock, quoteData }
      })

      Promise.all(fetchPromises)
        .then(results => {
          const newEndQuote = results.reduce((acc, { stock, quoteData }) => {
            acc[stock] = quoteData
            return acc
          }, {})

          setEndQuote(prevEndQuote => ({
            ...prevEndQuote,
            ...newEndQuote,
          }))
        })
        .catch(e => console.log(e))
    }

    updateData()

    const intervalId = setInterval(updateData, 900000)

    return () => clearInterval(intervalId)
  }, [watchLists])

  useEffect(() => {
    // console.log('endQuote: ', endQuote)
  }, [endQuote])

  useEffect(() => {
    const fetchWrapper = async () => {
      await loadWatchLists(user.id)
    }
    const saveWrapper = async () => {
      try {
        await saveWatchLists(user.id)
      } catch (e) {
        console.log(e)
      }
    }

    fetchWrapper().catch(e => console.log(e))
    return () => {
      saveWrapper()
    }
  }, [])

  useEffect(() => {
    const fetchWrapper = async () => {
      if (addStock) {
        let name = await fetchCompanyName(addStock)
        setCompanyData(name)
      }
    }
    fetchWrapper().catch(e => console.log(e))
  }, [addStock])

  useEffect(() => {
    if (width > 1440) {
      setWatchListWidth('xl')
    } else if (width > 1024 && width <= 1440) {
      setWatchListWidth('lg')
    } else if (width > 768 && width <= 1024) {
      setWatchListWidth('md')
    } else if (width <= 768) {
      setWatchListWidth('sm')
    }
  }, [width])
  
  const stockChartHandler = (stock) => {
      addStockChartHandler(stock, isBtnSelected);
  } 

  if (width > 1400) {
    return (
      <div className='w-[430px]'>
        <div className="flex flex-row">
          <div className="w-1/4 flex flex-row text-xl text-[#6A6D78]">
            <img src={ThumbSvg} className='h-[20px] w-[17px]' alt='image'/>
            Symbol
          </div>
          <div className="w-1/4 text-right text-xl text-[#6A6D78]">Last</div>
          <div className="w-1/4 text-right pr-2 text-xl text-[#6A6D78]">Chg</div>
          <div className="w-1/4 text-right pr-4 mr-2 text-xl text-[#6A6D78]">Chg%</div>
        </div>
        {Object.keys(watchLists).map((header: string, index: number) => {
          return (
            <div
              className="flex flex-col py-2 px-4 border-b-[#008C48] border-b-2 border-opacity-35 ml-2"
              key={index}
            >
              <div className="flex flex-row text-base text-[#6A6D78]">
                <img
                  src={CloseListSvg}
                  className="hover:bg-gray4 hover:cursor-pointer"
                  onClick={() => onVisibleHeader(header)}
                  alt='image'
                />
                {header}
                <div className="flex-grow grid place-items-end">
                  <button
                    className="flex px-2 rounded-sm bg-gray4"
                    onClick={() => {
                      setAddCategory(header)
                      setIsVisibleAddList(true)
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              {watchLists[header].visible &&
                watchLists[header].lists.map((stock: string, index: number) => {
                  let changeColor = 'text-black'
                  if (
                    endQuote[stock] &&
                    endQuote[stock]['09. change'] &&
                    Number(endQuote[stock]['09. change']) > 0
                  ) {
                    changeColor = 'text-green-500'
                  } else if (
                    endQuote[stock] &&
                    endQuote[stock]['09. change'] &&
                    Number(endQuote[stock]['09. change']) < 0
                  ) {
                    changeColor = 'text-red-500'
                  }
                  return (
                    <div
                      className="flex flex-row ml-4 my-1 text-[#6A6D78]"
                      key={`${header}-${index}`}
                    >
                      <button 
                        className={`w-1/4 text-center ${(currentStock == stock) && ('bg-red-400 text-white')}`} 
                        onClick={() => { 
                          if(stock !== symbol) {
                            stockChartHandler(stock);
                            setIsBtnSelected(!isBtnSelected);
                            if(isBtnSelected) {
                              setCurrentStock(stock);
                            } else {
                              setCurrentStock(null);
                            }
                          } else {
                            alert('Same company')
                          }
                        }}
                      >
                        {stock}
                      </button>
                      <div className="w-1/4 text-right">
                        {endQuote[stock] &&
                          Number(endQuote[stock]['05. price']).toFixed(2)}
                      </div>
                      <div className={`w-1/4 text-right ${changeColor}`}>
                        {endQuote[stock] &&
                          Number(endQuote[stock]['09. change']).toFixed(2)}
                      </div>
                      <div className={`w-1/4 text-right ${changeColor}`}>
                        {endQuote[stock] &&
                          Number(
                            endQuote[stock]['10. change percent'].replace(
                              '%',
                              ''
                            )
                          )
                            .toFixed(2)
                            .toString() + '%'}
                      </div>
                      <button
                        className="ml-2 p-1 bg-gray4 rounded-sm"
                        onClick={() => deleteStock(header, stock)}
                      >
                        <img src={RecycleBinSvg} width={15} alt=''/>
                      </button>
                    </div>
                  )
                })}
            </div>
          )
        })}
        {isVisibleAddList && (
          <Draggable defaultPosition={{ x: 70, y: 100 }}>
            <div className="absolute flex flex-col p-2 z-30 bg-white  h-auto border border-black rounded-md cursor-pointer">
              <div className="flex flex-row">
                {/* Add {addCategory} */}
                <div className="grid w-1/2 place-items-start ml-2">
                  Add {addCategory}
                </div>
                <div className="grid w-1/2 place-items-end mr-1">
                  <button
                    className="bg-color-brand-black w-20 px-4 py-1 rounded-md text-white text-sm"
                    onClick={() => setIsVisibleAddList(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="flex justify-center mt-2 mb-4">
                <input
                  className="flex w-4/5 place-items-center border border-gray2"
                  onChange={e => setAddStock(e.target.value)}
                  value={addStock}
                ></input>
              </div>
              <div className="flex flex-column">
                <div className="flex flex-row">
                  <div className="flex ">Symbol</div>
                  <div className="flex ">Name</div>
                </div>
              </div>
              {companyData.map((data, index) => (
                <div
                  className="flex flex-row hover:bg-gray4"
                  key={index}
                  onClick={() => {
                    handleAddStock(data['1. symbol'])
                  }}
                >
                  <div className="flex">{data['1. symbol']}</div>
                  <div className="flex">{data['2. name']}</div>
                </div>
              ))}
            </div>
          </Draggable>
        )}
      </div>
    )
  } else if (width <= 1400) {
    return <></>
  }
}
