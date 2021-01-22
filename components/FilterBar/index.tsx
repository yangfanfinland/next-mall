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
            Default sort
            <ArrowUpOutlined />
          </Radio.Button>
          <Radio.Button value="2" onClick={() => onSort('c')}>
            Sales sort
            <ArrowDownOutlined />
          </Radio.Button>
          <Radio.Button value="3" onClick={() => onSort('p')}>
            Price first
            <ArrowDownOutlined />
          </Radio.Button>
        </Button.Group>
      </div>
    </div>
  )
}

export default FilterBar
