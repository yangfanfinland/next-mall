import request from "../util/request"

/**
 * Get categories
 */
export const getCategoriesApi = async () => {
    return request.get('/index/cats');
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