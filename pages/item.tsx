import React, { useEffect, useState } from 'react'
import { withRouter, SingletonRouter } from 'next/router'
import { Tabs, message } from 'antd'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import BreadcrumbNav from '../components/BreadcrumbNav'
import ItemImgPreview from '../components/ItemPage/ItemImgPreview'
import ItemSpecification from '../components/ItemPage/ItemSpecification'
import ItemDetails from '../components/ItemPage/ItemDetails'
import ItemComment from '../components/ItemPage/ItemComment'
import { useSelector } from 'react-redux'
import {
  addItemToShopcart,
  getShopcartItemCounts,
  ShopcartItem,
} from '../util/app'
import { getItemInfoApi, addToShopcartApi } from '../api/api'
import styles from '../static/styles/item.less'

interface Props extends SingletonRouter {
  itemInfo: any
}

const { TabPane } = Tabs

const Item = ({ itemInfo }: Props) => {
  console.log(itemInfo)
  const {
    item,
    itemParams,
    itemImgList,
    itemSpecList,
    parentCatList,
  } = itemInfo
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [shopcartItemCounts, setShopcartItemCounts] = useState(0)
  const user = useSelector((store) => store.user)

  useEffect(() => {
    judgeUserLoginStatus()
  }, [item.id])

  const judgeUserLoginStatus = () => {
    if (user && user.id) {
      setUserIsLogin(true)
      setUserInfo(user)
    } else {
      setUserIsLogin(false)
      setUserInfo({})
    }
  }

  const handleChange = (key) => {
    console.log(key)
  }

  const handleAddToCart = async (shopcartItem: ShopcartItem) => {
    const shopcartCounts = getShopcartItemCounts()
    if (shopcartCounts >= 8) {
      message.info('您购物车中的食物太多啦~请把它们带回家吧~！')
      return
    }
    shopcartItem.itemImgUrl = itemImgList[0].url

    // Add products to shopping cart list
    addItemToShopcart({ ...shopcartItem })

    // 购物车应该在登录/注册的时候同步
    // 判断当前用户是否登录，如果登录，则把购物车数据发送至后端（后端需要合并已存在的商品）
    if (userIsLogin) {
      const res = await addToShopcartApi(userInfo.id, shopcartItem, {
        headers: {
          headerUserId: userInfo.id,
          headerUserToken: userInfo.userUniqueToken,
        },
      })

      if (res.status == 200) {
      } else if (res.status == 500) {
        message.error((res as any).msg)
      }
    }

    message.success('商品添加至购物车成功！')

    // 刷新购物车数量
    setShopcartItemCounts(getShopcartItemCounts())
  }

  return (
    <>
      <HtmlHead title={'商品详情'} />
      <SearchArea />
      <div className={`bw`}>
        <BreadcrumbNav showTotal={false} items={parentCatList} item={item} />
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

  let itemInfo
  const res = await getItemInfoApi(itemId)
  if (res.status == 200) {
    itemInfo = res.data
  } else if (res.status == 500) {
    message.error((res as any).msg)
  }

  return {
    itemInfo,
  }
}

export default withRouter(Item)
