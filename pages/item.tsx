import React, { useEffect, useState } from 'react'
import { serverUrl, getShopcartItemCounts, addItemToShopcart, ShopcartItem, getCookie, getUrlParam } from '../util/app'
import axios from 'axios'
import moment from 'moment'
import Router, { withRouter } from 'next/router'

type itemParams = {
  producPlace: string
  brand: string
  factoryName: string
  factoryAddress: string
  packagingMethod: string
  footPeriod: string
  weight: number
  storageMethod: string
  eatMethod: string
}

const Item = ({ itemInfo, countsVO }: { itemInfo: any, countsVO: any }) => {
  const [level, setLevel] = useState('')
  const [itemId, setItemId] = useState('')
  const [pageSize, setPageSize] = useState(0)
  const [page, setPage] = useState(0)
  const [commentList, setCommentList] = useState([])
  const [maxPage, setMaxPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [item, setItem] = useState<any>({})
  const [itemSpecList, setItemSpecList] = useState([])
  const [selectedSku, setSelectedSku] = useState<any>({})
  const [buyCounts, setBuyCounts] = useState<any>()
  const [shopcartItemCounts, setShopcartItemCounts] = useState(0)
  const [itemImgList, setItemImgList] = useState<any>()
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()

  useEffect(() => {
    // 通过cookie判断用户是否登录
    judgeUserLoginStatus()

    // 渲染商品信息
    var itemId = getUrlParam('itemId')
    // 如果itemId为空，跳转到错误页面
    if (itemId == null || itemId == undefined || itemId == '') {
    window.location.href = 'http://www.imooc.com/error/noexists'
    return
    }
    setItemId(itemId)
    renderItemInfo(itemId)

    // 从购物车中拿到商品的数量
    setShopcartItemCounts(getShopcartItemCounts())

    // 渲染商品评价列表内容
    renderComments(itemId, level, page, pageSize)
  }, [])

  const renderItemInfo = (itemId) => {
    var item = itemInfo.item
    // 如果item为空，则商品不存在，跳转错误页面
    if (item == null || item == undefined || item == '') {
        window.location.href = 'http://www.imooc.com/error/noexists'
    }

    // console.log(itemInfo);
    setItem(item)

    // 商品图片放大镜效果实现
    var itemImgListTemp = itemInfo.itemImgList
    renderZoomItemImgs(itemImgListTemp)

    // 商品规格实现
    var itemSpecListTemp = itemInfo.itemSpecList
    setItemSpecList(itemSpecListTemp)
    var selectedSku = itemSpecListTemp[0]
    setSelectedSku(selectedSku)
  }

  // 商品图片放大镜效果实现
  const renderZoomItemImgs = (itemImgListTemp) => {
    // 循环图片，把头图放在第一张
    for (var i = 0; i < itemImgListTemp.length; i++) {
      var tempImg = itemImgListTemp[i]
      var isMain = tempImg.isMain
      if (isMain == 1) {
        // 删除主图在数组中的位置
        itemImgListTemp.splice(i, 1)
        // 把主图插入到第一个元素
        itemImgListTemp.unshift(tempImg)
      }
    }
    setItemImgList(itemImgListTemp)

    // 循环图片，渲染放大镜商品图
    var zoomBoxHtml = ''
    var mainItemImg = itemImgListTemp[0]
    zoomBoxHtml +=
      '' +
      '<div class="tb-booth tb-pic tb-s310">' +
      '<img src="' +
      mainItemImg.url +
      '" alt="细节展示放大镜特效" rel="' +
      mainItemImg.url +
      '" class="jqzoom" />' +
      '</div>'
    zoomBoxHtml += '<ul class="tb-thumb" id="thumblist">'
    for (var i = 0; i < itemImgListTemp.length; i++) {
      var tempImg = itemImgListTemp[i]

      if (i == 0) {
        zoomBoxHtml += '<li class="tb-selected">'
      } else {
        zoomBoxHtml += '<li>'
      }
      zoomBoxHtml +=
        '<div class="tb-pic tb-s40">' +
        '<a href="javascript:return;"><img src="' +
        tempImg.url +
        '" mid="' +
        tempImg.url +
        '" big="' +
        tempImg.url +
        '"></a>' +
        '</div>' +
        '</li>'
    }
    zoomBoxHtml += '</ul>'

    var $zoomBox = $('#zoomBox')
    $zoomBox.html(zoomBoxHtml)

    $('.jqzoom').imagezoom()
    $('#thumblist li a').click(function () {
      $(this)
        .parents('li')
        .addClass('tb-selected')
        .siblings()
        .removeClass('tb-selected')
      $('.jqzoom').attr('src', $(this).find('img').attr('mid'))
      $('.jqzoom').attr('rel', $(this).find('img').attr('big'))
    })
  }

  const renderCommentsByLevel = (level) => {
    console.log(level)
    setLevel(level)
    renderComments(itemId, level, 1, pageSize)
  }

  const judgeUserLoginStatus = () => {
    var userCookie = getCookie('user')
    if (
      userCookie != null &&
      userCookie != undefined &&
      userCookie != ''
    ) {
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

  const selectSku = (arrIndex) => {
    var selectedSku = itemSpecList[arrIndex]
    setSelectedSku(selectedSku)
  }

  const minus = () => {
    var tmpCounts = parseInt(buyCounts) - 1
    if (tmpCounts <= 0) {
        tmpCounts = 1
    }
    setBuyCounts(tmpCounts)
  }

  const plus = () => {
    var tmpCounts = parseInt(buyCounts) + 1
    if (tmpCounts >= 100) {
      tmpCounts = 99
    }
    setBuyCounts(tmpCounts)
  }

  const addToCart = async (e: Event) => {
      e.preventDefault()
      // 由于cookie大小限制为4k，另外课程第一阶段是没有redis的，所以相关暂存性内容会存入到cookie中
      var shopcartCounts = getShopcartItemCounts()
      if (shopcartCounts >= 8) {
        alert('您购物车中的食物太多啦~请把它们带回家吧~！')
        return
      }

      // 创建购物车对象

      var tmpBuyCounts = buyCounts
      tmpBuyCounts = parseInt(tmpBuyCounts)
      if (typeof tmpBuyCounts != 'number') {
        alert('购买数量不能为非数字！')
        // tmpBuyCounts = 1;
        setBuyCounts(1)
        return
      }

      // 构建购物车商品对象
      var shopcartItem = new ShopcartItem(
        item.id,
        itemImgList[0].url,
        item.itemName,
        selectedSku.id,
        selectedSku.name,
        tmpBuyCounts,
        selectedSku.priceDiscount,
        selectedSku.priceNormal
      )
      // console.log(shopcartItem);
      // 添加商品至购物车list
      addItemToShopcart(shopcartItem)

      // 购物车应该在登录/注册的时候同步

      // 判断当前用户是否登录，如果登录，则把购物车数据发送至后端（后端需要合并已存在的商品）
      if (userIsLogin) {
        axios.defaults.withCredentials = true
        const res = await axios
          .post(
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

  const renderComments = async (itemId, level, page, pageSize) => {
    axios.defaults.withCredentials = true
    const res = await axios.get(
      serverUrl +
        '/items/comments?itemId=' +
        itemId +
        '&level=' +
        level +
        '&page=' +
        page +
        '&pageSize=' +
        pageSize,
      {}
    )

    if (res.data.status == 200) {
      var grid = res.data.data
      var commentList = grid.rows
      setCommentList(commentList)

      for (var i = 0; i < commentList.length; i++) {
        var date = commentList[i].createdTime
        var formatedTime = moment(date).format('YYYY年MM月DD日 h:mm:ss')
        commentList[i].createdTime = formatedTime
      }

      var maxPage = grid.total // 获得总页数
      var total = grid.records // 获得总记录数

      setMaxPage(maxPage)
      setTotal(total)
    } else if (res.data.status == 500) {
      alert(res.data.msg)
    }
  }

  return (
    <div className="listMain">
      <div className="nav-table">
        <div className="long-title">
          <span className="all-goods">商品详情</span>
        </div>
      </div>
      <ol className="am-breadcrumb am-breadcrumb-slash">
        <li>
          <a href="#">首页</a>
        </li>
        <li>
          <a href="#">分类</a>
        </li>
        <li className="am-active">商品</li>
      </ol>
      <div className="item-inform">
        <div className="clearfixLeft" id="clearcontent">
          <div className="box" id="zoomBox"></div>
          <div className="clear"></div>
        </div>

        <div className="clearfixRight">
          <div className="tb-detail-hd">
            <h1>{item.itemName}</h1>
          </div>
          <div className="tb-detail-list">
            <div className="tb-detail-price" style={{height: "140px"}}>
              <li className="price iteminfo_price">
                <dt>促销价</dt>
                <dd>
                  <em>¥</em>
                  <b className="sys_item_price">
                    {selectedSku.priceDiscount / 100}
                  </b>
                </dd>
              </li>
              <li className="price iteminfo_mktprice">
                <dt>原价</dt>
                <dd>
                  <em>¥</em>
                  <b className="sys_item_mktprice">
                    {selectedSku.priceNormal / 100}
                  </b>
                </dd>
              </li>
              <li className="price iteminfo_mktprice">
                <dt>累计销售</dt>
                <dd>
                  <b className="">{item.sellCounts}</b>
                </dd>
              </li>
              <div className="clear"></div>
            </div>

            <div className="clear"></div>

            <dl className="iteminfo_parameter sys_item_specpara">
              <dt className="theme-login">
                <div className="cart-title">
                  可选规格<span className="am-icon-angle-right"></span>
                </div>
              </dt>
              <dd>
                <div className="theme-popover-mask"></div>
                <div className="theme-popover">
                  <div className="theme-span"></div>
                  <div className="theme-popbod dform">
                    <form
                      className="theme-signin"
                      name="loginform"
                      action=""
                      method="post"
                    >
                      <div className="theme-signin-left">
                        <div className="theme-options">
                          <div className="cart-title">口味</div>
                          <ul>
                            {itemSpecList &&
                              itemSpecList.map((spec, specIdx) => (
                                <li key={specIdx}
                                  onClick={() => selectSku(specIdx)}
                                  className={
                                    selectedSku.id == spec.id
                                      ? 'sku-line selected'
                                      : 'sku-line'
                                  }
                                >
                                  {spec.name}
                                  <i></i>
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div className="theme-options">
                          <div className="cart-title number">数量</div>
                          <dd>
                            <input
                              id="min"
                              className="am-btn am-btn-default"
                              name=""
                              type="button"
                              value="-"
                              onClick={minus}
                            />
                            <input
                              id="text_box"
                              name=""
                              type="text"
                              v-model="buyCounts"
                              style={{ width: '30px' }}
                            />
                            <input
                              id="add"
                              className="am-btn am-btn-default"
                              name=""
                              type="button"
                              value="+"
                              onClick={plus}
                            />
                            <span id="Stock" className="tb-hidden">
                              库存
                              <span className="stock">{selectedSku.stock}</span>
                              件
                            </span>
                          </dd>
                        </div>
                        <div className="clear"></div>

                        <div className="btn-op">
                          <div className="btn am-btn am-btn-warning">确认</div>
                          <div className="btn close am-btn am-btn-warning">
                            取消
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </dd>
            </dl>
            <div className="clear"></div>
            <div className="shopPromotion gold">
              <div className="hot">
                <dt className="tb-metatit">店铺优惠</dt>
                <div className="gold-list">
                  <p v-show="selectedSku.discounts < 1">
                    {selectedSku.discounts * 10}折优惠
                  </p>
                  <p v-show="selectedSku.discounts >= 1">无优惠</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pay">
            <li>
              <div className="clearfix tb-btn tb-btn-basket theme-login">
                <a
                  id="LikBasket"
                  style={{
                    width: '160px',
                    height: '46px',
                    backgroundColor: '#df2e33',
                    fontWeight: 'bold',
                    lineHeight: '46px',
                    fontSize: '18px',
                    padding: '0 26px',
                    fontFamily: 'microsoft yahei',
                  }}
                  title="加入购物车"
                  href="#"
                  onClick={addToCart}
                >
                  <i></i>加入购物车
                </a>
              </div>
            </li>
          </div>
        </div>
        <div className="clear"></div>
      </div>

      <div className="introduce">
        <div className="introduceMain">
          <div className="am-tabs" data-am-tabs>
            <ul className="am-avg-sm-3 am-tabs-nav am-nav am-nav-tabs">
              <li className="am-active">
                <a href="#">
                  <span className="index-needs-dt-txt">宝贝详情</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <span className="index-needs-dt-txt">全部评价</span>
                </a>
              </li>
            </ul>

            <div className="am-tabs-bd">
              <div className="am-tab-panel am-fade am-in am-active">
                <div className="J_Brand">
                  <div className="attr-list-hd tm-clear">
                    <h4>产品参数：</h4>
                  </div>
                  <div className="clear"></div>
                  <ul id="J_AttrUL">
                    <li title="">产地:&nbsp;{itemInfo.itemParams.producPlace}</li>
                    <li title="">品牌名:&nbsp;{itemInfo.itemParams.brand}</li>
                    <li title="">生产厂名:&nbsp;{itemInfo.itemParams.factoryName}</li>
                    <li title="">生产厂址:&nbsp;{itemInfo.itemParams.factoryAddress}</li>
                    <li title="">
                      包装方式:&nbsp;{itemInfo.itemParams.packagingMethod}
                    </li>
                    <li title="">保质期:&nbsp;{itemInfo.itemParams.footPeriod}</li>
                    <li title="">规格重量:&nbsp;{itemInfo.itemParams.weight}</li>
                    <li title="">储存方法:&nbsp;{itemInfo.itemParams.storageMethod}</li>
                    <li title="">食用方式:&nbsp;{itemInfo.itemParams.eatMethod}</li>
                  </ul>
                  <div className="clear"></div>
                </div>

                <div className="details">
                  <div className="attr-list-hd after-market-hd">
                    <h4>商品细节</h4>
                  </div>
                  <div className="twlistNews" v-html="item.content"></div>
                </div>
                <div className="clear"></div>
              </div>

              <div className="am-tab-panel am-fade">
                <div className="actor-new comment-summary">
                  <div className="rate">
                    <div v-if="countsVO.totalCounts == 0">
                      <strong>
                        100<span>%</span>
                      </strong>
                    </div>
                    <div v-if="countsVO.totalCounts > 0">
                      <strong>
                        {Math.round(
                          (countsVO.goodCounts / countsVO.totalCounts) * 100
                        )}
                        <span>%</span>
                      </strong>
                    </div>
                    <br />
                    <span>好评度</span>
                  </div>
                  <div className="comment-counts">
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
                <div className="clear"></div>

                <ul className="am-comments-list am-comments-list-flip">
                  {
                      commentList.map((commentRecord, commentIndex) => (
                        <li key={commentIndex}
                    className="am-comment"
                  >
                    <a href="#" onClick={(e) => e.preventDefault()} >
                      <img
                        className="am-comment-avatar"
                        src={commentRecord.userFace}
                      />
                    </a>
                    <div className="am-comment-main">
                      <header className="am-comment-hd">
                        <div className="am-comment-meta">
                          <a href="#link-to-user" className="am-comment-author">
                            {commentRecord.nickname} (匿名)
                          </a>
                          评论于
                          <time dateTime="">{commentRecord.createdTime}</time>
                        </div>
                      </header>

                      <div className="am-comment-bd">
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
                      ))
                  }
                </ul>

                <div className="clear"></div>

                <div className="wrap" id="wrap">
                  {/* <zpagenav
                            v-bind:page="page"
                            v-bind:page-size="pageSize"
                            v-bind:total="total"
                            v-bind:max-page="maxPage"
                            v-on:pagehandler="doPaging"
                            >
                            </zpagenav> */}
                </div>

                <div className="clear"></div>
              </div>
              <div className="am-tab-panel am-fade"></div>
            </div>
          </div>

          <div className="clear"></div>
        </div>
      </div>
    </div>
  )
}

export default Item

Item.getInitialProps = async ({ ctx }) => {
    // const { itemId } = ctx.query
    const itemId = "bingan-1002"

    let itemInfo;
    const res = await axios.get(serverUrl + '/items/info/' + itemId, {})
    if (res.data.status == 200) {
        itemInfo = res.data.data

        // console.log(this.itemImgList);
      } else if (res.data.status == 500) {
        alert(res.data.msg)
      }

      let countsVO;
      axios.defaults.withCredentials = true
      const res2 = await axios.get(serverUrl + '/items/commentLevel?itemId=' + itemId, {})
  
          if (res2.data.status == 200) {
            countsVO = res2.data.data
          } else if (res.data.status == 500) {
            alert(res.data.msg)
          }
  
    return {
        itemInfo,
        countsVO
    }
  }
