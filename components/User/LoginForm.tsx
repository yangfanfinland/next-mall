import React from 'react'
import { Button, Form, Input } from "antd"
import styles from './styles.less'
import { useIntl } from "react-intl"
import { UserAddOutlined, KeyOutlined } from '@ant-design/icons'

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 24},
}

const LoginForm = ({ onFinish, onFinishFailed, loading }: { onFinish: (values: any) => void, onFinishFailed?: (errorInfo: any) => void, loading: boolean }) => {
    const { formatMessage } = useIntl()
    const f = id => formatMessage({ id })
    
    return (
        <div className={styles.userWrap}>
            <div className={styles.title}>{f("login.title")}</div>
            <Form
                {...layout}
                name="login"
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    name="username"
                    rules={[{required: true, message: f("login.username")}]}
                >
                    <Input prefix={<UserAddOutlined className={`${styles.userIcon} ${styles.user}`} />}
                           placeholder={f("login.username")}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{required: true, message: f("login.password")}]}
                >
                    <Input.Password prefix={<KeyOutlined className={`${styles.userIcon} ${styles.pwd}`} />}
                                    placeholder={f("login.password")}
                    />
                </Form.Item>
                <div className={`${styles.forgetPwd} tr`}>
                    <a className={styles.alink} href={'/user/forgetPassword'}>{f("login.forgetPasswordLink")}</a>
                </div>
                <Button type="primary"
                        className={`${styles.loginItem}`}
                        htmlType="submit"
                        disabled={loading}
                        loading={loading}>{f("login.loginBtn")}</Button>
                <div className={styles.bottom}>
                    <a href={'/user/register'}>{f("login.registerLink")}</a>
                </div>
            </Form>
        </div>
    )
}

export default LoginForm