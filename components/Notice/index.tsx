import React from 'react'
import styles from './index.less'

const Notice = ({ content }) => {
  return (
    <div className={styles.notice}>
      { content }
    </div>
  )
}

export default Notice
