import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Dropdown, Menu } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/actions/users'
import styles from './index.less'

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/center/order">
        My order
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/center/address">
        Address list
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/center/collection">
        Saved products
      </a>
    </Menu.Item>
  </Menu>
)

const Header = () => {
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<{ username: string }>()
  const { formatMessage } = useIntl()
  const f = (id) => formatMessage({ id })
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user && user.id) {
      setUserIsLogin(true)
      setUserInfo(user)
    } else {
      setUserIsLogin(false)
      setUserInfo({ username: '' })
    }
  }, [user])

  const goUserCenter = (e) => {
    e.preventDefault()
  }

  const handleLogout = useCallback(
    (e) => {
      e.preventDefault()
      dispatch(logout())
    },
    [dispatch]
  )

  return (
    <div className={`${styles.header} headerHeight`}>
      <ul className={`${styles.headerInner} contentWidth`}>
        <li>
          <span className={styles.welcomeMsg}>{f('header.welcome')}</span>
          {userIsLogin ? (
            <>
              <span>{userInfo.username}</span> |{' '}
              <a href="" onClick={(e) => handleLogout(e)}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link href={'/user/login'}>
                <a>{f('header.login')}</a>
              </Link>
              <span className={styles.line}>|</span>
              <Link href={'/user/register'}>
                <a>{f('header.register')}</a>
              </Link>
            </>
          )}
        </li>
        <li>
          <a href="/center/order" id="myOrder" target={'_blank'} className={styles.buyItem}>
            {f('header.myOrder')}
          </a>
          <a href="/shopcart" target={'_blank'} className={styles.buyItem}>
            {f('header.shoppingCart')}
          </a>
          <Dropdown overlay={menu}>
            <a
              href=""
              className={`${styles.buyItem}`}
              onClick={(e) => e.preventDefault()}
            >
              {f('header.personalCenter')}
              <DownOutlined />
            </a>
          </Dropdown>
        </li>
      </ul>
    </div>
  )
}

export default Header
