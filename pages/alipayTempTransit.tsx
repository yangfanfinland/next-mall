import React, { useEffect, useState } from 'react'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import { withRouter, SingletonRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { paymentServerUrl } from '../util/app'
import axios from 'axios'
import { message } from 'antd'
import styles from '../static/styles/alipayTempTransit.module.scss'

interface Props extends SingletonRouter {
  orderId: string
}

const AlipayTempTransit = ({ orderId }: Props) => {
  const [userInfo, setUserInfo] = useState<any>()
  const user = useSelector((store) => store.user)
  const [alipayForm, setAlipayForm] = useState('')

  useEffect(() => {
    judgeUserLoginStatus()
  }, [])

  useEffect(() => {
    if (!userInfo) return
    getAliPayForm(orderId)
  }, [userInfo])

  const judgeUserLoginStatus = () => {
    if (user && user.id) {
      setUserInfo(user)
    } else {
      setUserInfo({})
    }
  }

  const getAliPayForm = async (orderId) => {
    axios.defaults.withCredentials = true
    const res = await axios.post(
      paymentServerUrl +
        '/payment/goAlipay?merchantUserId=' +
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
      var alipayForm = res.data.data
      console.log(alipayForm)
      document.write(alipayForm)
      // setAlipayForm(alipayForm)
    } else {
      message.error(res.data.msg)
    }
  }

  return (
    <>
      <HtmlHead title={'阿里支付'} />
      <SearchArea />
      <div className={`${styles.hd} contentWidth`}>
        <div className="hd-main">
          <div className="ep-hd-info">
            <div className="ep-logo">
              <img src="/static/images/logobig.png" alt="天天吃货" />
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
      <div className={`${styles.bd} contentWidth`}>
        <div className="bd-main">
          <div className="ep-wrapper">
            <div className="ep-pay-step ep-step-channel bd-main-container">
              <div className="ep-order-detail">
                <div>
                  <img src="/static/images/loading.gif" />
                  <span className="hit-words">
                    订单[<em>{orderId}</em>
                    ]正在支付中，请耐心等待...
                  </span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: alipayForm }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

AlipayTempTransit.getInitialProps = async ({ ctx }) => {
  const { orderId } = ctx.query

  return {
    orderId,
  }
}

export default withRouter(AlipayTempTransit)
