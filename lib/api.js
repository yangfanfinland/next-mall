const axios = require('axios')

const base_url = 'http://localhost:8088'

async function requestMall(method, url, data, headers) {
  try {
    const result = await axios({
      method,
      url: `${base_url}${url}`,
      data,
      headers,
    })
    return result
  } catch (error) {
    console.error('Request mall server result: ' + error)
    return { data: {} }
  }
}

const isServer = typeof window === 'undefined'
async function request({ method = 'GET', url, data = {} }, req, res) {
  if (!url) {
    throw Error('url must be provided')
  }
  if (isServer) {
    const { session } = req
    const { githubAuth } = session || {}
    const { token_type, access_token } = githubAuth || {}
    const headers = {}
    if (access_token) {
      headers.Authorization = `${token_type} ${access_token}`
    }
    return await requestMall(method, url, data, headers)
  } else {
    try {
      const result = await axios({
        method,
        url: `${url}`,
        data,
      })
      return result
    } catch (error) {
      console.log('Request result: ' + error)
      return { data: {} }
    }
  }
}

module.exports = {
  request,
  requestMall,
}