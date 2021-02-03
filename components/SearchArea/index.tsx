import React from 'react'
import SearchBar from '../SearchBar'
import Link from 'next/link'
import styles from './index.less'

const SearchArea = ({
  keywords,
  noSearch = false,
}: {
  keywords?: string
  noSearch?: boolean
}) => {
  return (
    <div className={`bw`}>
      <div className={`${styles.searchWrap} contentWidth`}>
        <Link href={`/`}>
          <a className={styles.logoWrap}>
            <img src="/static/images/logobig.png" alt="Foodie shop" />
          </a>
        </Link>

        {!noSearch && (
          <div className={styles.searchArea}>
            <SearchBar defaultValue={keywords} />
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchArea
