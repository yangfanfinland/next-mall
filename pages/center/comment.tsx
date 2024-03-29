import React, { useEffect, useState } from 'react'
import UserCenterNav from '../../components/UserCenterNav'
import HtmlHead from '../../components/HtmlHead'
import SearchArea from '../../components/SearchArea'
import { getMyCommentListApi } from '../../api/api'
import styles from '../../static/styles/comment.less'
import { message, Pagination } from 'antd'
import { useSelector } from 'react-redux'
import moment from 'moment'

const Comment = () => {
  const [myCommentList, setMyCommentList] = useState([])
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [maxPage, setMaxPage] = useState(1)
  const [total, setTotal] = useState(1)
  const user = useSelector((store) => store.user)

  useEffect(() => {
    judgeUserLoginStatus()
  }, [])

  useEffect(() => {
    if (!userInfo) return
    renderMyCommentList(page, pageSize)
  }, [userInfo])

  const renderMyCommentList = async (page, pageSize) => {
    const res = await getMyCommentListApi(userInfo.id, page, pageSize, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      const grid = res.data
      let tempMyCommentList = grid.rows

      for (let i = 0; i < tempMyCommentList.length; i++) {
        const date = tempMyCommentList[i].createdTime
        const formatedTime = moment(date).format('YYYY-MM-DD h:mm:ss')
        tempMyCommentList[i].createdTime = formatedTime
      }

      setMyCommentList(tempMyCommentList)

      setMaxPage(grid.total) // 获得总页数
      setTotal(grid.records) // 获得总记录数
    } else if (res.status == 500) {
      message.error((res as any).msg)
    }
  }

  const doPaging = async (page) => {
    setPage(page)
    await renderMyCommentList(page, pageSize)
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
        <div className={`${styles['user-comment']}`}>
          <div className={`${styles['comment-main']}`}>
            <div className={`${styles['comment-list']}`}>
              <div className={`${styles['comment-top']}`}>
                <div className={`${styles['th']}`}>Comment</div>
                <div className={`${styles['th']}`}>Product</div>
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
                              <span>Specification: {comment.specName}</span>
                            </p>
                            <p className={`${styles['info-time']}`}>
                              {comment.createdTime}
                            </p>
                          </div>
                        </div>
                      </li>
                      <div className={styles.clear}
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
