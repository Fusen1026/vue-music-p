import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useSlider(wrapRef) {
  const slide = ref(null)
  const currentPageIndex = ref(0)

  onMounted(() => {
    const sliderVal = slide.value = new BScroll(wrapRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    })

    sliderVal.on('slideWillChange', (page) => {
      currentPageIndex.value = page.pageX
    })
  })

  onUnmounted(() => {
    slide.value.destroy()
  })

  onActivated(() => {
    slide.value.enable()
    slide.value.refresh()
  })

  onDeactivated(() => {
    slide.value.disable()
  })

  return {
    slide,
    currentPageIndex
  }
}
