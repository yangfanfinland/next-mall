import React, { useEffect, useState } from 'react'
import { message, Pagination } from 'antd'
import UserCenterNav from '../../components/UserCenterNav'
import HtmlHead from '../../components/HtmlHead'
import SearchArea from '../../components/SearchArea'
import { getOrderStatusCountsApi, getOrderTrendApi } from '../../api/api'
import moment from 'moment'
import { useSelector } from 'react-redux'
import styles from '../../static/styles/center.less'

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
  const user = useSelector((store) => store.user)

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
    const res = await getOrderStatusCountsApi(userInfo.id, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      setOrderStatusCounts(res.data)
    } else {
      message.error((res as any).msg)
    }
  }

  const doPaging = async (page) => {
    setPage(page)
    await renderOrderTrend(page, pageSize)
  }

  const renderOrderTrend = async (page, pageSize) => {
    const res = await getOrderTrendApi(userInfo.id, page, pageSize, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      const grid = res.data
      let tempOrderTrendList = grid.rows

      for (let i = 0; i < tempOrderTrendList.length; i++) {
        const payTimeTmp = tempOrderTrendList[i].payTime
        const formatedPayTime = moment(payTimeTmp).format(
          'YYYY-MM-DD h:mm:ss'
        )

        const deliverTimeTmp = tempOrderTrendList[i].deliverTime
        const formatedDeliverTime = moment(deliverTimeTmp).format(
          'YYYY-MM-DD h:mm:ss'
        )

        const successTimeTmp = tempOrderTrendList[i].successTime
        const formatedSuccessTime = moment(successTimeTmp).format(
          'YYYY-MM-DD h:mm:ss'
        )

        tempOrderTrendList[i].payTime = formatedPayTime
        tempOrderTrendList[i].deliverTime = formatedDeliverTime
        tempOrderTrendList[i].successTime = formatedSuccessTime
      }

      setOrderTrendList(tempOrderTrendList)
      setMaxPage(grid.total)
      setTotal(grid.records)
    } else {
      message.error((res as any).msg)
    }
  }

  const renderCalendar = () => {
    const yearMonth = moment(new Date()).format('YYYY-MM')
    const day = moment(new Date()).format('DD')
    const localMoment = moment().locale('zh-cn')
    const weekDay = localMoment.format('dddd')

    setYearMonth(yearMonth)
    setDay(day)
    setWeekDay(weekDay)
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
      <HtmlHead title={'Foodie - Personal center'} />
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
                  <i className={`${styles['s-icon']}`}></i>My order
                  <a
                    className={`${styles['i-load-more-item-shadow']}`}
                    href="/center/order"
                  >
                    All orders
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
                          Unpaid
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
                          Wait delivery
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
                          Wait receive
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
                          Wait comment
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
                  <i className="s-icon"></i>Order flow
                </div>
                <div className={`${styles['s-content']}`}>
                  <ul className={`${styles['lg-list']}`}>
                    {orderTrendList &&
                      orderTrendList.map((trend, trendIndex) => (
                        <li className={`${styles['lg-item']}`} key={trendIndex}>
                          {trend.orderStatus == 20 && (
                            <div className={`${styles['lg-info']}`}>
                              <p>Order Id: [{trend.orderId}]</p>
                              <div className={`${styles['lg-detail-wrap']}`}>
                                <a href="" className={`${styles['lg-detail']}`}>
                                  Paid, wait delivering
                                </a>
                              </div>
                              <p>Paid on: {trend.payTime}</p>
                            </div>
                          )}

                          {trend.orderStatus == 30 && (
                            <div className={`${styles['lg-info']}`}>
                              <p>Order Id: [{trend.orderId}]</p>
                              <div className={`${styles['lg-detail-wrap']}`}>
                                <a href="" className={`${styles['lg-detail']}`}>
                                  Delivered, to be patient please
                                </a>
                              </div>
                              <p>Delivered on: {trend.deliverTime}</p>
                            </div>
                          )}

                          {trend.orderStatus == 40 && (
                            <div className={`${styles['lg-info']}`}>
                              <p>Order Id: [{trend.orderId}]</p>
                              <div className={`${styles['lg-detail-wrap']}`}>
                                <a href="" className={`${styles['lg-detail']}`}>
                                  Order succeed
                                </a>
                              </div>
                              <p>Succeed on: {trend.successTime}</p>
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
                Calendar
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
