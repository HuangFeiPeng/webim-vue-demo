import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Button, NavBar, Tabbar, TabbarItem, Cell, List, SwipeCell, Field, CellGroup } from 'vant'
/* i18n */
import i18n from './i18n'
import 'amfe-flexible'
//  引入组件样式
import 'vant/lib/index.css'

const app = createApp(App)
/* router */
app.use(router)
/* vant */
app.use(Button).use(NavBar).use(Tabbar).use(TabbarItem).use(Cell).use(List).use(SwipeCell).use(Field).use(CellGroup)
/* i18n */
app.use(i18n)
app.mount('#app')
