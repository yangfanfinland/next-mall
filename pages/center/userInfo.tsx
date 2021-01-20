import React, { useEffect, useState } from 'react'
import { Form, Input, message, Button, Radio, DatePicker } from 'antd'
import UserCenterNav from '../../components/UserCenterNav'
import HtmlHead from '../../components/HtmlHead'
import SearchArea from '../../components/SearchArea'
import { checkEmail, checkMobile } from '../../util/app'
import { getUserInfoApi, uploadFaceApi, updateUserInfoApi } from '../../api/api'
import moment from 'moment'
import { useSelector } from 'react-redux'
import styles from '../../static/styles/userInfo.less'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

const dateFormat = 'YYYY-MM-DD'

const UserInfo = () => {
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [userInfoMore, setUserInfoMore] = useState<any>()
  const user = useSelector((store) => store.user)

  const onFinish = (values: any) => {}

  useEffect(() => {
    judgeUserLoginStatus()
  }, [])

  useEffect(() => {
    if (!userInfo) return
    renderUserInfo()
  }, [userInfo])

  const judgeUserLoginStatus = () => {
    if (user && user.id) {
      setUserIsLogin(true)
      setUserInfo(user)
    } else {
      setUserIsLogin(false)
      setUserInfo({})
    }
  }

  const renderUserInfo = async () => {
    // 请求后端获得最新数据
    const res = await getUserInfoApi(userInfo.id, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      const userInfoMore = res.data
      setUserInfoMore(userInfoMore)
    } else {
      message.error((res as any).msg)
    }
  }

  const uploadFace = async (e) => {
    let f = (document.getElementById('userFace') as any).files[0]

    let multiForm = new FormData() //创建一个form对象
    multiForm.append('file', f, f.name) //append 向form表单添加数据

    // 请求后端获得最新数据
    const res = await uploadFaceApi(userInfo.id, multiForm, {
      headers: {
        'Content-Type': 'multipart/form-data',
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      message.success('头像上传成功!')
      window.location.reload()
    } else {
      message.error((res as any).msg)
    }
  }

  const saveUserInfo = async (values) => {
    const nickname = values.nickname
    if (nickname == null || nickname == '' || nickname == undefined) {
      message.warning('昵称不能为空')
      return
    }
    if (nickname.length > 12) {
      message.warning('昵称长度不能超过12位')
      return
    }

    const realname = values.realname
    if (realname != null && realname != '' && realname != undefined) {
      if (realname.length > 12) {
        message.warning('真实姓名长度不能超过12位')
        return
      }
    }

    console.log(values)

    const mobile = values.mobile
    if (mobile != null && mobile != '' && mobile != undefined) {
      if (mobile.length != 11) {
        message.warning('手机号长度为11位')
        return
      }

      if (!checkMobile(mobile)) {
        message.warning('请输入有效的手机号码！')
        return
      }
    }

    const email = values.email
    if (email != null && email != '' && email != undefined) {
      if (!checkEmail(email)) {
        message.warning('请输入有效的邮箱地址！')
        return
      }
    }

    // 请求后端获得最新数据
    const res = await updateUserInfoApi(userInfo.id, values, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      message.success('用户信息修改成功!')
      window.location.reload()
    } else {
      message.error((res as any).msg)
    }
  }

  return (
    <>
      <HtmlHead title={'宜选商城 - 个人中心'} />
      <SearchArea />
      <div className={`${styles.center} contentWidth`}>
        <UserCenterNav router="userInfo" />

        {userInfoMore && (
          <div className={`${styles['user-info']}`}>
            <div className={`${styles['user-infoPic']}`}>
              <div className={`${styles['filePic']}`}>
                <input
                  className={`${styles['inputPic']}`}
                  type="file"
                  id="userFace"
                  onChange={uploadFace}
                  accept="image/gif,image/jpeg,image/jpg,image/png"
                />
                <img
                  className={`${styles['am-img-thumbnail']}`}
                  src={userInfo.face}
                  alt=""
                />
              </div>
              <div className={`${styles['info-m']}`}>
                <div>
                  <b>
                    用户名：<i>{userInfo.username}</i>
                  </b>
                </div>
              </div>
            </div>
            <div className="info-main">
              <Form {...layout} name="nest-messages" onFinish={saveUserInfo}>
                <Form.Item
                  name="nickname"
                  label="昵称"
                  rules={[{ required: true }]}
                  initialValue={userInfoMore.nickname}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="realname"
                  label="真实姓名"
                  rules={[{ required: true }]}
                  initialValue={userInfoMore.realname}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="sex"
                  label="性别"
                  initialValue={userInfoMore.sex}
                >
                  <Radio.Group>
                    <Radio value={1}>男</Radio>
                    <Radio value={0}>女</Radio>
                    <Radio value={2}>保密</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  name="birthday"
                  label="生日"
                  rules={[
                    {
                      type: 'object',
                      required: true,
                      message: 'Please select time!',
                    },
                  ]}
                  initialValue={moment(userInfoMore.birthday)}
                >
                  <DatePicker format={dateFormat} />
                </Form.Item>
                <Form.Item
                  name="mobile"
                  label="手机"
                  rules={[{ required: true }]}
                  initialValue={userInfoMore.mobile}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="电子邮件"
                  rules={[{ type: 'email' }]}
                  initialValue={userInfoMore.email}
                >
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                  <Button type="primary" htmlType="submit">
                    保存修改
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default UserInfo
