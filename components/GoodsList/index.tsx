import React from 'react'
import GoodsItem from '../GoodsItem'
import styles from './index.module.scss'

const GoodsList = ({ itemsList }) => {
  return (
    <div className={`${styles.listWrap} contentWidth fcb`}>
      {itemsList &&
        itemsList.map((item, index) => {
          return <GoodsItem key={index} item={item} />
        })}
    </div>
  )
}

export default GoodsList
