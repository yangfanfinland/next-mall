import React, { useEffect, useState } from 'react'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import BreadcrumbNav from '../components/BreadcrumbNav'
import FilterBar from '../components/FilterBar'
import GoodsList from '../components/GoodsList'
import {
  serverUrl,
  getCookie,
  getUrlParam,
  getShopcartItemCounts,
} from '../util/app'
import axios from 'axios'
import { message } from 'antd'

const catItems = () => {
  const [keywords, setKeywords] = useState(null)
  const [sort, setSort] = useState('k')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [maxPage, setMaxPage] = useState(1)
  const [total, setTotal] = useState(1)
  const [itemsList, setItemsList] = useState([])
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [searchType, setSearchType] = useState(null)
  const [catId, setCatId] = useState(0)
  const [shopcartItemCounts, setShopcartItemCounts] = useState(0)

  useEffect(() => {
    judgeUserLoginStatus()
    var page = getUrlParam('page')
    if (page == null || page == undefined || page == '') {
      setPage(1)
    } else {
      setPage(parseInt(page))
    }

    var pageSize = getUrlParam('pageSize')
    if (pageSize == null || pageSize == undefined || pageSize == '') {
      setPageSize(20)
    } else {
      setPageSize(parseInt(pageSize))
    }

    var searchType = getUrlParam('searchType')
    if (searchType == null || searchType == undefined || searchType == '') {
      return false
    } else if (searchType == 'searchItems') {
      setSearchType(searchType)

      var keywords = getUrlParam('keywords')
      if (keywords == null || keywords == undefined || keywords == '') {
        return
      }
      setKeywords(keywords)

      searchInBackend(keywords, 'k', 1, 20)
    } else if (searchType == 'catItems') {
      setSearchType(searchType)
      // 从别的页面来的搜索
      var catId = getUrlParam('catId')
      if (catId == null || catId == undefined || catId == '') {
        setCatId(0)
      } else {
        setCatId(parseInt(catId))
      }
    }

    // 从购物车中拿到商品的数量
    setShopcartItemCounts(getShopcartItemCounts())
  }, [])

  useEffect(() => {
    if (catId == 0) {
      return
    }
    searchCatItemsInBackend(catId, 'k', page, pageSize)
  }, [catId, page, pageSize])

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
    await axios
      .get(
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

export default catItems
