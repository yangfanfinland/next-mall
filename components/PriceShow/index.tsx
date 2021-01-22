import React from 'react'
import styles from './index.less'

const PriceShow = () => {
  return (
    <div className={`fcb`}>
      <p className={`${styles.currentPrice}`}>€375.00</p>
      <p className={`${styles.marketPrice}`}>Market price €918.00</p>
    </div>
  )
}

export default PriceShow