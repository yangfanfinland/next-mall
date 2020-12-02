import React, { useEffect, useState } from 'react'
import UserCenterNav from '../../components/UserCenterNav'
import HtmlHead from '../../components/HtmlHead'
import SearchArea from '../../components/SearchArea'
import { serverUrl, getCookie, getUrlParam } from '../../util/app'
import axios from 'axios'
import { message } from 'antd'
import styles from '../../static/styles/doComment.module.scss'

const DoComment = () => {
  const [orderItemList, setOrderItemList] = useState([])
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    var orderId = getUrlParam("orderId")
    setOrderId(orderId)
    judgeUserLoginStatus()
  }, [])

  useEffect(() => {
    if (!userInfo || !orderId) return
    renderItemComment(orderId)
  }, [userInfo, orderId])

  const renderItemComment = async (orderId) => {
    axios.defaults.withCredentials = true
    const res = await axios.post(
      serverUrl +
        '/mycomments/pending?userId=' +
        userInfo.id +
        '&orderId=' +
        orderId,
      {},
      {
        headers: {
          headerUserId: userInfo.id,
          headerUserToken: userInfo.userUniqueToken,
        },
      }
    )

    if (res.data.status == 200) {
      var tempOrderItemList = res.data.data

      for (var i = 0; i < tempOrderItemList.length; i++) {
        tempOrderItemList[i].commentLevel = 0
        tempOrderItemList[i].commentId = 0
      }

      setOrderItemList(tempOrderItemList)
    } else if (res.data.status == 500) {
      message.error(res.data.msg)
    }
  }

  const saveComments = async () => {
    // 判断每项元素是否有评论等级
    // 判断每项元素是否包含评论内容
    for (var i = 0; i < orderItemList.length; i++) {
      var tempItem = orderItemList[i]
      if (
        tempItem.commentLevel == '' ||
        tempItem.commentLevel == undefined ||
        tempItem.commentLevel == null
      ) {
        message.warning('每个商品都需要一朵小花噢~')
        return
      }
      if (
        tempItem.content == '' ||
        tempItem.content == undefined ||
        tempItem.content == null
      ) {
        message.warning('每个商品都需要您宝贵的评论噢~')
        return
      }
    }

    axios.defaults.withCredentials = true
    const res = await axios.post(
      serverUrl +
        '/mycomments/saveList?userId=' +
        userInfo.id +
        '&orderId=' +
        orderId,
      orderItemList,
      {
        headers: {
          headerUserId: userInfo.id,
          headerUserToken: userInfo.userUniqueToken,
        },
      }
    )

    if (res.data.status == 200) {
      message.success('评论成功！')
      window.location.href = '/center/order'
    } else if (res.data.status == 500) {
      message.error(res.data.msg)
    }
  }

  const makeComment = (orderItemId, level) => {
    var tempOrderItemList = orderItemList
    for (var i = 0; i < tempOrderItemList.length; i++) {
      var tempId = tempOrderItemList[i].id
      if (tempId == orderItemId) {
        tempOrderItemList[i].commentLevel = level
      }
    }

    setOrderItemList(tempOrderItemList)

    var liId = ''
    if (level == 1) {
      liId = 'good_' + orderItemId
    } else if (level == 2) {
      liId = 'normal_' + orderItemId
    } else if (level == 3) {
      liId = 'bad_' + orderItemId
    }

    var goodLiId = 'good_' + orderItemId
    var normalLiId = 'normal_' + orderItemId
    var badLiId = 'bad_' + orderItemId

    // 判断评价等级，先把所有的颜色去掉，然后再在当前点击的上面标记颜色
    var goodDomLi = document.getElementById(goodLiId)
    var normalDomLi = document.getElementById(normalLiId)
    var badDomLi = document.getElementById(badLiId)
    goodDomLi.children[0].classList.remove('active')
    normalDomLi.children[0].classList.remove('active')
    badDomLi.children[0].classList.remove('active')

    var domLi = document.getElementById(liId)
    var classList = domLi.children[0].classList
    classList.add('active')
  }

  const judgeUserLoginStatus = () => {
    var userCookie = getCookie('user')
    if (userCookie != null && userCookie != undefined && userCookie != '') {
      var userInfoStr = decodeURIComponent(userCookie)
      // console.log(userInfoStr);
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
        <UserCenterNav router="comment" />
        <div className="main-wrap">
          <div className="user-comment">
            <div className="am-cf am-padding">
              <div className="am-fl am-cf">
                <strong className="am-text-danger am-text-lg">发表评论</strong><small>Make&nbsp;Comments</small>
              </div>
            </div>
            <hr />

            <div className="comment-main">
              <div className="comment-list">
                {orderItemList.map((orderItem, index) => (
                  <>
                    <div className="item-pic">
                      <a href="javascript:void(0);" className="J_MakePoint">
                        <img src={orderItem.itemImg} className="itempic" />
                      </a>
                    </div>

                    <div className="item-title">
                      <div className="item-name">
                        <a href="">
                          <p className="item-basic-info">
                            {orderItem.itemName}
                          </p>
                        </a>
                      </div>
                      <div className="item-info">
                        <div className="info-little">
                          <span>
                            规格：{orderItem.itemSpecName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="clear"></div>
                    <div className="item-comment">
                      <textarea
                        placeholder="您的评价将会对其他小伙伴们提供很大帮助哟~"
                        v-model="orderItem.content"
                      ></textarea>
                    </div>
                    <div className="item-opinion">
                      <li id={'good_'+orderItem.id} onClick={() => makeComment(orderItem.id, 1)}>
                        <i className="op1"></i>好评
                      </li>
                      <li id={'normal_'+orderItem.id} onClick={() => makeComment(orderItem.id, 2)}>
                        <i className="op2"></i>中评
                      </li>
                      <li id={'bad_'+orderItem.id} onClick={() => makeComment(orderItem.id, 3)}>
                        <i className="op3"></i>差评
                      </li>
                    </div>
                  </>
                ))}
              </div>

              <div className="info-btn">
                <div className="am-btn am-btn-danger" onClick={saveComments}>
                  发表评论
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DoComment
