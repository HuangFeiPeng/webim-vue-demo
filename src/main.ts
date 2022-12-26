import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Button, Field, CellGroup } from 'vant'

import 'amfe-flexible'
//  引入组件样式
import 'vant/lib/index.css'

createApp(App).use(router).use(Button).use(Field).use(CellGroup).mount('#app')
