import React, { useCallback, useEffect, useState } from "react"
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import imageScale from "../../../util/imageScale"
import styles from './index.module.scss'



const ItemImgPreview = ({ images }) => {
    const [ topPosition, setTopPosition ] = useState(0);
    const [ current, setCurrent ] = useState({index: 0, url: images[0].url })

    useEffect(() => {
        imageScale()
    }, [])

    const onClickPrevBtn = useCallback((direction) => {
        const top = direction === 'up' ? topPosition + 88 : topPosition - 88;
        setTopPosition(top);
    }, [topPosition])

    const disabledUp = topPosition === 0 || images.length < 5;
    const disabledDown = (Math.abs(topPosition) / 88) === images.length - 4 || images.length < 5;

    return (
        <div className={`${styles.goodsImgPrevWrap} fl fcb`}>
            <div className={`${styles.leftListWrap} fcb`}>
                <a className={`${styles.prevBtn} ${disabledUp ? styles.disabled : ''}`} onClick={() => {
                    if (disabledUp) {
                        console.log('上不可点')
                        return
                    }
                    onClickPrevBtn('up');
                }}><UpOutlined/></a>
                <div className={styles.thumListWrap}>
                    <ul className={styles.thumListInner} style={{top: topPosition}}>
                        {
                            images.map((image, i) => {
                                return (
                                    <li key={image.id} className={`${styles.item} ${current.index === i ? styles.active : ''}`}
                                        onMouseEnter={() => {
                                            setCurrent({
                                                index: i,
                                                url: image.url
                                            });
                                        }}
                                    >
                                        <a className={styles.alink}>
                                            <img className={`${styles.thumImg}`}
                                                 src={image.url}
                                                 alt=""/>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <a className={`${styles.prevBtn} ${disabledDown ? styles.disabled : ''}`} onClick={() => {
                    if (disabledDown) {
                        console.log('下不可点')
                        return
                    }
                    onClickPrevBtn('down');
                }}><DownOutlined/></a>
            </div>
            <div className={`${styles.imgBox}`} id={'box'}>
                <div className={`${styles.small}`} style={{backgroundImage: `url(${current.url})`}} id={'small'}>
                    <div className={`${styles.mask} hide`} id={'mask'}/>
                </div>
                <div className={`${styles.big} hide`} id={'big'}>
                    <img src={current.url} className={styles.bigImg}/>
                </div>
                <div className={`hide`} id={'local'}>
                    <p className="title">鼠标在图片中的坐标为: </p>
                    <p> x : <span></span></p>
                    <p> y : <span></span></p>
                </div>
            </div>
        </div>
    )
}

export default ItemImgPreview