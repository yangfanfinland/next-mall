import request from "../util/request"

/**
 * Get carousel
 */
export const getCarousel = async () => {
    return request.get('/index/carousel');
}

/**
 * Get categories
 */
export const getCategoriesApi = async () => {
    return request.get('/index/cats');
}

/**
 * Get sub categories by root category Id
 * @param rootCatId Root category Id
 */
export const getSubCategories = async (rootCatId: string) => {
    return request.get(`/index/subCat/${rootCatId}`);
}

/**
 * Get six new items by category Id
 * @param id Category Id
 */
export const getSixNewItemsByCategoryId = async (id: number) => {
    return request.get(`/index/sixNewItems/${id}`);
}

/**
 * Get items by category Id
 * @param catId Category Id
 * @param sort
 * @param page 
 * @param pageSize 
 */
export const getCategotyItems = async (catId: number, sort: string, page: number, pageSize: number) => {
    return request.get(`/items/catItems?catId=${catId}&sort=${sort}&page=${page}&pageSize=${pageSize}`)
}

/**
 * Get items by search keyword
 * @param keywords Search keyword
 * @param sort 
 * @param page 
 * @param pageSize 
 */
export const getSearchItems = async (keywords: string, sort: string, page: number, pageSize: number) => {
    return request.get(`/items/search?keywords=${encodeURIComponent(keywords)}&sort=${sort}&page=${page}&pageSize=${pageSize}`)
}

/**
 * Get item info
 * @param itemId Item id
 */
export const getItemInfo = async (itemId: string) => {
    return request.get(`/items/info/${itemId}`)
}

/**
 * Add item to shopping cart
 * @param userId Login user Id
 * @param shopcartItem shopcart item
 * @param config Axios request config
 */
export const addToShopcart = async (userId: string, shopcartItem: any, config: any) => {
    return request.post(`/shopcart/add?userId=${userId}`, shopcartItem, config)
}

/**
 * Delete item from shopping cart
 * @param userId Login user Id
 * @param specId Specification Id
 * @param config Axios request config
 */
export const deleteFromShopcart = async (userId: string, specId: string, config: any) => {
    return request.post(`/shopcart/del?userId=${userId}&itemSpecId=${specId}`, {}, config)
}

/**
 * Refresh shopcart
 * @param itemSpecIds item specification id list
 */
export const refreshShopcart = async (itemSpecIds: string) => {
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
export const setDefaultAddressApi = async (userId: string, addressId: string, config: any) => {
    return request.post(`/address/setDefalut?userId=${userId}&addressId=${addressId}`, {}, config)
}

/**
 * Delete address
 * @param userId Login user Id
 * @param addressId Address Id
 * @param config 
 */
export const deleteAddressApi = async (userId: string, addressId: string, config: any) => {
    return request.post(`/address/delete?userId=${userId}&addressId=${addressId}`, {}, config)
}

/**
 * Create order
 * @param order Order to be created
 * @param config Axios request config
 */
export const createOrder = async (order: any, config: any) => {
    return request.post(`/orders/create`, order, config)
}

/**
 * Get paid order by order Id
 * @param orderId Order Id
 * @param config 
 */
export const getPaidOrderInfo = async (orderId: string, config: any) => {
    return request.post(`/orders/getPaidOrderInfo?orderId=${orderId}`, {}, config)
}

/**
 * Get Ali payment form
 * @param merchantUserId 
 * @param merchantOrderId 
 */
export const goAlipay = async (merchantUserId: string, merchantOrderId: string, config: any) => {
    return request.post(`/payment/goAlipay?merchantUserId=${merchantUserId}&merchantOrderId=${merchantOrderId}`, {}, config)
}

/**
 * Get comment level counts
 * @param itemId Product item Id
 */
export const getCommentLevel = async (itemId: string) => {
    return request.get(`/items/commentLevel?itemId=${itemId}`)
}

/**
 * Get comments by product item Id
 * @param itemId 
 * @param level 
 * @param page 
 * @param pageSize 
 */
export const getComments = async (itemId: string, level: number, page: number, pageSize: number) => {
    return request.get(`/items/comments?itemId=${itemId}&level=${level}&page=${page}&pageSize=${pageSize}`)
}