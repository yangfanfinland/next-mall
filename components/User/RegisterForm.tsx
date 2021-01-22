import React, { useState } from 'react'
import { Button, Form, Input } from 'antd'
import Router from 'next/router'
import { UserAddOutlined, KeyOutlined } from '@ant-design/icons'
import styles from './styles.less'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
}

const RegisterForm = ({
  onFinish,
  onFinishFailed,
  loading,
}: {
  onFinish: (values: any) => void
  onFinishFailed?: (errorInfo: any) => void
  loading: boolean
}) => {
  const [formData, setFormData] = useState<any>({})
  const [form] = Form.useForm()

  return (
    <div className={styles.userWrap}>
      <div className={styles.title}>Register</div>
      <Form
        {...layout}
        name="login"
        // initialValues={{remember: true}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
        onValuesChange={(changedValues, all) => {
          setFormData(all)
        }}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Fill in username please' }]}
        >
          <Input
            prefix={
              <UserAddOutlined
                className={`${styles.userIcon} ${styles.user}`}
              />
            }
            placeholder={'Fill in username please'}
            maxLength={11}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Fill in password please' }]}
          className={styles.codeItem}
        >
          <Input.Password
            prefix={
              <KeyOutlined className={`${styles.userIcon} ${styles.pwd}`} />
            }
            placeholder={'Fill in password please'}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: 'Fill in confirm password please' },
          ]}
        >
          <Input.Password
            prefix={
              <KeyOutlined className={`${styles.userIcon} ${styles.pwd}`} />
            }
            placeholder={'Fill in confirm password please'}
          />
        </Form.Item>
        <Button
          type="primary"
          loading={loading}
          disabled={loading}
          htmlType="submit"
        >
          Register
        </Button>
        <div className={styles.bottom}>
          <a className={`gary`} onClick={() => Router.replace('/user/login')}>
            Go to login
          </a>
        </div>
      </Form>
    </div>
  )
}

export default RegisterForm
