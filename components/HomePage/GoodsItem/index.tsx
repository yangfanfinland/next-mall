import React from 'react'
import styles from './index.less'

const GoodsItem = ({
  item,
  rightGap = 8,
  myClassName,
  myStyle,
}: {
  item
  rightGap?: number
  myClassName?: string
  myStyle?: any
}) => {
  return (
    <a
      href={item && '/item?itemId=' + item.itemId}
      target={'_blank'}
      className={`${styles.goodsItem} ${myClassName ? myClassName : ''}`}
    >
      <img
        src={(item && item.itemUrl) || '/static/images/test/goods.jpg'}
        className={styles.goodsImg}
        alt=""
      />
      <div className={styles.goodsDesc}>
        {item && item.itemName && (
          <p className={styles.goodsName}>{item && item.itemName}</p>
        )}

        <p className={styles.priceWrap}>
          {item && item.nowPrice && (
            <span className={styles.nowPrice}>€519</span>
          )}
          {item && item.marketPrice && (
            <span className={styles.marketPrice}>€519</span>
          )}
        </p>
      </div>
    </a>
  )
}

export default GoodsItem
