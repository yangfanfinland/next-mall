import React from 'react'
import HtmlHead from '../components/HtmlHead'
import SearchArea from '../components/SearchArea'
import TopNav from '../components/TopNav'
import MyCarousel from '../components/MyCarousel'
import Warranty from '../components/Warranty'
import AreaSixNewGoods from '../components/HomePage/AreaSixNewGoods'
import AreaBrand from '../components/HomePage/AreaBrand'
import AreaSuperGoods from '../components/HomePage/AreaSuperGoods'
import AreaShops from '../components/HomePage/AreaShops'
import AreaSpecial from '../components/HomePage/AreaSpecial'
import AreaLike from '../components/HomePage/AreaLike'
import { getCategoriesApi, getSixNewItemsByCategoryIdApi } from '../api/api'
import styles from '../static/styles/index.less'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

const Home = ({ categoryList, likeItemList }) => {
  const router = useRouter()
  const { locale, locales, defaultLocale } = router
  const { formatMessage } = useIntl()
  const f = (id) => formatMessage({ id })

  return (
    <>
      {/* <p>Current locale: {locale}</p>   // Current locale: en */}
      {/* <p>Default locale: {defaultLocale}</p>   // Default locale: zh */}
      {/* <p>Configured locales: {JSON.stringify(locales)}</p>  // Configured locales: ["zh","en","fi"] */}

      <HtmlHead title={f('home.title')} />
      <SearchArea />
      <TopNav categoryList={categoryList} />
      <MyCarousel />
      <Warranty />
      <div className={`${styles.homeContent}`}>
        <div className={`contentWidth`}>
          <AreaSixNewGoods likeItemList={likeItemList} />
          {/* <AreaBrand />
          <AreaSuperGoods />
          <AreaShops />
          <AreaSpecial />
          <AreaLike likeItemList={likeItemList} /> */}
        </div>
      </div>
    </>
  )
}

export default Home

Home.getInitialProps = async ({ ctx, reduxStore }) => {
  const { user } = reduxStore.getState()
  let categoryList
  let likeItemList = []
  const res = await getCategoriesApi()
  if (res.status == 200) {
    categoryList = res.data
  }

  if (Array.isArray(categoryList)) {
    for (const category of categoryList) {
      const res = await getSixNewItemsByCategoryIdApi(category.id)
      if (res.status == 200) {
        const itemTemp = res.data
        likeItemList.push(itemTemp[0])
      }
    }
  }

  return {
    categoryList,
    likeItemList,
    user,
  }
}
