//处理组件是否需要缓存
import { defineStore } from 'pinia'
export const useRouterKeepAliveStore = defineStore('routerKeepAlive', {
    state: () => ({
        keepAliveComponentList: [],
    }),
    actions: {
        setKeepAlive(keepAliveComp: string) {
            console.log('>>>>>', keepAliveComp)
            // this.$state.
        },
    },
})
