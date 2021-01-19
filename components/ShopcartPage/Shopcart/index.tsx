import React, { useEffect, useState } from 'react'
import { Checkbox, message } from 'antd'
import InputBuyNumber from '../../InputBuyNumber'
import {
  setCookie,
  deleteCookie,
  getShopcartList,
  ShopcartItem,
  addItemToShopcart,
} from '../../../util/app'
import { deleteFromShopcart, refreshShopcart } from '../../../api/api'
import { useSelector } from 'react-redux'
import styles from './index.less'

const Shopcart = () => {
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [shopcartList, setShopcartList] = useState([])
  const [specIds, setSpecIds] = useState([])
  const [allSelectedCounts, setAllSelectedCounts] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const user = useSelector((store) => store.user)

  useEffect(() => {
    judgeUserLoginStatus()
    renderShopcart()
  }, [])

  useEffect(() => {
    reCalItemsCountsAndAmount()
  }, [specIds])

  const judgeUserLoginStatus = () => {
    if (user && user.id) {
      setUserIsLogin(true)
      setUserInfo(user)
    } else {
      setUserIsLogin(false)
      setUserInfo({})
    }
  }

  const renderShopcart = async () => {
    let shopcartList = getShopcartList()

    if (shopcartList.length <= 0) {
      return
    }

    // 刷新购物车中价格，以防长时间未登录网址，价格发生变动
    // 拼接规格ids
    let itemSpecIds = ''
    for (let i = 0; i < shopcartList.length; i++) {
      let tmpSpecId = shopcartList[i].specId
      itemSpecIds += tmpSpecId
      if (i < shopcartList.length - 1) {
        itemSpecIds += ','
      }
    }
    // 1001，2002，3003，4004

    // 请求后端获得最新数据
    const res = await refreshShopcart(itemSpecIds)

    if (res.status == 200) {
      const newItemList = res.data
      // 删除现有购物车cookie
      deleteCookie('shopcart')
      // 拿到最新商品数据以后，重新组合成购物车数据
      for (let i = 0; i < newItemList.length; i++) {
        const tmpNewItem = newItemList[i]
        const tmpNewItemSpecId = tmpNewItem.specId
        const buyCounts = getBuyCountsFromCookieShopcartList(
          shopcartList,
          tmpNewItemSpecId
        )

        // 构建购物车商品对象
        const shopcartItem = new ShopcartItem(
          tmpNewItem.itemId,
          tmpNewItem.itemImgUrl,
          tmpNewItem.itemName,
          tmpNewItem.specId,
          tmpNewItem.specName,
          buyCounts,
          tmpNewItem.priceDiscount,
          tmpNewItem.priceNormal
        )
        // 添加商品至购物车list
        addItemToShopcart(shopcartItem)
      }
      // 重新获取cookie中的商品list渲染到页面
      shopcartList = getShopcartList()
      setShopcartList(shopcartList)
    } else if (res.status == 500) {
      message.error((res as any).msg)
    }
  }

  const getBuyCountsFromCookieShopcartList = (shopcartList, specId) => {
    for (let i = 0; i < shopcartList.length; i++) {
      const tmpSpecId = shopcartList[i].specId
      if (tmpSpecId == specId) {
        return shopcartList[i].buyCounts
      }
    }
  }

  // 从购物车中删除商品
  const delFromCart = async (specId) => {
    const bool = window.confirm('确认从购物车中移除该商品吗？')
    if (!bool) {
      return
    }

    // 删除cookie中的商品
    let shopcartList = getShopcartList()
    for (let i = 0; i < shopcartList.length; i++) {
      const tmpItem = shopcartList[i]
      if (tmpItem.specId == specId) {
        shopcartList.splice(i, 1)
        break
      }
    }
    // 重新放入cookie，更新一下
    setCookie('shopcart', JSON.stringify(shopcartList))
    setShopcartList(shopcartList)

    // 清除选中项
    const clonedSpecIds = [...specIds]
    for (let i = 0; i < specIds.length; i++) {
      const tmpSpecId = specIds[i]
      if (specId == tmpSpecId) {
        setSpecIds(clonedSpecIds.splice(i, 1))
      }
    }

    // 如果用户是已经登录状态，需要再把redis中的购物车商品删除
    if (userIsLogin) {
      const res = await deleteFromShopcart(userInfo.id, specId, {
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
  }

  // 重新计算购物车中选中的件数以及总价格
  const reCalItemsCountsAndAmount = () => {
    if (specIds.length == 0) {
      setAllSelectedCounts(0)
      setTotalAmount(0)
    } else {
      // 把specIds和cookie中的购物车进行对比
      setAllSelectedCounts(specIds.length)

      const shopcartList = getShopcartList()

      let totalAmount = 0
      for (let i = 0; i < shopcartList.length; i++) {
        const tmpItem = shopcartList[i]

        for (let j = 0; j < specIds.length; j++) {
          const selectSpecId = specIds[j]
          if (tmpItem.specId == selectSpecId) {
            totalAmount += tmpItem.priceDiscount * tmpItem.buyCounts
          }
        }
      }
      setTotalAmount(totalAmount)
    }
  }

  const handleSpecChanged = (specId) => {
    const clonedSpecIds = [...specIds]
    if (clonedSpecIds.indexOf(specId) > -1) {
      setSpecIds(clonedSpecIds.filter((id) => id != specId))
    } else {
      clonedSpecIds.push(specId)
      setSpecIds(clonedSpecIds)
    }
  }

  // 全选与反选
  const checkedAll = () => {
    if (specIds.length === shopcartList.length) {
      //实现反选
      setSpecIds([])
    } else {
      //实现全选
      let tempSpecIds = []
      shopcartList.forEach(function (item, index) {
        tempSpecIds.push(item.specId)
      })
      setSpecIds(tempSpecIds)
    }
  }

  const goPay = () => {
    // href={'/submitOrder'}
    const shopcartList = getShopcartList()
    if (shopcartList.length <= 0) {
      message.info('购物车中没有商品，无法结算')
      return
    }

    if (specIds.length <= 0) {
      message.info('请至少在购物车中选择一个商品后再结算')
      return
    }

    // 判断是否登录
    if (userIsLogin) {
      const specIdsStr = specIds.toString()
      window.location.href = 'submitOrder?selectedItemSpecIds=' + specIdsStr
    } else {
      const bool = window.confirm('请登录/注册后再进行结算操作噢~！')
      if (!bool) {
        return
      } else {
        goLogin()
      }
    }
  }

  const goLogin = () => {
    window.location.href = 'user/login?returnUrl=shopcart'
  }

  const handleBuyNumberChange = (specId, value) => {
    const shopcartList = getShopcartList()
    for (let i = 0; i < shopcartList.length; i++) {
      const tmpItem = shopcartList[i]
      if (tmpItem.specId == specId) {
        tmpItem.buyCounts = value
        break
      }
    }
    // 重新放入cookie，更新一下
    setCookie('shopcart', JSON.stringify(shopcartList))
    setShopcartList(shopcartList)
    reCalItemsCountsAndAmount()
  }

  return (
    <div className={`bw`}>
      <div className={`${styles.carListPage} contentWidth`}>
        <div className={`${styles.title} fcb`}>
          <span className={`fl`}>我的购物车 {shopcartList.length}</span>
          <a className={`fr`} href="">
            清空购物车
          </a>
        </div>
        <div className={`${styles.header} fcb`}>
          <span className={styles.goodsInfo}>商品信息</span>
          <span className={styles.price}>单价(元)</span>
          <span className={styles.num}>数量</span>
          <span className={styles.money}>金额(元)</span>
          <span className={styles.action}>操作</span>
        </div>
        <ul className={styles.goodsList}>
          <Checkbox.Group value={specIds}>
            {shopcartList &&
              shopcartList.map((cartItem, sidx) => (
                <li key={sidx} className={`${styles.item} fcb`}>
                  <div className={`fl`}>
                    <Checkbox
                      onChange={() => handleSpecChanged(cartItem.specId)}
                      value={cartItem.specId}
                    ></Checkbox>
                  </div>
                  <div className={`${styles.goodsImg} fl`}>
                    <img src={cartItem.itemImgUrl} alt="" />
                  </div>
                  <div className={`${styles.goodsDesc} fl`}>
                    <p className={`${styles.name}`}>{cartItem.itemName}</p>
                    <p className={`${styles.color}`}>
                      规格：{cartItem.specName}
                    </p>
                  </div>
                  <div className={`${styles.goodsPrice} fl`}>
                    {cartItem.priceNormal / 100}
                  </div>
                  <div className={`${styles.goodsNum} fl`}>
                    <InputBuyNumber
                      defaultValue={cartItem.buyCounts}
                      onChange={(value) =>
                        handleBuyNumberChange(cartItem.specId, value)
                      }
                    />
                  </div>
                  <div className={`${styles.goodsSale} fl`}>
                    {(cartItem.priceDiscount / 100) * cartItem.buyCounts}
                  </div>
                  <div className={`${styles.goodsAction} fl`}>
                    <a onClick={() => delFromCart(cartItem.specId)}>删除</a>
                  </div>
                </li>
              ))}
          </Checkbox.Group>
        </ul>

        <div className={`${styles.buyBottom} fcb`}>
          <div className={'fl'}>
            <Checkbox onChange={checkedAll}>全选</Checkbox>
          </div>
          <div className={`${styles.right} fr fcb`}>
            <p className={`${styles.choseGoods} fl`}>
              已选商品{' '}
              <span className={styles.choseRed}>{allSelectedCounts}</span> 件{' '}
            </p>
            <div className={`fl`}>
              <div className={`${styles.choseGoods}`}>
                合计（不含运费）
                <span className={`${styles.choseRed}`}>
                  {totalAmount / 100}
                </span>
              </div>
              <div className={`${styles.rate}`}>商品税费： ¥0</div>
            </div>
            <a className={`${styles.buyBtn} fr`} onClick={goPay}>
              结算
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shopcart
