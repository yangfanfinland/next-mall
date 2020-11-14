import React, { useState } from 'react'
import styles from './index.module.scss';

const SearchBar = () => {
    const [ keywords, setKeywords ] = useState("")

    const doSearch = () => {

	}
	
	const handleKeywordsChanged = (e) => {
		setKeywords(e.target.value);
	}

    return (
		<div className={styles.searchBar}>
			<i className={styles.searchIcon}/>
			<input onChange={handleKeywordsChanged} type="text" className={styles.searchInput} placeholder={'搜索'}/>
			<a href={''} onClick={doSearch} className={styles.searchBtn}>搜索</a>
		</div>
    )
}

export default SearchBar