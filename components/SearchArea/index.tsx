import React from 'react'
import SearchBar from '../SearchBar'
import styles from './index.module.scss'

const SearchArea = ({ noSearch = false }) => {
    return (
        <div className={`bw`}>
            <div className={`${styles.searchWrap} contentWidth`}>
                <a className={styles.logoWrap}>
                    <img src="/static/images/logobig.png" alt="多米电商"/>
                </a>
                {
                    !noSearch &&
                    <div className={styles.searchArea}>
                        <SearchBar />
                    </div>
                }
            </div>
        </div>
    )
}

export default SearchArea