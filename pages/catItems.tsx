import React, { useEffect, useState } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import BreadcrumbNav from '../components/BreadcrumbNav'
import FilterBar from '../components/FilterBar'
import GoodsList from '../components/GoodsList'
import { getCategotyItemsApi, getSearchItemsApi } from '../api/api'
import { Pagination, message } from 'antd'
import { useSelector } from 'react-redux'
import styles from '../static/styles/catItems.less'

interface Props extends SingletonRouter {
  grid: any
  searchType: string
  catId: number
  pageSize: number
  keywords?: string
}

const catItems = ({ grid, searchType, catId, pageSize, keywords }: Props) => {
  const [sort, setSort] = useState('k')
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(grid.total)
  const [total, setTotal] = useState(grid.records)
  const [itemsList, setItemsList] = useState(grid.rows)
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const user = useSelector((store) => store.user)

  useEffect(() => {
    judgeUserLoginStatus()
  }, [])

  const searchInBackend = async (keywords, sort, page, pageSize) => {
    const res = await getSearchItemsApi(keywords, sort, page, pageSize)
    if (res.status == 200) {
      const grid = res.data
      setItemsList(grid.rows)
      setMaxPage(grid.total)
      setTotal(grid.records)
    } else if (res.status == 500) {
      message.error((res as any).msg)
      return
    }
  }

  const searchCatItemsInBackend = async (catId, sort, page, pageSize) => {
    const res = await getCategotyItemsApi(catId, sort, page, pageSize)
    if (res.status == 200) {
      const grid = res.data
      setItemsList(grid.rows)
      setMaxPage(grid.total)
      setTotal(grid.records)
    } else if (res.status == 500) {
      message.error((res as any).msg)
      return
    }
  }

  const chooseSort = async (sort) => {
    setSort(sort)

    if (searchType == 'searchItems') {
      if (keywords == null || keywords == undefined || keywords == '') {
        message.warning('Search keyword cannot be empty')
        return
      }
      await searchInBackend(keywords, sort, 1, 20)
    }
    if (searchType == 'catItems') {
      if (catId == null || catId == undefined) {
        message.warning('Category cannot be empty')
        return
      }
      await searchCatItemsInBackend(catId, sort, 1, 20)
    }
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

  const doPaging = async (page) => {
    setPage(page)

    if (searchType == 'searchItems') {
      await searchInBackend(keywords, sort, page, pageSize)
    }
    if (searchType == 'catItems') {
      await searchCatItemsInBackend(catId, sort, page, pageSize)
    }
  }

  return (
    <>
      <HtmlHead title={'Product list'} />
      <SearchArea keywords={keywords} />
      <BreadcrumbNav items={null} />
      <FilterBar onSort={chooseSort} />
      <GoodsList itemsList={itemsList} />
      <div className={`contentWidth ${styles.wrap}`}>
        <Pagination
          pageSize={pageSize}
          showQuickJumper
          defaultCurrent={1}
          total={total}
          onChange={doPaging}
        />
      </div>
    </>
  )
}

catItems.getInitialProps = async ({ ctx }) => {
  const {
    searchType,
    catId,
    sort = 'k',
    page = 1,
    pageSize = 20,
    keywords,
  } = ctx.query

  let grid, res
  if (searchType == 'catItems') {
    res = await getCategotyItemsApi(catId, sort, page, pageSize)
  }
  if (searchType == 'searchItems') {
    res = await getSearchItemsApi(keywords, sort, page, pageSize)
  }
  if (res.status == 200) {
    grid = res.data
  }

  return {
    grid,
    searchType: searchType,
    catId: catId,
    pageSize: pageSize,
    keywords: keywords,
  }
}

export default withRouter(catItems)
