import React from 'react'
import { Breadcrumb } from 'antd'
import styles from './index.less'

const BreadcrumbNav = ({
  showTotal = true,
  items,
  item,
}: {
  showTotal?: boolean
  items
  item?
}) => {
  return (
    <div className={`${styles.navCrumbWrap} contentWidth fcb`}>
      <Breadcrumb separator={'>'} className={styles.left}>
        <Breadcrumb.Item>
          <a href="/">Main</a>
        </Breadcrumb.Item>
        {items &&
          [...items].reverse().map((o, i) => {
            return item && item.catId == o.id ? (
              <Breadcrumb.Item
                key={o.id}
                href={`/catItems?searchType=catItems&catId=${o.id}`}
              >
                <span>{o.name}</span>
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item key={o.id}>
                <span>{o.name}</span>
              </Breadcrumb.Item>
            )
          })}
        {item && (
          <Breadcrumb.Item>
            <span>{item.itemName}</span>
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      {showTotal && (
        <div className={styles.right}>
          <span className={styles.totalGoods}>25555</span> products in total
        </div>
      )}
    </div>
  )
}

export default BreadcrumbNav