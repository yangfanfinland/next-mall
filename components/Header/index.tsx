import React, { useState } from 'react'

const Header = () => {

    const [ userIsLogin, setUserIsLogin ] = useState(false)
    const [ userInfo, setUserInfo ] = useState<{ username: string }>()

    const goUserCenter = () => {
        
    }

    return (
        <div className="am-container header">
			<ul className="message-l">
				<div className="topMessage">
                    {
                        userIsLogin ? (
                            <div className="menu-hd" v-show="userIsLogin">
                                <span style={{ color: "#d2364c" }}>欢迎，{ userInfo.username }</span>
                            </div>
                        ): (
                            <div className="menu-hd">
                                <a href="login.html" target="_top" className="h">亲，请登录</a>
                                <a href="register.html" target="_top">免费注册</a>
                            </div>
                        )
                    }
				</div>
			</ul>
			<ul className="message-r">
				<div className="topMessage home">
					<div className="menu-hd"><a href="index.html" target="_top" className="h">商城首页</a></div>
				</div>
				<div className="topMessage my-shangcheng">
					<div className="menu-hd MyShangcheng">
                        <a href="javascript:void(0);" onClick={goUserCenter}>
						<i className="am-icon-user am-icon-fw"></i>个人中心</a>
                    </div>
				</div>
			</ul>
		</div>
    )
}

export default Header