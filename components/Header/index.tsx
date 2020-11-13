import React, { useEffect, useState } from 'react'
import { getUrlParam, serverUrl, getCookie } from '../../util/app'


const Header = () => {

    const [ userIsLogin, setUserIsLogin ] = useState(false)
    const [ userInfo, setUserInfo ] = useState<{ username: string }>()

    useEffect(() => {
        var userCookie = getCookie("user");
        if (userCookie != null && userCookie != undefined && userCookie != '') {
            var userInfoStr = decodeURIComponent(userCookie);
            if (userInfoStr != null && userInfoStr != undefined && userInfoStr != '') {
                var userInfo = JSON.parse(userInfoStr);
                // 判断是否是一个对象
                if ( typeof(userInfo)  == "object" ) {
                    setUserIsLogin(true);
                    setUserInfo(userInfo);
                } else {
                    setUserIsLogin(false);
                    setUserInfo({ username: "" })
                }
            }
        } else {
            setUserIsLogin(false);
            setUserInfo({ username: "" })
        }
    }, [])

    const goUserCenter = () => {
        
    }

    return (
        <div className="am-container header">
			<ul className="message-l">
				<div className="topMessage">
                    {
                        userIsLogin ? (
                            <div className="menu-hd">
                                <span style={{ color: "#d2364c" }}>欢迎，{ userInfo.username }</span>
                            </div>
                        ): (
                            <div className="menu-hd">
                                <a href="login" target="_top" className="h">亲，请登录</a>
                                <a href="register" target="_top">免费注册</a>
                            </div>
                        )
                    }
				</div>
			</ul>
			<ul className="message-r">
				<div className="topMessage home">
					<div className="menu-hd"><a href="index" target="_top" className="h">商城首页</a></div>
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