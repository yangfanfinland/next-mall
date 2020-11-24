import React, { useEffect, useState } from 'react'
import { Input, message } from 'antd'
import {
  serverUrl,
  getUrlParam,
  goErrorPage,
  getShopcartList,
} from '../../../util/app'
import styles from './index.module.scss'

const GoodsArea = () => {
  const [orderItemList, setOrderItemList] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    renderOrderInfoList()
  }, [])

  const renderOrderInfoList = () => {
    var selectedItemSpecIds = getUrlParam('selectedItemSpecIds')
    if (
      selectedItemSpecIds == null ||
      selectedItemSpecIds == '' ||
      selectedItemSpecIds == undefined
    ) {
      goErrorPage()
    }

    var specIdsArray = new Array()
    specIdsArray = selectedItemSpecIds.split(',')

    var orderItemList = []
    var totalAmount = 0
    for (var i = 0; i < specIdsArray.length; i++) {
      var tmpSpecId = specIdsArray[i]
      var orderItem = getItemFromCookieShopcartList(tmpSpecId)
      orderItemList.push(orderItem)
      totalAmount += orderItem.priceDiscount * orderItem.buyCounts
    }

    setOrderItemList(orderItemList)
    setTotalAmount(totalAmount)

    if (orderItemList.length <= 0) {
      message.error('没有商品信息，或订单已经提交')
      window.location.href = 'shopcart.html'
    }
  }

  const getItemFromCookieShopcartList = (specId) => {
    var shopcartList = getShopcartList()

    if (
      shopcartList == null ||
      shopcartList == undefined ||
      shopcartList.length == 0
    ) {
      // goErrorPage()
    }

    for (var i = 0; i < shopcartList.length; i++) {
      var tmpSpecId = shopcartList[i].specId
      if (tmpSpecId == specId) {
        return shopcartList[i]
      }
    }
  }

  return (
    <div className={`contentWidth ${styles.goodsAreaPage}`}>
      <div className={`${styles.title}`}>确认订单信息</div>
      <div className={`${styles.header} fcb`}>
        <span className={`${styles.goodsInfo} fl`}>商品信息</span>
        <span className={`${styles.goodsPrice} fl`}>单价(元)</span>
        <span className={`${styles.goodsNum} fl`}>数量</span>
        <span className={`${styles.money} fl`}>金额(元)</span>
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
                <div><span>规格：{orderItem.specName} </span></div>
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

            <div className={styles.yunFee}>
              <span className={`color6 f16`}>运费：</span>
              <span className={`red f16`}>￥5.00</span>
            </div>
          </div>
        ))}

      <div className={`${styles.msgWrap} fcb`}>
        <div className={`fl fcb`}>
          <span className={`${styles.msgTitle} fl`}>给商家留言：</span>
          <div className={`fl ${styles.msgText}`}>
            <Input.TextArea rows={2} placeholder={'选填，最多200字'} />
          </div>
        </div>
        <div className={`fr`}>
          <span>店铺合计(含运费)：</span>
          <span className={`f20 fwb red`}>¥{totalAmount / 100}</span>
        </div>
      </div>

      <div className={`tr`}>
        <a className={`${styles.submitOrder}`}>提交订单</a>
      </div>
    </div>
  )
}

export default GoodsArea
