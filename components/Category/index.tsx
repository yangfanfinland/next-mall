import React, { useState } from 'react'
import styles from './index.less'
import SubCategory from './SubCategory'
import { getSubCategories } from '../../api/api'

const Category = ({ hoverShow = false, categoryList = [] }) => {
  const [subCategoryList, setSubCategoryList] = useState()

  const handleMouseEnter = (rootCatId) => {
    getSubCategoryList(rootCatId)
  }

  const getSubCategoryList = async (rootCatId) => {
    const res = await getSubCategories(rootCatId)
    if (res.data.status == 200) {
      const catList = res.data.data
      setSubCategoryList(catList)
    }
  }

  return (
    <div
      className={`${styles.category} ${hoverShow ? styles.hoverCategory : ''}`}
    >
      <div className={`${styles.topLevel}`}>
        <div className={styles.lineicon}>
          <i />
          <i />
          <i />
        </div>
        <span>所有分类</span>
      </div>
      <ul
        className={`${styles.categoryList} ${
          hoverShow ? styles.hideCategory : ''
        }`}
      >
        {categoryList.map((rootCat) => (
          <li
            key={rootCat.id}
            className={styles.categoryItem}
            onMouseEnter={() => handleMouseEnter(rootCat.id)}
          >
            <img className={`${styles.categoryIcon}`} src={rootCat.catImage} />
            <span className={styles.categoryName}>{rootCat.name}</span>
            <i className={styles.iconArrow} />
            <div className={`${styles.subCategory}`}>
              <SubCategory subCategoryList={subCategoryList} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Category
