import React, { useCallback, useEffect, useState } from 'react'
import AddressModal from '../../AddressModal'
import { serverUrl, getCookie } from '../../../util/app'
import { cities } from '../../../util/cities'
import axios from 'axios'
import { message } from 'antd'
import styles from './index.module.scss'

const Address = () => {
  const [visible, setVisible] = useState(false)
  const [addressList, setAddressList] = useState([])
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [defaultAddressId, setDefaultAddressId] = useState('')
  const [choosedAddressId, setChoosedAddressId] = useState('')
  const [receiver, setReceiver] = useState('')
  const [mobile, setMobile] = useState('')
  const [prov, setProv] = useState('北京')
  const [city, setCity] = useState('北京')
  const [district, setDistrict] = useState('东城区')
  const [detail, setDetail] = useState('')
  const [arr] = useState(cities)
  const [cityArr, setCityArr] = useState([])
  const [districtArr, setDistrictArr] = useState([])

  useEffect(() => {
    // updateCity();
    updateDistrict()
    // 通过cookie判断用户是否登录
    judgeUserLoginStatus()
    // renderOrderInfoList();
  }, [])

  useEffect(() => {
    if (!userInfo) return
    renderUserAddressList()
  }, [userInfo])

  // 通过cookie判断用户是否登录
  const judgeUserLoginStatus = () => {
    var userCookie = getCookie('user')
    if (userCookie != null && userCookie != undefined && userCookie != '') {
      var userInfoStr = decodeURIComponent(userCookie)
      if (
        userInfoStr != null &&
        userInfoStr != undefined &&
        userInfoStr != ''
      ) {
        var userInfo = JSON.parse(userInfoStr)
        // 判断是否是一个对象
        if (typeof userInfo == 'object') {
          setUserIsLogin(true)
          setUserInfo(userInfo)
        } else {
          setUserIsLogin(false)
          setUserInfo({})
        }
      }
    } else {
      setUserIsLogin(false)
      setUserInfo({})
    }
  }

  const renderUserAddressList = async () => {
    // 请求后端获得最新数据
    axios.defaults.withCredentials = true
    await axios
      .post(
        serverUrl + '/address/list?userId=' + userInfo.id,
        {},
        {
          headers: {
            headerUserId: userInfo.id,
            headerUserToken: userInfo.userUniqueToken,
          },
        }
      )
      .then((res) => {
        if (res.data.status == 200) {
          var addressList = res.data.data

          setAddressList(addressList)

          // 设置默认应该选中的地址id
          setDefaultChoosedAddressId(addressList)

          // 清空地址内容
          flushAddressForm()
        } else if (res.data.status == 500) {
          message.error(res.data.msg)
        } else {
          message.error(res.data.msg)
        }
      })
  }

  const flushAddressForm = () => {
    setReceiver('')
    setMobile('')
    setProv('北京')
    setCity('北京')
    setDistrict('东城区')
    setDetail('')

    // updateCity()
    updateDistrict()
  }

  useEffect(() => {
    for (var i in arr) {
      var obj = arr[i]
      if (obj.name == prov) {
        setCityArr(obj.sub)
        break
      }
    }
  }, [prov])

  useEffect(() => {
    cityArr.length > 0 && setCity(cityArr[1].name)
  }, [cityArr])

  const updateCity = () => {
    for (var i in arr) {
      var obj = arr[i]
      if (obj.name == prov) {
        setCityArr(obj.sub)
        break
      }
    }
    setCity(cityArr[1].name)
  }

  const updateDistrict = () => {
    for (var i in cityArr) {
      var obj = cityArr[i]
      if (obj.name == city) {
        setDistrictArr(obj.sub)
        break
      }
    }
    if (districtArr && districtArr.length > 0 && districtArr[1].name) {
      setDistrict(districtArr[1].name)
    } else {
      setDistrict('')
    }
  }

  const setDefaultChoosedAddressId = (addressList) => {
    var confirmAddress = {}
    for (var i = 0; i < addressList.length; i++) {
      var address = addressList[i]
      if (address.isDefault == 1) {
        setDefaultAddressId(address.id)
        confirmAddress = address
        // 如果当前页面还没有选中的地址，则把默认地址作为选中地址
        if (
          choosedAddressId == null ||
          choosedAddressId == undefined ||
          choosedAddressId == ''
        ) {
          setChoosedAddressId(address.id)
        }
        break
      }
    }

    // 赋值
    confirmAddress = confirmAddress
  }

  return (
    <div className={`contentWidth`}>
      <div className={styles.title}>选择收货地址</div>
      <div className={`${styles.addressList} fcb`}>
        {addressList.map((address, aindex) => {
          return (
            <div
              className={`${styles.item} ${aindex === 0 ? styles.active : ''}`}
              key={aindex}
            >
              <div className={`${styles.nameWrap} fcb`}>
                <span className={`${styles.name} fl`}>
                  {address.receiver} 收{' '}
                </span>
                {aindex === 0 && (
                  <span className={`${styles.default} fr`}>默认</span>
                )}
              </div>
              <div className={styles.address}>
                {address.province} {address.city} {address.district}{' '}
                {address.detail}
              </div>
              <div>{address.mobile}</div>
              <a className={styles.modifyBtn}>修改</a>
            </div>
          )
        })}
      </div>
      <a className={styles.modifyAddrBtn} onClick={() => setVisible(true)}>
        +新建地址
      </a>
      <AddressModal
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        onOk={(values) => {
          console.log(values)
        }}
      />
    </div>
  )
}

export default Address
