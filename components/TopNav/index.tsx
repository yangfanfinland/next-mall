import React from 'react'
import Category from '../Category'
import styles from './index.less'

const TopNav = ({ hoverShow = false, categoryList }) => {
  return (
    <div className={`bw`}>
      <div className={`${styles.topTab} bw contentWidth fcb`}>
        <Category hoverShow={hoverShow} categoryList={categoryList} />
        <ul className={`${styles.funcTab} fcb`}>
          <li>
            <a href="#">Main</a>
          </li>
          <li>
            <a href="#">Express</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default TopNav
