import React from 'react'
import styles from './index.less'

const AreaBrand = () => {
  return (
    <ul className={'mb40 fcb'}>
      <li className={`${styles.hotItem}`}>
        <a href="/goodsDetail" target={'_blank'}>
          <p className={styles.titleWrap}>
            <span className={styles.title}>热卖品牌</span>
            <span className={styles.subTitle}>全球精选，一网打尽</span>
          </p>
          <img
            src="../static/images/test/hot1.png"
            width={'100%'}
            height={320}
            alt=""
          />
        </a>
      </li>
      <li className={`${styles.hotItem}`}>
        <a href="/goodsDetail" target={'_blank'}>
          <p className={styles.titleWrap}>
            <span className={styles.title}>聚名品</span>
            <span className={styles.subTitle}>全球优质品牌都在这里</span>
          </p>
          <img
            src="../static/images/test/hot2.png"
            width={'100%'}
            height={320}
            alt=""
          />
        </a>
      </li>
      <li className={`${styles.hotItem}`}>
        <a href="/goodsDetail" target={'_blank'}>
          <p className={styles.titleWrap}>
            <span className={styles.title}>全球好物</span>
            <span className={styles.subTitle}>为您甄选品质好货</span>
          </p>
          <img
            src="../static/images/test/hot3.png"
            width={'100%'}
            height={320}
            alt=""
          />
        </a>
      </li>
    </ul>
  )
}

export default AreaBrand
