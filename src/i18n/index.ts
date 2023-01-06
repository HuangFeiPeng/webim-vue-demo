/* 国际化配置 */
import { createI18n } from 'vue-i18n'
import { I18N_CACHE_NAME } from '@/constants'
import zh_CN from './lang/zh_CN'
import en_US from './lang/en_US'

//获取浏览器本地语言
const localLocale: string = window.navigator.language.split('-')[1]
//设置语言包
const messages = { zh_CN, en_US }
interface IMapMessages {
    [key: string]: string
}
const mapMessages: IMapMessages = {
    CN: 'zh_CN',
    US: 'en_US',
}
const i18n = createI18n({
    globalInjection: true, //全局生效$t
    messages,
    legacy: false,
    silentTranslationWarn: true,
    // 默认语言
    locale: localStorage.getItem(I18N_CACHE_NAME) || mapMessages[localLocale] || 'zh_CN',
})

export default i18n
