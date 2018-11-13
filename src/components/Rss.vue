<template>
<v-container grid-list-md>
    <h1 class='primary--text mb-2'><v-icon large class='primary--text'>rss_feed</v-icon> 관심작가 최신글</h1>
    <v-card>
      <v-container>
        <v-layout>
          <v-flex>
            <div style='position: relative;'>
              <v-text-field 
                flat
                autofocus
                browser-autocomplete
                dont-fill-mask-blanks
                clearable
                prefix="@"
                color="blue darken-3" 
                label="Username"
                v-model="username" 
                hint="최신글을 확인하고 싶은 사용자명을 등록하세요. 최신글 3개를 가져옵니다."
                persistent-hint
                :loading="lookupAccountsLoading"
                prepend-inner-icon="account_box"
                v-on:keyup.enter.space="addFeedUsers">
              </v-text-field >
              <div style='position: absolute;z-index: 2;top: 45px;min-width:400px'>
                <v-slide-y-transition>
                  <v-card v-show='lookupAccounts.length > 0'>
                    <v-list dense>
                      <div v-for="(u, index) in lookupAccounts" :key="index">
                        <v-divider :key="index" v-if="index > 0"></v-divider>
                        <v-list-tile avatar @click="selectedAutoUsername(u)">
                          <v-list-tile-avatar>
                            <img :src="`https://steemitimages.com/u/${u}/avatar/small`" :alt="u">
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title>{{u}}</v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </div>
                    </v-list>
                  </v-card>
                </v-slide-y-transition>
              </div>
            </div>
            <tamplate v-for="u in feedUsers" :key="u">
              <v-chip close @input="removeFeedUsers(u)">
                <v-avatar>
                  <img :src="`https://steemitimages.com/u/${u}/avatar/small`" :alt="u">
                </v-avatar>
                {{u}}
              </v-chip>
            </tamplate>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    
    <v-layout row>
      <v-flex>
        <!-- <v-subheader>최신글</v-subheader> -->
        <v-card v-show='feedBusy || feeds.length > 0'>
          <v-fade-transition>
            <v-progress-linear color='blue' :indeterminate="true" :active="feedBusy" v-show='feedBusy' class="ma-0"></v-progress-linear>
          </v-fade-transition>
          <v-list three-line v-show="feeds.length > 0">
            <tamplate v-for="(feed, index) in getFeedsByCreated" :key="feed.id">
              <v-divider :inset="false" :key="index" v-if="index > 0"></v-divider>
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="`https://steemitimages.com/u/${feed.author}/avatar/small`" :alt="feed.author">
                  <!-- <span class='hidden-sm-and-down username caption ellipsis-text font-weight-bold'>
                    <a :href="`https://steemit.com/@${feed.author}`" target="_blank">{{ feed.author }}</a>
                  </span> -->
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title><a class='font-weight-medium' :href="`https://steemit.com${feed.url}`" target="_blank">{{ feed.title }}</a></v-list-tile-title>
                  <!-- <v-list-tile-sub-title class='ellipsis-text-two hidden-sm-and-down'>{{feed.body}}</v-list-tile-sub-title>
                  <v-list-tile-sub-title class='ellipsis-text hidden-md-and-up'>{{feed.body}}</v-list-tile-sub-title>
                  <v-list-tile-sub-title class='hidden-md-and-up post-meta font-italic'>
                    Posted by <span class='font-weight-bold subheading'><a :href="`https://steemit.com/@${feed.author}`" target="_blank">{{ feed.author }}</a></span> on <span class='font-weight-bold'>{{ feed.created | dateFormat2 }}</span>
                  </v-list-tile-sub-title> -->
                  <v-list-tile-sub-title class='ellipsis-text'>{{feed.body}}</v-list-tile-sub-title>
                  <v-list-tile-sub-title class='post-meta font-italic'>
                    Posted by <span class='font-weight-bold subheading'><a :href="`https://steemit.com/@${feed.author}`" target="_blank">{{ feed.author }}</a></span> on <span class='font-weight-bold'>{{ feed.created | dateFormat2 }}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <!-- <v-list-tile-action class="hidden-sm-and-down">
                    <v-list-tile-action-text>{{ feed.created | dateFormat }}</v-list-tile-action-text>
                    <v-spacer></v-spacer>
                </v-list-tile-action> -->
              </v-list-tile>
            </tamplate>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
  </div>
