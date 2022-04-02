import { RootState } from '@redux/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPlayerState, IProgressPayload } from './palyerSlice.interface'

const musics = [
  {
    name: 'jacinto-1',
    title: '0 Electric Chill Machine',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-2',
    title: '1 Seven Nation Army (Remix)',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-3',
    title: '2 Goodnight, Disco Queen',
    artist: 'Jacinto Design',
  },
  {
    name: 'metric-1',
    title: '3 Front Row (Remix)',
    artist: 'Metric/Jancinto Design',
  },
]

// 랜덤 셔플 알고리즘
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shuffle = (array: number[]) => {
  const arraySize = array.length
  const indexArray = Array.from({ length: arraySize }, (_, i) => i)
  array.forEach((_, index) => {
    if (index === arraySize - 1) {
      return
    }
    const randomIndex = Math.floor(Math.random() * (arraySize - index) + index)
    const temp = indexArray[index]
    indexArray[index] = indexArray[randomIndex]
    indexArray[randomIndex] = temp
  })

  return indexArray
}

const initialState: IPlayerState = {
  list: {
    musics,
    currentIndex: 0,
    indexArray: [0, 1, 2, 3],
  },
  controll: {
    isPlay: false,
    isShuffle: false,
    repeat: undefined,
  },
  progress: {
    percent: 0,
    duration: 0,
    durationStringTime: '0:00',
    currentStringTime: '0:00',
  },
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.list.currentIndex = action.payload
    },
    nextMusic: (state) => {
      state.list.currentIndex =
        (state.list.currentIndex + 1) % state.list.musics.length
    },
    prevMusic: (state) => {
      const calcIndex = state.list.currentIndex - 1
      const prevIndex = calcIndex < 0 ? musics.length - 1 : calcIndex
      state.list.currentIndex = prevIndex
    },
    togglePlay: (state, action: PayloadAction<boolean | undefined>) => {
      state.controll.isPlay =
        action.payload === undefined ? !state.controll.isPlay : action.payload
    },
    toggleRepeat: (state) => {
      switch (state.controll.repeat) {
        case undefined:
          state.controll.repeat = 'one'
          break
        case 'one':
          state.controll.repeat = 'all'
          break
        case 'all':
          state.controll.repeat = undefined
      }
    },
    toggleShuffle: (state) => {
      const { indexArray, currentIndex } = state.list
      const changedShuffle = !state.controll.isShuffle
      state.controll.isShuffle = changedShuffle
      if (changedShuffle) {
        state.list.indexArray = shuffle(state.list.indexArray)
        state.list.currentIndex = 0
      } else {
        const currentMusicIndex = musics.findIndex(
          (item) => item === musics[indexArray[currentIndex]]
        )
        state.list.currentIndex = currentMusicIndex
        state.list.indexArray = Array.from(
          { length: indexArray.length },
          (_, i) => i
        )
      }
    },
    setProgress: (state, action: PayloadAction<IProgressPayload>) => {
      state.progress = { ...state.progress, ...action.payload }
    },
  },
  extraReducers: {},
})

// Action creators are generated for each case reducer function
export const {
  setCurrentIndex,
  nextMusic,
  prevMusic,
  toggleRepeat,
  toggleShuffle,
  togglePlay,
  setProgress,
} = playerSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPlayer = (state: RootState) => state.player

export default playerSlice.reducer
