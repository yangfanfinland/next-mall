import React from 'react'
import styles from './index.less'

const NavArr = [
  { value: '0', label: 'Personal info' },
  { value: 'userInfo', label: 'My info' },
  { value: 'address', label: 'Receive address' },
  { value: '0', label: 'My trade' },
  { value: 'order', label: 'Order management' },
  { value: 'comment', label: 'My comment' },
]

const UserCenterNav = ({ router = 'index' }) => {
  return (
    <ul className={styles.navWrap}>
      <div className={styles.person}>
        <a href={`/center`}>Personal center</a>
      </div>
      {NavArr.map((o, index) => {
        return (
          <li
            className={`${router === o.value ? styles.active : ''}`}
            key={index}
          >
            {o.value != '0' ? (
              <a href={`/center/${o.value}`}>{o.label}</a>
            ) : (
              <label>{o.label}</label>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default UserCenterNav
