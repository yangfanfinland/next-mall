import React, { useEffect, useState } from 'react'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import { withRouter, SingletonRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Link from 'next/link'

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
      window.location.href = 'login?returnUrl=' + '/center'
    } else {
      window.location.href = '/center'
    }
  }

  return (
    <>
      <HtmlHead title={'Succeed'} />
      <SearchArea />
      <div className="hd">
        <div className="hd-main">
          <div className="ep-hd-info">
            <Link href={`/`}>
              <a className="ep-logo">
                <img src="images/logobig.png" alt="Foodie shop" />
              </a>
            </Link>
            <div className="ep-order-status">
              <span className="page-title">Order payment</span>
            </div>
          </div>
          <div className="user-info">
            {userInfo && <p>Account: {userInfo.nickname}</p>}
          </div>
        </div>
      </div>
      <div className="bd">
        <div className="bd-main">
          <div className="paid-info">
            <div className="first-line">
              <img src="img/success.png" className="paid-success"></img>
              <span className="success-words">Payment succeed!</span>
            </div>
            <div className="second-line">
              <p className="order-words">Order Id: {orderId}</p>
              <p className="order-words">
                Total:
                <em className="rmb">
                  <i>€</i>
                  {orderAmount / 100}
                </em>
              </p>
              <p className="order-words gray-words">
                Contact our service for help
              </p>
              <p className="order-words gray-words">
                Service: service@miyixuan.com
              </p>
            </div>
            <div className="third-line">
              <button className="go-center" onClick={goUserCenter}>
                View my order
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
