import React from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons/lib/icons'
import styles from './index.less'

const GoodsItem = ({ item, myClassName }: { item; myClassName?: string }) => {
  return (
    <a
      href={item && '/item?itemId=' + item.itemId}
      target={'_blank'}
      className={`${styles.goodsItem} ${myClassName ? myClassName : ''}`}
    >
      <img src={item.imgUrl} className={styles.goodsImg} alt="" />
      <div className={styles.goodsDesc}>
        <p className={styles.goodsName}>{item.itemName}</p>
        <p className={styles.priceWrap}>
          <span className={styles.nowPrice}>¥{item.price / 100}</span>
          {/* <span className={styles.marketPrice}>市场价 ¥630</span> */}
        </p>
        {/* <p className={styles.storeName}>春雨（papa recipe）海外旗舰店</p> */}
        <div className={`${styles.totalSaleWrap} fcb`}>
          <p className={`${styles.saleTotal} fl fcb`}>
            Sales：<span className={styles.num}>{item.sellCounts}</span>
          </p>
          <span className={`${styles.car} fr`}>
            <ShoppingCartOutlined style={{ fontSize: 24, color: '#F33A3F' }} />
          </span>
        </div>
      </div>
    </a>
  )
}

export default GoodsItem
