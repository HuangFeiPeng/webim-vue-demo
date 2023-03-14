import { createApp } from 'vue'
import App from './App.vue'
/* stores */
import { createPinia } from 'pinia'
/* router */
import router from './router'

/* vant components */
import {
    Icon,
    Button,
    Popover,
    NavBar,
    Search,
    Tabbar,
    TabbarItem,
    Cell,
    List,
    SwipeCell,
    Field,
    CellGroup,
    Badge,
    IndexBar,
    IndexAnchor,
    Divider,
    PullRefresh,
    Toast,
    Popup,
    Checkbox,
    Empty,
} from 'vant'
import { Image as VanImage } from 'vant'
/* i18n */
import i18n from './i18n'
import 'amfe-flexible'
//  引入组件样式
import 'vant/lib/index.css'

const app = createApp(App)
const pinia = createPinia()
/* pinia */
app.use(pinia)
/* router */
app.use(router)
/* vant */
app.use(Icon)
    .use(Popover)
    .use(Button)
    .use(NavBar)
    .use(Search)
    .use(Tabbar)
    .use(TabbarItem)
    .use(Cell)
    .use(List)
    .use(SwipeCell)
    .use(Field)
    .use(CellGroup)
    .use(Badge)
    .use(VanImage)
    .use(IndexBar)
    .use(IndexAnchor)
    .use(Divider)
    .use(PullRefresh)
    .use(Toast)
    .use(Popup)
    .use(Checkbox)
    .use(Empty)
/* i18n */
app.use(i18n)
app.mount('#app')
