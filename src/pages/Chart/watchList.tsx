import { FC, useEffect, useState } from 'react'
import Draggable from 'react-draggable'

import { ThumbSvg, CloseListSvg, RecycleBinSvg } from '../../assets/icons'
import { useWatchListsStore } from '../../context/watchListStore'
import { useAuthContext } from '../../context/authContext'
import { fetchCompanyName } from '../../api/fetchCompanyName'
import { fetchEndQuote } from '../../api/fetchEndQuote'

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

export const WatchList: FC = () => {
  const { watchLists, setWatchLists, loadWatchLists, saveWatchLists } =
    useWatchListsStore()
  const { user } = useAuthContext()
  const [isVisibleAddList, setIsVisibleAddList] = useState<boolean>(false)
  const [addCategory, setAddCategory] = useState<string>('Stocks')
  const [addStock, setAddStock] = useState<string>('')
  const [companyData, setCompanyData] = useState<companyData[]>([])
  const [endQuote, setEndQuote] = useState<endQuoteMap>({})

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
    console.log('endQuote: ', endQuote)
  }, [endQuote])

  useEffect(() => {
    const fetchWrapper = async () => {
      console.log('loadWatchlists!')
      await loadWatchLists(user.id)
    }
    const saveWrapper = async () => {
      console.log('saveWatchLists!')
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
        console.log('name: ', name)
        setCompanyData(name)
      }
    }
    fetchWrapper().catch(e => console.log(e))
  }, [addStock])

  return (
    <div className="flex flex-col ml-2 w-[400px] h-[800px] bg-white pt-2">
      <div className="flex flex-row mr-4 mb-4">
        <div className="w-1/4 flex flex-row">
          <img src={ThumbSvg} />
          Symbol
        </div>
        <div className="w-1/4 text-right">Last</div>
        <div className="w-1/4 text-right pr-2">Chg</div>
        <div className="w-1/4 text-right pr-4">Chg%</div>
      </div>
      {Object.keys(watchLists).map((header: string, index: number) => {
        return (
          <div
            className="flex flex-col py-2 px-4 border-b-[#008C48] border-b-2 ml-2"
            key={index}
          >
            <div className="flex flex-row">
              <img
                src={CloseListSvg}
                className="hover:bg-gray4 hover:cursor-pointer"
                onClick={() => onVisibleHeader(header)}
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
                    className="flex flex-row ml-4 my-1"
                    key={`${header}-${index}`}
                  >
                    <div className="w-1/4 text-left">{stock}</div>
                    <div className="w-1/4 text-right">
                      {endQuote[stock] && endQuote[stock]['05. price']}
                    </div>
                    <div className={`w-1/4 text-right ${changeColor}`}>
                      {endQuote[stock] && endQuote[stock]['09. change']}
                    </div>
                    <div className={`w-1/4 text-right ${changeColor}`}>
                      {endQuote[stock] && endQuote[stock]['10. change percent']}
                    </div>
                    <button
                      className="p-1 bg-gray4 rounded-sm"
                      onClick={() => deleteStock(header, stock)}
                    >
                      <img src={RecycleBinSvg} width={15} />
                    </button>
                  </div>
                )
              })}
          </div>
        )
      })}
      {isVisibleAddList && (
        <Draggable defaultPosition={{ x: 100, y: 350 }}>
          <div className="absolute flex flex-col p-2 z-30 bg-white w-[500px] h-[550px] border border-black rounded-md cursor-pointer">
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
                <div className="flex w-[120px]">Symbol</div>
                <div className="flex w-">Name</div>
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
                <div className="flex w-[120px]">{data['1. symbol']}</div>
                <div className="flex">{data['2. name']}</div>
              </div>
            ))}
          </div>
        </Draggable>
      )}
    </div>
  )
}
