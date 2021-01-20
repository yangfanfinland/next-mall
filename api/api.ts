import request from '../util/request'

/**
 * Get user info
 * @param userId User Id
 * @param config Axios request config
 */
export const getUserInfoApi = async (userId: string, config: any) => {
  return request.get(`/center/userInfo?userId=${userId}`, config)
}

/**
 * User register
 * @param user
 */
export const registerUserApi = async (user: any) => {
    return request.post(`/passport/regist`, user)
}

/**
 * Update user info
 * @param userId User Id
 * @param user User obj to be updated
 * @param config Axios request config
 */
export const updateUserInfoApi = async (
  userId: string,
  user: any,
  config: any
) => {
  return request.post(`/userInfo/update?userId=${userId}`, user, config)
}

/**
 * Upload avartar
 * @param userId
 * @param form
 * @param config
 */
export const uploadFaceApi = async (
  userId: string,
  form: FormData,
  config: any
) => {
  return request.post(`/userInfo/uploadFace?userId=${userId}`, form, config)
}

/**
 * Get carousel
 */
export const getCarouselApi = async () => {
  return request.get('/index/carousel')
}

/**
 * Get categories
 */
export const getCategoriesApi = async () => {
  return request.get('/index/cats')
}

/**
 * Get sub categories by root category Id
 * @param rootCatId Root category Id
 */
export const getSubCategoriesApi = async (rootCatId: string) => {
  return request.get(`/index/subCat/${rootCatId}`)
}

/**
 * Get six new items by category Id
 * @param id Category Id
 */
export const getSixNewItemsByCategoryIdApi = async (id: number) => {
  return request.get(`/index/sixNewItems/${id}`)
}

/**
 * Get items by category Id
 * @param catId Category Id
 * @param sort
 * @param page
 * @param pageSize
 */
export const getCategotyItemsApi = async (
  catId: number,
  sort: string,
  page: number,
  pageSize: number
) => {
  return request.get(
    `/items/catItems?catId=${catId}&sort=${sort}&page=${page}&pageSize=${pageSize}`
  )
}

/**
 * Get items by search keyword
 * @param keywords Search keyword
 * @param sort
 * @param page
 * @param pageSize
 */
export const getSearchItemsApi = async (
  keywords: string,
  sort: string,
  page: number,
  pageSize: number
) => {
  return request.get(
    `/items/search?keywords=${encodeURIComponent(
      keywords
    )}&sort=${sort}&page=${page}&pageSize=${pageSize}`
  )
}

/**
 * Get item info
 * @param itemId Item id
 */
export const getItemInfoApi = async (itemId: string) => {
  return request.get(`/items/info/${itemId}`)
}

/**
 * Add item to shopping cart
 * @param userId Login user Id
 * @param shopcartItem shopcart item
 * @param config Axios request config
 */
export const addToShopcartApi = async (
  userId: string,
  shopcartItem: any,
  config: any
) => {
  return request.post(`/shopcart/add?userId=${userId}`, shopcartItem, config)
}

/**
 * Delete item from shopping cart
 * @param userId Login user Id
 * @param specId Specification Id
 * @param config Axios request config
 */
export const deleteFromShopcartApi = async (
  userId: string,
  specId: string,
  config: any
) => {
  return request.post(
    `/shopcart/del?userId=${userId}&itemSpecId=${specId}`,
    {},
    config
  )
}

/**
 * Refresh shopcart
 * @param itemSpecIds item specification id list
 */
export const refreshShopcartApi = async (itemSpecIds: string) => {
  return request.get(`/items/refresh?itemSpecIds=${itemSpecIds}`)
}

/**
 * Get address list
 * @param userId Login user Id
 * @param config
 */
export const getAddressListApi = async (userId: string, config: any) => {
  return request.post(`/address/list?userId=${userId}`, {}, config)
}

/**
 * Add address
 * @param address
 * @param config
 */
export const addAddressApi = async (address: any, config: any) => {
  return request.post(`/address/add`, address, config)
}

/**
 * Update addres
 * @param address
 * @param config
 */
export const updateAddressApi = async (address: any, config: any) => {
  return request.post(`/address/update`, address, config)
}

/**
 * Set default address
 * @param userId
 * @param addressId
 * @param config
 */
export const setDefaultAddressApi = async (
  userId: string,
  addressId: string,
  config: any
) => {
  return request.post(
    `/address/setDefalut?userId=${userId}&addressId=${addressId}`,
    {},
    config
  )
}

