import React, { useEffect, useState } from 'react'
import { getUrlParam } from '../../util/app'
import RegisterForm from '../../components/User/RegisterForm'
import { registerUserApi } from '../../api/api'
import { message } from 'antd'

export default function Register() {
  const [loading, setLoading] = useState(false)
  const [returnUrl, setReturnUrl] = useState('')

  useEffect(() => {
    const url = getUrlParam('returnUrl')
    if (url != null && url != undefined && url != '') {
      setReturnUrl(url)
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
      message.error('Password length no less than 6')
      return
    }
    if (values.confirmPassword != values.password) {
      message.error('Password not match')
      return
    }

    const userBO = {
      username: values.username,
      password: values.password,
      confirmPassword: values.confirmPassword,
    }

    // form提交
    setLoading(true)
    const res = await registerUserApi(userBO)
    if (res.status == 200) {
      const user = res.data
      setLoading(false)
      if (returnUrl != null && returnUrl != undefined && returnUrl != '') {
        window.location.href = returnUrl
      } else {
        window.location.href = '/'
      }
    } else if (res.status == 500) {
      message.error((res as any).msg)
      setLoading(false)
      return
    }
  }

  return (
    <>
      <RegisterForm onFinish={registUser} loading={loading} />
    </>
  )
}
