import React, { useEffect, useState } from 'react'
import { getUrlParam, serverUrl } from '../../util/app'
import RegisterForm from "../../components/User/RegisterForm"
import axios from 'axios'
import { message } from "antd"

export default function Register() {
    const [ loading, setLoading] = useState(false)
    const [ returnUrl, setReturnUrl ] = useState("")

    useEffect(() => {
        const url = getUrlParam("returnUrl");
        if (url != null && url != undefined && url != '') {
            setReturnUrl(url);
        }
    }, [])

    // TODO: Check username is exist
    // useEffect(() => {
    //     const checkUsernameIsExist = async () => {
    //         const res = await axios.get(serverUrl + '/passport/usernameIsExist?username=' + username, {})
    //         if (res.data.status == 200) {
    //             return;
    //         } else if (res.data.status == 500) {
    //             return;
    //         }
    //     }
    //     checkUsernameIsExist()
    // }, [username])

    const registUser = async (values) => {
        if (values.password.length < 6) {
            message.error("密码不能少于6位");
            return;
        }
        if (values.confirmPassword != values.password) {
            message.error("密码与确认密码不一致");
            return;
        }

        const userBO = {
            username: values.username,
            password: values.password,
            confirmPassword: values.confirmPassword
        };

        // form提交
        axios.defaults.withCredentials = true;
        setLoading(true)
        const res = await axios.post(serverUrl + '/passport/regist', userBO)
        if (res.data.status == 200) {
            const user = res.data
            setLoading(false)
            if (returnUrl != null && returnUrl != undefined && returnUrl != '') {
                window.location.href = returnUrl;
            } else {
                window.location.href = "/";
            }
        } else if (res.data.status == 500) {
            message.error(res.data.msg)
            setLoading(false)
            return;
        }
    }

    return (
        <>
            <RegisterForm onFinish={registUser} loading={loading} />
        </>
    )
}