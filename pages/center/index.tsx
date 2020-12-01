import React, { useEffect, useState } from 'react'
import { message, Pagination } from 'antd'
import UserCenterNav from '../../components/UserCenterNav'
import HtmlHead from '../../components/HtmlHead'
import SearchArea from '../../components/SearchArea'
import { serverUrl, getCookie } from '../../util/app'
import axios from 'axios'
import moment from 'moment'
import styles from '../../static/styles/center.module.scss'

const Index = () => {
  const [orderTrendList, setOrderTrendList] = useState([])
  const [userInfo, setUserInfo] = useState<any>()
  const [orderStatusCounts, setOrderStatusCounts] = useState<any>()
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [maxPage, setMaxPage] = useState(1)
  const [total, setTotal] = useState(1)
  const [yearMonth, setYearMonth] = useState('')
  const [day, setDay] = useState('')
  const [weekDay, setWeekDay] = useState('')

  useEffect(() => {
    judgeUserLoginStatus()
    renderCalendar()
  }, [])

  useEffect(() => {
    if (!userInfo) return
    renderOrderStatusCounts()
    renderOrderTrend(page, pageSize)
  }, [userInfo])

  const renderOrderStatusCounts = async () => {
    axios.defaults.withCredentials = true
    const res = await axios.post(
      serverUrl + '/myorders/statusCounts?userId=' + userInfo.id,
      {},
      {
        headers: {
          headerUserId: userInfo.id,
          headerUserToken: userInfo.userUniqueToken,
        },
      }
    )

    if (res.data.status == 200) {
      setOrderStatusCounts(res.data.data)
    } else {
      alert(res.data.msg)
      console.log(res.data.msg)
    }
  }

  const doPaging = async (page) => {
    setPage(page)
    await renderOrderTrend(page, pageSize)
  }

  const renderOrderTrend = async (page, pageSize) => {
    axios.defaults.withCredentials = true
    const res = await axios.post(
      serverUrl +
        '/myorders/trend?userId=' +
        userInfo.id +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize,
      {},
      {
        headers: {
          headerUserId: userInfo.id,
          headerUserToken: userInfo.userUniqueToken,
        },
      }
    )

    if (res.data.status == 200) {
      var grid = res.data.data
      var tempOrderTrendList = grid.rows

      for (var i = 0; i < tempOrderTrendList.length; i++) {
        var payTimeTmp = tempOrderTrendList[i].payTime
        var formatedPayTime = moment(payTimeTmp).format(
          'YYYY年MM月DD日 h:mm:ss'
        )

        var deliverTimeTmp = tempOrderTrendList[i].deliverTime
        var formatedDeliverTime = moment(deliverTimeTmp).format(
          'YYYY年MM月DD日 h:mm:ss'
        )

        var successTimeTmp = tempOrderTrendList[i].successTime
        var formatedSuccessTime = moment(successTimeTmp).format(
          'YYYY年MM月DD日 h:mm:ss'
        )

        tempOrderTrendList[i].payTime = formatedPayTime
        tempOrderTrendList[i].deliverTime = formatedDeliverTime
        tempOrderTrendList[i].successTime = formatedSuccessTime
      }

      setOrderTrendList(tempOrderTrendList)
      setMaxPage(grid.total)
      setTotal(grid.records)
    } else {
      message.error(res.data.msg)
    }
  }

  const renderCalendar = () => {
    var yearMonth = moment(new Date()).format('YYYY年MM月')
    var day = moment(new Date()).format('DD')
    var localMoment = moment().locale('zh-cn')
    var weekDay = localMoment.format('dddd')

    setYearMonth(yearMonth)
    setDay(day)
    setWeekDay(weekDay)
  }

  const judgeUserLoginStatus = () => {
    var userCookie = getCookie('user')
    if (userCookie != null && userCookie != undefined && userCookie != '') {
      var userInfoStr = decodeURIComponent(userCookie)
      if (
        userInfoStr != null &&
        userInfoStr != undefined &&
        userInfoStr != ''
      ) {
        var userInfo = JSON.parse(userInfoStr)
        // 判断是否是一个对象
        if (typeof userInfo == 'object') {
          setUserIsLogin(true)
          setUserInfo(userInfo)
        } else {
          setUserIsLogin(false)
          setUserInfo({})
        }
      }
    } else {
      setUserIsLogin(false)
      setUserInfo({})
    }
  }

  return (
    <>
      <HtmlHead title={'多米电商 - 个人中心'} />
      <SearchArea />
      <div className={`${styles.center} contentWidth`}>
        <UserCenterNav router="center" />
        <div className={`${styles['main-wrap']}`}>
          <div className={`${styles['wrap-left']}`}>
            <div className={`${styles['wrap-list']}`}>
              <div className={`${styles['m-user']}`}>
                <div className={`${styles['m-userinfo']}`}>
                  {userInfo && (
                    <div className={`${styles['m-baseinfo']}`}>
                      <a href="userinfo.html">
                        <img src={userInfo.face} />
                      </a>
                      <em className={`${styles['s-name']}`}>
                        ({userInfo.nickname})
                      </em>
                    </div>
                  )}
                </div>
              </div>

              <div className={`${styles['m-order']}`}>
                <div className={`${styles['s-bar']}`}>
                  <i className={`${styles['s-icon']}`}></i>我的订单
                  <a
                    className={`${styles['i-load-more-item-shadow']}`}
                    href="/center/order"
                  >
                    全部订单
                  </a>
                </div>
                {orderStatusCounts && (
                  <ul>
                    <li>
                      <a href="/center/order">
                        <i>
                          <img src="/static/images/pay.png" />
                        </i>
                        <span>
                          待付款
                          {orderStatusCounts.waitPayCounts > 0 && (
                            <em className="m-num">
                              {orderStatusCounts.waitPayCounts}
                            </em>
                          )}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="/center/order">
                        <i>
                          <img src="/static/images/send.png" />
                        </i>
                        <span>
                          待发货
                          {orderStatusCounts.waitDeliverCounts > 0 && (
                            <em className="m-num">
                              {orderStatusCounts.waitDeliverCounts}
                            </em>
                          )}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="/center/order">
                        <i>
                          <img src="/static/images/receive.png" />
                        </i>
                        <span>
                          待收货
                          {orderStatusCounts.waitReceiveCounts > 0 && (
                            <em className="m-num">
                              {orderStatusCounts.waitReceiveCounts}
                            </em>
                          )}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href="/center/order">
                        <i>
                          <img src="/static/images/comment.png" />
                        </i>
                        <span>
                          待评价
                          {orderStatusCounts.waitCommentCounts > 0 && (
                            <em className="m-num">
                              {orderStatusCounts.waitCommentCounts}
                            </em>
                          )}
                        </span>
                      </a>
                    </li>
                  </ul>
                )}
              </div>
              <div className={`${styles['box-container-bottom']}`}></div>
              <div className={`${styles['m-logistics']}`}>
                <div className={`${styles['s-bar']}`}>
                  <i className="s-icon"></i>订单动向
                </div>
                <div className={`${styles['s-content']}`}>
                  <ul className={`${styles['lg-list']}`}>
                    {orderTrendList &&
                      orderTrendList.map((trend, trendIndex) => (
                        <li className={`${styles['lg-item']}`} key={trendIndex}>
                          {trend.orderStatus == 20 && (
                            <div className={`${styles['lg-info']}`}>
                              <p>订单号：[{trend.orderId}]</p>
                              <div className={`${styles['lg-detail-wrap']}`}>
                                <a href="" className={`${styles['lg-detail']}`}>
                                  您已付款，等待发货~
                                </a>
                              </div>
                              <p>付款时间：{trend.payTime}</p>
                            </div>
                          )}

                          {trend.orderStatus == 30 && (
                            <div className={`${styles['lg-info']}`}>
                              <p>订单号：[{trend.orderId}]</p>
                              <div className={`${styles['lg-detail-wrap']}`}>
                                <a href="" className={`${styles['lg-detail']}`}>
                                  商家已发货，请耐心等待噢~
                                </a>
                              </div>
                              <p>发货时间：{trend.deliverTime}</p>
                            </div>
                          )}

                          {trend.orderStatus == 40 && (
                            <div className={`${styles['lg-info']}`}>
                              <p>订单号：[{trend.orderId}]</p>
                              <div className={`${styles['lg-detail-wrap']}`}>
                                <a href="" className={`${styles['lg-detail']}`}>
                                  该订单交易成功！
                                </a>
                              </div>
                              <p>成功时间：{trend.successTime}</p>
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>

                  <div className={`${styles.wrap}`}>
                    <Pagination
                      pageSize={pageSize}
                      showQuickJumper
                      defaultCurrent={1}
                      total={total}
                      onChange={doPaging}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles['wrap-right']}`}>
            <div className={`${styles['day-list']}`}>
              <div className={`${styles['s-bar']}`}>
                <a className={`${styles['i-history-trigger']}`} href="#"></a>
                小日历
              </div>
              <div className={`${styles['s-care-noweather']}`}>
                <div className={`${styles['s-date']}`}>
                  <em>{day}</em>
                  <span>{weekDay}</span>
                  <span>{yearMonth}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
