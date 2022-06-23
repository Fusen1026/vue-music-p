import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    props: {
      data: Object
    },
    components: {
      MusicList
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData() {
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cache = storage.session.get(key)
          if (cache && (cache.mid || cache.id + '') === this.$route.params.id) {
            ret = cache
          }
        }
        return ret
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      }
    },
    async created() {
      const computedData = this.computedData
      if (!computedData) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      const result = await fetch(computedData)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
}
