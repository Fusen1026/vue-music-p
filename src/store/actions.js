import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

export function selectPlay({ commit }, { list, index }) {
  commit('setPlayingState', true)
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}

export function randomPlay({ commit }, list) {
  commit('setPlayingState', true)
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setFullScreen', true)
  commit('setPlayList', shuffle(list))
  commit('setCurrentIndex', 0)
}

export function changeMode({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }

  const currentIndex = state.playList.findIndex((item) => {
    return item.id === currentId
  })

  commit('setCurrentIndex', currentIndex)
  commit('setPlayMode', mode)
}

export function clearSongList({ commit }) {
  console.log('=================>')
  commit('setCurrentIndex', 0)
  commit('setSequenceList', [])
  commit('setPlayList', [])
  commit('setPlayingState', false)
}

export function removeSong({ commit, state }, song) {
  const playList = state.playList.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playList, song)
  if (sequenceIndex < 0 || playIndex < 0) {
    return
  }

  playList.splice(playIndex, 1)
  sequenceList.splice(sequenceIndex, 1)

  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit('setCurrentIndex', currentIndex)
  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  if (!playList.length) {
    commit('setPlayingState', false)
  }
}

export function addSong({ commit, state }, song) {
  const playList = state.playList.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const playIndex = findIndex(playList, song)

  if (playIndex > -1) {
    currentIndex = playIndex
  } else {
    playList.push(song)
    currentIndex = playList.length - 1
  }

  const sequenceIndex = findIndex(sequenceList, song)
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }

  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
