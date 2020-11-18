import React, { useEffect, useState } from 'react'
import Link from "next/link"
import { Dropdown, Menu } from "antd"
import { DownOutlined } from '@ant-design/icons'
import { getCookie } from '../../util/app'
import { useIntl } from "react-intl"
import styles from './index.module.scss'

const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="/myOrder">
                我的订单
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="/authentication">
                实名认证
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="/addressList">
                收货地址
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="/collectionGoods">
                收藏商品
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="/followStore">
                关注店铺
            </a>
        </Menu.Item>
    </Menu>
)

const Header = () => {

    const [ userIsLogin, setUserIsLogin ] = useState(false)
    const [ userInfo, setUserInfo ] = useState<{ username: string }>()
    const { formatMessage } = useIntl()
    const f = id => formatMessage({ id })

    useEffect(() => {
        var userCookie = getCookie("user");
        if (userCookie != null && userCookie != undefined && userCookie != '') {
            var userInfoStr = decodeURIComponent(userCookie);
            if (userInfoStr != null && userInfoStr != undefined && userInfoStr != '') {
                var userInfo = JSON.parse(userInfoStr);
                // 判断是否是一个对象
                if ( typeof(userInfo)  == "object" ) {
                    setUserIsLogin(true);
                    setUserInfo(userInfo);
                } else {
                    setUserIsLogin(false);
                    setUserInfo({ username: "" })
                }
            }
        } else {
            setUserIsLogin(false);
            setUserInfo({ username: "" })
        }
    }, [])

    const goUserCenter = (e) => {
        e.preventDefault()
    }

    return (
        <div className={`${styles.header} headerHeight`}>
            <ul className={`${styles.headerInner} contentWidth`}>
                <li>
                    <span className={styles.welcomeMsg}>{f("header.welcome")}</span>
                    {
                        userIsLogin ?
                            <span>{userInfo.username}</span>
                            :
                            <>
                                <Link href={'/user/login'}>
                                    <a>{f("header.login")}</a>
                                </Link>
                                <span className={styles.line}>|</span>
                                <Link href={'/user/register'}>
                                    <a>{f("header.register")}</a>
                                </Link>
                            </>
                    }
                </li>
                <li>
                    <a href="/myOrder" target={'_blank'} className={styles.buyItem}>{f("header.myOrder")}</a>
                    <a href="/car" target={'_blank'} className={styles.buyItem}>{f("header.shoppingCart")}</a>
                    <Dropdown overlay={menu}>
                        <a href="" className={`${styles.buyItem}`} onClick={e => e.preventDefault()}>{f("header.personalCenter")}<DownOutlined/></a>
                    </Dropdown>
                    <a href="" className={styles.buyItem}>商家入驻</a>
                </li>
            </ul>
        </div>
    )
}

export default Header