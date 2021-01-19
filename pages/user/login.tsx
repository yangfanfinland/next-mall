import React, { useEffect, useState } from 'react'
import { getUrlParam } from '../../util/app'
import axios from 'axios'
import LoginForm from '../../components/User/LoginForm'
import { message } from 'antd'
import { useDispatch } from 'react-redux'
import Router from 'next/router'
import { request } from '../../lib/api'

export default function Login() {
  const [returnUrl, setReturnUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const url = getUrlParam('returnUrl')
    if (url != null && url != undefined && url != '') {
      setReturnUrl(url)
    }
  }, [])

  const doLogin = async (values) => {
    const userBO = {
      username: values.username,
      password: values.password,
    }

    // form提交
    setLoading(true)
    axios.defaults.withCredentials = true
    // const res = await axios.post(serverUrl + '/passport/login', userBO)
    const res = await request({ method: "POST", url: '/auth/passport/login', data: userBO })
    if (res.data.status == 200) {
      const user = res.data
      dispatch({ type: 'LOGIN', user: { ...user.data } })
      if (returnUrl != null && returnUrl != undefined && returnUrl != '') {
        Router.push(returnUrl)
      } else {
        Router.push('/')
      }
    } else if (res.data.status == 500) {
      message.error(res.data.msg)
      setLoading(false)
      return
    }
  }

  return (
    <>
      <LoginForm onFinish={doLogin} loading={loading} />
    </>
  )
}
