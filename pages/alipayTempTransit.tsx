import React, { useEffect, useState } from 'react'
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
