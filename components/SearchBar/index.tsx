import React, { useState } from 'react'


const SearchBar = () => {
    const [ keywords, setKeywords ] = useState()

    const doSearch = () => {

    }

    return (
        <div className="nav white">
			<div className="logoBig">
				<li><img src="/static/images/logobig.png" /></li>
			</div>
			<div className="search-bar pr">
				<a href="#"></a>
				<form>
					<input id="searchInput" value={keywords} name="index_none_header_sysc" type="text" placeholder="搜索" />
					<input id="ai-topsearch" onClick={doSearch} className="submit am-btn" value="搜索" />
				</form>
			</div>
		</div>
    )
}

export default SearchBar