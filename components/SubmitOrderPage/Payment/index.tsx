import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'

const Payment = () => {
  const [payMethod, setPayMethod] = useState(0)

  const choosePayMethod = (payMethod) => {
    setPayMethod(payMethod)
  }

  return (
    <>
      <div className={`${styles.logistics} contentWidth`}>
        <h3>选择支付方式</h3>
        <ul className={`${styles['pay-list']}`}>
          <li
            className={`${styles['wxpay']}`}
            onClick={() => choosePayMethod(1)}
          >
            <img src="/static/images/wxpay.png" />
            <span></span>
          </li>
          <li
            className={`${styles['alipay']}`}
            onClick={() => choosePayMethod(2)}
          >
            <img src="/static/images/alipay.png" />
            <span></span>
          </li>
        </ul>
      </div>
      <div style={{clear: "both"}}></div>
    </>
  )
}

export default Payment
