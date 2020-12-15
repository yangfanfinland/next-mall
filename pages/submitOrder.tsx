import React, { useState, useEffect } from 'react'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import { withRouter } from 'next/router'
import axios from 'axios'
import { serverUrl } from '../util/app'
import { message } from 'antd'
import Address from '../components/SubmitOrderPage/Address'
import Payment from '../components/SubmitOrderPage/Payment'
import GoodsArea from '../components/SubmitOrderPage/GoodsArea'
import styles from '../static/styles/submitOrder.module.scss'
import { useSelector } from 'react-redux'

const SubmitOrder = () => {
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [orderItemList, setOrderItemList] = useState([])
  const [choosedAddressId, setChoosedAddressId] = useState('')
  const [choosedPayMethod, setChoosedPayMethod] = useState(0)
  const [orderId, setOrderId] = useState('')
  const user = useSelector((store) => store.user)
  const [orderRemarker, setOrderRemarker] = useState("")
  const [totalAmount, setTotalAmount] = useState()

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
    setChoosedAddressId(choosedAddress)
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
      message.warning('没有商品信息，订单无法提交~！')
      return
    }
    // 拼接规格ids
    var itemSpecIds = ''
    for (var i = 0; i < orderItemList.length; i++) {
      var tmpSpecId = orderItemList[i].specId
      itemSpecIds += tmpSpecId
      if (i < orderItemList.length - 1) {
        itemSpecIds += ','
      }
    }

    // 判断选中的地址id不能为空
    if (
      choosedAddressId == null ||
      choosedAddressId == undefined ||
      choosedAddressId == ''
    ) {
      message.warning('请选择收货地址！')
      return
    }

    // 判断支付方式不能为空
    if (choosedPayMethod != 1 && choosedPayMethod != 2) {
      message.warning('请选择支付方式！')
      return
    }

    // 买家备注可以为空
    axios.defaults.withCredentials = true
    const res = await axios.post(
      serverUrl + '/orders/create',
      {
        userId: userInfo.id,
        itemSpecIds: itemSpecIds,
        addressId: choosedAddressId,
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

    if (res.data.status == 200) {
      var orderId = res.data.data
      // 判断是否微信还是支付宝支付
      if (choosedPayMethod == 1) {
        // 微信支付则跳转到微信支付页面，并且获得支付二维码
        window.location.href = 'wxpay?orderId=' + orderId
      } else if (choosedPayMethod == 2) {
        setOrderId(orderId)

        // 支付宝支付直接跳转
        window.open('alipayTempTransit?orderId=' + orderId, '_blank')
        window.location.href =
          'alipay.html?orderId=' + orderId + '&amount=' + totalAmount
        // const newWindow = window.open();
        // 弹出的新窗口进行支付
        // newWindow.location = "alipayTempTransit.html?orderId=" + orderId;
        // this.$nextTick(()=> {
        // 	// 当前页面跳转后会轮训支付结果
        // 	newWindow.location.href = "alipay.html?orderId=" + orderId;
        // })
      } else {
        message.warning('目前只支持微信或支付宝支付！')
      }
    } else {
      message.error(res.data.msg)
    }
  }

  return (
    <>
      <HtmlHead title={'提交订单'} />
      <SearchArea noSearch={true} />
      <div className={`bw`}>
        <Address chooseAddressCallback={handleChooseAddress} />
        <Payment choosePaymentCallback={handleChoosePayment} />
        <GoodsArea goodsCallback={handleGoods} />
        <div className={`contentWidth tr`}>
          <a className={`${styles.submitOrder}`} onClick={submitOrder}>
            提交订单
          </a>
        </div>
      </div>
    </>
  )
}

SubmitOrder.getInitialProps = async ({ ctx }) => {
  const { selectedItemSpecIds } = ctx.query

  let itemInfo

  return {
    itemInfo,
  }
}

export default withRouter(SubmitOrder)
