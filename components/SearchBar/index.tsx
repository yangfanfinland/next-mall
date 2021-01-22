import React, { useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import styles from './index.less'

const SearchBar = ({ defaultValue = '' }) => {
  const [keywords, setKeywords] = useState(defaultValue)

  const handleKeywordsChanged = (e) => {
    setKeywords(e.target.value)
  }

  return (
    <div className={styles.searchBar}>
      <SearchOutlined className={styles.searchIcon} />
      <input
        onChange={handleKeywordsChanged}
        value={keywords}
        type="text"
        className={styles.searchInput}
        placeholder={'Search'}
      />
      <a
        href={`/catItems?searchType=searchItems&keywords=${keywords}`}
        target="_blank"
        className={styles.searchBtn}
      >
        Search
      </a>
    </div>
  )
}

export default SearchBar
