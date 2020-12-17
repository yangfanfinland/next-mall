import React, { useEffect, useState } from 'react'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import { withRouter, SingletonRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { serverUrl, paymentServerUrl } from '../util/app'
import axios from 'axios'
import { message } from 'antd'
import styles from '../static/styles/alipay.module.scss'

interface Props extends SingletonRouter {
  orderId: string
  amount
}

const Alipay = ({ orderId, amount }: Props) => {
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const user = useSelector((store) => store.user)
  const [paymentInfo, setPaymentInfo] = useState<any>()

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
      alert(res.data.msg)
    }
  }

  const judgeUserLoginStatus = () => {
    if (user && user.id) {
      setUserIsLogin(true)
      setUserInfo(user)
    } else {
      setUserIsLogin(false)
      setUserInfo({})
    }
  }

  return (
    <>
      <HtmlHead title={'阿里支付'} />
      <SearchArea />
      <div className="hd">
        <div className="hd-main">
          <div className="ep-hd-info">
            <div className="ep-logo">
              <img src="images/logobig.png" alt="慕课网 - 天天吃货" />
            </div>
            <div className="ep-order-status">
              <span className="page-title">订单支付</span>
            </div>
          </div>
          <div className="user-info">
            {userInfo && <p>账号：{userInfo.nickname}</p>}
          </div>
        </div>
      </div>
      <div className="bd">
        <div className="bd-main">
          <div className="ep-wrapper">
            <div className="ep-pay-step ep-step-channel bd-main-container">
              <div className="ep-order-detail">
                <div>
                  <img src="img/loading.gif" />
                  <span className="hit-words">
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
