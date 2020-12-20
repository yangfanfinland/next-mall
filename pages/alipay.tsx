import React, { useEffect, useState } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { serverUrl } from '../util/app'
import axios from 'axios'
import { message } from 'antd'
import styles from '../static/styles/alipay.module.scss'

interface Props extends SingletonRouter {
  orderId: string
  amount
}

const Alipay = ({ orderId, amount }: Props) => {
  const [userInfo, setUserInfo] = useState<any>()
  const user = useSelector((store) => store.user)

  useEffect(() => {
    judgeUserLoginStatus()
  }, [])

  useEffect(() => {
    if (!userInfo) return
    const intervalId = setInterval(() => {
      checkPayResult()
    }, 3000)
    return () => clearInterval(intervalId)
  }, [userInfo])

  const checkPayResult = async () => {
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
          'success?orderId=' + orderId + '&orderAmount=' + amount
      }
    } else {
      message.error(res.data.msg)
    }
  }

  const judgeUserLoginStatus = () => {
    if (user && user.id) {
      setUserInfo(user)
    } else {
      setUserInfo({})
    }
  }

  return (
    <>
      <div className={`${styles.hd}`}>
        <div className={`${styles["hd-main"]}`}>
          <div className={`${styles["ep-hd-info"]}`}>
            <div className={`${styles["ep-logo"]}`}>
              <img src="/static/images/logobig.png" alt="天天吃货" />
            </div>
            <div className={`${styles["ep-order-status"]}`}>
              <span className={`${styles["page-title"]}`}>订单支付</span>
            </div>
          </div>
          <div className={`${styles["user-info"]}`}>
            {userInfo && <p>账号：{userInfo.nickname}</p>}
          </div>
        </div>
      </div>
      <div className={`${styles.bd}`}>
        <div className={`${styles["bd-main"]}`}>
          <div className={`${styles["ep-wrapper"]}`}>
            <div className={`${styles["ep-pay-step"]} ${styles["ep-step-channel"]} ${styles["bd-main-container"]}`}>
              <div className={`${styles["ep-order-detail"]}`}>
                <div>
                  <img src="/static/images/loading.gif" />
                  <span className={`${styles["hit-words"]}`}>
                    订单[<em>{orderId}</em>
                    ]正在支付中，请耐心等待...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Alipay.getInitialProps = async ({ ctx }) => {
  const { orderId, amount } = ctx.query

  return {
    orderId,
    amount,
  }
}

export default withRouter(Alipay)
