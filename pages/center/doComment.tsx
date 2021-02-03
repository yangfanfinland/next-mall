import React, { useEffect, useState } from 'react'
import UserCenterNav from '../../components/UserCenterNav'
import HtmlHead from '../../components/HtmlHead'
import SearchArea from '../../components/SearchArea'
import { getUrlParam } from '../../util/app'
import { doCommentApi, saveCommentApi } from '../../api/api'
import { message } from 'antd'
import { useSelector } from 'react-redux'
import styles from '../../static/styles/doComment.less'

const DoComment = () => {
  const [orderItemList, setOrderItemList] = useState([])
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [orderId, setOrderId] = useState('')

  const [level, setLevel] = useState(0)
  const [content, setContent] = useState('')
  const user = useSelector((store) => store.user)

  useEffect(() => {
    const orderId = getUrlParam('orderId')
    setOrderId(orderId)
    judgeUserLoginStatus()
  }, [])

  useEffect(() => {
    if (!userInfo || !orderId) return
    renderItemComment(orderId)
  }, [userInfo, orderId])

  const renderItemComment = async (orderId) => {
    const res = await doCommentApi(userInfo.id, orderId, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      const tempOrderItemList = res.data

      for (let i = 0; i < tempOrderItemList.length; i++) {
        tempOrderItemList[i].commentLevel = 0
        tempOrderItemList[i].commentId = 0
      }

      setOrderItemList(tempOrderItemList)
    } else if (res.status == 500) {
      message.error((res as any).msg)
    }
  }

  const saveComments = async () => {
    // 判断每项元素是否有评论等级
    // 判断每项元素是否包含评论内容
    for (let i = 0; i < orderItemList.length; i++) {
      const tempItem = orderItemList[i]
      if (
        tempItem.commentLevel == '' ||
        tempItem.commentLevel == undefined ||
        tempItem.commentLevel == null
      ) {
        message.warning('A flower needed for evey product~')
        return
      }
      if (
        tempItem.content == '' ||
        tempItem.content == undefined ||
        tempItem.content == null
      ) {
        message.warning('A comment needed for every product~')
        return
      }
    }

    const res = await saveCommentApi(userInfo.id, orderId, orderItemList, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      message.success('Comment successfully!')
      window.location.href = '/center/order'
    } else if (res.status == 500) {
      message.error((res as any).msg)
    }
  }

  const makeCommentContent = (e, orderItemId) => {
    let tempOrderItemList = orderItemList
    for (let i = 0; i < tempOrderItemList.length; i++) {
      const tempId = tempOrderItemList[i].id
      if (tempId == orderItemId) {
        tempOrderItemList[i].content = e.target.value
      }
    }

    setOrderItemList(tempOrderItemList)
    setContent(orderItemId + e.target.value)
  }

  const makeComment = (orderItemId, level) => {
    let tempOrderItemList = orderItemList
    for (let i = 0; i < tempOrderItemList.length; i++) {
      const tempId = tempOrderItemList[i].id
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
      <HtmlHead title={'Foodie - Personal center'} />
      <SearchArea />
      <div className={`${styles.center} contentWidth`}>
        <UserCenterNav router="comment" />
        <div className={`${styles['main-wrap']}`}>
          <div className={`${styles['user-comment']}`}>
            <div className={`${styles['am-padding']}`}>
              <div className={`${styles['am-fl']}`}>
                <strong className={`${styles['am-text-danger']}`}>
                  Post comment
                </strong>{' '}
                / <small>Make&nbsp;Comments</small>
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
                          <span>Specification: {orderItem.itemSpecName}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`${styles['clear']}`}></div>
                    <div className={`${styles['item-comment']}`}>
                      <textarea
                        placeholder="Your comment will help others a lot~"
                        onChange={(e) => makeCommentContent(e, orderItem.id)}
                      ></textarea>
                    </div>
                    <div className={`${styles['item-opinion']}`}>
                      <li
                        id={'good_' + orderItem.id}
                        onClick={() => makeComment(orderItem.id, 1)}
                      >
                        <i
                          className={
                            orderItem.commentLevel == 1
                              ? `${styles['op1']} ${styles['active']}`
                              : `${styles['op1']}`
                          }
                        ></i>
                        Positive
                      </li>
                      <li
                        id={'normal_' + orderItem.id}
                        onClick={() => makeComment(orderItem.id, 2)}
                      >
                        <i
                          className={
                            orderItem.commentLevel == 2
                              ? `${styles['op2']} ${styles['active']}`
                              : `${styles['op2']}`
                          }
                        ></i>
                        Average
                      </li>
                      <li
                        id={'bad_' + orderItem.id}
                        onClick={() => makeComment(orderItem.id, 3)}
                      >
                        <i
                          className={
                            orderItem.commentLevel == 3
                              ? `${styles['op3']} ${styles['active']}`
                              : `${styles['op3']}`
                          }
                        ></i>
                        Negative
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
                  Post comment
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
