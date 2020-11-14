import React from 'react'
import styles from './index.module.scss'

const PriceShow = () => {
    return (
		<div className={`fcb`}>
			<p className={`${styles.currentPrice}`}>¥375.00</p>
			<p className={`${styles.marketPrice}`}>市场价 ¥918.00</p>
		</div>
	)
}

export default PriceShow