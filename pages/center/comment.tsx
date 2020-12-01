import React, { useEffect, useState } from 'react'
import UserCenterNav from '../../components/UserCenterNav'
import HtmlHead from '../../components/HtmlHead'
import SearchArea from '../../components/SearchArea'
import { serverUrl, getCookie } from '../../util/app'
import axios from 'axios'
import styles from '../../static/styles/comment.module.scss'
import { message, Pagination } from 'antd'
import moment from 'moment'

const Comment = () => {
  const [myCommentList, setMyCommentList] = useState([])
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [maxPage, setMaxPage] = useState(1)
  const [total, setTotal] = useState(1)

  useEffect(() => {
    judgeUserLoginStatus()
  }, [])

  useEffect(() => {
    if (!userInfo) return
    renderMyCommentList(page, pageSize)
  }, [userInfo])

  const renderMyCommentList = async (page, pageSize) => {
    axios.defaults.withCredentials = true
    const res = await axios.post(
      serverUrl +
        '/mycomments/query?userId=' +
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
      var tempMyCommentList = grid.rows

      for (var i = 0; i < tempMyCommentList.length; i++) {
        var date = tempMyCommentList[i].createdTime
        var formatedTime = moment(date).format('YYYY年MM月DD日 h:mm:ss')
        tempMyCommentList[i].createdTime = formatedTime
      }

      setMyCommentList(tempMyCommentList)

      setMaxPage(grid.total) // 获得总页数
      setTotal(grid.records) // 获得总记录数
    } else if (res.data.status == 500) {
      message.error(res.data.msg)
    }
  }

  const doPaging = async (page) => {
    setPage(page)
    await renderMyCommentList(page, pageSize)
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
        <UserCenterNav router="comment" />
        <div className={`${styles['user-comment']}`}>
          <div className={`${styles['comment-main']}`}>
            <div className={`${styles['comment-list']}`}>
              <div className={`${styles['comment-top']}`}>
                <div className={`${styles['th']}`}>评价</div>
                <div className={`${styles['th']}`}>商品</div>
              </div>

              <ul className={`${styles['item-list']}`}>
                {myCommentList &&
                  myCommentList.map((comment, commentIndex) => (
                    <div key={commentIndex}>
                      <li className={`${styles['td']} ${styles['td-item']}`}>
                        <div className={`${styles['item-pic']}`}>
                          <a href="" className="J_MakePoint">
                            <img
                              src={comment.itemImg}
                              className={`${styles['itempic']}`}
                            />
                          </a>
                        </div>
                      </li>

                      <li className={`${styles['td']} ${styles['td-comment']}`}>
                        <div className={`${styles['item-title']}`}>
                          {/* <div className="item-opinion">好评</div> */}
                          <div className={`${styles['item-name']}`}>
                            <a href="">
                              <p className="item-basic-info">
                                {comment.itemName}
                              </p>
                            </a>
                          </div>
                        </div>
                        <div className={`${styles['item-comment']}`}>
                          {comment.content}
                        </div>

                        <div className={`${styles['item-info']}`}>
                          <div>
                            <p className={`${styles['info-little']}`}>
                              <span>规格：{comment.specName}</span>
                            </p>
                            <p className={`${styles['info-time']}`}>
                              {comment.createdTime}
                            </p>
                          </div>
                        </div>
                      </li>
                      <div
                        style={{ marginBottom: '12px', clear: 'both' }}
                      ></div>
                    </div>
                  ))}
              </ul>
            </div>
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
    </>
  )
}

export default Comment