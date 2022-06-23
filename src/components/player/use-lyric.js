import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric({ songReady, currentTime }) {
  const scrollRef = ref(null)
  const listRef = ref(null)

  const store = useStore()
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const pureLyric = ref('')
  const playingLyric = ref('')
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureLyric.value = 0

    const lyric = await getLyric(newSong)

    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })
    // 如果获取的歌词和当前的歌词不一样，则不执行下面的逻辑
    if (currentSong.value.lyric !== lyric) {
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      pureLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
      playingLyric.value = ''
    }
  })
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = scrollRef.value
    const listEle = listRef.value
    if (lineNum > 5) {
      const lineEle = listEle.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEle, 1000)
    } else {
      scrollComp.scroll.scrollToElement(0, 0, 1000)
    }
  }

  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }
  return {
    currentLyric,
    currentLineNum,
    playLyric,
    stopLyric,
    listRef,
    scrollRef,
    pureLyric,
    playingLyric
  }
}
