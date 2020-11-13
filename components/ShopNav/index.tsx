import React from 'react'
const ShopNav = () => {
    return (
        <div className="shopNav">
			<div className="slideall">

				<div className="long-title"><span className="all-goods">全部分类</span></div>
				<div className="nav-cont">
					<ul>
						<li className="index"><a href="index.html">首页</a></li>
						<li className="qc"><a href="https://www.imooc.com" target="_blank">慕课网</a></li>
					</ul>
				</div>

				<div id="nav" className="navfull">
					<div className="area clearfix">
						<div className="category-content" id="guide_2">

							<div className="category">
								<ul className="category-list" id="js_climit_li"></ul>
							</div>
						</div>

					</div>
				</div>
				<div className="clear"></div>
			</div>
		</div>
    )
}

export default ShopNav