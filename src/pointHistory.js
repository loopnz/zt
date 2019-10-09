import './styles/pointHistory.scss'
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import BScroll from 'better-scroll'
Vue.use(MintUI)

var app = new Vue({
  el: '#app',
  template: '#pointHistoryTpl',
  data: {
    today: '',
    timeList: [],
    terms: [
      {
        title: '登录',
        status: '已完成',
        desc: '1分/每日首次登录',
        amountPoint: 6,
        currentPoint: 0,
        percent: 0
      }
    ]
  },
  created: function() {
    var days = this.getMonthDays()
    var today = new Date().getDate()
    var month = new Date().getMonth() + 1
    this.today =
      new Date().getFullYear() +
      '.' +
      this.addZero(month) +
      '.' +
      this.addZero(today)
    for (var i = 0; i < 18; i++) {
      var obj = {}
      if (i === 0) {
        obj.time = '今天'
      } else if (i < 15) {
        var prevousDay = new Date(
          new Date().getTime() - 24 * 60 * 60 * 1000 * i
        )
        obj.time =
          this.addZero(prevousDay.getMonth() + 1) +
          '.' +
          this.addZero(prevousDay.getDate())
      } else {
        obj.time = ''
      }

      this.timeList.unshift(obj)
    }
  },
  mounted: function() {
    var child = this.$refs.pointHistoryUl.children
    var scroll = new BScroll(this.$refs.pointHistoryScroll, {
      scrollX: true,
      scrollY: false
    })
    scroll.scrollToElement(child[17], 500)
  },
  methods: {
    addZero: function(str) {
      return ('0' + str).slice(-2)
    },
    getMonthDays: function() {
      var today = new Date()
      var year = today.getFullYear()
      var month = today.getMonth() + 1
      var nextMonth = year + '/' + (month + 1) + '/' + '01'
      var time = new Date(nextMonth).getTime() - 12 * 60 * 60 * 1000
      var date = new Date(time).getDate()
      return date
    },
    complete: function(item) {
      console.log(item)
    },
    back: function() {}
  }
})
