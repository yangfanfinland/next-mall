import React, { useEffect, useState } from 'react'
import UserCenterNav from '../../components/UserCenterNav'
import HtmlHead from '../../components/HtmlHead'
import SearchArea from '../../components/SearchArea'
import OrderList from '../../components/UserCenterPage/OrderList'
import { Tabs, message } from 'antd'
import { serverUrl, getCookie, checkEmail, checkMobile } from '../../util/app'
import axios from 'axios'
import moment from 'moment'
import styles from '../../static/styles/order.module.scss'

const { TabPane } = Tabs

const Order = () => {
  const handleChange = () => {}

  const [myOrderList, setMyOrderList] = useState([])
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [maxPage, setMaxPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [orderStatus, setOrderStatus] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)


  useEffect(() => {
    judgeUserLoginStatus()
  }, [])

  useEffect(() => {
      if (!userInfo) return
    renderOrderList(orderStatus, page, pageSize)   
  }, [userInfo])

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

  const renderOrderList = async (orderStatus, page, pageSize) => {
    // 请求后端获得最新数据
    axios.defaults.withCredentials = true
    const res = await axios
      .post(
        serverUrl +
          '/myorders/query?userId=' +
          userInfo.id +
          '&orderStatus=' +
          orderStatus +
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
          setMyOrderList(grid.rows)

          for (var i = 0; i < myOrderList.length; i++) {
            var date = myOrderList[i].createdTime
            var formatedTime = moment(date).format('YYYY年MM月DD日 h:mm:ss')
            myOrderList[i].createdTime = formatedTime
          }
          console.log(myOrderList)

          setMaxPage(grid.total) // 获得总页数
          setTotal(grid.records) // 获得总记录数
        } else if (res.data.status == 500) {
          message.error(res.data.msg)
        }
  }

  const queryOrdersByStatus = async (status) => {
    if (status == null || status =="" || status == undefined || status == 0) {
        status = "";
    }

    setOrderStatus(status);
    setPage(1);
    await renderOrderList(status, 1, pageSize);
  }

  return (
    <>
      <HtmlHead title={'多米电商 - 个人中心'} />
      <SearchArea />
      <div className={`${styles.center} contentWidth`}>
        <UserCenterNav router="order" />
        <div style={{ width: '100%' }}>
          <Tabs defaultActiveKey="1" onChange={queryOrdersByStatus}>
            <TabPane tab="所有订单" key={0}>
              <OrderList myOrderList={myOrderList} />
            </TabPane>
            <TabPane tab="代付款" key={10}>
              <OrderList myOrderList={myOrderList} />
            </TabPane>
            <TabPane tab="代发货" key={20}>
              <OrderList myOrderList={myOrderList} />
            </TabPane>
            <TabPane tab="代收货" key={30}>
              <OrderList myOrderList={myOrderList} />
            </TabPane>
            <TabPane tab="已完成" key={40}>
              <OrderList myOrderList={myOrderList} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Order
