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
                                        <Link href={`/catItems.html?searchType=catItems&catId=${category.id}`}>
                                            <a target="_blank" className={`${styles.cate2}`}>
                                                { category.name }
                                            </a>
                                        </Link>
                                    </p>
                                    <div className={`${styles.ctgnamebox}`}>
                                        {
                                            category.subCatList.map(subCat => (
                                                <Link key={subCat.subId} href={`/catItems.html?searchType=catItems&catId=${subCat.subId}`}>
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

                {/* <li className={`fcb`}>
                    <div className={`${styles.litd}`}>
                        <div className={styles.underTitleMiddleLine}/>
                        <div className={`${styles.itemList}`}>
                            <p className={styles.title}>
                                <Link href={'/categoryGoodsList'}>
                                    <a target="_blank" className={`${styles.cate2}`}>
                                        洗发护发
                                    </a>
                                </Link>
                            </p>
                            <div className={`${styles.ctgnamebox}`}>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="/categoryGoodsList">
                                    其他头发护理
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#"
                                >
                                    头发造型
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    美发护发工具
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    洗发皂
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    梳子
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    护发精油
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    染发剂/膏
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    洗护发套装
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    发膜
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    护发素
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="/#">
                                    洗发水
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.litd}`}>
                        <div className={styles.underTitleMiddleLine}/>
                        <div className={`${styles.itemList}`}>
                            <p className={styles.title}>
                                <a target="_blank" className={`${styles.cate2}`} href="#">
                                    洗发护发
                                </a>
                            </p>
                            <div className={`${styles.ctgnamebox}`}>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    其他头发护理
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#"
                                >
                                    头发造型
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    美发护发工具
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    洗发皂
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    梳子
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    护发精油
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    染发剂/膏
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    洗护发套装
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    发膜
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="#">
                                    护发素
                                </a>
                                <a target="_blank"
                                   className="f-fcred"
                                   href="/#">
                                    洗发水
                                </a>
                            </div>
                        </div>
                    </div>
                </li> */}
            </ul>
        </div>
    )
}

export default SubCategory