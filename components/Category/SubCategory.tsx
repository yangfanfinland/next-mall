import React from 'react'
import Link from "next/link"
import styles from './SubCategory.module.scss'

const SubCategory = ({ subCategoryList = [] }) => {
    return (
        <div className={`${styles.subCateInner}`}>
            <ul className={`${styles.subCateList}`}>
                {
                    subCategoryList.map(category => (
                        <li key={category.id} className={`fcb`}>
                            <div className={`${styles.litd}`}>
                                <div className={styles.underTitleMiddleLine}/>
                                <div className={`${styles.itemList}`}>
                                    <p className={styles.title}>
                                        <Link href={`/catItems?searchType=catItems&catId=${category.id}`}>
                                            <a target="_blank" className={`${styles.cate2}`}>
                                                { category.name }
                                            </a>
                                        </Link>
                                    </p>
                                    <div className={`${styles.ctgnamebox}`}>
                                        {
                                            category.subCatList.map(subCat => (
                                                <Link key={subCat.subId} href={`/catItems?searchType=catItems&catId=${subCat.subId}`}>
                                                    <a key={subCat.subId} target="_blank" className="f-fcred">
                                                        {subCat.subName}
                                                    </a>
                                                </Link>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default SubCategory