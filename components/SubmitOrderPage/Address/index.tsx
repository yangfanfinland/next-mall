import React, { useEffect, useState } from 'react'
import AddressModal from '../../AddressModal'
import { checkMobile } from '../../../util/app'
import { cities } from '../../../util/cities'
import { message } from 'antd'
import { useSelector } from 'react-redux'
import { getAddressListApi, addAddressApi, updateAddressApi, deleteAddressApi, setDefaultAddressApi } from '../../../api/api'
import styles from './index.less'

const Address = ({
  chooseAddressCallback,
}: {
  chooseAddressCallback?: (choosedAddress) => void
}) => {
  const [visible, setVisible] = useState(false)
  const [addressList, setAddressList] = useState([])
  const [userIsLogin, setUserIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [defaultAddressId, setDefaultAddressId] = useState('')
  const [choosedAddressId, setChoosedAddressId] = useState('')
  const [prov, setProv] = useState('北京')
  const [city, setCity] = useState('北京')
  const [district, setDistrict] = useState('东城区')
  const [arr] = useState(cities)
  const [cityArr, setCityArr] = useState([])
  const [districtArr, setDistrictArr] = useState([])
  const [updatedAddressId, setUpdatedAddressId] = useState('')
  const [initialValues, setInitialValues] = useState<any>()
  const [confirmAddress, setConfirmAddress] = useState<any>()
  const user = useSelector((store) => store.user)

  useEffect(() => {
    // updateCity();
    updateDistrict()
    judgeUserLoginStatus()
    // renderOrderInfoList();
  }, [])

  useEffect(() => {
    if (!userInfo) return
    renderUserAddressList()
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

  const renderUserAddressList = async () => {
    // 请求后端获得最新数据
    const res = await getAddressListApi(userInfo.id, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      const addressList = res.data

      setAddressList(addressList)

      // 设置默认应该选中的地址id
      setDefaultChoosedAddressId(addressList)

      // 清空地址内容
      flushAddressForm()
    } else {
      message.error((res as any).msg)
    }
  }

  const flushAddressForm = () => {
    setProv('北京')
    setCity('北京')
    setDistrict('东城区')

    // updateCity()
    updateDistrict()
  }

  useEffect(() => {
    for (let i in arr) {
      const obj = arr[i]
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
    for (let i in arr) {
      const obj = arr[i]
      if (obj.name == prov) {
        setCityArr(obj.sub)
        break
      }
    }
    setCity(cityArr[1].name)
  }

  const updateDistrict = () => {
    for (let i in cityArr) {
      const obj = cityArr[i]
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

  const chooseAddress = (choosedAddressId) => {
    setChoosedAddressId(choosedAddressId)
    // 确认地址动态改变
    renderConfirmAddress(choosedAddressId)
  }

  const renderConfirmAddress = (addressId) => {
    // 提交订单的确认地址要跟着动态改变
    let tempConfirmAddress = null
    for (let i = 0; i < addressList.length; i++) {
      const tmpAddress = addressList[i]
      if (tmpAddress.id == addressId) {
        tempConfirmAddress = tmpAddress
        break
      }
    }
    // 赋值
    setConfirmAddress(tempConfirmAddress)
    chooseAddressCallback(tempConfirmAddress)
  }

  const setDefaultChoosedAddressId = (addressList) => {
    let tempConfirmAddress = {}
    for (let i = 0; i < addressList.length; i++) {
      const address = addressList[i]
      if (address.isDefault == 1) {
        setDefaultAddressId(address.id)
        tempConfirmAddress = address
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
    setConfirmAddress(tempConfirmAddress)
    chooseAddressCallback(tempConfirmAddress)
  }

  const editAddress = (addressId) => {
    // 获得编辑的地址内容
    let updateAddress = null
    for (let i = 0; i < addressList.length; i++) {
      const tmpAddress = addressList[i]
      if (tmpAddress.id == addressId) {
        updateAddress = tmpAddress
        break
      }
    }

    // 赋值
    setInitialValues({
      receiver: updateAddress.receiver,
      mobile: updateAddress.mobile,
      prov: updateAddress.province,
      city: updateAddress.city,
      district: updateAddress.district,
      detail: updateAddress.detail,
    })

    // 设置更新地址的id
    setUpdatedAddressId(addressId)

    // 弹出对话框
    setVisible(true)
  }

  const saveNewAddressOrUpdate = async (values) => {
    const receiver = values.receiver
    if (receiver == null || receiver == '' || receiver == undefined) {
      message.warning('收货人姓名不能为空')
      return
    }
    if (receiver.length > 12) {
      message.warning('收货人姓名不能太长')
      return
    }

    const mobile = values.mobile
    if (mobile == null || mobile == '' || mobile == undefined) {
      message.warning('手机不能为空')
      return
    }
    if (mobile.length != 11) {
      message.warning('手机号长度为11位')
      return
    }

    if (!checkMobile(mobile)) {
      message.warning('请输入有效的手机号码！')
      return
    }

    const prov = values.prov
    const city = values.city
    const district = values.district

    const detail = values.detail
    if (detail == null || detail == '' || detail == undefined) {
      message.warning('详细地址不能为空')
      return
    }

    // 添加新地址
    const addressId = updatedAddressId

    // 地址id为空，则新增地址，否则更新地址
    if (addressId == '' || addressId == undefined || addressId == null) {
      const res = await addAddressApi(
        {
          userId: userInfo.id,
          receiver: receiver,
          mobile: mobile,
          province: prov,
          city: city,
          district: district,
          detail: detail,
        },
        {
          headers: {
            headerUserId: userInfo.id,
            headerUserToken: userInfo.userUniqueToken,
          },
        }
      )

      if (res.status == 200) {
        closeAddressDialog()
        renderUserAddressList()

        // 设置更新地址的id为空
        setUpdatedAddressId('')
      } else if (res.status == 500) {
        message.error((res as any).msg)
      }
    } else {
      const res = await updateAddressApi(
        {
          addressId: addressId,
          userId: userInfo.id,
          receiver: receiver,
          mobile: mobile,
          province: prov,
          city: city,
          district: district,
          detail: detail,
        },
        {
          headers: {
            headerUserId: userInfo.id,
            headerUserToken: userInfo.userUniqueToken,
          },
        }
      )

      if (res.status == 200) {
        closeAddressDialog()
        renderUserAddressList()
      } else if (res.status == 500) {
        message.error((res as any).msg)
      }
    }
  }

  // 删除地址
  const deleteAddress = async (addressId) => {
    const isDel = window.confirm('确认删除改地址吗')
    if (!isDel) {
      return
    }

    // 如果删除的地址是默认地址或者选中地址，则choosedAddressId和defaultAddressId要设置为空
    if (addressId == choosedAddressId) {
      setChoosedAddressId('')
      chooseAddressCallback(null)
    }

    if (addressId == defaultAddressId) {
      setDefaultAddressId('')
    }

    const res = await deleteAddressApi(userInfo.id, addressId, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      renderUserAddressList()
    } else {
      message.error((res as any).msg)
    }
  }

  // 设置默认地址
  const setDefaultAddress = async (addressId) => {
    const res = await setDefaultAddressApi(userInfo.id, addressId, {
      headers: {
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userUniqueToken,
      },
    })

    if (res.status == 200) {
      renderUserAddressList()
    } else {
      message.error((res as any).msg)
    }
  }

  const closeAddressDialog = () => {
    setVisible(false)
    // 设置更新地址的id为空
    setUpdatedAddressId('')
    flushAddressForm()
  }

  return (
    <div className={`contentWidth`}>
      <div className={styles.title}>选择收货地址</div>
      <div className={`${styles.addressList} fcb`}>
        {addressList.map((address, aindex) => {
          return (
            <div
              className={`${styles.item} ${
                address.id === choosedAddressId ? styles.active : ''
              }`}
              key={aindex}
              onClick={() => chooseAddress(address.id)}
            >
              <div className={`${styles.nameWrap} fcb`}>
                <span className={`${styles.name} fl`}>
                  {address.receiver} 收{' '}
                </span>
                {address.isDefault === 1 && (
                  <span className={`${styles.default} fr`}>默认地址</span>
                )}
              </div>
              <div className={styles.address}>
                {address.province} {address.city} {address.district}{' '}
                {address.detail}
              </div>
              <div>{address.mobile}</div>
              {address.isDefault !== 1 && (
                <>
                  <a
                    className={styles.modifyBtn}
                    onClick={() => setDefaultAddress(address.id)}
                  >
                    设为默认
                  </a>
                  |
                </>
              )}
              <a
                className={styles.modifyBtn}
                onClick={() => editAddress(address.id)}
              >
                修改
              </a>
              |
              <a
                className={styles.modifyBtn}
                onClick={() => deleteAddress(address.id)}
              >
                删除
              </a>
            </div>
          )
        })}
      </div>
      <a className={styles.modifyAddrBtn} onClick={() => setVisible(true)}>
        +新建地址
      </a>
      <AddressModal
        initialValues={initialValues}
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        onOk={saveNewAddressOrUpdate}
      />
    </div>
  )
}

export default Address
