export const serverUrl = 'http://localhost:8088'
export const shopServerUrl = "http://localhost:8080/foodie-shop/"
//export const paymentServerUrl = "http://localhost:8089"
export const paymentServerUrl = "http://payment.t.mukewang.com/foodie-payment"
const cookieDomain = 'localhost;'

export function getUrlParam(paramName) {
  var reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)') //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg) //匹配目标参数
  if (r != null) return decodeURI(r[2])
  return null //返回参数值
}

export function getCookie(cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1)
    if (c.indexOf(name) != -1) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

/**
 * 获得购物车列表
 */
export function getShopcartList() {
  // 判断有没有购物车，如果没有购物车，则new 一个购物车list
  // 如果有购物车，则直接把shopcartItem丢进去
  var foodieShopcartCookie = getCookie('shopcart')
  var foodieShopcart = []
  if (
    foodieShopcartCookie != null &&
    foodieShopcartCookie != '' &&
    foodieShopcartCookie != undefined
  ) {
    var foodieShopcartStr = decodeURIComponent(foodieShopcartCookie)
    foodieShopcart = JSON.parse(foodieShopcartStr)

    // 如果不是对象，则重新复制为空数组
    if (typeof foodieShopcart != 'object') {
      foodieShopcart = []
    }
  }
  return foodieShopcart
}

/**
 * 获得购物车中的数量
 */
export function getShopcartItemCounts() {
  // 判断有没有购物车，如果没有购物车，则new 一个购物车list
  // 如果有购物车，则直接把shopcartItem丢进去
  var foodieShopcartCookie = getCookie('shopcart')
  var foodieShopcart = []
  if (
    foodieShopcartCookie != null &&
    foodieShopcartCookie != '' &&
    foodieShopcartCookie != undefined
  ) {
    var foodieShopcartStr = decodeURIComponent(foodieShopcartCookie)
    foodieShopcart = JSON.parse(foodieShopcartStr)

    // 如果不是对象，则重新复制为空数组
    if (typeof foodieShopcart != 'object') {
      foodieShopcart = []
    }
  }
  return foodieShopcart.length
}

export function addItemToShopcart(pendingItem) {
  // 判断有没有购物车，如果没有购物车，则new 一个购物车list
  // 如果有购物车，则直接把shopcartItem丢进去
  var foodieShopcartCookie = getCookie('shopcart')
  var foodieShopcart = []
  if (
    foodieShopcartCookie != null &&
    foodieShopcartCookie != '' &&
    foodieShopcartCookie != undefined
  ) {
    var foodieShopcartStr = decodeURIComponent(foodieShopcartCookie)
    foodieShopcart = JSON.parse(foodieShopcartStr)

    // 如果不是对象，则重新复制为空数组
    if (typeof foodieShopcart != 'object') {
      foodieShopcart = []
    }

    var isHavingItem = false
    // 如果添加的商品已经存在与购物车中，则购物车中已经存在的商品数量累加新增的
    for (var i = 0; i < foodieShopcart.length; i++) {
      var tmpItem = foodieShopcart[i]
      var specId = tmpItem.specId
      if (specId == pendingItem.specId) {
        isHavingItem = true
        var newCounts = tmpItem.buyCounts + pendingItem.buyCounts
        tmpItem.buyCounts = newCounts
        // 删除主图在数组中的位置
        foodieShopcart.splice(i, 1, tmpItem)
      }
    }
    if (!isHavingItem) {
      foodieShopcart.push(pendingItem)
    }
  } else {
    foodieShopcart.push(pendingItem)
  }

  setCookie('shopcart', JSON.stringify(foodieShopcart))
}

export function setCookie(name, value) {
  const Days = 365
  let exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  let cookieContent = name + '=' + encodeURIComponent(value) + ';path=/;'
  if (cookieDomain != null && cookieDomain != undefined && cookieDomain != '') {
    cookieContent += 'domain=' + cookieDomain
  }
  document.cookie = cookieContent
}

export function deleteCookie(name) {
    let cookieContent = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    if (cookieDomain != null && cookieDomain != undefined && cookieDomain != '') {
        cookieContent += "domain=" + cookieDomain;
    }
    document.cookie = cookieContent;
}

export function goErrorPage() {
  window.location.href = "http://localhost:8080/error/noexists";
}

export function checkMobile(mobile) {
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (!myreg.test(mobile)) {
      return false;
  }
  return true;
}

export function checkEmail(email) {
  var myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (!myreg.test(email)) {
      return false;
  }
  return true;
}

export class ShopcartItem {
  constructor(
    itemId,
    itemImgUrl,
    itemName,
    specId,
    specName,
    buyCounts,
    priceDiscount,
    priceNormal
  ) {
    this.itemId = itemId
    this.itemImgUrl = itemImgUrl
    this.itemName = itemName
    this.specId = specId
    this.specName = specName
    this.buyCounts = buyCounts
    this.priceDiscount = priceDiscount
    this.priceNormal = priceNormal
  }
}
