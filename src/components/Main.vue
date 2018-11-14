<template>
<div>
  <v-tabs
        slot="extension"
        v-model="tabs"
        fixed-tabs
        centered
        color="transparent"
        _icons-and-text
      >
        <v-tabs-slider></v-tabs-slider>
        <v-tab href="#tabs-1" class="primary--text">
          <!-- RSS -->
          <v-icon>rss_feed</v-icon>
        </v-tab>
        <v-tab href="#tabs-2" class="primary--text">
          <!-- history -->
          <v-icon>history</v-icon>
        </v-tab>
        <!-- <v-tab href="#tabs-3" class="primary--text">
          <v-icon>account_box</v-icon>
        </v-tab> -->
      </v-tabs>
    <v-tabs-items v-model="tabs" class="white elevation-1">
      <v-tab-item id="tabs-1">
        <Rss />
      </v-tab-item>
      <v-tab-item id="tabs-2">
        <History/>
      </v-tab-item>
      <!-- <v-tab-item id="tabs-3">
        <v-card>
          <v-card-text>tabs-3</v-card-text>
        </v-card>
      </v-tab-item> -->
    </v-tabs-items>
  </div>
</template>
<script>
export default {
  name: 'Main',
  components: {
    Rss: () => import('./Rss'),
    History: () => import('./History'),
  },
  data() {
    return {
     tabs: null,
    }
  },   
}
</script>