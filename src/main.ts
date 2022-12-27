import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Button, NavBar, Tabbar, TabbarItem, Cell, List, SwipeCell, Field, CellGroup } from 'vant'

import 'amfe-flexible'
//  引入组件样式
import 'vant/lib/index.css'

createApp(App)
    .use(router)
    .use(Button)
    .use(NavBar)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Cell)
    .use(List)
    .use(SwipeCell)
    .use(Field)
    .use(CellGroup)
    .mount('#app')
