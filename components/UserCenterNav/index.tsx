import React from 'react'
import styles from './index.module.scss'

const NavArr = [
  { value: 'myOrder', label: '个人资料' },
  { value: 'userInfo', label: '我的信息' },
  { value: 'addressList', label: '收货地址' },
  { value: '4', label: '我的交易' },
  { value: '5', label: '订单管理' },
  { value: '6', label: '我的评价' },
]

const UserCenterNav = ({ router = 'myOrder' }) => {
  return (
    <ul className={styles.navWrap}>
      {NavArr.map((o) => {
        return (
          <li
            className={`${router === o.value ? styles.active : ''}`}
            key={o.value}
          >
            <a href={`/center/${o.value}`}>{o.label}</a>
          </li>
        )
      })}
    </ul>
  )
}

export default UserCenterNav
