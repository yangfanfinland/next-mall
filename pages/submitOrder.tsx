import React, { useState, useEffect } from 'react'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import { withRouter } from 'next/router'
import { createOrderApi } from '../api/api'
import { message } from 'antd'
import Address from '../components/SubmitOrderPage/Address'
import Payment from '../components/SubmitOrderPage/Payment'
import GoodsArea from '../components/SubmitOrderPage/GoodsArea'
import styles from '../static/styles/submitOrder.less'
import { useSelector } from 'react-redux'

const SubmitOrder = () => {
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [orderItemList, setOrderItemList] = useState([])
  const [confirmAddress, setChoosedAddress] = useState<any>()
  const [choosedPayMethod, setChoosedPayMethod] = useState(0)
  const [orderId, setOrderId] = useState('')
  const user = useSelector((store) => store.user)
  const [orderRemarker, setOrderRemarker] = useState('')
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    judgeUserLoginStatus()
  }, [])

  const judgeUserLoginStatus = () => {
    if (user && user.id) {
      setUserIsLogin(true)
      setUserInfo(user)
    } else {
      setUserIsLogin(false)
      setUserInfo({})
    }
  }

  const handleChooseAddress = (choosedAddress) => {
    console.log('choosed address', choosedAddress)
    setChoosedAddress(choosedAddress ? choosedAddress : null)
  }

  const handleChoosePayment = (choosedPayment) => {
    console.log('choosed payment', choosedPayment)
    setChoosedPayMethod(choosedPayment)
  }

  const handleGoods = (goods) => {
    console.log('goods', goods)
    setOrderItemList(goods.orderItemList)
    setTotalAmount(goods.totalAmount)
  }

  const submitOrder = async () => {
    // 判断提交的商品不能为空
    if (orderItemList.length <= 0) {
      message.warning('No product info to checkout')
      return
    }
    // 拼接规格ids
    let itemSpecIds = ''
    for (let i = 0; i < orderItemList.length; i++) {
      const tmpSpecId = orderItemList[i].specId
      itemSpecIds += tmpSpecId
      if (i < orderItemList.length - 1) {
        itemSpecIds += ','
      }
    }

    // 判断选中的地址id不能为空
    if (!confirmAddress) {
      message.warning('Select receive address please')
      return
    }

    // 判断支付方式不能为空
    if (choosedPayMethod != 1 && choosedPayMethod != 2) {
      message.warning('Select payment please')
      return
    }

    // 买家备注可以为空
    const res = await createOrderApi(
      {
        userId: userInfo.id,
        itemSpecIds: itemSpecIds,
        addressId: confirmAddress.id,
        payMethod: choosedPayMethod,
        leftMsg: orderRemarker,
      },
      {
        headers: {
          headerUserId: userInfo.id,
          headerUserToken: userInfo.userUniqueToken,
        },
      }
    )

    if (res.status == 200) {
      const orderId = res.data
      // 判断是否微信还是支付宝支付
      if (choosedPayMethod == 1) {
        // 微信支付则跳转到微信支付页面，并且获得支付二维码
        window.location.href = 'wxpay?orderId=' + orderId
      } else if (choosedPayMethod == 2) {
        setOrderId(orderId)

        // 支付宝支付直接跳转
        window.open('alipayTempTransit?orderId=' + orderId, '_blank')
        window.location.href =
          'alipay?orderId=' + orderId + '&amount=' + totalAmount
      } else {
        message.warning('Only support Wechat and Ali payment')
      }
    } else {
      message.error((res as any).msg)
    }
  }

  return (
    <>
      <HtmlHead title={'Submit order'} />
      <SearchArea noSearch={true} />
      <div className={`bw`}>
        <Address chooseAddressCallback={handleChooseAddress} />
        <Payment choosePaymentCallback={handleChoosePayment} />
        <GoodsArea goodsCallback={handleGoods} />
        {/* <div className={`contentWidth tr`}>
          <a className={`${styles.submitOrder}`} onClick={submitOrder}>
            提交订单
          </a>
        </div> */}

        <div
          className={`contentWidth ${styles['order-go']} ${styles['clearfix']}`}
        >
          <div className={`${styles['pay-confirm']} ${styles['clearfix']}`}>
            <div className={`${styles.box}`}>
              <div className={`${styles.realPay}`}>
                <em className={`${styles.t}`}>Total: </em>
                <span className={`${styles['price g_price']}`}>
                  <em className={`${styles['style-large-bold-red']}`}>
                    {totalAmount ? <>¥{totalAmount / 100}</> : <>€0</>}
                  </em>
                </span>
              </div>

              {confirmAddress && (
                <div className={`${styles['pay-address']}`}>
                  <p className={`${styles['buy-footer-address']}`}>
                    <span
                      className={`${styles['buy-line-title']} ${styles['buy-line-title-type']}`}
                    >
                      Delivery to:
                    </span>
                    <span className={`${styles['buy--address-detail']}`}>
                      <span className={`${styles['province']}`}>
                        {confirmAddress.province}
                      </span>
                      <span className={`${styles['city']}`}>
                        {confirmAddress.city}
                      </span>
                      <span className={`${styles['dist']}`}>
                        {confirmAddress.district}
                      </span>
                      <span className={`${styles['street']}`}>
                        {confirmAddress.detail}
                      </span>
                    </span>
                  </p>
                  <p className={`${styles['buy-footer-address']}`}>
                    <span className={`${styles['buy-line-title']}`}>
                      Receiver:
                    </span>
                    <span className={`${styles['buy-address-detail']}`}>
                      <span className={`${styles['buy-user']}`}>
                        {confirmAddress.receiver}
                      </span>
                      <span className={`${styles['buy-phone']}`}>
                        {confirmAddress.mobile}
                      </span>
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className={`${styles['submitOrder']}`}>
              <div className={`${styles['go-btn-wrap']}`}>
                <a
                  onClick={submitOrder}
                  className={`${styles['btn-go']}`}
                  title="Click to submit order"
                >
                  Submit order
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

SubmitOrder.getInitialProps = async ({ ctx }) => {
  let itemInfo

  return {
    itemInfo,
  }
}

export default withRouter(SubmitOrder)
