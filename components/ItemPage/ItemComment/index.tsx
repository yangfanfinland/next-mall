import React, { useEffect, useState } from 'react'
import { Pagination, message } from "antd"
import styles from './index.less'
import { getCommentLevelApi, getCommentsApi } from "../../../api/api"
import moment from 'moment'

const ItemComment = ({ item }) => {
  const { id } = item

  const [level, setLevel] = useState("")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [maxPage, setMaxPage] = useState(1)
  const [total, setTotal] = useState(1)
  const [countsVO, setCountsVO] = useState<any>()
  const [commentList, setCommentList] = useState([])

  useEffect(() => {
    renderCommentLevelCounts(id)
    renderComments(id, level, page, pageSize)
  }, [id])

  const renderCommentsByLevel = async (level) => {
    setLevel(level)
    renderComments(id, level, 1, pageSize)
  }

  const renderCommentLevelCounts = async (itemId) => {
    let countsVO
    const res = await getCommentLevelApi(itemId)

    if (res.status == 200) {
      countsVO = res.data
      setCountsVO(countsVO)
    } else if (res.status == 500) {
      message.error((res as any).msg)
    }
  }

  const renderComments = async (itemId, level, page, pageSize) => {
    const res = await getCommentsApi(itemId, level, page, pageSize)

    if (res.status == 200) {
      const grid = res.data
      const commentList = grid.rows

      for (let i = 0; i < commentList.length; i++) {
        const date = commentList[i].createdTime
        const formatedTime = moment(date).format('YYYY年MM月DD日 h:mm:ss')
        commentList[i].createdTime = formatedTime
      }

      setCommentList(commentList)

      const maxPage = grid.total // 获得总页数
      const total = grid.records // 获得总记录数

      setMaxPage(maxPage)
      setTotal(total)
    } else if (res.status == 500) {
      message.error((res as any).msg)
    }
  }

  const doPaging = (page) => {
    setPage(page)
    renderComments(id, level, page, pageSize)
  }

  return (
    <div className="">
      {countsVO && (
        <div className={`${styles['comment-summary']}`}>
          <div className={`${styles.rate}`}>
            {countsVO.totalCounts === 0 && (
              <div>
                <strong>
                  100<span>%</span>
                </strong>
              </div>
            )}

            {countsVO.totalCounts > 0 && (
              <div>
                <strong>
                  {Math.round(
                    (countsVO.goodCounts / countsVO.totalCounts) * 100
                  )}
                  <span>%</span>
                </strong>
              </div>
            )}
            <br />
            <span>好评度</span>
          </div>
          <div className={`${styles['comment-counts']}`}>
            <div
              className="counts-words"
              onClick={() => renderCommentsByLevel('')}
            >
              全部评价（{countsVO.totalCounts}）
            </div>
            <div
              className="counts-words"
              onClick={() => renderCommentsByLevel(1)}
              style={{ marginLeft: '20px' }}
            >
              好评（{countsVO.goodCounts}）
            </div>
            <div
              className="counts-words"
              onClick={() => renderCommentsByLevel(2)}
              style={{ marginLeft: '20px' }}
            >
              中评（{countsVO.normalCounts}）
            </div>
            <div
              className="counts-words"
              onClick={() => renderCommentsByLevel(3)}
              style={{ marginLeft: '20px' }}
            >
              差评（{countsVO.badCounts}）
            </div>
          </div>
        </div>
      )}

      <ul className={`${styles['am-comments-list']}`}>
        {commentList.map((commentRecord, commentIndex) => (
          <li key={commentIndex} className={`${styles['am-comment']}`}>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <img className={`${styles['am-comment-avatar']}`} src={commentRecord.userFace} />
            </a>
            <div className={`${styles['am-comment-main']}`}>
              <header className={`${styles['am-comment-hd']}`}>
                <div className={`${styles['am-comment-meta']}`}>
                  <a href="#link-to-user" className={`${styles['am-comment-author']}`}>
                    {commentRecord.nickname} (匿名)
                  </a>
                  评论于
                  <time dateTime="">{commentRecord.createdTime}</time>
                </div>
              </header>

              <div className={`${styles['am-comment-bd']}`}>
                <div className="tb-rev-item" data-id="255776406962">
                  <div className="J_TbcRate_ReviewContent tb-tbcr-content">
                    {commentRecord.content}
                  </div>
                  <div className="tb-r-act-bar">
                    <span className="specName">
                      规格：{commentRecord.specName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className={`${styles.wrap}`}>
        <Pagination showQuickJumper defaultCurrent={1} total={total} onChange={doPaging} />
      </div>
    </div>
  )
}

export default ItemComment