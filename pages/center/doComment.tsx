import React, { useEffect, useState } from 'react'
import UserCenterNav from '../../components/UserCenterNav'
import HtmlHead from '../../components/HtmlHead'
import SearchArea from '../../components/SearchArea'
import { serverUrl, getCookie, getUrlParam } from '../../util/app'
import axios from 'axios'
import { message } from 'antd'
import { useSelector } from 'react-redux'
import styles from '../../static/styles/doComment.less'

const DoComment = () => {
  const [orderItemList, setOrderItemList] = useState([])
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [orderId, setOrderId] = useState('')

  const [level, setLevel] = useState(0)
  const [content, setContent] = useState("")
  const user = useSelector((store) => store.user)

  useEffect(() => {
    var orderId = getUrlParam('orderId')
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

  const makeCommentContent = (e, orderItemId) => {
    var tempOrderItemList = orderItemList
    for (var i = 0; i < tempOrderItemList.length; i++) {
      var tempId = tempOrderItemList[i].id
      if (tempId == orderItemId) {
        tempOrderItemList[i].content = e.target.value
      }
    }

    setOrderItemList(tempOrderItemList)
    setContent(orderItemId + e.target.value)
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
    setLevel(orderItemId + level)
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
      <HtmlHead title={'多米电商 - 个人中心'} />
      <SearchArea />
      <div className={`${styles.center} contentWidth`}>
        <UserCenterNav router="comment" />
        <div className={`${styles['main-wrap']}`}>
          <div className={`${styles['user-comment']}`}>
            <div className={`${styles['am-padding']}`}>
              <div className={`${styles['am-fl']}`}>
                <strong className={`${styles['am-text-danger']}`}>发表评论</strong> / <small>Make&nbsp;Comments</small>
              </div>
            </div>

            <div className={`${styles['comment-main']}`}>
              <div className={`${styles['comment-list']}`}>
                {orderItemList.map((orderItem, index) => (
                  <div className={`${styles['item']}`} key={index}>
                    <div className={`${styles['item-pic']}`}>
                      <a href="" className={`${styles['J_MakePoint']}`}>
                        <img
                          src={orderItem.itemImg}
                          className={`${styles['itempic']}`}
                        />
                      </a>
                    </div>

                    <div className={`${styles['item-title']}`}>
                      <div className={`${styles['item-name']}`}>
                        <a href="">
                          <p className={`${styles['item-basic-info']}`}>
                            {orderItem.itemName}
                          </p>
                        </a>
                      </div>
                      <div className={`${styles['item-info']}`}>
                        <div className={`${styles['info-little']}`}>
                          <span>规格：{orderItem.itemSpecName}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles['clear']}`}></div>
                    <div className={`${styles['item-comment']}`}>
                      <textarea
                        placeholder="您的评价将会对其他小伙伴们提供很大帮助哟~"
                        onChange={(e) => makeCommentContent(e, orderItem.id)}
                      ></textarea>
                    </div>
                    <div className={`${styles['item-opinion']}`}>
                      <li
                        id={'good_' + orderItem.id}
                        onClick={() => makeComment(orderItem.id, 1)}
                      >
                        <i className={orderItem.commentLevel == 1 ? `${styles['op1']} ${styles['active']}`: `${styles['op1']}`}></i>好评
                      </li>
                      <li
                        id={'normal_' + orderItem.id}
                        onClick={() => makeComment(orderItem.id, 2)}
                      >
                        <i className={orderItem.commentLevel == 2 ? `${styles['op2']} ${styles['active']}`: `${styles['op2']}`}></i>中评
                      </li>
                      <li
                        id={'bad_' + orderItem.id}
                        onClick={() => makeComment(orderItem.id, 3)}
                      >
                        <i className={orderItem.commentLevel == 3 ? `${styles['op3']} ${styles['active']}`: `${styles['op3']}`}></i>差评
                      </li>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`${styles['info-btn']}`}>
                <div
                  className={`${styles['am-btn-danger']}`}
                  onClick={saveComments}
                >
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
