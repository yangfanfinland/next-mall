import React from 'react'
import styles from './index.module.scss'

const ItemDetails = ({ item, itemParams }) => {
  return (
    itemParams && (
      <div className="">
        <div className="">
          <div className="">
            <h4>产品参数：</h4>
          </div>
          <ul className={`${styles.J_AttrUL}`}>
            <li title="">产地:&nbsp;{itemParams.producPlace}</li>
            <li title="">品牌名:&nbsp;{itemParams.brand}</li>
            <li title="">生产厂名:&nbsp;{itemParams.factoryName}</li>
            <li title="">生产厂址:&nbsp;{itemParams.factoryAddress}</li>
            <li title="">包装方式:&nbsp;{itemParams.packagingMethod}</li>
            <li title="">保质期:&nbsp;{itemParams.footPeriod}</li>
            <li title="">规格重量:&nbsp;{itemParams.weight}</li>
            <li title="">储存方法:&nbsp;{itemParams.storageMethod}</li>
            <li title="">食用方式:&nbsp;{itemParams.eatMethod}</li>
          </ul>
        </div>

        <div className="details">
          <div className="attr-list-hd after-market-hd">
            <h4>商品细节</h4>
          </div>
          <div
            className="twlistNews"
            dangerouslySetInnerHTML={{ __html: item.content }}
          ></div>
        </div>
      </div>
    )
  )
}

export default ItemDetails
