import { RootState } from '@redux/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IMusic, IPlayerState, IProgressPayload } from './palyerSlice.interface'

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
  currentMusic: null,
  musics: [],
  indexing: {
    currentIndex: 0,
    indexArray: [],
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
    setCurrentMusic: (state, action: PayloadAction<IMusic>) => {
      const setMusic = action.payload
      state.currentMusic = setMusic
      const findIndex = state.musics.findIndex(
        (music) => music.id === setMusic.id
      )

      if (findIndex === -1) {
        const length = state.musics.length
        state.musics.push(setMusic)
        state.indexing.indexArray.push(length)
        state.indexing.currentIndex = length
      } else {
        if (state.controll.isShuffle) {
          const changeIndex = state.indexing.indexArray.findIndex(
            (value) => value === findIndex
          )
          state.indexing.currentIndex = changeIndex
        } else {
          state.indexing.currentIndex = findIndex
        }
      }
    },
    addMusic: (state, action: PayloadAction<IMusic | IMusic[]>) => {
      const add = action.payload
      const musicLength = state.musics.length
      if (Array.isArray(add)) {
        state.musics = [...state.musics, ...add]
        const addIndex = Array.from(
          { length: add.length },
          (_, i) => i + musicLength
        )
        state.indexing.indexArray = [...state.indexing.indexArray, ...addIndex]
      } else {
        state.musics.push(add)
        state.indexing.indexArray.push(musicLength)
      }
    },
    removeMusic: (state, action: PayloadAction<number>) => {
      const removeId = action.payload
      const findIndex = state.musics.findIndex((music) => music.id === removeId)

      if (findIndex !== -1) {
        const currentIndex = state.indexing.currentIndex

        state.musics = state.musics.filter((_, index) => index !== findIndex)
        state.indexing.indexArray = state.indexing.indexArray.filter(
          (value, index) => {
            if (value !== findIndex) {
              if (index <= currentIndex) {
                state.indexing.currentIndex -= 1
                if (index === currentIndex) {
                  state.currentMusic =
                    state.musics[state.indexing.indexArray[index - 1]]
                }
              }
            }
            return true
          }
        )

        if (state.indexing.currentIndex === state.musics.length - 1) {
          state.indexing.currentIndex -= 1
        }
      }
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      if (!state.musics.length) {
        return
      }
      const changeIndex = action.payload
      state.indexing.currentIndex = changeIndex
      state.currentMusic = state.musics[state.indexing.indexArray[changeIndex]]
    },
    nextMusic: (state) => {
      if (!state.musics.length) {
        return
      }
      const nextIndex = (state.indexing.currentIndex + 1) % state.musics.length
      state.indexing.currentIndex = nextIndex
      state.currentMusic = state.musics[state.indexing.indexArray[nextIndex]]
    },
    prevMusic: (state) => {
      if (!state.musics.length) {
        return
      }
      const calcIndex = state.indexing.currentIndex - 1
      const prevIndex = calcIndex < 0 ? state.musics.length - 1 : calcIndex
      state.indexing.currentIndex = prevIndex
      state.currentMusic = state.musics[state.indexing.indexArray[prevIndex]]
    },
    togglePlay: (state, action: PayloadAction<boolean | undefined>) => {
      if (!state.musics.length) {
        return
      }
      state.controll.isPlay =
        action.payload === undefined ? !state.controll.isPlay : action.payload
    },
    toggleRepeat: (state) => {
      switch (state.controll.repeat) {
        case undefined:
          state.controll.repeat = 'all'
          break
        case 'all':
          state.controll.repeat = 'one'
          break
        case 'one':
          state.controll.repeat = undefined
      }
    },
    toggleShuffle: (state) => {
      const { indexArray, currentIndex } = state.indexing
      const changedShuffle = !state.controll.isShuffle
      state.controll.isShuffle = changedShuffle
      if (changedShuffle) {
        const shuffledArray = shuffle(state.indexing.indexArray)
        state.indexing.indexArray = shuffledArray
        state.indexing.currentIndex = 0
        state.currentMusic = state.musics[shuffledArray[0]]
      } else {
        const { musics } = state
        const currentMusicIndex = musics.findIndex(
          (item) => item === musics[indexArray[currentIndex]]
        )
        state.indexing.currentIndex = currentMusicIndex
        state.indexing.indexArray = Array.from(
          { length: indexArray.length },
          (_, i) => i
        )
        state.currentMusic = state.musics[currentIndex]
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
  setCurrentMusic,
  addMusic,
  removeMusic,
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
