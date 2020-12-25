import React, { useState } from 'react'
import { Input, message } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './index.less'

const InputBuyNumber = ({
  stock,
  defaultValue = 0,
  onChange,
}: {
  stock?: number
  defaultValue?: number
  onChange?: (value) => void
}) => {
  const [value, setValue] = useState(defaultValue)

  const handlePlusClick = () => {
    setValue(value + 1)
    onChange(value + 1)
  }

  const handleMinusClick = () => {
    if (value === 0) {
      message.warning('Minimal is 0')
      return
    }
    setValue(value - 1)
    onChange(value - 1)
  }

  const handleOnChange = (e) => {
    if (e.target.value === 0) {
      message.warning('Minimal is 0')
      return
    }
    setValue(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className={styles.buyInputWrap}>
      <Input
        addonBefore={
          <a
            className={`${styles.numBtn} ${styles.cut}`}
            onClick={handleMinusClick}
          >
            <MinusOutlined />
          </a>
        }
        addonAfter={
          <a
            className={`${styles.numBtn} ${styles.add}`}
            onClick={handlePlusClick}
          >
            <PlusOutlined />
          </a>
        }
        className={styles.buyNumInput}
        size={'small'}
        value={value}
        onChange={handleOnChange}
      />
      {stock && <span>库存{stock}件</span>}
    </div>
  )
}

export default InputBuyNumber
