import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/base.css'

//引入外部的组件
import { PullRefresh } from 'vant';

const app = createApp(App)

//注册外部组件
app.use(PullRefresh);

app.use(createPinia())
app.use(router)
router.push('/DueToday')
app.mount('#app')
