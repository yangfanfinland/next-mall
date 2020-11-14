import React from 'react'
import styles from './index.module.scss'

const GoodsItem = ({ item, rightGap = 8, myClassName, myStyle }: { item, rightGap?: number, myClassName?: string, myStyle?: any }) => {
    return (
        <a href="/goodsDetail" target={'_blank'}
           className={`${styles.goodsItem} ${myClassName ? myClassName : ''}`} >
            <img src="../../../static/images/test/speical1.png" className={styles.goodsImg} alt=""/>
            <div className={styles.goodsDesc}>
                <p className={styles.goodsName}>Kiehl's 科颜氏 金盏花植物精华水金盏花植物精华</p>
                <p className={styles.priceWrap}>
                    <span className={styles.nowPrice}>¥519</span>
                    <span className={styles.marketPrice}>市场价 ¥630</span>
                </p>
            </div>
        </a>
    )
}

export default GoodsItem