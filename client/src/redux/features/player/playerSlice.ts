import { RootState } from '@redux/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPlayerState, IProgressPayload } from './palyerSlice.interface'
import { IMusic } from '@appTypes/types.type.'

// 랜덤 셔플 알고리즘
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
    currentTime: 0,
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
    // 재생할 음악을 선택
    setCurrentMusic: (state, action: PayloadAction<IMusic>) => {
      const setMusic = action.payload // 변경할 음악
      state.currentMusic = setMusic
      let findIndex = -1
      state.musics = state.musics.map((music, index) => {
        if (music.id === setMusic.id) {
          findIndex = index
          return setMusic
        } else {
          return music
        }
      })

      if (findIndex === -1) {
        // 재생목록에 변경할 음악이 없다면 추가
        const length = state.musics.length
        state.musics.push(setMusic)
        state.indexing.indexArray.push(length)
        state.indexing.currentIndex = length
      } else {
        // 음악이 있는경우 인덱스 수정
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
    // 재생목록에 음악을 추가
    addMusic: (state, action: PayloadAction<IMusic | IMusic[]>) => {
      const addMusics = !Array.isArray(action.payload)
        ? [action.payload]
        : action.payload
      const musicLength = state.musics.length

      state.musics = [...state.musics, ...addMusics]
      const addIndexies = Array.from(
        { length: addMusics.length },
        (_, i) => i + musicLength
      )
      state.indexing.indexArray = [...state.indexing.indexArray, ...addIndexies]
    },
    // 재생목록에서 음악을 삭제
    removeMusic: (state, action: PayloadAction<number>) => {
      const findIndex = action.payload
      const changedMusics = state.musics.filter(
        (_, index) => index !== findIndex
      )

      if (findIndex !== -1) {
        const { currentIndex } = state.indexing
        let changedIndex = currentIndex

        const changedIndexArray: number[] = []
        state.indexing.indexArray.map((item, index) => {
          if (item === findIndex) {
            if (index <= currentIndex) {
              changedIndex -= 1
            }
            return
          }
          changedIndexArray.push(item >= findIndex ? item - 1 : item)
        })

        changedIndex = changedIndex < 0 ? 0 : changedIndex

        if (changedMusics.length) {
          state.currentMusic = changedMusics[changedIndexArray[changedIndex]]
        } else {
          state.currentMusic = null
          state.controll.isPlay = false
        }
        state.indexing = {
          indexArray: changedIndexArray,
          currentIndex: changedIndex,
        }
        state.musics = changedMusics
      }
    },
    // 재생목록 초기화
    clearMusics: (state) => {
      state.controll.isPlay = false
      state.currentMusic = null
      state.indexing = { currentIndex: 0, indexArray: [] }
      state.musics = []
      state.progress = {
        currentStringTime: '0:00',
        currentTime: 0,
        duration: 0,
        durationStringTime: '0:00',
        percent: 0,
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

      if (!state.currentMusic) {
        state.currentMusic = state.musics[state.indexing.indexArray[0]]
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
    // 랜덤재생이면 재생목록을 섞는다
    toggleShuffle: (state) => {
      const { indexArray, currentIndex } = state.indexing
      const changedIsShuffle = !state.controll.isShuffle
      state.controll.isShuffle = changedIsShuffle
      if (changedIsShuffle) {
        // 랜덤재생일 경우
        const shuffledArray = shuffle(state.indexing.indexArray)
        state.indexing.indexArray = shuffledArray
        state.indexing.currentIndex = 0
        state.currentMusic = state.musics[shuffledArray[0]]
      } else {
        // 랜덤재생 풀렸을 경우
        // 재생중인 음악은 유지하며 재생목록을 원상태로 복구
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
    // 재생중인 음악의 진행상태를 설정
    setProgress: (state, action: PayloadAction<IProgressPayload>) => {
      if (state.currentMusic) {
        state.progress = { ...state.progress, ...action.payload }
      } else {
        state.progress = {
          currentTime: 0,
          currentStringTime: '0:00',
          durationStringTime: '0:00',
          percent: 0,
          duration: 0,
        }
      }
    },
  },
  extraReducers: {},
})

// Action creators are generated for each case reducer function
export const {
  setCurrentMusic,
  addMusic,
  removeMusic,
  clearMusics,
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