</template>
<style scoped>
.v-avatar {
  position: relative;
  display: block!important;
}
.v-avatar .username {
  display: block;
  margin-left: -10px;
  width: 60px;
  text-align: center;
}
.post-meta {
  font-family: Lora,'Times New Roman',serif;
  /* font-size: 0.9em; */
  font-style: italic;
  /* margin-top: 0; */
  color: #868e96;
}
</style>
<script>
import steem from 'steem';

export default {
  name: 'Rss',
  data() {
    return {
      username: '',
      lookupAccounts: [],
      lookupAccountsLoading: false,
      feedUsers: [],
      feeds: [],
      feedBusy: true,
      // model: ['anpigon'],
    }
  },
  watch: {
    'username': function(username) {
      console.log(username);
      this.lookupAccounts = [];
      if(username && username.length > 0) {
        this.lookupAccountsLoading = true;
        steem.api.lookupAccountsAsync(username, 5).then(r => {
          console.log(r);
          this.lookupAccounts = r;
          this.lookupAccountsLoading = false;
        });
      }          
    }
  },
  computed: {
    getFeedsByCreated() {
      return this.feeds
      .filter((e) => {
        if(!this.feedUsers.includes(e.author)) return false
        return true;
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created))
    }
  },
  methods: {
    selectedAutoUsername(username) {
      console.log('selected username', username)
      // this.lookupAccounts = [];
      this.addFeedUsers(null, username);
    },
    // 구독 사용자 추가
    async addFeedUsers(e, username) {
      this.lookupAccounts = [];
      username = username || this.username
      // console.log('add username', username);
      if(!this.feedUsers.includes(username)) {
        this.feedUsers.push(username);
        this.feedBusy = true;
        const _feeds = await this.getDiscussionsByAuthor(username);
        this.feeds = [
          ...this.feeds,
          ..._feeds,
        ];
        this.feedBusy = false;
        // window.localStorage.setItem('feedUsers', this.feedUsers.join(','));
        this.saveFeedUsers();
      }
      this.username = '';
    },
    // 구독 사용자 삭제
    removeFeedUsers (item) {
      this.feedUsers.splice(this.feedUsers.indexOf(item), 1)
      this.feedUsers = [...this.feedUsers]
      this.saveFeedUsers();
      this.feeds = [
        ...this.feeds.filter((e) => this.feedUsers.includes(e.author))
      ]          
    },
    // 글 가져오기
    getDiscussionsByAuthor(username) {
      // console.log('getDiscussionsByAuthor');
      return steem.api.getDiscussionsByAuthorBeforeDateAsync(username, '', '1970-01-01T00:00:00', 3)
                            .map((e) => {
                              const body = e.body
                                .replace(/!?\[[^\]]*\]\([^\)]*\)/g, '')
                                .replace(/<[^>]*>[^<]*<[^>]*>/g, '')
                                .replace(/https?:\/\/[^\s]*/gi, '')
                                .replace(/[#|\*]/g, '')
                                .slice(0, 200);
                              return {
                                id: e.id,
                                title: e.title,
                                created: e.created,                                  
                                author: e.author,
                                permlink: e.permlink,
                                url: e.url,
                                body,
                                json_metadata: JSON.parse(e.json_metadata),
                              }
                            });
    },
    saveFeedUsers() {
      window.localStorage.setItem('feedUsers', this.feedUsers.join(','));
    }
  },
  created() {
    this.feedBusy = true;
    const feedUsers = window.localStorage.getItem('feedUsers');
    this.feedUsers = feedUsers ? feedUsers.split(',') : [];
  
    const _self = this;
    Promise.all([
      ..._self.feedUsers.map((u) => _self.getDiscussionsByAuthor(u))
    ]).then(function (values) {
      // console.log(values)
      for(const key in values) {
        _self.feeds = [
          ..._self.feeds,
          ...values[key]
        ]
      }
      _self.feedBusy = false;
    });  
  }      
}
</script>