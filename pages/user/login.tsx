import React, { useEffect, useState } from 'react'
import { getUrlParam, serverUrl } from '../../util/app'
import axios from 'axios'
import LoginForm from '../../components/User/LoginForm'
import { message } from 'antd'

export default function Login() {
  const [ returnUrl, setReturnUrl ] = useState('')
  const [ loading, setLoading ] = useState(false)

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
    const res = await axios.post(serverUrl + '/passport/login', userBO)
    if (res.data.status == 200) {
      var user = res.data
      if (returnUrl != null && returnUrl != undefined && returnUrl != '') {
        window.location.href = returnUrl
      } else {
        window.location.href = '/'
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
