import React, { useState } from 'react'
import { Button, Form, Input } from "antd"
import Router from "next/router"
import { UserAddOutlined, KeyOutlined } from '@ant-design/icons'
import styles from './styles.less'

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 24},
}

const RegisterForm = ({ onFinish, onFinishFailed, loading }: { onFinish: (values: any) => void, onFinishFailed?: (errorInfo: any) => void, loading: boolean }) => {

    const [ formData, setFormData ] = useState<any>({ });
    const [ form ] = Form.useForm();

    return (
        <div className={styles.userWrap}>
            <div className={styles.title}>免费注册</div>
            <Form
                {...layout}
                name="login"
                // initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                form={form}
                onValuesChange={(changedValues, all) => {
                    setFormData(all);
                }}
            >
                <Form.Item
                    name="username"
                    rules={[{required: true, message: '请输入用户名'}]}
                >
                    <Input prefix={<UserAddOutlined className={`${styles.userIcon} ${styles.user}`} />}
                           placeholder={'请输入用户名'}
                           maxLength={11}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{required: true, message: '请输入密码'}]}
                    className={styles.codeItem}
                >
                    <Input.Password prefix={<KeyOutlined className={`${styles.userIcon} ${styles.pwd}`} />}
                           placeholder={'请输入密码'}
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    rules={[{required: true, message: '请输入确认密码'}]}
                >
                    <Input.Password prefix={<KeyOutlined className={`${styles.userIcon} ${styles.pwd}`} />}
                                    placeholder={'请输入确认密码'}
                    />
                </Form.Item>
                <Button type="primary" loading={loading} disabled={loading} htmlType="submit">注册</Button>
                <div className={styles.bottom}>
                    <a className={`gary`} onClick={() => Router.replace('/user/login')}>返回登录</a>
                </div>
            </Form>
        </div>
    )
}

export default RegisterForm