import './styles/index.scss'
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueMeta from 'vue-meta'
Vue.use(MintUI)
Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
})
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
  metaInfo: {
    title: '学习积分首页'
  },
  data: {
    popupVisible:false,
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
    back: function() {},
    show:function(){
        this.popupVisible = true;
    },
    exchange:function(){
      this.popupVisible = true;
    }
    
  }
})
