import React from 'react'
import styles from './index.less'

const Warranty = ({ width }: { width?: string }) => {
  return (
    <div className={`bw`}>
      <ul
        className={`${styles.warranty} ${width ? width : 'contentWidth'} fcb`}
      >
        <li className={`${styles.warrItem}`}>
          <img
            className={`${styles.wrrIcon}`}
            src={'/static/images/warr1.png'}
            alt={'genuine product'}
          />
          <a>Genuine product</a>
        </li>
        <li className={`${styles.warrItem}`}>
          <img
            className={`${styles.wrrIcon}`}
            src={'/static/images/warr2.png'}
            alt={'Strict supervision'}
          />
          <a>Strict supervision</a>
        </li>
        <li className={`${styles.warrItem}`}>
          <img
            className={`${styles.wrrIcon}`}
            src={'/static/images/warr3.png'}
            alt={'Certified merchants'}
          />
          <a>Certified merchants</a>
        </li>
        <li className={`${styles.warrItem}`}>
          <img
            className={`${styles.wrrIcon}`}
            src={'/static/images/warr4.png'}
            alt={'Worry free after sale'}
          />
          <a>Worry free after sale</a>
        </li>
      </ul>
    </div>
  )
}

export default Warranty
