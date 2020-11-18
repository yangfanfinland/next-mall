import zhMessages from './zh.js'
import antdZh from 'antd/lib/locale-provider/zh_CN'

let appLocale = {
  messages: {
    ...zhMessages,
  },
  antd: antdZh,
  locale: 'zh-CN'
}

export default appLocale