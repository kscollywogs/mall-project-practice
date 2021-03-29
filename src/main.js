import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store";
import VueLazyload from "vue-lazyload";

import toast from 'components/common/toast'

Vue.config.productionTip = false

// 安装toast插件
Vue.use(toast)

Vue.use(VueLazyload, {
  // 添加占位图
  loading: require ('./assets/img/common/placeholder.png')
})

// 事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
