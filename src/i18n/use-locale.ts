import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Locale } from 'vant'
// import { Locale } from 'vant'
// Vant英文语言包
import enUS from 'vant/es/locale/lang/en-US'
//Vant 中文语言包
import zhCN from 'vant/es/locale/lang/zh-CN'
const messages = { zh_CN: zhCN, en_US: enUS }
export function useLocale() {
    const { locale } = useI18n()
    //监听中英文切换改变Vant组件中英文包
    watch(
        locale,
        () => {
            if (locale.value === 'zh_CN') {
                Locale.use('zh_CN', messages.zh_CN)
            }
            if (locale.value === 'en_US') {
                Locale.use('en_US', messages.en_US)
            }
        },
        { immediate: true },
    )
}
