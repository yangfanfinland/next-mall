import React from 'react'
import { shopServerUrl } from '../../../util/app'
import styles from './index.less'

const OrderList = ({
  myOrderList,
  deleteOrder,
  confirmReceive,
  commentItems,
  goPay,
}: {
  myOrderList
  deleteOrder?: (orderId) => void
  confirmReceive?: (orderId) => void
  commentItems?: (orderId) => void
  goPay?: (orderId, payMethod, totalAmount) => void
}) => {
  return (
    <div className={styles['am-tabs-bd']}>
      <div className={styles['am-tab-panel']}>
        <div className={styles['order-top']}>
          <div className={`${styles['th']} ${styles['th-item']}`}>
            <div className="td-inner">Product</div>
          </div>
          <div className={`${styles['th']} ${styles['th-price']}`}>
            <div className="td-inner">Price</div>
          </div>
          <div className={`${styles['th']} ${styles['th-number']}`}>
            <div className="td-inner">Amount</div>
          </div>
          <div className={`${styles['th']} ${styles['th-operation']}`}>
            <div className="td-inner">Payment</div>
          </div>
          <div className={`${styles['th']} ${styles['th-amount']}`}>
            <div className="td-inner">Sub total</div>
          </div>
          <div className={`${styles['th']} ${styles['th-status']}`}>
            <div className="td-inner">Status</div>
          </div>
          <div className={`${styles['th']} ${styles['th-change']}`}>
            <div className="td-inner">Operate</div>
          </div>
        </div>

        <div className={styles['order-main']}>
          <div className={styles['order-list']}>
            {myOrderList &&
              myOrderList.map((order, ordersIndex) => (
                <div className={styles['order-status']} key={ordersIndex}>
                  <div className={styles['order-title']}>
                    <div className="dd-num">
                      Order Id: <a href="">{order.orderId}</a>
                    </div>
                    <span>Created on: {order.createdTime}</span>
                  </div>
                  <div className={styles['order-content']}>
                    <div className={styles['order-left']}>
                      {order.subOrderItemList &&
                        order.subOrderItemList.map((subItem, subIndex) => (
                          <ul className={styles['item-list']} key={subIndex}>
                            <li
                              className={`${styles['td']} ${styles['td-item']}`}
                            >
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
                                      Specification: {subItem.itemSpecName}
                                    </p>
                                  </a>
                                </div>
                              </div>
                            </li>
                            <li
                              className={`${styles['td']} ${styles['td-price']}`}
                            >
                              <div className="item-price">
                                €{subItem.price / 100}
                              </div>
                            </li>
                            <li
                              className={`${styles['td']} ${styles['td-number']}`}
                            >
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
                          {order.payMethod == 1 && (
                            <img src="/static/images/wxpay.png" />
                          )}
                          {order.payMethod == 2 && (
                            <img src="/static/images/alipay.png" />
                          )}
                        </div>
                      </li>
                      <li className={`${styles['td']} ${styles['td-amount']}`}>
                        <div className="item-amount">
                          Total: {order.realPayAmount / 100}€
                        </div>
                      </li>
                      <div className={styles['move-right']}>
                        <li
                          className={`${styles['td']} ${styles['td-status']}`}
                        >
                          <div className="">
                            {order.orderStatus == 10 && (
                              <p className="Mystatus">Unpaid</p>
                            )}

                            {order.orderStatus == 20 && (
                              <p className="Mystatus">Paid</p>
                            )}

                            {order.orderStatus == 30 && (
                              <p className="Mystatus">Delivered</p>
                            )}

                            {order.orderStatus == 40 && (
                              <p className="Mystatus">Succeed</p>
                            )}

                            {order.orderStatus == 50 && (
                              <p className="Mystatus">Closed</p>
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
                              className={`${styles['btn']} ${styles['go-pay']}`}
                            >
                              Pay
                            </div>
                          )}

                          {order.orderStatus == 20 && (
                            <p className="Mystatus">Delivering</p>
                          )}

                          {order.orderStatus == 30 && (
                            <div
                              onClick={() => confirmReceive(order.orderId)}
                              className={`${styles['btn']} ${styles['confirm-receive']}`}
                            >
                              Receive
                            </div>
                          )}

                          {order.isComment == 0 && order.orderStatus == 40 && (
                            <div
                              onClick={() => commentItems(order.orderId)}
                              className={`${styles['btn']} ${styles['comment-items']}`}
                            >
                              Comment
                            </div>
                          )}

                          {order.isComment == 1 && order.orderStatus == 40 && (
                            <div className="Mystatus">Commented</div>
                          )}

                          {order.orderStatus == 50 && (
                            <div
                              onClick={() => deleteOrder(order.orderId)}
                              className={`${styles['btn']} ${styles['delete-order']}`}
                            >
                              Delete
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
