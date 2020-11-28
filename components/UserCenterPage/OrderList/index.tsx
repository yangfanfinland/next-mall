import React, { useEffect, useState } from 'react'
import { shopServerUrl } from '../../../util/app'
import styles from './index.module.scss'

const OrderList = ({ myOrderList }) => {
  const goPay = (orderId, payMethod, totalAmount) => {}

  const confirmReceive = (orderId) => {}

  const commentItems = (orderId) => {
    window.location.href = 'doComment?orderId=' + orderId
  }

  const deleteOrder = (orderId) => {}

  return (
    <div className={styles['am-tabs-bd']}>
      <div className={styles['am-tab-panel']}>
        <div className={styles['order-top']}>
          <div className={`${styles['th']} ${styles['th-item']}`}>
            <div className="td-inner">商品</div>
          </div>
          <div className={`${styles['th']} ${styles['th-price']}`}>
            <div className="td-inner">单价</div>
          </div>
          <div className={`${styles['th']} ${styles['th-number']}`}>
            <div className="td-inner">数量</div>
          </div>
          <div className={`${styles['th']} ${styles['th-operation']}`}>
            <div className="td-inner">支付方式</div>
          </div>
          <div className={`${styles['th']} ${styles['th-amount']}`}>
            <div className="td-inner">合计</div>
          </div>
          <div className={`${styles['th']} ${styles['th-status']}`}>
            <div className="td-inner">交易状态</div>
          </div>
          <div className={`${styles['th']} ${styles['th-change']}`}>
            <div className="td-inner">交易操作</div>
          </div>
        </div>

        <div className={styles['order-main']}>
          <div className={styles['order-list']}>
            {myOrderList &&
              myOrderList.map((order, ordersIndex) => (
                <div className={styles['order-status']} key={ordersIndex}>
                  <div className={styles['order-title']}>
                    <div className="dd-num">
                      订单编号：<a href="">{order.orderId}</a>
                    </div>
                    <span>成交时间：{order.createdTime}</span>
                  </div>
                  <div className={styles['order-content']}>
                    <div className={styles['order-left']}>
                      {order.subOrderItemList &&
                        order.subOrderItemList.map((subItem, subIndex) => (
                          <ul className={styles['item-list']} key={subIndex}>
                            <li className={`${styles['td']} ${styles['td-item']}`}>
                              <div className={styles['item-pic']}>
                                <a
                                  href={`${shopServerUrl}item.html?itemId=${subItem.itemId}`}
                                  target="_blank"
                                  className="J_MakePoint"
                                >
                                  <img
                                    src={subItem.itemImg}
                                    className="itempic J_ItemImg"
                                  />
                                </a>
                              </div>
                              <div className={styles['item-info']}>
                                <div className="item-basic-info">
                                  <a
                                    href={
                                      shopServerUrl +
                                      'item.html?itemId=' +
                                      subItem.itemId
                                    }
                                    target="_blank"
                                  >
                                    <p>{subItem.itemName}</p>
                                    <p className="info-little">
                                      规格：{subItem.itemSpecName}
                                    </p>
                                  </a>
                                </div>
                              </div>
                            </li>
                            <li className={`${styles['td']} ${styles['td-price']}`}>
                              <div className="item-price">
                                ￥{subItem.price / 100}
                              </div>
                            </li>
                            <li className={`${styles['td']} ${styles['td-number']}`}>
                              <div className="item-number">
                                <span>×</span>
                                {subItem.buyCounts}
                              </div>
                            </li>
                          </ul>
                        ))}
                    </div>
                    <div className={styles['order-right']}>
                      <li className={styles['td']}>
                        <div className={styles['item-operation']}>
                          {order.payMethod == 1 && <img src="/static/images/wxpay.png" />}
                          {order.payMethod == 2 && <img src="/static/images/alipay.png" />}
                        </div>
                      </li>
                      <li className={`${styles['td']} ${styles['td-amount']}`}>
                        <div className="item-amount">
                          合计：{order.realPayAmount / 100}元
                          <p>
                            含运费：
                            <span>
                              {order.postAmount == 0
                                ? '包邮'
                                : order.postAmount / 100 + '元'}
                            </span>
                          </p>
                        </div>
                      </li>
                      <div className={styles['move-right']}>
                        <li
                          className={`${styles['td']} ${styles['td-status']}`}
                        >
                          <div className="">
                            {order.orderStatus == 10 && (
                              <p className="Mystatus">等待付款</p>
                            )}

                            {order.orderStatus == 20 && (
                              <p className="Mystatus">买家已付款</p>
                            )}

                            {order.orderStatus == 30 && (
                              <p className="Mystatus">商家已发货</p>
                            )}

                            {order.orderStatus == 40 && (
                              <p className="Mystatus">交易成功</p>
                            )}

                            {order.orderStatus == 50 && (
                              <p className="Mystatus">交易关闭</p>
                            )}
                          </div>
                        </li>
                        <li
                          className={`${styles['td']} ${styles['td-change']}`}
                        >
                          {order.orderStatus == 10 && (
                            <div
                              onClick={() =>
                                goPay(
                                  order.orderId,
                                  order.payMethod,
                                  order.realPayAmount
                                )
                              }
                              className="am-btn am-btn-danger anniu"
                            >
                              一键支付
                            </div>
                          )}

                          {order.orderStatus == 20 && (
                            <p className="Mystatus">拣货中</p>
                          )}

                          {order.orderStatus == 30 && (
                            <div
                              onClick={() => confirmReceive(order.orderId)}
                              className="am-btn am-btn-danger anniu"
                            >
                              确认收货
                            </div>
                          )}

                          {order.isComment == 0 && order.orderStatus == 40 && (
                            <div
                              onClick={() => commentItems(order.orderId)}
                              className="am-btn am-btn-danger anniu"
                            >
                              评价商品
                            </div>
                          )}

                          {order.isComment == 1 && order.orderStatus == 40 && (
                            <div className="Mystatus">已评价</div>
                          )}

                          {order.orderStatus == 50 && (
                            <div
                              onClick={() => deleteOrder(order.orderId)}
                              className="am-btn am-btn-danger anniu"
                            >
                              删除订单
                            </div>
                          )}
                        </li>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderList
