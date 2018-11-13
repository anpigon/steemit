<template>
  <v-app>
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      fixed
      app
    >
      <v-list dense>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>rss_feed</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>최신글 확인</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="https://anpigon.github.io/steemit-calculator/" target="_blank">
          <v-list-tile-action>
            <v-icon>money</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>업보팅 계산기 <v-icon small>launch</v-icon></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Contact</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile> -->
      </v-list>
    </v-navigation-drawer>
    <v-toolbar  
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="blue darken-3"
      dark 
      fixed 
      app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title _style="width: 300px" class="headline _text-uppercase ml-0 pl-3">
        <span _class="hidden-sm-and-down">Steemit Apps</span>
        <!-- <span class="font-weight-light">MATERIAL DESIGN</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn> -->
    </v-toolbar>

    <v-content>
      <Main/>
    </v-content>
  </v-app>
</template>
<style>
.hangul_serif {
  font-family: 'Noto Serif KR', 'Malgun Gothic', 'NanumGothic', 'Dotum', sans-serif;
  -webkit-font-smoothing: antialiased;
}
.v-toolbar__title {
  font-family: 'Roboto', sans-serif;
}
.ellipsis-text, .ellipsis-text-two , .ellipsis-text-three {
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1!important;
  /* display: -webkit-box!important; */
  -webkit-box-orient: vertical;
  /* white-space: nowrap!important; */
}
.ellipsis-text-two {
  -webkit-line-clamp: 2!important;
  /* white-space: normal!important; */
}
.v-list__tile a {
  text-decoration: none;
}
</style>
<script>
import Main from './components/Main'
// import WebFontLoader from 'webfontloader'

// https://vuetifyjs.com/en/components/tabs#example-fixed-tabs
export default {
  name: 'App',
  components: {
    Main
  },
  data () {
    return {
      drawer: this.$vuetify.breakpoint.lgAndUp,
    }
  },
  // mounted () {
  //   WebFontLoader.load({
  //     google: {
  //       families: [
  //         'Roboto:100,300,400,500,700,900', 
  //         // 'Noto+Serif+KR:100,300,400,500,700,900'
  //       ]
  //     },
  //     active: this.setFontLoaded
  //   })
  // },
  // methods: {
  //   setFontLoaded () {
  //     this.$emit('font-loaded')
  //   }
  // }
}
</script>
