import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import './config/bootstrap'
import './config/msgs'
import store from './config/store'
import router from './config/router'

import App from './App'

Vue.config.productionTip = false

// TEMPORÁRIO
require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkpvbmF0aGFuIE1hY2hhZG8iLCJlbWFpbCI6ImpvbmF0aGFuc21hY2hhZG9AZ21haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTU1NjkzNDMwOCwiZXhwIjoxNTU3MTkzNTA4fQ.ZcDc86Zd1WuhZgyEC9TPj-pAlPa9ZCUqCg8DpkiTheA'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')