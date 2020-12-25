import React from 'react'
import { Button, Radio } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import styles from './index.less'

const FilterBar = ({ onSort }) => {
  return (
    <div className={`${styles.filterWrap} contentWidth fcb`}>
      <div className={`fl fcb`}>
        <Button.Group className={`${styles.btnGroup} fl`}>
          <Radio.Button value="1" onClick={() => onSort('k')}>
            默认排序
            <ArrowUpOutlined />
          </Radio.Button>
          <Radio.Button value="2" onClick={() => onSort('c')}>
            销量排序
            <ArrowDownOutlined />
          </Radio.Button>
          <Radio.Button value="3" onClick={() => onSort('p')}>
            价格优先
            <ArrowDownOutlined />
          </Radio.Button>
        </Button.Group>
      </div>
    </div>
  )
}

export default FilterBar
