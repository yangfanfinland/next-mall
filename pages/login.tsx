import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { getUrlParam, serverUrl } from '../util/app'
import axios from 'axios'

export default function Login() {

    const [ returnUrl, setReturnUrl ] = useState("")
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    useEffect(() => {
        const url = getUrlParam("returnUrl");
        if (url != null && url != undefined && url != '') {
            setReturnUrl(url);
        }
    }, [])

    const handleUsernameChanged = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChanged = (e) => {
        setPassword(e.target.value)
    }

    const doLogin = async () => {
        if (username == null || username == undefined || username == '') {
            alert("用户名不能为空");
            return;
        } else if (password == null || password == undefined || password == '') {
            alert("密码不能为空");
            return;
        } else if (password.length < 6) {
            alert("密码不能少于6位");
            return;
        }

        var userBO = {
            username: username,
            password: password
        };

        // form提交
        axios.defaults.withCredentials = true;
        // console.log(axios.defaults);
        const res = await axios.post(serverUrl + '/passport/login', userBO)
        if (res.data.status == 200) {
            var user = res.data;
            if (returnUrl != null && returnUrl != undefined && returnUrl != '') {
                window.location.href = returnUrl;
            } else {
                window.location.href = "/";
            }

        } else if (res.data.status == 500) {
            alert(res.data.msg);
            return;
        }
    }

    return (
        <>
            <div className="login-banner" id="login">
                <div className="login-main">
                    <div className="login-banner-bg"><span></span><img src="/static/img/loginpage.png" /></div>
                    <div className="login-box">

                        <h3 className="title">登录商城</h3>
                        <div className="clear"></div>
                        <div className="login-form">
                            <form>
                                <div className="user-name">
                                    <label htmlFor="user"><i className="am-icon-user"></i></label>
                                    <input type="text" value={username} onChange={handleUsernameChanged} id="user" placeholder="请输入用户名" />
                                </div>
                                <div className="user-pass">
                                    <label htmlFor="password"><i className="am-icon-lock"></i></label>
                                    <input type="password" value={password} onChange={handlePasswordChanged} id="password" placeholder="请输入密码" />
                                </div>
                            </form>
                        </div>

                        <div className="login-links">
                            <a href={'register?returnUrl=' + returnUrl} className="am-fr">前往注册</a>
                            <br />
                        </div>
                        <div className="am-cf">
                            <input type="button" name="" value="登 录" onClick={doLogin} className="am-btn am-btn-primary am-btn-sm" />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}