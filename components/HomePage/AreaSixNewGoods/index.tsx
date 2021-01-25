import React from 'react'
import styles from './index.less'
import GoodsItem from '../GoodsItem'

const AreaSixNewGoods = ({ likeItemList }) => {
  return (
    <>
      {likeItemList.map((rootCat, i) => {
        return (
          <div className={styles.specialItem} key={i}>
            <h1 className={styles.title}>{rootCat.rootCatName}</h1>
            <ul className={`${styles.specialList} fcb`}>
              <li
                className={styles.item}
                style={{ backgroundColor: rootCat.bgColor }}
              >
                <a href="/goodsDetail" target={'_blank'}>
                  <img
                    className={styles['cat-image']}
                    src={rootCat.catImage}
                    alt={rootCat.rootCatName}
                  />
                </a>
              </li>
              <li className={styles.item}>
                <a
                  href={'/item?itemId=' + rootCat.simpleItemList[0].itemId}
                  target={'_blank'}
                  className={styles.topA}
                >
                  <img src={rootCat.simpleItemList[0].itemUrl} alt="" />
                  <div className={styles.goodsDesc}>
                    <p className="goodsName">
                      {rootCat.simpleItemList[0].itemName}
                    </p>
                    <p className="priceWrap">
                      {rootCat.simpleItemList[0].nowPrice && (
                        <span className={styles.nowPrice}>€519</span>
                      )}
                      {rootCat.simpleItemList[0].marketPrice && (
                        <span className={styles.marketPrice}>€619</span>
                      )}
                    </p>
                  </div>
                </a>
                <div className={`fcb`}>
                  <GoodsItem item={rootCat.simpleItemList[1]} />
                  <GoodsItem item={rootCat.simpleItemList[2]} />
                </div>
              </li>
              <li className={styles.item}>
                <a
                  href={'/item?itemId=' + rootCat.simpleItemList[3].itemId}
                  target={'_blank'}
                  className={styles.topA}
                >
                  <img src={rootCat.simpleItemList[3].itemUrl} alt="" />
                  <div className={styles.goodsDesc}>
                    <p className="goodsName">
                      {rootCat.simpleItemList[0].itemName}
                    </p>
                    <p className="priceWrap">
                      {rootCat.simpleItemList[0].nowPrice && (
                        <span className={styles.nowPrice}>€519</span>
                      )}
                      {rootCat.simpleItemList[0].marketPrice && (
                        <span className={styles.marketPrice}>€619</span>
                      )}
                    </p>
                  </div>
                </a>
                <div className={`fcb`}>
                  <GoodsItem item={rootCat.simpleItemList[4]} />
                  <GoodsItem item={rootCat.simpleItemList[5]} />
                </div>
              </li>
            </ul>
          </div>
        )
      })}
    </>
  )
}

export default AreaSixNewGoods
