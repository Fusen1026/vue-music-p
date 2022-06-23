import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const cdRef = ref(null)
  const imageRef = ref(null)

  const store = useStore()
  const playing = computed(() => store.state.playing)
  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value, imageRef.value)
    }
  })

  function syncTransform(wrapperRef, innerRef) {
    const wrapperTransform = getComputedStyle(wrapperRef).transform
    const innerTransform = getComputedStyle(innerRef).transform
    wrapperRef.style.transform = wrapperTransform === 'none' ? innerTransform
    : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    imageRef
  }
}
