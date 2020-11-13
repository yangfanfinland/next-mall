import React, { useState } from 'react'
import ShopNav from '../components/ShopNav'
import Carousel from '../components/MyCarousel'
import Footer from '../components/Footer'
import Recommendation from '../components/Recommendation'
import SixNewItemsList from '../components/SixNewItemsList'
import axios from 'axios'

export default function Home({ categoryList }) {
  return (
    <>
      <div id="index444">
        <ShopNav />
        <div className="banner">
        <Carousel />
        </div>
      </div>

      <div className="shopMainbg">
        <div className="shopMain" id="shopmain">
          <Recommendation />
          <div className="clear "></div>
          <div>
            <SixNewItemsList categoryList={categoryList} />
          </div>
          <Footer />
        </div>
      </div>
    </>
  )
}

Home.getInitialProps = async ({ ctx }) => {
  let categoryList;
  var serverUrl = "http://localhost:8088";
  const res = await axios.get(serverUrl + '/index/cats', {})
  if (res.data.status == 200) {
    categoryList = res.data.data
  }

  return {
    categoryList,
  }
}
