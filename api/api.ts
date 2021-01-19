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