/**
 * Delete address
 * @param userId Login user Id
 * @param addressId Address Id
 * @param config
 */
export const deleteAddressApi = async (
  userId: string,
  addressId: string,
  config: any
) => {
  return request.post(
    `/address/delete?userId=${userId}&addressId=${addressId}`,
    {},
    config
  )
}

/**
 * Get order status counts
 * @param userId
 * @param config
 */
export const getOrderStatusCountsApi = async (userId: string, config: any) => {
  return request.post(`/myorders/statusCounts?userId=${userId}`, {}, config)
}

/**
 * Get order trend
 * @param userId
 * @param page
 * @param pageSize
 * @param config
 */
export const getOrderTrendApi = async (
  userId: string,
  page: number,
  pageSize: number,
  config: any
) => {
  return request.post(
    `/myorders/trend?userId=${userId}&page=${page}&pageSize=${pageSize}`,
    {},
    config
  )
}

/**
 * Get order list by order status
 * @param userId
 * @param orderStatus
 * @param page
 * @param pageSize
 * @param config
 */
export const getOrderListApi = async (
  userId: string,
  orderStatus: number,
  page: number,
  pageSize: number,
  config: any
) => {
  return request.post(
    `/myorders/query?userId=${userId}&orderStatus=${orderStatus}&page=${page}&pageSize=${pageSize}`,
    {},
    config
  )
}

/**
 * Create order
 * @param order Order to be created
 * @param config Axios request config
 */
export const createOrderApi = async (order: any, config: any) => {
  return request.post(`/orders/create`, order, config)
}

/**
 * Delete order
 * @param userId
 * @param orderId
 * @param config
 */
export const deleteOrderApi = async (
  userId: string,
  orderId: string,
  config: any
) => {
  return request.post(
    `/myorders/delete?userId=${userId}&orderId=${orderId}`,
    {},
    config
  )
}

/**
 * Confirm receive
 * @param userId
 * @param orderId
 * @param config
 */
export const confirmReceiveApi = async (
  userId: string,
  orderId: string,
  config: any
) => {
  return request.post(
    `/myorders/confirmReceive?userId=${userId}&orderId=${orderId}`,
    {},
    config
  )
}

/**
 * Get paid order by order Id
 * @param orderId Order Id
 * @param config
 */
export const getPaidOrderInfoApi = async (orderId: string, config: any) => {
  return request.post(`/orders/getPaidOrderInfo?orderId=${orderId}`, {}, config)
}

/**
 * Get comment level counts
 * @param itemId Product item Id
 */
export const getCommentLevelApi = async (itemId: string) => {
  return request.get(`/items/commentLevel?itemId=${itemId}`)
}

/**
 * Get my comment list
 * @param userId
 * @param page
 * @param pageSize
 * @param config
 */
export const getMyCommentListApi = async (
  userId: string,
  page: number,
  pageSize: number,
  config: any
) => {
  return request.post(
    `/mycomments/query?userId=${userId}&page=${page}&pageSize=${pageSize}`,
    {},
    config
  )
}

/**
 * Get comments by product item Id
 * @param itemId
 * @param level
 * @param page
 * @param pageSize
 */
export const getCommentsApi = async (
  itemId: string,
  level: number,
  page: number,
  pageSize: number
) => {
  return request.get(
    `/items/comments?itemId=${itemId}&level=${level}&page=${page}&pageSize=${pageSize}`
  )
}

/**
 * Do comment
 * @param userId
 * @param orderId
 * @param config
 */
export const doCommentApi = async (
  userId: string,
  orderId: string,
  config: any
) => {
  return request.post(
    `/mycomments/pending?userId=${userId}&orderId=${orderId}`,
    {},
    config
  )
}

/**
 * Save comment
 */
export const saveCommentApi = async (
  userId: string,
  orderId: string,
  orderItemList: any,
  config: any
) => {
  return request.post(
    `/mycomments/saveList?userId=${userId}&orderId=${orderId}`,
    orderItemList,
    config
  )
}

/**
 * Get Ali payment form
 * @param merchantUserId
 * @param merchantOrderId
 */
export const goAlipayApi = async (
  merchantUserId: string,
  merchantOrderId: string,
  config: any
) => {
  return request.post(
    `/payment/goAlipay?merchantUserId=${merchantUserId}&merchantOrderId=${merchantOrderId}`,
    {},
    config
  )
}
