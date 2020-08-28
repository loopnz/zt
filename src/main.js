import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./app.vue";
import { wait } from "./utils/index";
Vue.use(ElementUI);

new Vue({
  el: "#app",
  render: h => h(App)
});

wait();
