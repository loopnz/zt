import './styles/rule.scss'
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

var app = new Vue({
  el: '#app',
  template: '#pointRuleTpl',
  data: {
    terms: [
      {
        title: '每日签到',
        status: '已完成',
        desc: '1分/每日首次登录',
        amountPoint: 6,
        currentPoint: 0,
        percent: 0
      },
      {
        title: '阅读文章',
        desc: '阅读文章'
      },
      {
        title: '观看视频',
        desc: '观看视频'
      }
    ]
  },
  methods: {
    complete: function(item) {
      console.log(item)
    },
    back: function() {}
  }
})
