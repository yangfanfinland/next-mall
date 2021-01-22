import React from 'react'
import GoodsItem from '../GoodsItem'
import styles from './index.less'

const AreaLike = ({ likeItemList }) => {
  return (
    <div className={`fcb mb40`}>
      <h1 className={styles.title}>猜你喜欢</h1>
      <ul className={`fcb`}>
        {likeItemList &&
          likeItemList.map((o, i) => {
            return <GoodsItem key={i} myClassName={styles.goodsItem} item={o} />
          })}
      </ul>
    </div>
  )
}

export default AreaLike
