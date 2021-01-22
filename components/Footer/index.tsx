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
          <a href="">Instagram</a>
        </p>
      </div>
      <div className={styles['footer-bd']}>
        <p>
          <em>© 2021 miyixuan.com MiYiXuan e-commerce all rights reserved</em>
        </p>
      </div>
    </div>
  )
}

export default Footer
