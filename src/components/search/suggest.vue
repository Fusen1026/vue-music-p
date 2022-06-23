<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
        @click="selectedSinger(singer)"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectedSong(song)"
      >
        <div class="icon">
          <div class="icon-music"></div>
        </div>
        <div class="name">
          <p class="text">
            {{ song.singer }}-{{ song.name }}
          </p>
        </div>
      </li>
      <div
        class="suggest-item"
        v-loading:[loadingText]="isPullUpLoading"
      ></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, nextTick } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from './use-pull-up-load'

export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['selected-singer', 'selected-song'],
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const page = ref(1)
    const hasMore = ref(true)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')
    const manualLoading = ref(false)

    // computed
    const isPullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })
    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })

    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })

    // 阻止上拉加载事件
    const preventPullLoad = computed(() => {
      return loading.value || isPullUpLoad.value
    })

    // hooks
    const { isPullUpLoad, rootRef, scroll } = usePullUpLoad(searchMore, preventPullLoad)

    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })

    async function searchFirst() {
      if (!props.query) {
        return
      }
      singer.value = null
      songs.value = []
      page.value = 1
      hasMore.value = true

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await makeScrollable()
    }

    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      await nextTick()
      await makeScrollable()
    }

    async function makeScrollable() {
      console.log('scroll.value.maxScrollY', scroll.value.maxScrollY)
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }

    function selectedSinger(singer) {
      emit('selected-singer', singer)
    }

    function selectedSong(song) {
      emit('selected-song', song)
    }

    return {
      singer,
      songs,
      page,
      hasMore,
      loadingText,
      loading,
      noResult,
      noResultText,
      rootRef,
      isPullUpLoading,
      selectedSong,
      selectedSinger
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
