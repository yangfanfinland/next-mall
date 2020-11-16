import React from "react"
import styles from './UserLayout.module.scss'
import Warranty from "../Warranty"

const UserLayout = ({children}) => {
    return (
        <div className={`bw`}>
            <div className={`${styles.userHeader} contentWidth fcb`}>
                <a className={`${styles.logoLink} fl`}>
                    <img src="/static/images/logobig.png" alt=""/>
                </a>
                <div className={`${styles.warrantWrap} fl`}>
                    <Warranty width={'auto'}/>
                </div>
            </div>
            <div className={styles.userContent}>
                <div className={`contentWidth login`}>
                    <div><span></span><img src="/static/images/loginpage.png" /></div>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserLayout