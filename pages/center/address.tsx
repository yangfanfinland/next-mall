import React from 'react'
import UserCenterNav from '../../components/UserCenterNav'
import HtmlHead from '../../components/HtmlHead'
import SearchArea from '../../components/SearchArea'
import Address from '../../components/SubmitOrderPage/Address'
import styles from '../../static/styles/address.less'

const DeliveryAddress = () => {
  return (
    <>
      <HtmlHead title={'宜选商城 - 个人中心'} />
      <SearchArea />
      <div className={`${styles.center} contentWidth`}>
        <UserCenterNav router="address" />
        <Address />
      </div>
    </>
  )
}

export default DeliveryAddress
