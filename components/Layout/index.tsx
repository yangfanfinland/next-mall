import Header from '../Header'
import Footer from '../Footer'
import styles from './index.less'

const Layout = ({children}) => {
    return (
        <>
            <Header />
            <div id={'mainBody'} className={styles.main}>
                {children}
            </div>
            <Footer/>
        </>
    )
}

export default Layout