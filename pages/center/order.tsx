import React, { useEffect, useState } from 'react'
import UserCenterNav from '../../components/UserCenterNav'
import HtmlHead from '../../components/HtmlHead'
import SearchArea from '../../components/SearchArea'
import OrderList from '../../components/UserCenterPage/OrderList'
import { Tabs, message, Pagination } from 'antd'
import { shopServerUrl } from '../../util/app'
import {
  getOrderListApi,
  deleteOrderApi,
  confirmReceiveApi,
} from '../../api/api'
import moment from 'moment'
import { useSelector } from 'react-redux'
import styles from '../../static/styles/order.less'

const { TabPane } = Tabs

const Order = () => {
  const [myOrderList, setMyOrderList] = useState([])
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [maxPage, setMaxPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [orderStatus, setOrderStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const user = useSelector((store) => store.user)

  useEffect(() => {
    judgeUserLoginStatus()
  }, [])

  useEffect(() => {
    if (!userInfo) return
    renderOrderList(orderStatus, page, pageSize)
  }, [userInfo])

  const judgeUserLoginStatus = () => {
    if (user && user.id) {
      setUserIsLogin(true)
      setUserInfo(user)
    } else {
      setUserIsLogin(false)
      setUserInfo({})
    }
  }

  const renderOrderList = async (orderStatus, page, pageSize) => {
    // 请求后端获得最新数据
    const res = await getOrderListApi(
      userInfo.id,
      orderStatus,
      page,
      pageSize,
      {
        headers: {
          headerUserId: userInfo.id,
          headerUserToken: userInfo.userUniqueToken,
        },
      }
    )

    if (res.status == 200) {
      const grid = res.data
      setMyOrderList(grid.rows)

      for (let i = 0; i < myOrderList.length; i++) {
        const date = myOrderList[i].createdTime
        const formatedTime = moment(date).format('YYYY-MM-DD h:mm:ss')
        myOrderList[i].createdTime = formatedTime
      }
      console.log(myOrderList)

      setMaxPage(grid.total) // 获得总页数
      setTotal(grid.records) // 获得总记录数
    } else if (res.status == 500) {
      message.error((res as any).msg)
    }
  }

  const doPaging = async (page) => {
    setPage(page)
    await renderOrderList(orderStatus, page, pageSize)
  }

  const queryOrdersByStatus = async (status) => {
    if (status == null || status == '' || status == undefined || status == 0) {
      status = ''
    }

    setOrderStatus(status)
    setPage(1)
    await renderOrderList(status, 1, pageSize)
  }

  const deleteOrder = async (orderId) => {
    const confirm = window.confirm('Conform to delete?')
    if (!confirm) {
      return false
    }

    const res = await deleteOrderApi(userInfo.id, orderId, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      await renderOrderList(orderStatus, page, pageSize)
    } else if (res.status == 500) {
      message.error((res as any).msg)
    }
  }

  const confirmReceive = async (orderId) => {
    const confirm = window.confirm('Confirm to receive?')
    if (!confirm) {
      return false
    }

    const res = await confirmReceiveApi(userInfo.id, orderId, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      renderOrderList(orderStatus, page, pageSize)
    } else if (res.status == 500) {
      message.error((res as any).msg)
    }
  }

  const commentItems = (orderId) => {
    window.location.href = 'doComment?orderId=' + orderId
  }

  const goPay = (orderId, payMethod, totalAmount) => {
    // 判断是否微信还是支付宝支付
    if (payMethod == 1) {
      // 微信支付则跳转到微信支付页面，并且获得支付二维码
      window.location.href = shopServerUrl + 'wxpay?orderId=' + orderId
    } else if (payMethod == 2) {
      // 支付宝支付直接跳转
      window.location.href =
        shopServerUrl + 'alipay?orderId=' + orderId + '&amount=' + totalAmount
      window.open(shopServerUrl + 'alipayTempTransit.html?orderId=' + orderId)
    } else {
      message.info('Only support Wechat and Ali payment')
    }
  }

  return (
    <>
      <HtmlHead title={'YiXuan mall - Personal center'} />
      <SearchArea />
      <div className={`${styles.center} contentWidth`}>
        <UserCenterNav router="order" />
        <div className={styles.order}>
          <Tabs defaultActiveKey="1" onChange={queryOrdersByStatus}>
            <TabPane tab="All" key={0}>
              <OrderList myOrderList={myOrderList} deleteOrder={deleteOrder} />
            </TabPane>
            <TabPane tab="Unpaid" key={10}>
              <OrderList myOrderList={myOrderList} goPay={goPay} />
            </TabPane>
            <TabPane tab="Wait deliver" key={20}>
              <OrderList myOrderList={myOrderList} />
            </TabPane>
            <TabPane tab="Wait receive" key={30}>
              <OrderList
                myOrderList={myOrderList}
                confirmReceive={confirmReceive}
              />
            </TabPane>
            <TabPane tab="Complete" key={40}>
              <OrderList
                myOrderList={myOrderList}
                commentItems={commentItems}
              />
            </TabPane>
          </Tabs>
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
    </>
  )
}

export default Order
