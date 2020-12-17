import React, { useEffect, useState } from 'react'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import { withRouter, SingletonRouter } from 'next/router'
import { useSelector } from 'react-redux'
import styles from '../static/styles/success.module.scss'

interface Props extends SingletonRouter {
  orderId: string
  orderAmount
}

const Success = ({ orderId, orderAmount }: Props) => {
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const user = useSelector((store) => store.user)

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

  const goUserCenter = () => {
    if (!userIsLogin) {
        window.location.href = "login?returnUrl=" +  "/center";
    } else {
        window.location.href = "/center";
    }
  }

  return (
    <>
      <HtmlHead title={'成功'} />
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
          <div className="paid-info">
            <div className="first-line">
              <img src="img/success.png" className="paid-success"></img>
              <span className="success-words">支付成功！</span>
            </div>
            <div className="second-line">
              <p className="order-words">商品订单：{orderId}</p>
              <p className="order-words">
                支付金额：
                <em className="rmb">
                  <i>¥</i>
                  {orderAmount / 100}
                </em>
              </p>
              <p className="order-words gray-words">
                若有疑问请与客服联系，我们将会尽快为您提供帮助与服务。
              </p>
              <p className="order-words gray-words">
                客服邮箱：service@yangfanyuanhang.com
              </p>
            </div>
            <div className="third-line">
              <button className="go-center" onClick={goUserCenter}>
                查看我的订单
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Success.getInitialProps = async ({ ctx }) => {
  const { orderId, orderAmount } = ctx.query

  return {
    orderId,
    orderAmount,
  }
}

export default withRouter(Success)
