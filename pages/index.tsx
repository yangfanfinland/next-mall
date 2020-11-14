import React from 'react'
import axios from 'axios'
import { serverUrl } from '../util/app'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import TopNav from '../components/TopNav'
import MyCarousel from '../components/MyCarousel'
import Warranty from '../components/Warranty'
import AreaBrand from '../components/HomePage/AreaBrand'
import AreaSuperGoods from '../components/HomePage/AreaSuperGoods'
import AreaShops from '../components/HomePage/AreaShops'
import AreaSpecial from '../components/HomePage/AreaSpecial'
import AreaLike from '../components/HomePage/AreaLike'
import styles from '../static/styles/index.module.scss'

export default function Home({ categoryList, likeItemList }) {
  return (
    <>
      <HtmlHead title={'多米电商 - 首页'}/>
      <SearchArea/>
      <TopNav categoryList={categoryList} />
      <MyCarousel />
      <Warranty />
      <div className={`${styles.homeContent}`}>
          <div className={`contentWidth`}>
              <AreaBrand />
              <AreaSuperGoods />
              <AreaShops />
              <AreaSpecial />
              <AreaLike likeItemList = {likeItemList} />
          </div>
      </div>
    </>
  )
}

Home.getInitialProps = async ({ ctx }) => {
  let categoryList;
  let likeItemList = [];
  const res = await axios.get(serverUrl + '/index/cats', {})
  if (res.data.status == 200) {
    categoryList = res.data.data
  }

  if (Array.isArray(categoryList)) {
    for (const category of categoryList) {
      const res = await axios.get(serverUrl + '/index/sixNewItems/' + category.id, {})
      if (res.data.status == 200) {
          const itemTemp = res.data.data
          likeItemList.push(itemTemp)
      }
    }
  }


  return {
    categoryList,
    likeItemList
  }
}
