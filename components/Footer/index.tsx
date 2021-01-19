import React from 'react'
import styles from './index.less'

const Footer = () => {
  return (
    <div className={`contentWidth ${styles.footer}`}>
      <div className={styles['footer-hd']}>
        <p>
          <a href="">Facebook</a>
          <b>|</b>
          <a href="">Twitter</a>
          <b>|</b>
          <a href="">WhatsApp</a>
          <b>|</b>
          <a href="">Wechat</a>
          <b>|</b>
          <a href="">QQ</a>
        </p>
      </div>
      <div className={styles['footer-bd']}>
        <p>
          <em>© 2021 miyixuan.com 宜选电商 版权所有</em>
        </p>
      </div>
    </div>
  )
}

export default Footer
