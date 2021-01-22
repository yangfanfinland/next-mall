import React from 'react'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import Shopcart from '../components/ShopcartPage/Shopcart'

const Car = () => {
  return (
    <>
      <HtmlHead title={'Shopping cart'} />
      <SearchArea />
      <Shopcart />
    </>
  )
}

export default Car
