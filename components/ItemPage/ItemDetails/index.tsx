import React from 'react'
import styles from './index.less'

const ItemDetails = ({ item, itemParams }) => {
  return (
    itemParams && (
      <div className="">
        <div className="">
          <div className="">
            <h4>Product parameters:</h4>
          </div>
          <ul className={`${styles.J_AttrUL}`}>
            <li title="">Origin:&nbsp;{itemParams.producPlace}</li>
            <li title="">Brand:&nbsp;{itemParams.brand}</li>
            <li title="">Manufacturer:&nbsp;{itemParams.factoryName}</li>
            <li title="">Address:&nbsp;{itemParams.factoryAddress}</li>
            <li title="">Packing:&nbsp;{itemParams.packagingMethod}</li>
            <li title="">Best-before:&nbsp;{itemParams.footPeriod}</li>
            <li title="">Weight:&nbsp;{itemParams.weight}</li>
            <li title="">Storage:&nbsp;{itemParams.storageMethod}</li>
            <li title="">Edible method:&nbsp;{itemParams.eatMethod}</li>
          </ul>
        </div>

        <div className="details">
          <div className="attr-list-hd after-market-hd">
            <h4>Product detail</h4>
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
