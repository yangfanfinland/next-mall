import request from "../util/request"

// Get categories
export const getCategoriesApi = async () => {
    return request.get('/index/cats');
}

// Get six new items by category Id
export const getSixNewItemsByCategoryId = async (id: number) => {
    return request.get(`/index/sixNewItems/${id}`);
}