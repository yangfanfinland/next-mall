import Header from '../Header'
import Notice from '../Notice'
import Footer from '../Footer'
import styles from './index.less'

const Layout = ({ children }) => {
  const content = `Notice: Foodie shop under development! All are virtual products, no real trade at the moment!`
  return (
    <>
      <Notice content={content} />
      <Header />
      <div id={'mainBody'} className={styles.main}>
        {children}
      </div>
      <Footer />
    </>
  )
}

export default Layout
