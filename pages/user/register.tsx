import React, { useEffect, useState } from 'react'
import Footer from '../../components/Footer'
import { getUrlParam, serverUrl } from '../../util/app'
import axios from 'axios'

export default function Register() {
    const [ username, setUsername ] = useState("")
    const [ errUsername, setErrUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ confirmPassword, setConfirmPassword ] = useState("")
    const [ returnUrl, setReturnUrl ] = useState("")
    const [ errUsernameIsShow, setErrUsernameIsShow ] = useState(false)

    useEffect(() => {
        const url = getUrlParam("returnUrl");
        if (url != null && url != undefined && url != '') {
            setReturnUrl(url);
        }
    }, [])

    useEffect(() => {
        const checkUsernameIsExist = async () => {
            const res = await axios.get(serverUrl + '/passport/usernameIsExist?username=' + username, {})
            if (res.data.status == 200) {
                setErrUsername("");
                setErrUsernameIsShow(false);
                return;
            } else if (res.data.status == 500) {
                setErrUsername(res.data.msg);
                setErrUsernameIsShow(true);
                return;
            }
        }
        checkUsernameIsExist()
    }, [username])

    const handleUsernameChanged = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChanged = (e) => {
        setPassword(e.target.value)
    }

    const handleConfirmPasswordChanged = (e) => {
        setConfirmPassword(e.target.value)
    }

    const registUser = async () => {
        if (username == null || username == undefined || username =='') {
            alert("用户名不能为空");
            return;
        } else if (password == null || password == undefined || password =='') {
            alert("密码不能为空");
            return;
        } else if (password.length < 6) {
            alert("密码不能少于6位");
            return;
        } else if (confirmPassword == null || confirmPassword == undefined || confirmPassword =='') {
            alert("确认密码不能为空");
            return;
        } else if (confirmPassword != password) {
            alert("密码与确认密码不一致");
            return;
        }

        var userBO = {
            username: username,
            password: password,
            confirmPassword: confirmPassword
        };

        // form提交
        axios.defaults.withCredentials = true;
        const res = await axios.post(serverUrl + '/passport/regist', userBO)
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
            <div className="res-banner">
                <div className="res-main">
                    <div className="login-banner-bg">
                        <span></span>
                        <img src="/static/img/registpage.png"/>
                    </div>
                    <div className="login-box">
                            <div className="am-tabs" id="doc-my-tabs">
                                <ul className="am-tabs-nav am-nav am-nav-tabs am-nav-justify">
                                    <li className="am-active"><a href="">用户注册</a></li>
                                </ul>

                                <div className="am-tabs-bd" id="regist">
                                    <div className="am-tab-panel am-active">
                                        <form method="post">
                                            
                                            <div className="user-email">
                                                <label htmlFor="username"><i className="am-icon-envelope-o"></i></label>
                                                <input id="username" onChange={handleUsernameChanged} value={username} placeholder="请输入用户名" />
                                            </div>
                                            {
                                                errUsernameIsShow && (
                                                    <div style={{padding: "10px", fontSize: "12px", color: "red"}}>
                                                        {errUsername}
                                                    </div>	
                                                )
                                            }
                                            									
                                            <div className="user-pass">
                                                <label htmlFor="password"><i className="am-icon-lock"></i></label>
                                                <input type="password" id="password" onChange={handlePasswordChanged} value={password} placeholder="设置密码" />
                                            </div>										
                                            <div className="user-pass">
                                                <label htmlFor="confirmPassword"><i className="am-icon-lock"></i></label>
                                                <input type="password" id="confirmPassword" onChange={handleConfirmPasswordChanged} value={confirmPassword} placeholder="确认密码" />
                                            </div>
                                        
                                            <div className="login-links">
                                                <a href={'login?returnUrl=' + returnUrl} className="am-fr">已有账号？去登录</a>
                                                <br />
                                            </div>
                                            <div className="am-cf">
                                                <input type="button" name="" value="注册" onClick={registUser} className="am-btn am-btn-primary am-btn-sm am-fl" />
                                            </div>
                                        </form>
                                    </div>
                                </div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}