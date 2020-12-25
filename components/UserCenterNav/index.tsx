import React from 'react'
import styles from './index.less'

const NavArr = [
  { value: '0', label: '个人资料' },
  { value: 'userInfo', label: '我的信息' },
  { value: 'address', label: '收货地址' },
  { value: '0', label: '我的交易' },
  { value: 'order', label: '订单管理' },
  { value: 'comment', label: '我的评价' },
]

const UserCenterNav = ({ router = 'index' }) => {
  return (
    <ul className={styles.navWrap}>
      <div className={styles.person}>
        <a href={`/center`}>个人中心</a>
      </div>
      {NavArr.map((o, index) => {
        return (
          <li
            className={`${router === o.value ? styles.active : ''}`}
            key={index}
          >
            {
              o.value != "0" ? (
                <a href={`/center/${o.value}`}>{o.label}</a>
              ): (
                <label>{o.label}</label>
              )
            }
          </li>
        )
      })}
    </ul>
  )
}

export default UserCenterNav
