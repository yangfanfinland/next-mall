import React, { useEffect, useState } from 'react'
import { Input, message } from 'antd'
import { getUrlParam, goErrorPage, getShopcartList } from '../../../util/app'
import styles from './index.less'

const GoodsArea = ({ goodsCallback }: { goodsCallback?: (goods) => void }) => {
  const [orderItemList, setOrderItemList] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    renderOrderInfoList()
  }, [])

  const renderOrderInfoList = () => {
    const selectedItemSpecIds = getUrlParam('selectedItemSpecIds')
    if (
      selectedItemSpecIds == null ||
      selectedItemSpecIds == '' ||
      selectedItemSpecIds == undefined
    ) {
      goErrorPage()
    }

    let specIdsArray = new Array()
    specIdsArray = selectedItemSpecIds.split(',')

    let orderItemList = []
    let totalAmount = 0
    for (let i = 0; i < specIdsArray.length; i++) {
      const tmpSpecId = specIdsArray[i]
      const orderItem = getItemFromCookieShopcartList(tmpSpecId)
      orderItemList.push(orderItem)
      totalAmount += orderItem.priceDiscount * orderItem.buyCounts
    }

    setOrderItemList(orderItemList)
    setTotalAmount(totalAmount)
    goodsCallback({ orderItemList, totalAmount })

    if (orderItemList.length <= 0) {
      message.error('No product info or order submitted already')
      window.location.href = 'shopcart.html'
    }
  }

  const getItemFromCookieShopcartList = (specId) => {
    const shopcartList = getShopcartList()

    if (
      shopcartList == null ||
      shopcartList == undefined ||
      shopcartList.length == 0
    ) {
      // goErrorPage()
    }

    for (let i = 0; i < shopcartList.length; i++) {
      const tmpSpecId = shopcartList[i].specId
      if (tmpSpecId == specId) {
        return shopcartList[i]
      }
    }
  }

  return (
    <div className={`contentWidth ${styles.goodsAreaPage}`}>
      <div className={`${styles.title}`}>Confirm order info</div>
      <div className={`${styles.payTable}`}>
        <div className={`${styles.header} fcb`}>
          <span className={`${styles.goodsInfo} fl`}>Product info</span>
          <span className={`${styles.goodsPrice} fl`}>Price(€)</span>
          <span className={`${styles.goodsNum} fl`}>Amount</span>
          <span className={`${styles.money} fl`}>Sub total(€)</span>
        </div>

        {orderItemList &&
          orderItemList.map((orderItem, index) => (
            <div key={index} className={styles.goodsBox}>
              <div className={`${styles.item} fcb`}>
                <img
                  className={`${styles.goodsImg} fl`}
                  src={orderItem.itemImgUrl}
                  alt=""
                />
                <div className={`${styles.goodsName} fl`}>
                  {orderItem.itemName}
                  <div>
                    <span>Specification: {orderItem.specName} </span>
                  </div>
                </div>
                {/* <div className={`${styles.size} fl`}>
                
              </div> */}
                <div className={`${styles.fontBold} ${styles.price} fl`}>
                  {orderItem.priceDiscount / 100}
                </div>
                <div className={`${styles.fontBold}  ${styles.num} fl`}>
                  {orderItem.buyCounts}
                </div>
                <div className={`${styles.fontBold} ${styles.money} fl`}>
                  {(orderItem.priceDiscount * orderItem.buyCounts) / 100}
                </div>
              </div>

              {/* <div className={styles.yunFee}>
                <span className={`color6 f16`}>运费：</span>
                <span className={`red f16`}>￥5.00</span>
              </div> */}
            </div>
          ))}

        <div className={`${styles.msgWrap} fcb`}>
          <div className={`fl fcb`}>
            <span className={`${styles.msgTitle} fl`}>Message to shop: </span>
            <div className={`fl ${styles.msgText}`}>
              <Input.TextArea rows={2} placeholder={'Optional, maximum 200'} />
            </div>
          </div>
          <div className={`fr`}>
            <span>Total: </span>
            <span className={`f20 fwb red`}>€{totalAmount / 100}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoodsArea
