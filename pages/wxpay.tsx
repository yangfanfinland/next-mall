import React, { useEffect, useState } from 'react'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import { withRouter, SingletonRouter } from 'next/router'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { message } from 'antd'
import { serverUrl, paymentServerUrl } from '../util/app'
import styles from '../static/styles/wxpay.module.scss'
import $ from 'jquery'

interface Props extends SingletonRouter {
  orderId: string
}

const WXpay = ({ orderId }: Props) => {
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const user = useSelector((store) => store.user)
  const [paymentInfo, setPaymentInfo] = useState<any>()

  useEffect(() => {
    judgeUserLoginStatus()
  }, [])

  useEffect(() => {
    if (!user) return
    getWXPayQRCodeUrl(orderId)
  }, [user])

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkPayResult()
    }, 3000)
    return () => clearInterval(intervalId)
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

  const getWXPayQRCodeUrl = async (orderId) => {
    // 发起请求获得微信支付扫描二维码
    axios.defaults.withCredentials = true
    const res = await axios.post(
      paymentServerUrl +
        '/payment/getWXPayQRCode?merchantUserId=' +
        userInfo.id +
        '&merchantOrderId=' +
        orderId,
      {},
      {
        headers: {
          imoocUserId: 'imooc',
          password: 'imooc',
        },
      }
    )

    if (res.data.status == 200) {
      var paymentInfo = res.data.data
      setPaymentInfo(paymentInfo)
      // qrCodeUrl
      // console.log(paymentInfo);

      $('#wxqrcode-display').qrcode({
        width: 200,
        height: 200,
        text: paymentInfo.qrCodeUrl,
      })
    } else {
      message.error(res.data.msg)
    }
  }

  const checkPayResult = async () => {
    // 查询订单是否成功
    // 发起请求获得微信支付扫描二维码
    axios.defaults.withCredentials = true
    const res = await axios.post(
      serverUrl + '/orders/getPaidOrderInfo?orderId=' + orderId,
      {},
      {
        headers: {
          headerUserId: userInfo.id,
          headerUserToken: userInfo.userUniqueToken,
        },
      }
    )

    if (res.data.status == 200) {
      var orderStatus = res.data.data
      if (orderStatus.orderStatus == 20) {
        window.location.href =
          'success.html?orderId=' +
          orderId +
          '&orderAmount=' +
          paymentInfo.amount
      }
    } else {
      message.error(res.data.msg)
    }
  }

  return (
    <>
      <HtmlHead title={'商品详情'} />
      <SearchArea />
      <div className={`${styles.bd} contentWidth`}>
        <div className={`${styles["bd-main"]}`}>
          <div className={`${styles["ep-wrapper"]}`}>
            <div
              className={`${styles["ep-pay-step"]} ${styles["ep-step-channel"]} ${styles["bd-main-container"]}`}
            >
              <div className={`${styles["ep-order-detail"]}`}>
                <div>
                  <div className={`${styles["ep-order-tit"]}`}>
                    <dl>
                      <dt>商品订单：</dt>
                      <dd>{orderId}</dd>
                    </dl>
                  </div>
                  <div className={`${styles["ep-order-tit"]}`}>
                    <span>
                      支付金额：
                      <em className={`${styles["rmb"]}`}>
                        <i>¥</i>
                        {paymentInfo.amount / 100}
                      </em>
                    </span>
                  </div>
                </div>
              </div>
              <div className={`${styles["ep-pay-method"]} ${styles["ep-pay-methods"]}`}>
                <dl>
                  <span className={`${styles["pay-method"]}`}>
                    <dt className={`${styles["pay-words"]}`}>支付方式：</dt>

                    <div className={`${styles["ep-pay-method-list-tit"]}`}>
                      <ul>
                        <li
                          className={`${styles["selected"]}`}
                          data-type="wechat"
                          title="微信支付"
                        >
                          <span className={`${styles["ep-icon"]} ${styles["ep-icon-wxpay"]}`}></span>
                          <span className={`${styles["ep-pay-method-name"]}`}>微信支付</span>
                          <i className={`${styles["ep-icon"]} ${styles["ep-icon-selected"]}`}></i>
                        </li>
                      </ul>
                    </div>
                  </span>

                  <dd className={`${styles["pay-channel"]}`}>
                    <div className={`${styles["ep-pay-method-list-con"]}`}>
                      <div className={`${styles["con"]} ${styles["channel-wechat show"]}`}>
                        <div className={`${styles["clearfix"]}`}>
                          <div className={`${styles["fl"]}`}>
                            <div className={`${styles["ep-wxpay-qrcode-wrap"]}`}>
                              <div
                                id="wxqrcode-display" className={`${styles["wxqrcode-display"]}`}
                              ></div>
                            </div>

                            <div className={`${styles["ep-wxpay-qrcode-notice"]}`}>
                              请打开手机微信，扫一扫完成支付
                            </div>
                          </div>
                          <div className={`${styles["fl"]} ${styles["ep-wxpay-qrcode-tip"]}`}>
                            <img src="img/ep_sys_wx_tip.jpg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

WXpay.getInitialProps = async ({ ctx }) => {
  const { orderId } = ctx.query

  return {
    orderId,
  }
}

export default withRouter(WXpay)