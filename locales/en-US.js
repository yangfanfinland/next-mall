import zhMessages from './en.js'
import antdZh from 'antd/lib/locale-provider/en_US'

let appLocale = {
  messages: {
    ...zhMessages,
  },
  antd: antdZh,
  locale: 'zh-CN'
}

export default appLocale