<template>
<v-container grid-list-md>
  <h1 class='primary--text mb-2'><v-icon large class='primary--text'>history</v-icon>히스토리</h1>
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
              v-model="search.username" 
              hint="히스토리를 확인하고 싶은 사용자명을 입력하세요. 최대 100개를 가져옵니다."
              persistent-hint
              :loading="lookupAccountsLoading"
              prepend-inner-icon="account_box"
              v-on:keyup.enter="getHistory">
            </v-text-field >
            <!-- <div style='position: absolute;z-index: 2;top: 45px;min-width:400px'>
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
            </div> -->
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
  
  <v-layout>
    <v-flex>
      <v-card row v-show='busy || historyFilter.length > 0'>
        <v-fade-transition>
          <v-progress-linear :indeterminate="busy" :active="busy" v-show='busy'></v-progress-linear>
        </v-fade-transition>
        <v-list _two-line dense>
          <template v-for="(item, index) in historyFilter">
            <v-divider v-if="index > 0" :inset="false" :key="index"></v-divider>
            <v-list-tile :key="item.id" avatar>
              <v-list-tile-avatar>
                <template v-if="item.op_type === 'vote'">
                  <v-icon small :color="(username === item.op.voter)?'red':'blue'">thumb_up</v-icon>
                  <v-icon small color='red' v-if='username === item.op.voter'>arrow_forward</v-icon>
                  <v-icon small color='blue' v-else>arrow_back</v-icon>
                </template>
                <template v-else-if="item.op_type === 'comment'">
                  <v-icon small :color="(username === item.op.voter)?'red':'blue'">comment</v-icon>
                  <v-icon small color='red' v-if='username === item.op.author'>arrow_forward</v-icon>
                  <v-icon small color='blue' v-else>arrow_back</v-icon>
                </template>
                <template v-else-if="item.op_type === 'transfer'">
                  <v-icon small :color="(username === item.op.from)?'red':'blue'">account_balance_wallet</v-icon>
                  <v-icon small color='red' v-if='username === item.op.from'>arrow_forward</v-icon>
                  <v-icon small color='blue' v-else>arrow_back</v-icon>
                </template>
                <template v-else-if="item.op_type === 'curation_reward'">
                  <v-icon small color="blue">star</v-icon>
                  <v-icon small color='blue'>arrow_back</v-icon>
                </template>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <!-- <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title> -->
                <template v-if="item.op_type === 'vote'">
                  <v-list-tile-title>
                    <a :href="'https://steemit.com/@' + item.op.voter" target="_blank">@{{item.op.voter}}</a>({{item.op.weight/100}}%)
                    upvote
                    <a :href="'https://steemit.com/@' + item.op.author + '/' + item.op.permlink" target="_blank">@{{item.op.author}}/{{item.op.permlink}}</a>
                  </v-list-tile-title>
                </template>
                <template v-else-if="item.op_type === 'comment'">
                  <v-list-tile-title>
                    <a :href="'https://steemit.com/@' + item.op.author" target="_blank">@{{item.op.author}}</a> 
                    replied to 
                    <span  class='ellipsis-single-text'>
                      <a :href="'https://steemit.com/@' + item.op.author + '/' + item.op.permlink" target='_blank'>@{{item.op.parent_author}}/{{item.op.parent_permlink}}</a> 
                    </span>
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{item.op.body}}
                  </v-list-tile-sub-title>
                </template>
                <template v-else-if="item.op_type === 'transfer'">
                  <v-list-tile-title>
                  	<a :href="'https://steemit.com/@' + item.op.from" target="_blank">@{{item.op.from}}</a> 
                    send {{item.op.amount}} to 
                    <a :href="'https://steemit.com/@' + item.op.to" target="_blank">@{{item.op.to}}</a>
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{item.op.memo}}
                  </v-list-tile-sub-title>
                </template>
                <template v-else-if="item.op_type === 'curation_reward'">
                  <v-list-tile-title>
                    <!-- <a :href="'https://steemit.com/@' + item.op.curator" target="_blank">@{{item.op.curator}}</a>  -->
                    curation reward: : {{item.op.reward}}
                    for 
                    <a :href="'https://steemit.com/@' + item.op.comment_author + '/' + item.op.comment_permlink" target='_blank'>@{{item.op.comment_author}}/{{item.op.comment_permlink}}</a> 
                  </v-list-tile-title>
                </template>
                <template v-else>
                  {{JSON.stringify(item.op)}}
                </template>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{item.timestamp | dateFormat}}</v-list-tile-action-text>
                <v-spacer></v-spacer>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>      
</template>
<style scoped>
.comment_body {
  /* width: 95%; */
  border: 1px solid #ddd;
  background: #f5f5f5;
  padding: 8px;
  margin: 2px;
}
</style>

<script>
import steem from 'steem';

export default {
  name: 'History',
  data() {
    return {
      search: {
        username: '',
      },
      username: '',
      items: [],
      historyId: -1,
      busy: false,
      lookupAccounts: [],
      lookupAccountsLoading: false,
      author: '',
    }
  },
  // watch: {
  //   'username': function(username) {
  //     console.log(username);
  //     this.lookupAccounts = [];
  //     if(username && username.length > 0) {
  //       this.lookupAccountsLoading = true;
  //       steem.api.lookupAccountsAsync(username, 5).then(r => {
  //         console.log(r);
  //         this.lookupAccounts = r;
  //         this.lookupAccountsLoading = false;
  //       });
  //     }          
  //   }
  // },
  computed: {
    historyFilter() {
      return this.items.filter((e) => {
        return ['vote', 'comment', 'transfer', 'curation_reward'].includes(e.op_type)
      });
    },
    // username() {
    //   return this.search.username.trim();
    // }
  },
  methods: {
    // selectedAutoUsername(username) {
    //   console.log('selected username', username)
    //   this.lookupAccounts = [];
    //   this.username = username;
    //   getHistory ();
    // },
    async getHistory () {
      const username = this.search.username.trim();
      if( username ) {
        this.busy = true;
        this.items = [];
        const his = await steem.api.getAccountHistoryAsync(username, -1, 100);
        this.username = username;
        console.log(his);
        this.items = his.reverse().map(([id, e]) => {
          // console.log(e);
          this.historyId = id;
          const [op_type, op] = e.op;
          return {
            ...e,
            id,
            op_type,
            op,
          };
        });
        this.busy = false;
      }
    }
  },
  created() {
    // this.getHistory();
  }
};
</script>