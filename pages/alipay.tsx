import React, { useEffect, useState } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { message } from 'antd'
import { getPaidOrderInfoApi } from '../api/api'
import Link from 'next/link'
import styles from '../static/styles/alipay.less'

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
    const res = await getPaidOrderInfoApi(orderId, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.data.status == 200) {
      const orderStatus = res.data.data

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
                  <img src="/static/images/loading.gif" />
                  <span className={`${styles['hit-words']}`}>
                    Order [<em>{orderId}</em>
                    ]Under payment, to be patient please...
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
