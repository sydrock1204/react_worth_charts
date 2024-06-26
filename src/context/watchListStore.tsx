import { create } from 'zustand'

import { stockWatchLists, stockWatchListState } from '../utils/typing'

import { supabase } from './supabase'

export const defaultStockWatchLists: stockWatchLists = {
  Indices: {
    visible: false,
    lists: [],
  },
  Stocks: {
    visible: true,
    lists: ['AAPL', 'NVDA'],
  },
  Futures: {
    visible: false,
    lists: [],
  },
}

export const useWatchListsStore = create<stockWatchListState>()(set => ({
  watchLists: defaultStockWatchLists,
  initWatchLists: () =>
    set(() => ({
      watchLists: {
        Indices: {
          visible: false,
          lists: [],
        },
        Stocks: {
          visible: true,
          lists: [],
        },
        Futures: {
          visible: false,
          lists: [],
        },
      },
    })),
  setWatchLists: (watchLists: stockWatchLists) => set(() => ({ watchLists })),
  updateWatchLists: (header: string, stock: string) =>
    set(state => ({
      ...state.watchLists,
      [header]: {
        visible: state.watchLists[header].visible,
        lists: [...state.watchLists[header].lists, stock],
      },
    })),
  deleteWatchLists: (header: string, stock: string) =>
    set(state => ({
      ...state.watchLists,
      [header]: {
        visible: state.watchLists[header].visible,
        lists: state.watchLists[header].lists.filter(list => list != stock),
      },
    })),
  saveWatchLists: async (userId: any) => {
    let currentWatchLists = useWatchListsStore.getState().watchLists

    // I will update the watchlists into currentWatchLists in the supabase
    let { data, error } = await supabase
      .from('watchlists')
      .update({ watchlists: currentWatchLists })
      .eq('user_id', userId)
      .select('watchlists')

    if (error) {
      console.log('Error: ', error)
    }
  },
  loadWatchLists: async (userId: any) => {
    // console.log('UserId: ', userId)
    let { data, error } = await supabase
      .from('watchlists')
      .select('*')
      .eq('user_id', userId)
    set(() => ({ watchLists: data[0].watchlists }))
  },
}))
