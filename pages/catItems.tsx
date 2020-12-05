import React, { useEffect, useState } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import BreadcrumbNav from '../components/BreadcrumbNav'
import FilterBar from '../components/FilterBar'
import GoodsList from '../components/GoodsList'
import { serverUrl, getCookie } from '../util/app'
import axios from 'axios'
import { Pagination, message } from 'antd'
import { useSelector } from 'react-redux'
import styles from '../static/styles/catItems.module.scss'

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
    axios.defaults.withCredentials = true
    await axios
      .get(
        serverUrl +
          '/items/search?keywords=' +
          keywords +
          '&sort=' +
          sort +
          '&page=' +
          page +
          '&pageSize=' +
          pageSize,
        {}
      )
      .then((res) => {
        if (res.data.status == 200) {
          var grid = res.data.data
          setItemsList(grid.rows)
          setMaxPage(grid.total)
          setTotal(grid.records)
        } else if (res.data.status == 500) {
          message.error(res.data.msg)
          return
        }
      })
  }

  const searchCatItemsInBackend = async (catId, sort, page, pageSize) => {
    axios.defaults.withCredentials = true
    const res = await axios.get(
      serverUrl +
        '/items/catItems?catId=' +
        catId +
        '&sort=' +
        sort +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize,
      {}
    )

    if (res.data.status == 200) {
      var grid = res.data.data
      setItemsList(grid.rows)
      setMaxPage(grid.total)
      setTotal(grid.records)
    } else if (res.data.status == 500) {
      message.error(res.data.msg)
      return
    }
  }

  const chooseSort = async (sort) => {
    setSort(sort)

    if (searchType == 'searchItems') {
      if (keywords == null || keywords == undefined || keywords == '') {
        message.warning('搜索内容不能为空')
        return
      }
      await searchInBackend(keywords, sort, 1, 20)
    } else if (searchType == 'catItems') {
      if (catId == null || catId == undefined) {
        message.warning('分类不能为空')
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
    } else if (searchType == 'catItems') {
      await searchCatItemsInBackend(catId, sort, page, pageSize)
    }
  }

  return (
    <>
      <HtmlHead title={'商品列表'} />
      <SearchArea keywords={keywords} />
      <BreadcrumbNav />
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

  let grid, url
  axios.defaults.withCredentials = true
  if (searchType == 'catItems') {
    url =
      serverUrl +
      '/items/' +
      searchType +
      '?catId=' +
      catId +
      '&sort=' +
      sort +
      '&page=' +
      page +
      '&pageSize=' +
      pageSize
  }
  if (searchType == 'searchItems') {
    url =
      serverUrl +
      '/items/search?keywords=' +
      encodeURIComponent(keywords) +
      '&sort=' +
      sort +
      '&page=' +
      page +
      '&pageSize=' +
      pageSize
  }
  const res = await axios.get(url, {})
  if (res.data.status == 200) {
    grid = res.data.data
  }
  return {
    grid,
    searchType: searchType,
    catId: catId,
	pageSize: pageSize,
	keywords: keywords
  }
}

export default withRouter(catItems)
