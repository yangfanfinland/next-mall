import React, { useEffect, useState } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import BreadcrumbNav from '../components/BreadcrumbNav'
import FilterBar from '../components/FilterBar'
import GoodsList from '../components/GoodsList'
import { serverUrl, getCookie } from '../util/app'
import axios from 'axios'
import { message } from 'antd'

interface Props extends SingletonRouter {
  grid: any
  type: string
  categoryId: number
}

const catItems = ({ grid, type, categoryId }: Props) => {
  const [keywords, setKeywords] = useState(null)
  const [sort, setSort] = useState('k')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [maxPage, setMaxPage] = useState(grid.total)
  const [total, setTotal] = useState(grid.records)
  const [itemsList, setItemsList] = useState(grid.rows)
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [searchType, setSearchType] = useState(type)
  const [catId, setCatId] = useState(categoryId)
  const [shopcartItemCounts, setShopcartItemCounts] = useState(0)

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
      <HtmlHead title={'商品列表'} />
      <SearchArea />
      <BreadcrumbNav />
      <FilterBar onSort={chooseSort} />
      <GoodsList itemsList={itemsList} />
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
    type: searchType,
    categoryId: catId,
  }
}

export default withRouter(catItems)
