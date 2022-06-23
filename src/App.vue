<template>
  <div class="content">
    <m-header></m-header>
    <tab></tab>
    <player></player>
    <router-view :style="viewStyle" v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </router-view>
    <router-view
      :style="viewStyle"
      name="user"
      v-slot="{ Component }"
    >
      <transition appear name="slide">
        <keep-alive>
          <component :is="Component"/>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  computed: {
    viewStyle() {
      const bottom = this.playList.length ? '60px' : 0
      return {
        bottom
      }
    },
    ...mapState([
      'playList'
    ])
  }
}
</script>
