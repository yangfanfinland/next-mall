import React, { useState } from 'react'
import { message } from 'antd'
import InputBuyNumber from '../../InputBuyNumber'
import { ShopcartItem } from '../../../util/app'
import styles from './index.less'

const ItemSpecification = ({ item, specification, addToCartCallback }) => {
  const [selectedSku, setSelectedSku] = useState(specification[0])
  const [buyCounts, setBuyCounts] = useState(0)

  const handleClick = (specId) => {
    const spec = specification.find((x) => x.id === specId)
    setSelectedSku(spec)
  }

  const addToCart = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    // 创建购物车对象
    if (typeof buyCounts != 'number') {
      message.warning('Buy counts cannot negaitive!')
      setBuyCounts(1)
      return
    }

    // 构建购物车商品对象
    const shopcartItem = new ShopcartItem(
      item.id,
      '',
      item.itemName,
      selectedSku.id,
      selectedSku.name,
      buyCounts,
      selectedSku.priceDiscount,
      selectedSku.priceNormal
    )

    addToCartCallback(shopcartItem)
  }

  return (
    <div className={`${styles.goodsInfoWrap} fl`}>
      <h1 className={styles.goodsName}>{item.itemName}</h1>
      {/* <p className={styles.goodsDesc}>
                保湿界的黑马选手——芙丽芳丝保湿面霜，价格美丽，效果杠把子！无添加、低刺激芙丽芳丝的头牌武器，涂抹在脸上凉凉的润润的，能够感受到肌肤在用力喝水，被水营养撑起饱满感~肤水嘟嘟的，就像打了水光针！
            </p> */}
      <div className={styles.goodsPriceWrap}>
        <p>
          <span className={styles.title}>Shop offers</span>
          <span className={styles.discount}>
            {selectedSku.discounts < 1 ? (
              <>{100 - selectedSku.discounts * 100}% off</>
            ) : (
              <>No offers</>
            )}
          </span>
        </p>
        <p>
          <span className={styles.title}>Sale price</span>
          <span className={styles.nowPrice}>€{selectedSku.priceDiscount}</span>
          <span className={styles.marketPrice}>
            Market price €{selectedSku.priceNormal}
          </span>
        </p>
        {/* <p>
                    <span className={styles.title}>税费</span>
                    <span>预估....</span>
                </p>
                <p>
                    <span className={styles.title}>运费</span>
                    <span>韩国至成都 10元</span>
                </p> */}
        <p>
          <span className={styles.title}>Sales</span>
          <span>{item.sellCounts}</span>
        </p>
      </div>
      <div className={`${styles.skuWrap} fcb`}>
        <span className={`${styles.title} fl`}>Taste</span>
        <ul className={`${styles.skuList} fl`}>
          {specification.map((spec) => (
            <li
              key={spec.id}
              className={
                selectedSku.id == spec.id
                  ? `${styles['sku-line']} ${styles.selected}`
                  : `${styles['sku-line']}`
              }
              onClick={() => handleClick(spec.id)}
            >
              <a
                href="#"
                className={styles.skuName}
                onClick={(e) => e.preventDefault()}
              >
                {spec.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* <div className={`${styles.colorWrap} fcb`}>
                <span className={`${styles.title} fl`}>颜色</span>
                <div className={`fl`}>
                    <Radio.Group size={'small'} buttonStyle="solid">
                        <Radio.Button value={1}>红色</Radio.Button>
                        <Radio.Button value={2}>蓝色</Radio.Button>
                    </Radio.Group>
                </div>
            </div> */}
      <div className={`${styles.buyNum} fcb`}>
        <span className={`${styles.title} fl`}>Stock</span>
        <div className={`fl`}>
          <InputBuyNumber
            defaultValue={1}
            stock={selectedSku.stock}
            onChange={(value) => setBuyCounts(value)}
          />
        </div>
      </div>
      <div className={styles.buyBtnWrap}>
        {/* <a className={`${styles.buyBtn} ${styles.buyNow}`}>立即购买</a> */}
        <a className={`${styles.buyBtn} ${styles.addCar}`} onClick={addToCart}>
          Add to shopping cart
        </a>
      </div>
    </div>
  )
}

export default ItemSpecification
