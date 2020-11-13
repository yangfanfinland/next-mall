import Header from '../Header'
import Footer from '../Footer'
import SearchBar from '../SearchBar'

const Layout = ({children}) => {
    return (
        <>
            <div className="hmtop">
                <Header />
                <SearchBar />
            </div>
            
            {children}
            <Footer />
        </>
    )
}

export default Layout