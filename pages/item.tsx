import React, { useEffect, useState } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import { Tabs } from 'antd'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import BreadcrumbNav from '../components/BreadcrumbNav'
import ItemImgPreview from '../components/ItemPage/ItemImgPreview'
import ItemSpecification from '../components/ItemPage/ItemSpecification'
import ItemDetails from '../components/ItemPage/ItemDetails'
import ItemComment from '../components/ItemPage/ItemComment'
import axios from 'axios'
import {
  serverUrl,
  addItemToShopcart,
  getCookie,
  getShopcartItemCounts,
  ShopcartItem,
} from '../util/app'
import styles from '../static/styles/item.module.scss'
import { debug } from 'console'

interface Props extends SingletonRouter {
  itemInfo: any
}

const { TabPane } = Tabs

const Item = ({ itemInfo }: Props) => {
  console.log(itemInfo)

  const { item, itemParams, itemImgList, itemSpecList } = itemInfo
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [shopcartItemCounts, setShopcartItemCounts] = useState(0)

  useEffect(() => {
    // 通过cookie判断用户是否登录
    judgeUserLoginStatus()
  }, [item.id])

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

  const handleChange = (key) => {
    console.log(key)
  }

  const handleAddToCart = async (shopcartItem: ShopcartItem) => {
    // 由于cookie大小限制为4k，另外课程第一阶段是没有redis的，所以相关暂存性内容会存入到cookie中
    var shopcartCounts = getShopcartItemCounts()
    if (shopcartCounts >= 8) {
      alert('您购物车中的食物太多啦~请把它们带回家吧~！')
      return
    }

    console.log('Item adding to shopcart', shopcartItem)
    console.log('Item adding to shopcart', {...shopcartItem})
    shopcartItem.itemImgUrl = itemImgList[0].url

    // 添加商品至购物车list
    addItemToShopcart({...shopcartItem})

    // 购物车应该在登录/注册的时候同步

    // 判断当前用户是否登录，如果登录，则把购物车数据发送至后端（后端需要合并已存在的商品）
    if (userIsLogin) {
      axios.defaults.withCredentials = true
      const res = await axios.post(
        serverUrl + '/shopcart/add?userId=' + userInfo.id,
        shopcartItem,
        {
          headers: {
            headerUserId: userInfo.id,
            headerUserToken: userInfo.userUniqueToken,
          },
        }
      )

      if (res.data.status == 200) {
      } else if (res.data.status == 500) {
        alert(res.data.msg)
      }
    }

    alert('商品添加至购物车成功！')

    // 刷新购物车数量
    setShopcartItemCounts(getShopcartItemCounts())
  }

  return (
    <>
      <HtmlHead title={'商品详情'} />
      <SearchArea />
      <div className={`bw`}>
        <BreadcrumbNav showTotal={false} />
        <div className={`fcb contentWidth`}>
          <ItemImgPreview images={itemImgList} />
          <ItemSpecification
            item={item}
            specification={itemSpecList}
            addToCartCallback={handleAddToCart}
          />
        </div>
        <div className={`${styles.introduce} contentWidth`}>
          <Tabs defaultActiveKey="1" onChange={handleChange}>
            <TabPane tab="宝贝详情" key="1">
              <ItemDetails item={item} itemParams={itemParams} />
            </TabPane>
            <TabPane tab="全部评价" key="2">
              <ItemComment item={item} />
            </TabPane>
          </Tabs>
        </div>
      </div>
      <style jsx>
        {`
          :global(.introduce) {

          }
        `}
      </style>
    </>
  )
}

Item.getInitialProps = async ({ ctx }) => {
  const { itemId } = ctx.query
  // const itemId = 'cake-1001'

  let itemInfo
  const res = await axios.get(serverUrl + '/items/info/' + itemId, {})
  if (res.data.status == 200) {
    itemInfo = res.data.data

    // console.log(this.itemImgList);
  } else if (res.data.status == 500) {
    alert(res.data.msg)
  }

  return {
    itemInfo,
  }
}

export default withRouter(Item)
