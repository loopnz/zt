import './styles/index.scss'
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

Vue.component('point-term', {
  props: {
    item: Object
  },
  template: '#termTpl',
  data: function() {
    return {}
  },
  methods: {
    to: function() {
      this.$emit('to')
    }
  }
})

var app = new Vue({
  el: '#app',
  template: '#pageTpl',
  data: {
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
  methods: {
    complete: function(item) {
      console.log(item)
    },
    back: function() {}
  }
})
