import React, { useEffect, useState } from 'react'
import HtmlHead from '../components/HtmlHead'
import { withRouter, SingletonRouter } from 'next/router'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { message } from 'antd'
import { serverUrl, paymentServerUrl } from '../util/app'
import styles from '../static/styles/wxpay.less'
import QRCode from 'qrcode'

interface Props extends SingletonRouter {
  orderId: string
}

const WXpay = ({ orderId }: Props) => {
  const [userInfo, setUserInfo] = useState<any>()
  const user = useSelector((store) => store.user)
  const [paymentInfo, setPaymentInfo] = useState<any>()

  useEffect(() => {
    judgeUserLoginStatus()
  }, [])

  useEffect(() => {
    if (!userInfo) return
    getWXPayQRCodeUrl(orderId)
  }, [userInfo])

  useEffect(() => {
    if (!userInfo) return
    const intervalId = setInterval(() => {
      checkPayResult()
    }, 3000)
    return () => clearInterval(intervalId)
  }, [userInfo])

  const judgeUserLoginStatus = () => {
    if (user && user.id) {
      setUserInfo(user)
    } else {
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

    console.log(userInfo, res)

    if (res.data.status == 200) {
      const paymentInfo = res.data.data
      setPaymentInfo(paymentInfo)
      // qrCodeUrl
      // console.log(paymentInfo);
      const canvas = document.getElementById('wxqrcode-display')
      QRCode.toCanvas(canvas, paymentInfo.qrCodeUrl, function (error) {
        if (error) console.error(error)
        console.log('success!')
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
      const orderStatus = res.data.data
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
      <HtmlHead title={'Wechat payment'} />
      <div className={`${styles.hd}`}>
        <div className={`${styles['hd-main']}`}>
          <div className={`${styles['ep-hd-info']}`}>
            <Link href={`/`}>
              <a className={`${styles['ep-logo']}`}>
                <img src="/static/images/logobig.png" alt="Foodie shop" />
              </a>
            </Link>
            <div className={`${styles['ep-order-status']}`}>
              <span className={`${styles['page-title']}`}>Order payment</span>
            </div>
          </div>
          <div className={`${styles['user-info']}`}>
            {userInfo && <p>Account: {userInfo.nickname}</p>}
          </div>
        </div>
      </div>
      <div className={`${styles.bd}`}>
        <div className={`${styles['bd-main']}`}>
          <div className={`${styles['ep-wrapper']}`}>
            <div
              className={`${styles['ep-pay-step']} ${styles['ep-step-channel']} ${styles['bd-main-container']}`}
            >
              <div className={`${styles['ep-order-detail']}`}>
                <div>
                  <div className={`${styles['ep-order-tit']}`}>
                    <dl>
                      <dt>Order Id: </dt>
                      <dd>{orderId}</dd>
                    </dl>
                  </div>
                  <div className={`${styles['ep-order-tit']}`}>
                    <span>
                      Total:
                      <em className={`${styles['rmb']}`}>
                        <i>€</i>
                        {paymentInfo ? (
                          <>{paymentInfo.amount / 100}</>
                        ) : (
                          <>0.00</>
                        )}
                      </em>
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={`${styles['ep-pay-method']} ${styles['ep-pay-methods']}`}
              >
                <dl>
                  <span className={`${styles['pay-method']}`}>
                    <dt className={`${styles['pay-words']}`}>Payment</dt>

                    <div className={`${styles['ep-pay-method-list-tit']}`}>
                      <ul>
                        <li
                          className={`${styles['selected']}`}
                          data-type="wechat"
                          title="Wechat payment"
                        >
                          <span
                            className={`${styles['ep-icon']} ${styles['ep-icon-wxpay']}`}
                          ></span>
                          <span className={`${styles['ep-pay-method-name']}`}>
                            Wechat payment
                          </span>
                          <i
                            className={`${styles['ep-icon']} ${styles['ep-icon-selected']}`}
                          ></i>
                        </li>
                      </ul>
                    </div>
                  </span>

                  <dd className={`${styles['pay-channel']}`}>
                    <div className={`${styles['ep-pay-method-list-con']}`}>
                      <div
                        className={`${styles['con']} ${styles['channel-wechat show']}`}
                      >
                        <div className={`${styles['clearfix']}`}>
                          <div className={`${styles['fl']}`}>
                            <div
                              className={`${styles['ep-wxpay-qrcode-wrap']}`}
                            >
                              <canvas
                                id="wxqrcode-display"
                                className={`${styles['wxqrcode-display']}`}
                              ></canvas>
                            </div>

                            <div
                              className={`${styles['ep-wxpay-qrcode-notice']}`}
                            >
                              Open mobile wechat to scan
                            </div>
                          </div>
                          <div
                            className={`${styles['fl']} ${styles['ep-wxpay-qrcode-tip']}`}
                          >
                            <img src="/static/images/ep_sys_wx_tip.jpg" />
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
