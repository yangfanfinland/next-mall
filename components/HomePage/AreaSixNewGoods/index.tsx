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
                    src={rootCat.catImage}
                    alt={rootCat.rootCatName}
                    style={{
                      width: '210px',
                      height: '210px',
                      marginLeft: 'calc((100% - 210px) / 2)',
                    }}
                  />
                </a>
              </li>
              <li className={styles.item}>
                <a
                  href={'/item?itemId=' + rootCat.simpleItemList[0].itemId}
                  target={'_blank'}
                  className={styles.topA}
                  style={{ position: 'relative' }}
                >
                  <img src={rootCat.simpleItemList[0].itemUrl} alt="" />
                  <div
                    className="goodsDesc"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      bottom: '0',
                      backgroundColor: 'snow',
                      opacity: '0.7',
                    }}
                  >
                    <p className="goodsName">
                      {rootCat.simpleItemList[0].itemName}
                    </p>
                    <p className="priceWrap">
                      {rootCat.simpleItemList[0].nowPrice && (
                        <span
                          className="nowPrice"
                          style={{ margin: '0 10px', color: '#f33a3f' }}
                        >
                          €519
                        </span>
                      )}
                      {rootCat.simpleItemList[0].marketPrice && (
                        <span
                          className="marketPrice"
                          style={{
                            textDecoration: 'line-through',
                            color: '#999999',
                          }}
                        >
                          €619
                        </span>
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
                  style={{ position: 'relative' }}
                >
                  <img src={rootCat.simpleItemList[3].itemUrl} alt="" />
                  <div
                    className="goodsDesc"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      bottom: '0',
                      backgroundColor: 'snow',
                      opacity: '0.7',
                    }}
                  >
                    <p className="goodsName">
                      {rootCat.simpleItemList[0].itemName}
                    </p>
                    <p className="priceWrap">
                      {rootCat.simpleItemList[0].nowPrice && (
                        <span
                          className="nowPrice"
                          style={{ margin: '0 10px', color: '#f33a3f' }}
                        >
                          €519
                        </span>
                      )}
                      {rootCat.simpleItemList[0].marketPrice && (
                        <span
                          className="marketPrice"
                          style={{
                            textDecoration: 'line-through',
                            color: '#999999',
                          }}
                        >
                          €619
                        </span>
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
